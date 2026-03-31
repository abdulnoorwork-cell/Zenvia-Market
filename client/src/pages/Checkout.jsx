import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Checkout = () => {
    const [loading, setLoading] = useState(false)
    const { cartItems, backendUrl, userId, token, getCartItems, shippingFee, currency, discount, getTotalCartItems,fetchAdminOrders } = useContext(AppContext)
    const subtotal = cartItems.reduce(
        (total, item) => total + item.offerPrice * item.quantity,
        0
    );
    const total = (subtotal + shippingFee) - discount;

    const [payment, setPayment] = useState("ONLINE");
    const [deliveryInfo, setDeliveryInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        postal_code: "",
        address: ""
    })
    const onChangeHandler = (e) => {
        setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value })
    }
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (token) {
            try {
                if (!cartItems || cartItems.length === 0) {
                    return toast.error("You didn,t have any cart items")
                }
                setLoading(true)
                let response = await axios.post(`${backendUrl}/api/order/place-order`, {
                    user_id: userId,
                    items: cartItems,
                    total_amount: total,
                    payment_method: payment,
                    address: deliveryInfo,
                }, {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                })
                if (response.data) {
                    setLoading(false)
                    getCartItems()
                    getTotalCartItems()
                    if (payment === "COD") {
                        toast.success("Order placed successfully!")
                    } else {
                        window.location.href = response.data.url
                    }
                    fetchAdminOrders()
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        } else {
            localStorage.removeItem('User')
            window.location.href ="/user/login";
            window.location.reload()
        }
    }

    return (
        <div className="min-h-screen py-12">

            <form onSubmit={onSubmitHandler} className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">

                {/* Billing Form */}
                <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow max-w-3xl">

                    <h2 className="text-2xl font-bold mb-6">
                        Billing Details
                    </h2>

                    <div>
                        <div className="grid md:grid-cols-2 gap-4 sm:text-[13px] text-xs">
                            <input
                                type="text"
                                name='firstName'
                                value={deliveryInfo.firstName}
                                onChange={onChangeHandler}
                                placeholder="First Name"
                                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />

                            <input
                                type="text"
                                name='lastName'
                                value={deliveryInfo.lastName}
                                onChange={onChangeHandler}
                                placeholder="Last Name"
                                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />

                            <input
                                type="email"
                                name='email'
                                value={deliveryInfo.email}
                                onChange={onChangeHandler}
                                placeholder="Email Address"
                                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />

                            <input
                                type="number"
                                name='phone'
                                value={deliveryInfo.phone}
                                onChange={onChangeHandler}
                                placeholder="Phone Number"
                                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />

                            <input
                                type="text"
                                name='city'
                                value={deliveryInfo.city}
                                onChange={onChangeHandler}
                                placeholder="City"
                                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />

                            <input
                                type="text"
                                name='postal_code'
                                value={deliveryInfo.postal_code}
                                onChange={onChangeHandler}
                                placeholder="Postal Code"
                                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />

                            <input
                                type="text"
                                name='address'
                                value={deliveryInfo.address}
                                onChange={onChangeHandler}
                                placeholder="Address"
                                className="md:col-span-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                    </div>

                    {/* Payment Method */}
                    <div className="mt-8">

                        <h3 className="text-xl font-bold mb-4">
                            Payment Method
                        </h3>

                        <div className="space-y-3 sm:text-[13px] text-xs font-medium">

                            <label onChange={() => setPayment("COD")} className="flex items-center gap-3 border border-gray-300 p-3 rounded-lg cursor-pointer bg-gray-50">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={payment === "COD"}
                                />
                                Cash on Delivery
                            </label>

                            <label onChange={() => setPayment("ONLINE")} className="flex items-center gap-3 border border-gray-300 p-3 rounded-lg cursor-pointer bg-gray-50">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={payment === "ONLINE"}
                                />
                                Credit / Debit Card
                            </label>

                        </div>
                    </div>

                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-xl shadow h-fit">

                    <h2 className="text-xl font-bold mb-6">
                        Order Summary
                    </h2>

                    <div className="space-y-4 text-sm">

                        {cartItems.map((item, index) => (
                            <div key={index} className="flex gap-3">

                                <img
                                    src={item.images[0]}
                                    alt=""
                                    className="w-16 h-16 object-contain bg-gray-50 border border-gray-200 rounded"
                                />

                                <div className="flex-1">
                                    <h6 className="font-semibold leading-[1.3em] mb-0.5 line-clamp-2">{item.name}</h6>
                                    <h6 className="text-xs text-gray-600 font-medium">
                                        Qty: {item.quantity}
                                    </h6>
                                    <h6 className='text-xs text-gray-600 font-medium' style={{ fontFamily: 'Outfit' }}>{item.size ? `Size. ${item.size}` : null}</h6>
                                    <h6 className='text-xs text-gray-600 font-medium' style={{ fontFamily: 'Outfit' }}>{item.color ? `Color. ${item.color}` : null}</h6>
                                    <h6 className='text-xs text-gray-600 font-medium' style={{ fontFamily: 'Outfit' }}>{item.footwear_size ? `Size. ${item.footwear_size}` : null}</h6>
                                </div>

                                <h6 className="font-semibold">
                                    {currency}. {(item.offerPrice * item.quantity).toLocaleString()}
                                </h6>

                            </div>
                        ))}

                    </div>

                    <hr className="my-6 opacity-50" />

                    <div className="space-y-2 text-sm">

                        <div className="flex justify-between font-medium">
                            <span style={{ fontFamily: 'Outfit' }}>Subtotal</span>
                            <span style={{ fontFamily: 'Outfit' }}>{currency}. {subtotal.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between font-medium">
                            <span style={{ fontFamily: 'Outfit' }}>Shipping</span>
                            <span style={{ fontFamily: 'Outfit' }}>{currency}.{subtotal ? shippingFee : "0"}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span style={{ fontFamily: 'Outfit' }}>Discount</span>
                            <span className="text-green-700/90" style={{ fontFamily: 'Outfit' }}>-{currency}.{subtotal ? discount : "0"}</span>
                        </div>

                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{currency}. {subtotal>0 ? total.toLocaleString() : '0'}</span>
                        </div>

                    </div>

                    <button type='submit' className="w-full cursor-pointer mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                        {loading ? "Order placing..." : 'Place Order'}
                    </button>

                </div>

            </form>

        </div>
    )
}

export default Checkout