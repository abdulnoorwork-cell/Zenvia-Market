import db from "../config/db.js";
import { v2 as cloudinary } from 'cloudinary'

export const addProduct = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const {
      name, category, subCategory, about,
      description, price, offerPrice,
      sizes, footwear_sizes, colors
    } = req.body;

    if (!name || !category || !about || !description || !price || !offerPrice) {
      return res.status(400).json({ success: false, messege: "Required fields missing" });
    }

    if (name.length < 8 || name.length > 120) {
      return res.status(400).json({ success: false, messege: "Name must be 8–120 chars" });
    }

    if (Number(offerPrice) > Number(price)) {
      return res.status(400).json({ success: false, messege: "Offer price invalid" });
    }

    await conn.beginTransaction();

    // ✅ Insert product
    const [result] = await conn.query(
      `INSERT INTO products 
      (name, category, subCategory, about, description, price, offerPrice, sizes, footwear_sizes, colors)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category,
        subCategory,
        about,
        description,
        price,
        offerPrice,
        JSON.stringify(sizes || []),
        JSON.stringify(footwear_sizes || []),
        JSON.stringify(colors || [])
      ]
    );

    const productId = result.insertId;

    let imageRows = [];

    // ✅ Handle file uploads
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const allowedFormat = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

      for (const file of files) {
        if (!allowedFormat.includes(file.mimetype)) {
          await conn.rollback();
          return res.status(400).json({ success: false, messege: "Invalid image format" });
        }

        const upload = await cloudinary.uploader.upload(file.tempFilePath);

        imageRows.push([productId, upload.secure_url]);
      }
    }

    // ✅ Insert images
    if (imageRows.length) {
      await conn.query(
        "INSERT INTO product_images (product_id, image) VALUES ?",
        [imageRows]
      );
    }

    await conn.commit();

    return res.status(201).json({
      success: true,
      messege: "Product added successfully"
    });

  } catch (err) {
    await conn.rollback();
    return res.status(500).json({ success: false, messege: err.message });
  } finally {
    conn.release();
  }
};

export const getProducts = async (req, res) => {
    try {
        const sql = `
      SELECT 
        p._id,
        p.name,
        p.category,
        p.subCategory,
        p.price,
        p.offerPrice,
        p.created_at,
        GROUP_CONCAT(pi.image) AS images
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p._id
      GROUP BY p._id
    `;

        const [data] = await db.query(sql);

        const result = data.map(p => ({
            ...p,
            images: p.images ? p.images.split(",") : []
        }));

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({ success: false, messege: err.message });
    }
};

export const getSingleProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const sql = `
      SELECT 
        p.*,
        GROUP_CONCAT(pi.image) AS images
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p._id
      WHERE p._id = ?
      GROUP BY p._id
    `;

        const [data] = await db.query(sql, [productId]);

        if (!data.length) {
            return res.status(404).json({ success: false, messege: "Product not found" });
        }

        const product = {
            ...data[0],
            images: data[0].images ? data[0].images.split(",") : []
        };

        return res.status(200).json(product);

    } catch (err) {
        return res.status(500).json({ success: false, messege: err.message });
    }
};

export const deleteProduct = async (req, res) => {
    const conn = await db.getConnection();

    try {
        const { productId } = req.params;

        await conn.beginTransaction();

        const [images] = await conn.query(
            "SELECT image FROM product_images WHERE product_id = ?",
            [productId]
        );

        const getPublicId = (url) => {
            const parts = url.split("/");
            const file = parts.pop().split(".")[0];
            return file;
        };

        for (const img of images) {
            const public_id = getPublicId(img.image);
            await cloudinary.uploader.destroy(public_id);
        }

        await conn.query("DELETE FROM product_images WHERE product_id = ?", [productId]);
        await conn.query("DELETE FROM products WHERE _id = ?", [productId]);

        await conn.commit();

        return res.status(200).json({
            success: true,
            messege: "Product deleted successfully"
        });

    } catch (err) {
        await conn.rollback();
        return res.status(500).json({ success: false, messege: err.message });
    } finally {
        conn.release();
    }
};

export const getSearchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) return res.json([]);

    const sql = `
      SELECT 
        p.*,
        GROUP_CONCAT(pi.image) AS images
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p._id
      WHERE 
        p.name LIKE ? OR
        p.category LIKE ? OR
        p.subCategory LIKE ? OR
        p.about LIKE ? OR
        p.description LIKE ?
      GROUP BY p._id
    `;

    const search = `%${query}%`;

    const [data] = await db.query(sql, [
      search, search, search, search, search
    ]);

    const result = data.map(p => ({
      ...p,
      images: p.images ? p.images.split(",") : []
    }));

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ success: false, messege: err.message });
  }
};

export const getSuggestions = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const sql = `
            SELECT _id, name 
            FROM products
            WHERE name LIKE ? OR category LIKE ? OR subCategory LIKE ?
            LIMIT 8
        `;

        const values = [`%${query}%`, `%${query}%`, `%${query}%`];
        const [products] = await db.execute(sql, values);

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
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

export const getLatestProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const sql = `
            SELECT _id, name, category, subCategory, price, offerPrice, created_at 
            FROM products 
            ORDER BY created_at DESC 
            LIMIT ?
        `;

        const [products] = await db.execute(sql, [limit]);

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
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

export const getCategoryProducts = async (req, res) => {
    try {
        const { category } = req.params;

        const [products] = await db.execute(
            `SELECT _id, name, category, subCategory, price, offerPrice 
             FROM products WHERE category = ?`,
            [category]
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
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

export const getLatestCategoryProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const { category } = req.params;

        const [products] = await db.execute(
            `SELECT _id, name, category, subCategory, price, offerPrice 
             FROM products 
             WHERE category = ? 
             ORDER BY created_at DESC 
             LIMIT ?`,
            [category, limit]
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
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

export const getSubCategoryProducts = async (req, res) => {
    try {
        const { subCategory } = req.params;

        const [products] = await db.execute(
            `SELECT _id, name, category, subCategory, price, offerPrice 
             FROM products WHERE subCategory = ?`,
            [subCategory]
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
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};