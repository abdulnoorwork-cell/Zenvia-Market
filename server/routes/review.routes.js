import express from 'express';
import { addReview, getProductReviews, productRating } from '../controllers/reviews.controller.js';
import {isAuthenticated} from '../middleware/auth.js'
const router = express.Router();

router.post('/add', isAuthenticated, addReview);
router.get('/get-reviews/:product_id',getProductReviews)
router.get('/get-product-rating/:product_id',productRating)

export default router;