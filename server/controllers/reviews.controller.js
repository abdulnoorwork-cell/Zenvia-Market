import db from '../config/db.js'
import { v2 as cloudinary } from 'cloudinary'

export const addReview = async (req, res) => {
    try {
        const { product_id, user_id, rating, comment } = req.body;

        if (!rating) {
            return res.status(400).json({ message: "Rating cannot be null" });
        }

        if (!comment) {
            return res.status(400).json({ message: "Comment cannot be null" });
        }

        const images = Array.isArray(req.body.images) ? req.body.images : [];

        const allowedFormat = ["image/jpg", "image/png", "image/jpeg", "image/webp"];

        const uploadedUrls = [];

        // upload images
        for (const img of images) {
            const upload = await cloudinary.uploader.upload(img, {
                folder: "reviews"
            });

            uploadedUrls.push(upload.secure_url);
        }

        // check purchase
        const [orders] = await db.execute(
            `SELECT o._id 
             FROM orders o 
             JOIN order_items oi ON o._id = oi.order_id 
             WHERE o.user_id = ? 
             AND oi.product_id = ? 
             AND o.order_status = "DELIVERED"
             LIMIT 1`,
            [user_id, product_id]
        );

        if (orders.length === 0) {
            return res.status(403).json({
                message: "You can only review purchased products"
            });
        }

        // duplicate check
        const [existing] = await db.execute(
            "SELECT _id FROM reviews WHERE user_id = ? AND product_id = ?",
            [user_id, product_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "Already reviewed this product"
            });
        }

        // insert review
        await db.execute(
            `INSERT INTO reviews 
            (product_id, user_id, rating, comment, images) 
            VALUES (?, ?, ?, ?, ?)`,
            [product_id, user_id, rating, comment, JSON.stringify(uploadedUrls)]
        );

        res.status(201).json({ success: true, message: "Review added" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Review error" });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const { product_id } = req.params;

        const [data] = await db.execute(`
            SELECT 
                r.*,
                u.name,
                u.email,
                u.profile_image,
                rr.reply,
                rr.created_at AS reply_created_at
            FROM reviews r
            JOIN users u ON r.user_id = u._id
            LEFT JOIN reviews_replies rr ON r._id = rr.review_id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `, [product_id]);

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({ message: "Error fetching reviews" });
    }
};

export const productRating = async (req, res) => {
    try {
        const { product_id } = req.params;

        const [data] = await db.execute(`
            SELECT 
                AVG(rating) AS average_rating,
                COUNT(*) AS total_reviews
            FROM reviews
            WHERE product_id = ?
        `, [product_id]);

        res.status(200).json(data[0]);

    } catch (err) {
        res.status(500).json({ message: "Rating error" });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const sql = `
            SELECT 
                reviews._id,
                reviews.product_id,
                reviews.user_id,
                reviews.comment,
                reviews.rating,
                reviews.created_at,
                users.name,
                users.email,
                users.profile_image,
                products.name AS product_name,
                products.price,
                products.offerPrice
            FROM reviews
            JOIN users ON users._id = reviews.user_id
            JOIN products ON products._id = reviews.product_id
        `;

        const [data] = await db.query(sql);

        for (let product of data) {
            const [images] = await db.query(
                "SELECT image FROM product_images WHERE product_id = ?",
                [product.product_id]
            );

            product.images = images.map(img => img.image);
        }

        return res.status(200).json(data);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getSingleReview = async (req, res) => {
    try {
        const { id } = req.params;

        const [data] = await db.execute(`
            SELECT 
                r._id,
                r.comment,
                u.name,
                u.email,
                u.profile_image
            FROM reviews r
            JOIN users u ON u._id = r.user_id
            WHERE r._id = ?
        `, [id]);

        res.status(200).json(data[0] || null);

    } catch (err) {
        res.status(500).json({ message: "Error fetching review" });
    }
};

export const adminReply = async (req, res) => {
    try {
        const { review_id, reply } = req.body;

        if (!review_id) {
            return res.status(400).json({ message: "Invalid review ID" });
        }

        if (!reply) {
            return res.status(400).json({ message: "Reply cannot be empty" });
        }

        await db.execute(
            "INSERT INTO reviews_replies (review_id, reply) VALUES (?, ?)",
            [review_id, reply]
        );

        res.status(201).json({ success: true, message: "Reply added" });

    } catch (err) {
        res.status(500).json({ message: "Reply error" });
    }
};