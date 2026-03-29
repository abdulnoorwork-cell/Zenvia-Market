import db from '../config/db.js'
import 'dotenv/config'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (req, res) => {
    const { user_id, items, total_amount, payment_method, address } = req.body;
    try {
        if (!address || !address.firstName) {
            return res.status(400).json({ message: "Invalid address" });
        }
        // 1. Save order in DB
        db.query(
            `INSERT INTO orders (user_id, total_amount, payment_method, address)
       VALUES (?, ?, ?, ?)`,
            [user_id, total_amount, payment_method, JSON.stringify(address)], (err, result) => {
                if (err) return res.status(500).json({ success: false, message: err })
                const order_id = result.insertId;
                // 2. Save items
                for (let item of items) {
                    db.query(
                        `INSERT INTO order_items (order_id, product_id,size, color, footwear_size, quantity, price)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [order_id, item._id, item.size || null, item.color || null, item.footwear_size || null, item.quantity, item.offerPrice], async (err, data) => {
                            if (err) return res.status(500).json({ success: false, message: err })
                            // 🟢 COD Flow
                            if (payment_method === "COD") {
                                const deleteQuery = 'DELETE FROM cart_items WHERE user_id = ?'
                                db.query(deleteQuery, [user_id], (err, result) => {
                                    if (err) return res.status(500).json({ success: false, message: err })
                                    return res.json({ success: true, message: "Order placed (COD)" });
                                })
                            }
                            // 🔵 ONLINE (Stripe)
                            if (payment_method === "ONLINE") {
                                const session = await stripe.checkout.sessions.create({
                                    payment_method_types: ["card"],

                                    line_items: items.map(item => ({
                                        price_data: {
                                            currency: "pkr",
                                            product_data: {
                                                name: item.name,
                                            },
                                            unit_amount: item.offerPrice * 100,
                                        },
                                        quantity: item.quantity,
                                    })),

                                    mode: "payment",

                                    success_url: `${process.env.FRONTEND_URL}/success?order_id=${order_id}`,
                                    cancel_url: `${process.env.FRONTEND_URL}/cancel`,

                                    metadata: {
                                        order_id: order_id.toString(),
                                    },
                                });
                                res.json({ url: session.url });

                                if (payment_method === "ONLINE") {
                                    const deleteQuery = 'DELETE FROM cart_items WHERE user_id = ?'
                                    db.query(deleteQuery, [user_id], (err, result) => {
                                        if (err) return res.status(500).json({ success: false, message: err })
                                        db.query('UPDATE orders SET payment_status = ? WHERE _id = ?', ["PAID", order_id])
                                    })
                                }
                            }
                        }
                    );
                }
            }
        );

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error });
    }
}

export const getUserOrders = (req, res) => {
    const { user_id } = req.params;
    const sql = 'SELECT * FROM orders JOIN order_items ON orders._id = order_items.order_id JOIN products ON products._id = order_items.product_id WHERE NOT (payment_method = "ONLINE" AND payment_status = "PENDING") AND user_id =?';
    db.query(sql, [user_id],async (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: err })
        } else {
            for (let product of data) {
                const images = await new Promise((resolve, reject) => {
                    const imgSql = "SELECT image FROM product_images WHERE product_id = ?";
                    db.query(imgSql, [product._id], (err, data) => {
                        if (err) reject(err)
                        resolve(data)
                    })
                })
                product.images = images.map(img => img.image)
            }
            res.status(200).json(data)
        }
    })
}

export const fetchAllOrders = (req, res) => {
    const sql = 'SELECT * FROM orders JOIN order_items ON orders._id = order_items.order_id JOIN products ON products._id = order_items.product_id WHERE NOT (payment_method = "ONLINE" AND payment_status = "PENDING")';
    db.query(sql, async (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: err })
        } else {
            for (let product of data) {
                const images = await new Promise((resolve, reject) => {
                    const imgSql = "SELECT image FROM product_images WHERE product_id = ?";
                    db.query(imgSql, [product._id], (err, data) => {
                        if (err) reject(err)
                        resolve(data)
                    })
                })
                product.images = images.map(img => img.image)
            }
            res.status(200).json(data)
        }
    })
}

export const deleteUserOrder = (req, res) => {
    const { order_id } = req.params;
    const deleteQuery = 'DELETE FROM order_items WHERE order_id = ?';
    db.query(deleteQuery, [order_id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, messege: err })
        } else {
            const sql = 'DELETE FROM orders WHERE _id = ?';
            db.query(sql, [order_id], (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, messege: err })
                }
                res.status(200).json({ success: true, messege: "Order Cancelled" })
            })
        }
    })
}

export const updateOrderStatus = (req, res) => {
    const { order_id } = req.params;
    const { order_status } = req.body;
    if (!order_status) {
        return res.status(400).json({ success: false, messege: "Status can,t be null" })
    }
    const values = [order_status]
    db.query('UPDATE orders SET order_status = ? WHERE _id = ?', [...values, order_id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, messege: err })
        }
        res.status(200).json({ success: true, messege: "Order Status updated" })
    })
}