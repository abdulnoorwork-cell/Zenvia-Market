import axios from 'axios';
import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false)
    const { backendUrl, navigate } = useContext(AppContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email }, {
                withCredentials: true
            })
            if (response.data.success) {
                setLoading(false)
                toast.success(response.data.messege)
                setEmail('');
                setLoading(false)
            }
            setLoading(false)
            console.log(response.data)
        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error(error.response.data.messege)
        }
    }
    return (
        <div className='px-4 h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100'>
            <form onSubmit={handleSubmit} className='bg-white rounded-[10px] text-sm p-8 max-w-[500px] w-full mx-auto shadow-xl'>
                <h6 className='text-xl font-semibold'>Forgot Password</h6>
                <div className='flex flex-col gap-1 mt-5'>
                    <label className='text-[15px]'>Email</label>
                    <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full mt-1 px-4 py-3 border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none' />
                </div>
                <button type="submit" className='text-white font-medium cursor-pointer bg-[#2563EB] px-10 py-3 mt-7 rounded-lg active:bg-blue-500'>{loading ? "Sending Link..." : "Send Link"}</button>
            </form>
        </div>
    )
}

export default ForgotPassword