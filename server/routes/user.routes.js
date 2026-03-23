import express from 'express'
import { adminLogin, forgotPassword, getUser, login, resetPassword, signup, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/user-data/:user_id',getUser);
router.put('/update/:user_id', updateUser);
router.post('/admin-login', adminLogin);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);

export default router;