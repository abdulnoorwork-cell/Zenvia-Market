import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import check_mark from '../assets/check_mark.png'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const OrderSuccessfull = () => {
    const hasCalled = useRef(false);
    const { navigate, backendUrl, getCartItems, getTotalCartItems } = useContext(AppContext)
    const query = new URLSearchParams(useLocation().search);
    const session_id = query.get("session_id");

    useEffect(() => {

        if (!session_id || hasCalled.current) return;

        hasCalled.current = true;

        const confirmOrder = async () => {
            try {
                let response = await axios.post(
                    `${backendUrl}/api/order/confirm-order`,
                    { session_id },
                    { withCredentials: true }
                );

                if (response.data) {
                    getCartItems()
                    getTotalCartItems()
                }

            } catch (error) {
                console.log(error);
                console.log(error?.response?.data?.message);
            }
        };

        confirmOrder();

    }, [session_id]);
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100'>
            <div className='bg-white rounded-[10px] text-sm p-8 max-w-[500px] w-full mx-auto shadow-xl flex flex-col items-center gap-0.5'>
                <img src={check_mark} className='w-12 mb-2' alt="" />
                <h3 className='text-2xl font-bold' style={{ fontFamily: 'Outfit' }}>Payment Successfull</h3>
                <p>Thank you for your payment</p>
                <button onClick={() => { navigate('/'); scrollTo(0, 0) }} className='cursor-pointer text-white font-medium bg-[#2563EB] px-10 py-3 mt-6 rounded-lg active:bg-blue-500'>Continue Shopping</button>
            </div>
        </div>
    )
}

export default OrderSuccessfull