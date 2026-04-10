import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import cross_icon from '../assets/cross_icon.svg'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const Cart = () => {
    const { currency, shippingFee, navigate, cartItems, backendUrl, userId, token, getCartItems, discount, getTotalCartItems } = useContext(AppContext);
    const [totalAmount, setTotalAmount] = useState();

    const getTotalAmount = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/cart/totalamount/${userId}`, {
                withCredentials: true
            })
            if (response.data) {
                setTotalAmount(response.data?.[0]?.total)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateQuantity = async (cart_id, quantity) => {
        if (!token) {
            toast.error("Please login first")
        }
        if (token) {
            try {
                let response = await axios.put(`${backendUrl}/api/cart/update-quantity/${userId}`, { cart_id, quantity }, {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                })
                if (response.data.success) {
                    toast.success(response.data.messege)
                    getCartItems()
                    getTotalCartItems()
                    getTotalAmount()
                }
            } catch (error) {
                console.log(error)
                if (error.response.status === 500) {
                    localStorage.removeItem('User')
                    window.location.href = "/user/login"
                }
                toast.error(error.response.data.messege)
            }
        }
    }
    const removeFomCart = async (cart_id) => {
        if (!token) {
            toast.error("Please login first")
        }
        if (token) {
            try {
                let response = await axios.post(`${backendUrl}/api/cart/removefromcart/${userId}`, { cart_id }, {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                })
                if (response.data.success) {
                    getCartItems()
                    getTotalCartItems()
                    getTotalAmount()
                    toast.success(response.data.messege)
                }
            } catch (error) {
                console.log(error)
                if (error.response.status === 500) {
                    localStorage.removeItem('User')
                    window.location.href = "/user/login"
                }
                toast.error(error.response.data.messege)
            }
        }
    }
    useEffect(() => {
        getTotalAmount()
    }, [])
    return (
        <div className="min-h-screen py-10">
            <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">

                {/* Cart Items */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow sm:p-6 p-5">
                    {cartItems.length>0&&<h2 className="text-2xl font-bold mb-6">Your Cart</h2>}
                    {cartItems.length<1 && <div className='text-gray-800 font-medium'>
                        <h2 className="text-2xl font-bold mb-4">Cart is Empty</h2>
                        <h6>You don,t have any item in cart.</h6>
                        </div>}

                    {cartItems.length > 0 &&
                        <div className='cart_items_label grid grid-cols-[3fr_1fr_1fr_1fr] items-center bg-gray-100 font-medium py-3 sm:text-sm text-xs px-4'>
                            <h6>Product</h6>
                            <h6>Quantity</h6>
                            <h6 className='mx-auto'>Price</h6>
                            <h6 className='text-end'>Action</h6>
                        </div>}

                    {cartItems.map((item, index) => (
                        <div
                            key={index}
                            className="cart_items grid grid-cols-[3fr_1fr_1fr_1fr] gap-2 items-center border-y border-gray-300 text-gray-800 py-4"
                        >
                            <div className="image_container flex items-center sm:gap-4 gap-3">
                                <img
                                    src={item.images[0]}
                                    alt=""
                                    className="sm:w-20 w-16 sm:h-20 h-16 bg-gray-100 object-contain rounded"
                                />

                                <div className='text-sm'>
                                    <h3 className="font-semibold sm:text-sm text-[13px]" style={{ fontFamily: 'Outfit' }}>{item.name}</h3>
                                    <div className='font-medium leading-[1.3em] mt-1'>
                                        {/* <p style={{ fontFamily: 'Outfit' }}>
                                            {currency}. {(item.offerPrice).toLocaleString()}
                                        </p> */}
                                        <p style={{ fontFamily: 'Outfit' }}>{item.size ? `Size. ${item.size}` : null}</p>
                                        <p style={{ fontFamily: 'Outfit' }}>{item.color ? `Color. ${item.color}` : null}</p>
                                        <p style={{ fontFamily: 'Outfit' }}>{item.footwear_size ? `Size. ${item.footwear_size}` : null}</p>
                                    </div>
                                </div>

                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => { updateQuantity(item.cart_id, item.quantity - 1) }}
                                    className="cursor-pointer px-3 py-0.5 bg-gray-200 rounded"
                                >
                                    -
                                </button>

                                <span className="font-semibold text-sm" style={{ fontFamily: 'Outfit' }}>{item.quantity}</span>

                                <button
                                    onClick={() => { updateQuantity(item.cart_id, item.quantity + 1) }}
                                    className="cursor-pointer px-3 py-0.5 bg-gray-200 rounded"
                                >
                                    +
                                </button>
                            </div>

                            {/* Total */}
                            <div className="font-semibold mx-auto text-sm" style={{ fontFamily: 'Outfit' }}>
                                {currency}. {(item.offerPrice * item.quantity).toLocaleString()}
                            </div>
                            <div className='cross_icon flex justify-end'>
                                <img src={cross_icon} onClick={() => removeFomCart(item.cart_id)} alt="" className='sm:h-[20px] sm:w-[20px] w-[17px] h-[17px] border border-red-400 rounded-full hover:scale-110 transition-all cursor-pointer mr-6' />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow p-6 h-fit">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                    <div className="space-y-3 text-gray-800 text-sm font-medium">

                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{currency}. {totalAmount ? (totalAmount)?.toLocaleString() : '0'} </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{currency}. {cartItems?.[0]?.total > 0 ? (shippingFee)?.toLocaleString() : '0'}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span className='text-green-600'>- {currency}. {cartItems?.[0]?.total > 0 ? discount : '0'}</span>
                        </div>

                        <hr className='opacity-30' />

                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{currency}. {cartItems?.[0]?.total > 0 ? ((totalAmount + shippingFee) - discount).toLocaleString() : '0'}</span>
                        </div>

                    </div>

                    {token ? <button onClick={() => { navigate('/checkout'); scrollTo(0, 0) }} className="w-full mt-6 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition text-sm">
                        Proceed to Checkout
                    </button> : <button onClick={() => { navigate('/user/login'); scrollTo(0, 0) }} className="w-full mt-6 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition text-sm">
                        Proceed to Checkout
                    </button>}

                    <button onClick={() => { navigate('/shop/all-products'); scrollTo(0, 0) }} className="w-full mt-3 border cursor-pointer border-gray-300 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart