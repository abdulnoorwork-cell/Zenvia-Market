import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { AppContext } from '../../context/AppContext'
import parcel_icon from '../../assets/parcel_icon.svg'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const { currency, backendUrl, isAdmin,fetchUserOrders } = useContext(AppContext);
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

    const updateOrderStatus = async (event, order_id) => {
        try {

            let response = await axios.put(`${backendUrl}/api/order/update-order/${order_id}`, { order_status: event.target.value }, {
                headers: {
                    Authorization: `${isAdmin}`
                },
                withCredentials: true
            });
            if (response.data.success) {
                await fetchAllOrders()
                await fetchUserOrders()
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
        fetchUserOrders()
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
                                    <img className="w-12 h-12 object-cover" src={order.images[0] ? order.images[0] : parcel_icon} alt="product_image" />
                                    <div className="flex flex-col justify-center">
                                        <p className="font-medium text-sm">
                                            {order?.name} <span className={`text-[#2563EB]`}>x{order?.quantity}</span>
                                        </p>
                                        <div className='flex flex-col leading-none gap-1 text-[13.2px] mt-1'>
                                            <p style={{ fontFamily: 'Outfit' }}>{order.size && "Size:"} {order.size && order.size}</p>
                                            <p style={{ fontFamily: 'Outfit' }}>{order.color && "Color:"} {order.color && order.color}</p>
                                            <p style={{ fontFamily: 'Outfit' }}>{order.footwear_size && "Size:"} {order.footwear_size && order.footwear_size}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <p className='font-medium mb-1'>{JSON.parse(order.address).firstName} {JSON.parse(order.address).lastName}</p>
                                    <p className='text-xs'>{JSON.parse(order.address).address}, {JSON.parse(order.address).city},{JSON.parse(order.address).postal_code}</p>
                                    <p className='text-xs'>{JSON.parse(order.address).email}</p>
                                    <p className='text-xs'>{JSON.parse(order.address).phone}</p>
                                </div>

                                <p className="font-medium text-[13.2px] my-auto text-black/70">{currency}. {(order?.total_amount).toLocaleString()}</p>

                                <div className="flex flex-col text-xs">
                                    <p>Method: {order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1).toLowerCase()}</p>
                                    <p>Date: {new Date(order.created_at).toDateString()}</p>
                                    <p>Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1).toLowerCase()}</p>
                                </div>
                                <select value={order.order_status?.trim()} onChange={(event) => updateOrderStatus(event, order.order_id)} className='p-2 font-medium text-xs bg-gray-50 border border-[#E2E8F0] outline-[#2563EB] w-fit text-gray-600 rounded-sm'>
                                    <option value="PLACED">Order Placed</option>
                                    <option value="PACKING">Packing</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="OUT FOR DELIVERY">Out for delivery</option>
                                    <option value="DELIVERED">Delivered</option>
                                </select>
                            </div>
                        ))}
                    </div> : <div className='font-medium min-h-[100px] w-full text-sm flex items-center justify-center text-center bg-white rounded-md'>You don,t have any customer orders</div>}
            </div>
        </div>
    )
}

export default Orders