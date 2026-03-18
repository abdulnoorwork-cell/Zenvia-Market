import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt'
import db from '../config/db.js'
import generateToken from '../config/token.js';
import 'dotenv/config'
import jwt from 'jsonwebtoken'

export const signup = async (req, res) => {
    if (req.body.profile_image !== '') {
        const { profile_image } = req.files;
        if (!req.files || Object.keys(req.files).length === 0 || !profile_image) {
            return res.status(400).json({ success: false, messege: 'No file uploaded' });
        }
        const { name, email, password, phone } = req.body;
        if (!name) {
            return res.status(400).json("Please enter the name")
        }
        if (!email) {
            return res.status(400).json("Please enter the email")
        }
        if (!password) {
            return res.status(400).json("Please enter the password")
        }
        if (password.length < 8) {
            return res.status(400).json("Password contains 8 characters long")
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const allowedFormat = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
        if (!allowedFormat.includes(profile_image.mimetype)) {
            return res.status(400).json({ success: false, messege: "Invalid Format! Only jpg, jpeg, png, webp are allowed" })
        }
        const cloudinaryResponse = await cloudinary.uploader.upload(profile_image.tempFilePath);
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log(cloudinaryResponse.error)
        }
        const imgUrl = cloudinaryResponse.url;
        const sql = 'INSERT INTO users(`name`,`email`,`password`,`phone`,`profile_image`) VALUES(?)';
        const values = [
            name,
            email,
            hashPassword,
            phone,
            JSON.stringify(imgUrl)
        ]
        db.query(sql, [values], (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ success: false, messege: "Email already exist" })
            } else {
                return res.status(201).json({ success: true, messege: "Signup Successfully" })
            }
        })
        return
    }
    const { email, password, name, phone } = req.body;
    if (!name) {
        return res.status(400).json("Please enter the name")
    }
    if (!email) {
        return res.status(400).json("Please enter the email")
    }
    if (!password) {
        return res.status(400).json("Please enter the password")
    }
    if (password.length < 2) {
        return res.status(400).json("Password contains 2 characters long")
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users(`name`,`email`,`password`,`phone`) VALUES(?)';
    const values = [
        name,
        email,
        hashPassword,
        phone
    ]
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ success: false, messege: "Email already exist" })
        } else {
            res.status(201).json({ success: true, messege: "Signup Successfully" })
        }
    })
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json("Please enter your email")
    }
    if (!password) {
        return res.status(400).json("Please enter your password")
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, email, async (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: "Error in login: " + err })
        }
        if (data.length > 0) {
            let isMatch = await bcrypt.compare(password, data[0].password);
            if (!isMatch) {
                return res.status(400).json("Incorrect Password")
            }
            let token = generateToken(data[0]._id);
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1 * 24 * 60 * 60 * 1000
            })
            res.status(200).json({ success: true, messege: `Welcome back ${data[0].name}`, data, token, expiresIn: 86400 })
        } else {
            return res.status(400).json("No email exist")
        }
    })
}

export const getUser = (req, res) => {
    const { user_id } = req.params;
    const sql = 'SELECT * FROM users WHERE _id = ?';
    db.query(sql, [user_id], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: "Error in getting user: " + err })
        } else {
            res.status(200).json(data)
        }
    })
}

export const updateUser = async (req, res) => {
    if (req.body.profile_image !== '') {
        const { name, email, phone } = req.body;
        if (!name || !email) {
            return res.status(400).json({ success: false, messege: "Please fill required fields" })
        }
        const { user_id } = req.params;
        const { profile_image } = req.files;
        const allowedFormat = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
        if (!allowedFormat.includes(profile_image.mimetype)) {
            return res.status(400).json({ success: false, messege: "Invalid Format! Only jpg, jpeg, png, webp are allowed" });
        }
        const cloudinaryResponse = await cloudinary.uploader.upload(profile_image.tempFilePath, {
            overwrite: true
        })
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return console.log(cloudinaryResponse.error)
        }
        const imgUrl = cloudinaryResponse.url;
        const sql = 'UPDATE users SET name = ?, email = ?, phone = ?, profile_image = ? WHERE _id = ?';
        const values = [name, email, phone, JSON.stringify(imgUrl)];
        db.query(sql, [...values, user_id], (err, data) => {
            if (err) {
                return res.status(500).json({ success: false, messege: "Error in updating user: " + err })
            } else {
                res.status(200).json({ success: true, messege: "Profile updated" })
            }
        })
        return
    }
    const { name, email, phone } = req.body;
    if (!name || !email) {
        return res.status(400).json({ success: false, messege: "Please fill required fields" })
    }
    const { user_id } = req.params;
    const sql = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE _id = ?';
    const values = [name, email, phone];
    db.query(sql, [...values, user_id], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: "Error in updating user: " + err })
        } else {
            res.status(200).json({ success: true, messege: "Profile updated" })
        }
    })
}

export const adminLogin = (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ success: false, messege: "Can,t be empty" })
        }
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, messege: "Invalid Credientials" })
        }
        const token = jwt.sign(email + password, process.env.ADMIN_JWT_SECRET);
        res.status(200).json({ success: true, messege: "admin loggedin successfull", token })
    } catch (error) {
        return res.status(500).json({ success: false, messege: "Error in Login: " + error })
    }
}