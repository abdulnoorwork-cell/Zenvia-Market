import db from '../config/db.js'
import 'dotenv/config'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (req, res) => {
    try {
        const { user_id, items, total_amount, payment_method, address } = req.body;

        if (!address || !address?.firstName) {
            return res.status(400).json({ message: "Invalid address" });
        }

        // ---------------- COD ----------------
        if (payment_method === "COD") {

            const [order] = await db.execute(
                `INSERT INTO orders (user_id, total_amount, payment_method, address, payment_status)
                 VALUES (?, ?, ?, ?, ?)`,
                [user_id, total_amount, "COD", JSON.stringify(address), "PENDING"]
            );

            const order_id = order.insertId;

            await Promise.all(items.map(item =>
                db.execute(
                    `INSERT INTO order_items 
                    (order_id, product_id, size, color, footwear_size, quantity, price)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        order_id,
                        item._id,
                        item.size || null,
                        item.color || null,
                        item.footwear_size || null,
                        item.quantity,
                        item.offerPrice
                    ]
                )
            ));

            await db.execute("DELETE FROM cart_items WHERE user_id = ?", [user_id]);

            return res.json({ success: true, message: "Order placed (COD)" });
        }

        // ---------------- ONLINE ----------------
        if (payment_method === "ONLINE") {

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: items.map(item => ({
                    price_data: {
                        currency: "pkr", // or "usd" if needed
                        product_data: {
                            name: item.name
                        },
                        unit_amount: Math.round(Number(item.offerPrice) * 100)
                    },
                    quantity: item.quantity
                })),
                mode: "payment",
                success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel`,
                metadata: {
                    user_id: user_id.toString(),
                    items: JSON.stringify(
                        items.map(item => ({
                            id: item._id,
                            qty: item.quantity,
                            price: item.offerPrice,
                        }))
                    ),
                    address: JSON.stringify(address),
                    total_amount: total_amount,
                },
            });

            return res.json({ url: session.url });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
};

export const confirmOrder = async (req, res) => {
    const { session_id } = req.body;

    const conn = await db.getConnection(); // ✅ use connection for transaction

    try {
        await conn.beginTransaction();

        // ✅ Check existing order
        const [existing] = await conn.query(
            "SELECT _id FROM orders WHERE stripe_session_id = ?",
            [session_id]
        );

        if (existing.length) {
            await conn.rollback();
            return res.json({ messege: "Order already exists" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== "paid") {
            await conn.rollback();
            return res.status(400).json({ messege: "Payment not completed" });
        }

        const user_id = session.metadata.user_id;
        const items = JSON.parse(session.metadata.items);
        const address = JSON.parse(session.metadata.address);
        const total_amount = session.metadata.total_amount;

        // ✅ Insert order
        const [orderResult] = await conn.query(
            `INSERT INTO orders 
      (user_id, total_amount, payment_method, address, payment_status, stripe_session_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, total_amount, "ONLINE", JSON.stringify(address), "PAID", session_id]
        );

        const order_id = orderResult.insertId;

        // ✅ Insert items
        for (const item of items) {
            await conn.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
                [order_id, item.id, item.qty, item.price]
            );
        }

        // ✅ Clear cart
        await conn.query("DELETE FROM cart_items WHERE user_id = ?", [user_id]);

        await conn.commit();

        return res.json({ success: true });

    } catch (error) {
        await conn.rollback();
        return res.status(500).json({ messege: error.message });
    } finally {
        conn.release();
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [data] = await db.execute(`
            SELECT 
                o.*,
                oi.*,
                p.*
            FROM orders o
            JOIN order_items oi ON o._id = oi.order_id
            JOIN products p ON p._id = oi.product_id
            WHERE NOT (o.payment_method = "ONLINE" AND o.payment_status = "PENDING")
            AND o.user_id = ?
        `, [user_id]);

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({ message: "Get orders error" });
    }
};

export const fetchAllOrders = async (req, res) => {
    try {
        const [data] = await db.execute(`
            SELECT o.*, oi.*, p.*
            FROM orders o
            JOIN order_items oi ON o._id = oi.order_id
            JOIN products p ON p._id = oi.product_id
            WHERE NOT (o.payment_method = "ONLINE" AND o.payment_status = "PENDING")
        `);

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({ message: "Fetch orders error" });
    }
};

export const getLatestOrders = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;

        const [data] = await db.execute(`
            SELECT o.*, oi.*, p.*
            FROM orders o
            JOIN order_items oi ON o._id = oi.order_id
            JOIN products p ON p._id = oi.product_id
            WHERE NOT (o.payment_method = "ONLINE" AND o.payment_status = "PENDING")
            ORDER BY o.created_at DESC
            LIMIT ?
        `, [limit]);

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({ message: "Latest orders error" });
    }
};

export const deleteUserOrder = async (req, res) => {
    try {
        const { order_id } = req.params;

        await db.execute("DELETE FROM order_items WHERE order_id = ?", [order_id]);
        await db.execute("DELETE FROM orders WHERE _id = ?", [order_id]);

        res.status(200).json({ success: true, message: "Order cancelled" });

    } catch (err) {
        res.status(500).json({ message: "Delete order error" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { order_status } = req.body;

        if (!order_status) {
            return res.status(400).json({ message: "Status required" });
        }

        await db.execute(
            "UPDATE orders SET order_status = ? WHERE _id = ?",
            [order_status, order_id]
        );

        res.status(200).json({ success: true, message: "Order updated" });

    } catch (err) {
        res.status(500).json({ message: "Update order error" });
    }
};