import db from '../config/db.js'
export const addToCart = (req, res) => {
    const { user_id } = req.params;
    const { product_id, quantity, size, color, footwear_size } = req.body;
    // simple validation
    if (!product_id) {
        return res.status(400).json({ message: "Product id required" });
    }
    const sql = 'INSERT INTO cart_items (user_id, product_id, quantity,size,color,footwear_size) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE quantity = quantity + 1';
    const values = [
        user_id,
        product_id,
        quantity,
        size || "",
        color || "",
        footwear_size || ""
    ]
    db.query(sql, values, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ success: false, messege: "Error in addtocart: " + err })
        } else {
            res.status(201).json({ success: true, messege: "Added To Cart" })
        }
    })
}

export const getCart = (req, res) => {
    const { user_id } = req.params;
    const sql = 'SELECT cart_items._id AS cart_id, products._id, products.name, products.offerPrice, cart_items.size, cart_items.color, cart_items.footwear_size, cart_items.quantity, (products.offerPrice * cart_items.quantity) AS total FROM cart_items JOIN products ON cart_items.product_id = products._id WHERE cart_items.user_id = ?';
    db.query(sql, [user_id],async (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ success: false, messege: "Error in getting cart items: " + err })
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
            res.status(200).json(data);
        }
    })
}

export const totalPrice = (req, res) => {
    const { user_id } = req.params;
    const sql = 'SELECT SUM(products.offerPrice * cart_items.quantity) AS total FROM cart_items JOIN products ON cart_items.product_id = products._id WHERE cart_items.user_id = ?';
    db.query(sql, [user_id], (err, data) => {
        if (err) {
            return req.status(500).json({ success: false, messege: "Error in getting total amount: " + err })
        } else {
            res.status(200).json(data)
        }
    })
}

export const totalItems = (req, res) => {
    const { user_id } = req.params;
    const sql = 'SELECT SUM(quantity) AS total_items FROM cart_items WHERE user_id = ?';
    db.query(sql, [user_id], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: "Error in getting total cart items: " + err })
        } else {
            res.status(200).json(data)
        }
    })
}

export const removeFromCart = (req, res) => {
    const { cart_id } = req.body;
    const { user_id } = req.params;
    const sql = 'DELETE FROM cart_items WHERE user_id = ? AND _id = ?';
    db.query(sql, [user_id, cart_id], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: "Error in remove from cart: " + err })
        } else {
            res.status(200).json({ success: true, messege: "Product removed" })
        }
    })
}

export const quantityUpdated = (req, res) => {
    const { user_id } = req.params;
    const { cart_id, quantity } = req.body;
    if(!cart_id){
        return res.status(401).json({success:false,messege:"Cart id not found"})
    }
    if (quantity < 1) {
        return res.status(400).json({ success: false, messege: "Quantity should be atleast 1" })
    }
    const sql = 'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND _id = ?';
    const values = [quantity]
    db.query(sql, [...values, user_id, cart_id], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: "Error in updating quantity: " + err })
        } else {
            res.status(200).json({ success: true, messege: "Quantity updated" })
        }
    })
}