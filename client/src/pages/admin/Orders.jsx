import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { AppContext } from '../../context/AppContext'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [orderStatus, setOrderStatus] = useState('')
    const { currency, backendUrl, token } = useContext(AppContext);
    const fetchAllOrders = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/order/get-orders`, { withCredentials: true })
            if (response.data) {
                setOrders(response.data)
            } else {
                console.log(error.response.data.messege);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const statusHandler = async (event, orderId) => {
        try {
            let response = await axios.post(`${backendUrl}/api/order/status`, { orderId, status: event.target.value }, { withCredentials: true })
            if (response.data.success) {
                await fetchAllOrders()
                toast.success(response.data.messege)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateOrderStatus = async (event, order_id) => {
        try {

            let response = await axios.put(`${backendUrl}/api/order/update-order/${order_id}`, { order_status: event.target.value }, { withCredentials: true });
            if (response.data.success) {
                fetchAllOrders()
                toast.success(response.data.messege);
            } else {
                toast.error(response.data.messege)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllOrders()
    }, [])

    console.log(orders)

    return (
        <div className="flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[95vh]">
            <div className='flex flex-col w-full'>
                <h1 className=' font-medium'>Orders List</h1>
                {orders.length > 0 ?
                    <div className='relative max-h-[80vh] mt-4 overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
                        {orders?.map((order, index) => (
                            <div key={index} className="bg-white grid xl:grid-cols-[2fr_2fr_1fr_2fr_1fr] md:grid-cols-[2fr_2fr_1fr] sm:grid-cols-2 items-center gap-4 py-4 px-3 rounded-md border border-gray-300 text-gray-800">
                                <div className="order_image_parent flex gap-2">
                                    <img className="w-12 h-12 object-cover" src={order?.image ? JSON.parse(order?.image) : null} alt="product_image" />
                                    <div className="flex flex-col justify-center">
                                        <p className="font-medium text-sm">
                                            {order?.name} <span className={`text-[#994CF5] ${order?.quantity < 2 && "hidden"}`}>x{order?.quantity}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <p className='font-medium mb-1'>{order?.full_name}</p>
                                    <p className='text-[13px] text-gray-600'>{order?.address}, {order?.city}, {order?.state},{order?.zipcode}, {order?.country}</p>
                                </div>

                                <p className="font-medium text-sm my-auto text-black/70">${order?.total_amount}</p>

                                <div className="flex flex-col text-[13px]">
                                    <p>Method: {order.payment_method}</p>
                                    <p>Date: {new Date(order.created_at).toDateString()}</p>
                                    <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                                </div>
                                <select value={order?.order_status} onChange={(event) => updateOrderStatus(event, order.order_id)} className='p-2 font-semibold text-xs outline-[#994CF5] w-fit'>
                                    <option value="Order Placed">Order Placed</option>
                                    <option value="Packing">Packing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out for delivery">Out for delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        ))}
                    </div> : <div className='font-medium min-h-[100px] w-full text-sm flex items-center justify-center text-center bg-white rounded-md'>You don,t have any customer orders</div>}
            </div>
        </div>
    )
}

export default Orders