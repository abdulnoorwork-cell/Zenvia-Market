import db from '../config/db.js'

export const addToCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { product_id, quantity = 1, size, color, footwear_size } = req.body;

        if (!product_id) {
            return res.status(400).json({ message: "Product id required" });
        }

        const sql = `
            INSERT INTO cart_items 
            (user_id, product_id, quantity, size, color, footwear_size) 
            VALUES (?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE quantity = quantity + 1
        `;

        await db.execute(sql, [
            user_id,
            product_id,
            quantity,
            size || "",
            color || "",
            footwear_size || ""
        ]);

        res.status(201).json({ success: true, message: "Added To Cart" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error in addToCart" });
    }
};

export const getCart = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [products] = await db.execute(`
            SELECT 
                c._id AS cart_id,
                p._id,
                p.name,
                p.offerPrice,
                c.size,
                c.color,
                c.footwear_size,
                c.quantity,
                (p.offerPrice * c.quantity) AS total
            FROM cart_items c
            JOIN products p ON c.product_id = p._id
            WHERE c.user_id = ?
        `, [user_id]);

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
        res.status(500).json({ message: "Error in getting cart items" });
    }
};

export const totalPrice = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [data] = await db.execute(`
            SELECT SUM(p.offerPrice * c.quantity) AS total 
            FROM cart_items c
            JOIN products p ON c.product_id = p._id
            WHERE c.user_id = ?
        `, [user_id]);

        res.status(200).json(data[0]);

    } catch (err) {
        res.status(500).json({ message: "Error in getting total amount" });
    }
};

export const totalItems = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [data] = await db.execute(
            'SELECT SUM(quantity) AS total_items FROM cart_items WHERE user_id = ?',
            [user_id]
        );

        res.status(200).json(data[0]);

    } catch (err) {
        res.status(500).json({ message: "Error in getting total items" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { cart_id } = req.body;
        const { user_id } = req.params;

        await db.execute(
            'DELETE FROM cart_items WHERE user_id = ? AND _id = ?',
            [user_id, cart_id]
        );

        res.status(200).json({ success: true, message: "Product removed" });

    } catch (err) {
        res.status(500).json({ message: "Error in remove from cart" });
    }
};

export const quantityUpdated = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { cart_id, quantity } = req.body;

        if (!cart_id) {
            return res.status(400).json({ success: false, message: "Cart id not found" });
        }

        if (quantity < 1) {
            return res.status(400).json({ success: false, message: "Quantity should be at least 1" });
        }

        await db.execute(
            'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND _id = ?',
            [quantity, user_id, cart_id]
        );

        res.status(200).json({ success: true, message: "Quantity updated" });

    } catch (err) {
        res.status(500).json({ message: "Error updating quantity" });
    }
};