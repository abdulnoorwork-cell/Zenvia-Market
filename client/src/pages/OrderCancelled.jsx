import React from 'react'
import { useLocation } from 'react-router-dom'
import cross_mark from '../assets/delete-button.png'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const OrderCancelled = () => {
    const { navigate } = useContext(AppContext)
    const query = new URLSearchParams(useLocation().search);
    const orderId = query.get("order_id")
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100'>
            <div className='bg-white rounded-[10px] text-sm p-8 max-w-[500px] w-full mx-auto shadow-xl flex flex-col items-center gap-0.5'>
                <img src={cross_mark} className='w-12 mb-2' alt="" />
                <h3 className='text-2xl font-bold tracking-tight'>Order Cancelled</h3>
                <button onClick={() => { navigate('/'); scrollTo(0, 0) }} className='cursor-pointer text-white font-medium bg-[#2563EB] px-10 py-3 mt-6 rounded-lg active:bg-blue-500'>Return to Home</button>
            </div>
        </div>
    )
}

export default OrderCancelled