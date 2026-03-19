import express from 'express'
import { addProduct, deleteProduct, getLatestProducts, getProducts, getSearchProducts, getSingleProduct } from '../controllers/product.controller.js';
import isAdmin from '../middleware/isAdmin.js';
const router = express.Router();

router.post('/add',isAdmin, addProduct);
router.get('/get-products',getProducts);
router.get('/latest-products',getLatestProducts);
router.get('/product-detail/:productId',getSingleProduct);
router.delete('/delete/:productId',isAdmin, deleteProduct);
router.get('/search-products',getSearchProducts);

export default router;