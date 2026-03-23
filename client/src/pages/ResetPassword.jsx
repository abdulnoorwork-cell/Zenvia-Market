import axios from 'axios';
import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('')
    const { backendUrl,navigate } = useContext(AppContext);
    const location = useLocation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Password does not match')
            return
        }
        try {
            let response = await axios.post(`${backendUrl}/api/user/reset-password`, { token: resetToken, password }, {
                withCredentials: true
            })
            if (response.data.success) {
                toast.success(response.data.messege)
                console.log(response.data)
                setPassword('');
                setConfirmPassword('');
                navigate('/login')
                
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.messege)
        }
    }
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        if (token) {
            setResetToken(token);
            console.log(token)
        } else {
            toast.error("Reset token not found")
        }
    }, [])

    return (
        <div className='px-4 h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100'>
            <form onSubmit={handleSubmit} className='bg-white rounded-[10px] text-sm p-8 max-w-[500px] w-full mx-auto shadow-xl'>
                <h6 className='text-gray-800 text-xl font-semibold'>Reset Password</h6>
                <div className='text-gray-800 flex flex-col gap-1 mt-5 text-sm'>
                    <h6>New Password</h6>
                    <input type="password" placeholder='Enter new password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full mt-1 px-4 py-3 border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none' />
                </div>
                <div className='text-gray-800 flex flex-col gap-1 mt-5 text-sm'>
                    <h6>Confirm Password</h6>
                    <input type="password" placeholder='Confirm your password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='w-full mt-1 px-4 py-3 border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none' />
                </div>
                <button type="submit" className='text-white font-medium cursor-pointer bg-[#2563EB] px-10 py-3 mt-7 rounded-lg active:bg-blue-500'>Reset Password</button>
            </form>
        </div>
    )
}

export default ResetPassword