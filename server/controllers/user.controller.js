import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt'
import db from '../config/db.js'
import generateToken from '../config/token.js';
import 'dotenv/config'
import jwt from 'jsonwebtoken'

export const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const profile_image = req.files?.profile_image;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill required fileds" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const [existing] = await db.execute(
            "SELECT _id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        let imgUrl = null;

        if (profile_image) {
            const allowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

            if (!allowed.includes(profile_image.mimetype)) {
                return res.status(400).json({ message: "Invalid image format" });
            }

            const upload = await cloudinary.uploader.upload(profile_image.tempFilePath);

            imgUrl = upload.url;
        }

        const sql = `
            INSERT INTO users (name, email, password, phone, profile_image)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.execute(sql, [
            name,
            email,
            hashPassword,
            phone || "",
            imgUrl
        ]);

        res.status(201).json({ success: true, message: "Signup successful" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email & password required" });
        }

        const [users] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: `Welcome ${user.name}`,
            user,
            token,
            expiresIn: 86400
        });

    } catch (err) {
        res.status(500).json({ message: "Login error" });
    }
};

export const getUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [data] = await db.execute(
            "SELECT * FROM users WHERE _id = ?",
            [user_id]
        );

        res.status(200).json(data[0] || null);

    } catch (err) {
        res.status(500).json({ message: "Error fetching user" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { name, email, phone } = req.body;
        const profile_image = req.files?.profile_image;

        if (!name || !email) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        let imgUrl;

        if (profile_image) {
            const upload = await cloudinary.uploader.upload(profile_image.tempFilePath);
            imgUrl = upload.url;
        }

        const sql = imgUrl
            ? "UPDATE users SET name=?, email=?, phone=?, profile_image=? WHERE _id=?"
            : "UPDATE users SET name=?, email=?, phone=? WHERE _id=?";

        const values = imgUrl
            ? [name, email, phone, imgUrl, user_id]
            : [name, email, phone, user_id];

        await db.execute(sql, values);

        res.status(200).json({ success: true, message: "Profile updated" });

    } catch (err) {
        res.status(500).json({ message: "Update error" });
    }
};

export const adminLogin = (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ success: false, messege: "Can,t be empty" })
        }
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: "Invalid Credientials" })
        }
        const token = jwt.sign(email + password, process.env.ADMIN_JWT_SECRET);
        res.status(200).json({ success: true, message: "admin loggedin successfull", token })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error in Login: " + error })
    }
}


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const [users] = await db.execute(
            "SELECT _id, email FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = users[0];

        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.RESET_TOKEN,
            { expiresIn: "10m" }
        );

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: user.email,
            subject: "Reset Password",
            text: resetLink
        });

        res.status(200).json({
            success: true,
            message: "Reset link sent"
        });

    } catch (err) {
        res.status(500).json({ message: "Forgot password error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const decoded = jwt.verify(token, process.env.RESET_TOKEN);

        const hashPassword = await bcrypt.hash(password, 10);

        await db.execute(
            "UPDATE users SET password = ? WHERE _id = ?",
            [hashPassword, decoded.id]
        );

        res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (err) {
        res.status(500).json({ message: "Reset password error" });
    }
};