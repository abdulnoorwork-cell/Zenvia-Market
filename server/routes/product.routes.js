import express from 'express'
import { addProduct, deleteProduct, getCategoryProducts, getLatestCategoryProducts, getLatestProducts, getProducts, getSearchProducts, getSingleProduct, getSubCategoryProducts } from '../controllers/product.controller.js';
import isAdmin from '../middleware/isAdmin.js';
const router = express.Router();

router.post('/add',isAdmin, addProduct);
router.get('/get-products',getProducts);
router.get('/latest-products',getLatestProducts);
router.get('/category-products/:category',getCategoryProducts);
router.get('/subcategory-products/:subCategory',getSubCategoryProducts);
router.get('/latest-category-products/:category',getLatestCategoryProducts);
router.get('/product-detail/:productId',getSingleProduct);
router.delete('/delete/:productId',isAdmin, deleteProduct);
router.get('/search-products',getSearchProducts);

export default router;