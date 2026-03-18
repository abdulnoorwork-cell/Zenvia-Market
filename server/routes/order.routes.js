import express from 'express'
import { deleteUserOrder, fetchAllOrders, getUserOrders, placeOrder, updateOrderStatus } from '../controllers/order.controller.js';
import isAdmin from '../middleware/isAdmin.js';
const router = express.Router();

router.post('/place-order',placeOrder);
router.get('/user-orders/:user_id',getUserOrders);
router.get('/get-orders',fetchAllOrders);
router.delete('/delete-order/:order_id',deleteUserOrder);
router.put('/update-order/:order_id', isAdmin, updateOrderStatus);

export default router;