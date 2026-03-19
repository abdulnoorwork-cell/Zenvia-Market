import db from "../config/db.js";
import { v2 as cloudinary } from 'cloudinary'

export const addProduct = async (req, res) => {
    const { name, category, subCategory, about, description, price, offerPrice, sizes, footwear_sizes, colors, images } = req.body;
    if (category !== "Home Decor") {
        if (!name || !category || !subCategory || !about || !description || !price || !offerPrice) {
            return res.status(400).json({ success: false, messege: "Please fill required fields" })
        }
    }
    if (name.length > 120) {
        return res.status(401).json({ success: false, messege: "maximum name is 80 characters" })
    }
    if (name.length < 8) {
        return res.status(401).json({ success: false, messege: "name contains 8 characters atleast" })
    }
    if (Number(price) < Number(offerPrice)) {
        return res.status(401).json({ success: false, messege: "Offer price cannot be greater than actual price" })
    }
    const sql = 'INSERT INTO products(`name`,`category`,`subCategory`,`about`,`description`,`price`,`offerPrice`,`sizes`,`footwear_sizes`,`colors`) VALUES(?)';
    const values = [
        name,
        category,
        subCategory,
        about,
        description,
        price,
        offerPrice,
        JSON.stringify(JSON.parse(sizes)),
        JSON.stringify(JSON.parse(footwear_sizes)),
        JSON.stringify(JSON.parse(colors))
    ];
    db.query(sql, [values], async (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ success: false, messege: "Error in adding product: " + err })
        } else {
            const productId = result.insertId;
            const uploadImages = [];
            try {
                for (const img of images) {
                    const allowedFormat = ["image/jpg", "image/png", "image/jpeg", "image/webp"];
                    if (!allowedFormat) {
                        return res.status(400).json({ success: false, messege: "Invalid Format! Only jpg,png,jpeg,webp are allowed" })
                    }
                    const upload = await cloudinary.uploader.upload(img)
                    uploadImages.push([productId, upload.secure_url]);
                }
            } catch (error) {
                console.log(error)
                return res.json(error)
            }
            const imgSql = 'INSERT INTO product_images(`product_id`,`image`) VALUES ?';
            db.query(imgSql, [uploadImages], (err, result) => {
                if (err) return res.status(500).json({ success: false, messege: err })
                res.status(201).json({ success: true, messege: "Product added successfully" })
            })
        }
    })
}

export const getProducts = (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, async (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: 'Error in getting products: ' + err });
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

export const getSingleProduct = (req, res) => {
    const { productId } = req.params;
    const sql = 'SELECT * FROM products WHERE _id = ?';
    db.query(sql, [productId], async (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: 'Error in getting single product: ' + err });
        } else {
            if (data.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }
            const product = data[0]
            const imgSql = "SELECT image FROM product_images WHERE product_id = ?";
            db.query(imgSql, [productId], (err, imgData) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Error fetching images"
                    });
                }
                product.images = imgData.map(img => img.image)
                res.status(200).json(product);
            })
        }
    })
}

export const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const sql = 'DELETE FROM products WHERE _id = ?';
    db.query(sql, productId, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: 'Error in deleting product: ' + err });
        } else {
            res.status(200).json({ success: true, messege: "Product deleted successfully" });
        }
    })
}

export const getSearchProducts = (req, res) => {
    const search = req.query.q;
    const sql = 'SELECT * FROM products WHERE name LIKE?';
    db.query(sql, [`%${search}%`], async (err, data) => {
        if (err) return res.status(500).json(err)
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
    })
}

export const getLatestProducts = (req, res) => {
    const limit = parseInt(req.query.limit) || 8;
    const sql = 'SELECT * FROM products ORDER BY created_at DESC LIMIT ?'
    db.query(sql, [limit], async (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Server error" });
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
    });
}