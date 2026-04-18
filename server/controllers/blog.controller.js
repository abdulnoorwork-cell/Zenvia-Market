import { v2 as cloudinary } from 'cloudinary';
import db from '../config/db.js'

export const addBlog = async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.files?.image;

        if (!title || !description || !image) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (title.length > 120) {
            return res.status(400).json({ success: false, message: "Maximum title is 120 characters" });
        }

        if (title.length < 12) {
            return res.status(400).json({ success: false, message: "Title must be at least 12 characters" });
        }

        if (description.length < 256) {
            return res.status(400).json({ success: false, message: "Description must be at least 256 characters" });
        }

        const allowedFormat = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({ success: false, message: "Invalid image format" });
        }

        const upload = await cloudinary.uploader.upload(image.tempFilePath);

        if (!upload || upload.error) {
            throw new Error(upload?.error?.message || "Cloudinary upload failed");
        }

        const sql = `INSERT INTO blogs (title, description, image) VALUES (?, ?, ?)`;
        const [result] = await db.execute(sql, [title, description, upload.url]);

        res.status(201).json({ success: true, message: "Blog added successfully", data: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBlogs = async (req, res) => {
    try {
        const [data] = await db.execute('SELECT * FROM blogs');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const singleBlog = async (req, res) => {
    try {
        const { blogId } = req.params;

        const [data] = await db.execute(
            'SELECT * FROM blogs WHERE _id = ?',
            [blogId]
        );

        res.status(200).json(data[0] || null);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.params;

        await db.execute(
            'DELETE FROM blogs WHERE _id = ?',
            [blogId]
        );

        res.status(200).json({ success: true, message: "Blog deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { blogId } = req.params;
        const image = req.files?.image;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (title.length > 120) {
            return res.status(400).json({ success: false, message: "Maximum title is 120 characters" });
        }

        if (title.length < 12) {
            return res.status(400).json({ success: false, message: "Title must be at least 12 characters" });
        }

        if (description.length < 256) {
            return res.status(400).json({ success: false, message: "Description must be at least 256 characters" });
        }

        let imageUrl;

        if (image) {
            const allowedFormat = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

            if (!allowedFormat.includes(image.mimetype)) {
                return res.status(400).json({ success: false, message: "Invalid image format" });
            }

            const upload = await cloudinary.uploader.upload(image.tempFilePath, {
                overwrite: true
            });

            if (!upload || upload.error) {
                throw new Error("Image upload failed");
            }

            imageUrl = upload.url;
        }

        if (imageUrl) {
            await db.execute(
                'UPDATE blogs SET title = ?, description = ?, image = ? WHERE _id = ?',
                [title, description, imageUrl, blogId]
            );
        } else {
            await db.execute(
                'UPDATE blogs SET title = ?, description = ? WHERE _id = ?',
                [title, description, blogId]
            );
        }

        res.status(200).json({ success: true, message: "Blog updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getLatestBlogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const [data] = await db.execute(
            'SELECT * FROM blogs ORDER BY created_at DESC LIMIT ?',
            [limit]
        );

        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};