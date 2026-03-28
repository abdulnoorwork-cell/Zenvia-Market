import express from 'express'
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
const router = express.Router();
import {isAuthenticated} from '../middleware/auth.js'

router.post('/add',isAuthenticated, addToWishlist)
router.delete('/remove',isAuthenticated, removeFromWishlist);
router.get('/get-user-wishlist/:user_id', getWishlist);
export default router