import db from '../config/db.js'

export const addToWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;

        const sql = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
        await db.execute(sql, [user_id, product_id]);

        res.status(201).json({ success: true, message: "Added to wishlist" });

    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.json({ message: "Already in wishlist" });
        }

        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;

        await db.execute(
            "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
            [user_id, product_id]
        );

        res.json({ success: true, message: "Removed from wishlist" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [products] = await db.execute(
            `SELECT p.* 
             FROM wishlist w 
             JOIN products p ON p._id = w.product_id 
             WHERE w.user_id = ?`,
            [user_id]
        );

        const updatedProducts = await Promise.all(
            products.map(async (product) => {
                const [images] = await db.execute(
                    "SELECT image FROM product_images WHERE product_id = ?",
                    [product._id]
                );

                return {
                    ...product,
                    images: images.map(img => img.image)
                };
            })
        );

        res.status(200).json(updatedProducts);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getWishlistProducts = async (req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT 
                p._id,
                p.name,
                p.category,
                p.offerPrice,
                COUNT(w.product_id) AS total_wishes
            FROM wishlist w
            JOIN products p ON p._id = w.product_id
            GROUP BY p._id
            ORDER BY total_wishes DESC
        `);

        const updatedProducts = await Promise.all(
            products.map(async (product) => {
                const [images] = await db.execute(
                    "SELECT image FROM product_images WHERE product_id = ?",
                    [product._id]
                );

                return {
                    ...product,
                    images: images.map(img => img.image)
                };
            })
        );

        res.status(200).json(updatedProducts);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const removeWishlistProduct = async (req, res) => {
    try {
        const { product_id } = req.params;

        const [result] = await db.execute(
            "DELETE FROM wishlist WHERE product_id = ?",
            [product_id]
        );

        if (result.affectedRows === 0) {
            return res.json({ success: false, message: "No product found with this ID" });
        }

        res.json({ success: true, message: "Product removed from wishlist" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};