import React, { useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import profile_image from '../assets/profile_image.png'
import { IoClose } from "react-icons/io5";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { RiBox3Line, RiEdit2Fill } from "react-icons/ri";
import { FiPackage, FiMapPin } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { FiHeart } from "react-icons/fi";
import { RiUserLine } from "react-icons/ri";
import { MdOutlineReviews } from "react-icons/md";
import { Heart, Star } from 'lucide-react';

const MyAccount = () => {
  const [label, setLabel] = useState("Dashboard");
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [previewImage, setPreviewImage] = useState(profile_image);
  const { token, userId, backendUrl, currency, navigate, wishlist, toggleWishlist, fetchUserOrders, orders } = useContext(AppContext)
  const file = useRef();

  const statusColor = (order_status) => {
    switch (order_status) {
      case "PACKING":
        return "bg-yellow-100 text-yellow-700";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "OUT FOR DELIVERY":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700 border border-[#E2E8F0]";
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && userId) {
        try {
          let response = await axios.get(`${backendUrl}/api/user/user-data/${userId}`, {
            headers: {
              Authorization: `${token}`
            },
            withCredentials: true
          })
          if (response.data) {
            setName(response.data[0].name)
            setEmail(response.data[0].email);
            setPhone(response.data[0].phone);
            setPreviewImage(JSON.parse(response?.data[0]?.profile_image))
            await fetchUserOrders()
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    fetchUserData()
  }, [token, userId])

  const logout = () => {
    localStorage.removeItem('User');
    toast.success("Logout successfully")
    setTimeout(() => {
      navigate('/user/login')
      window.location.reload()
    }, 1000)
  }

  const updateUserHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('profile_image', image || '');
      let response = await axios.put(`${backendUrl}/api/user/update/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`
        },
        withCredentials: true
      })
      if (response.data.success) {
        setLoading(false)
        setModel(false)
        toast.success(response.data.messege);
        fetchUser();
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error(error.response.data.messege);
    }
  }

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      setImage(file)
      setPreviewImage(fileReader?.result)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">

        {/* Sidebar */}
        <div className="bg-white pt-6 pr-3 rounded-xl shadow">

          <div className="text-center border-b border-[#e2e8f0a4] ml-3 pb-4">
            <img
              src={previewImage}
              className="w-[75px] h-[75px] rounded-full mx-auto"
            />

            <h3 className="mt-3 font-semibold">
              {name}
            </h3>

            <h6 className="text-gray-700 text-[13px]">
              {email}
            </h6>
            <button onClick={() => setModel(true)} className='text-white bg-[#2563EB] px-8 py-2 rounded-md text-[13px] cursor-pointer mt-2'>Edit Profile</button>
          </div>

          <div className="mt-4">

            <button onClick={() => setLabel("Dashboard")} className={`cursor-pointer w-full flex items-center gap-2 text-left px-4 py-2.5 ${label === "Dashboard" ? "bg-blue-50 text-blue-600" : ""}`}>
              <span className='text-lg'><RxDashboard /></span>Dashboard
            </button>

            <button onClick={() => setLabel("Orders")} className={`cursor-pointer w-full flex items-center gap-2 text-left px-4 py-2.5 ${label === "Orders" ? "bg-blue-50 text-blue-600" : ""}`}>
              <span className='text-lg'><RiBox3Line /></span>Orders
            </button>

            <button onClick={() => setLabel("Wishlist")} className={`cursor-pointer w-full flex items-center gap-2 text-left px-4 py-2.5 ${label === "Wishlist" ? "bg-blue-50 text-blue-600" : ""}`}>
              <span className='text-lg'><FiHeart /></span>Wishlist
            </button>

            <button onClick={() => setLabel("Account Details")} className={`cursor-pointer w-full flex items-center gap-2 text-left px-4 py-2.5 ${label === "Account Details" ? "bg-blue-50 text-blue-600" : ""}`}>
              <span className='text-lg'><RiUserLine /></span>Account Details
            </button>

            <button onClick={logout} className="cursor-pointer border-t border-[#e2e8f0a4] w-full text-left px-4 pt-3 pb-3.5 text-red-500 mt-3">
              Logout
            </button>

          </div>
        </div>

        {/* Dashboard */}
        {label === "Account Details" ?
          <div className="md:col-span-3 space-y-6">

            {/* Account Info */}
            <div className="bg-white p-6 rounded-xl shadow">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>

                <button onClick={() => setModel(true)} className="cursor-pointer flex items-center gap-1 text-blue-700 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-50 transition font-medium text-[13px]">
                  <RiEdit2Fill size={16} />
                  Edit
                </button>
              </div>

              {/* Info List */}
              <div>
                {/* Name */}
                <div className="flex items-start gap-4 p-3 border border-b-[0] border-[#E2E8F0]">
                  <FiUser className="text-gray-500 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-800 font-medium">{name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-3 border border-b-[0] border-[#E2E8F0]">
                  <FiMail className="text-gray-500 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">{email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-3 border border-[#E2E8F0]">
                  <FiPhone className="text-gray-500 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800 font-medium">{phone}</p>
                  </div>
                </div>
                <img src={previewImage} className='w-[55px] h-[55px] rounded-full cursor-pointer mt-4' alt="profile image" />
              </div>

            </div>
          </div> :
          label === "Orders" ?
            <div className="md:col-span-3 space-y-6 max-h-[630px] overflow-y-auto">

              {/* Orders List */}
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="w-full bg-white rounded-xl shadow p-4.5"
                >
                  {/* Top */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">
                        Order #{order._id}
                      </h3>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(
                          order.order_status
                        )}`}
                      >
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1).toLowerCase()}
                      </span>
                    </div>

                    <h6 style={{ fontFamily: 'Outfit' }} className="text-sm text-gray-700">
                      {new Date(order.created_at).toDateString()}
                    </h6>
                  </div>

                  {/* Middle */}
                  <div className="flex gap-4 items-center border-b border-[#E2E8F0] pb-4">
                    <img
                      src={order.images[0]}
                      alt="product"
                      className="w-16 h-16 rounded-md object-cover border border-[#E2E8F0] bg-gray-100"
                    />

                    <div className="flex-1">
                      <h4 className="font-medium">
                        {order.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Qty: {order.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <h6 style={{ fontFamily: "Outfit" }} className="text-lg font-semibold">
                        {currency}.{order.offerPrice.toLocaleString()}
                      </h6>

                      {/* <button className="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
                        View Order
                      </button> */}
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="flex flex-wrap gap-6 mt-3 text-sm text-gray-700 font-medium">
                    <div style={{ fontFamily: 'Outfit' }} className="flex items-center gap-2">
                      <FiMapPin />
                      {JSON.parse(order.address).city} {JSON.parse(order.address).postal_code} {JSON.parse(order.address).address}
                    </div>

                    <div style={{ fontFamily: 'Outfit' }} className="flex items-center gap-2">
                      <FiPhone />
                      {JSON.parse(order.address).phone}
                    </div>

                    {order.order_status === "DELIVERED" && <div onClick={() => { navigate(`/shop/product/${order.product_id}`); scrollTo(0, 0) }} style={{ fontFamily: 'Outfit' }} className="flex items-center gap-2 cursor-pointer">
                      <MdOutlineReviews />
                      Submit Review
                    </div>}
                  </div>
                </div>
              ))}
            </div> :
            label === "Wishlist" ?
              <div className="md:col-span-3 space-y-6 max-h-[630px] overflow-y-auto">
                {wishlist.length === 0 ? (
                  <div className="text-center py-20">
                    <h2 className="text-xl font-semibold text-gray-600">
                      Your wishlist is empty 💔
                    </h2>
                    <p className="text-gray-400 mt-2">
                      Start adding products you love
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Grid */}
                    <div className="products grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-[18px] gap-4">
                      {wishlist.map((item) => (
                        <div
                          key={item._id}
                          className="bg-white rounded-xl hover:shadow-lg transition p-4 relative border border-[#E2E8F0]"
                        >
                          {/* Remove Icon */}
                          <button
                            onClick={() => toggleWishlist(item._id)}
                            className="cursor-pointer absolute top-3 right-3 text-red-500 hover:scale-110"
                          >
                            <Heart fill="red" size={20} />
                          </button>
                          {/* Discount */}
                          <span className="absolute top-3 left-3 bg-[#EB6325] font-medium text-white text-xs px-2 py-1 rounded-md z-10">
                            {Math.round(((item?.price - item?.offerPrice) / item?.price) * 100)}% OFF
                          </span>

                          {/* Image */}
                          <img
                            onClick={() => { navigate(`/shop/product/${item?._id}`); scrollTo(0, 0) }}
                            src={item.images[0]}
                            alt={item.name}
                            className="cursor-pointer w-full h-40 object-contain mb-4"
                          />

                          {/* Category */}
                          {item.subCategory ?
                            <h6 className='text-xs font-medium text-[#EB6325] leading-[1.1em] mb-1.5'>{item?.subCategory}</h6> : <span className='text-xs font-medium text-orange-500 leading-none'>{item?.category}</span>}

                          {/* Title */}
                          <h3 onClick={() => { navigate(`/shop/product/${item?._id}`); scrollTo(0, 0) }} className="cursor-pointer text-gray-800 font-semibold line-clamp-2">
                            {item.name}
                          </h3>

                          {/* Rating */}
                          <div className="rating flex items-center mt-1.5 text-orange-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                            ))}
                            <span className="text-gray-500 text-xs ml-1">(24)</span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center sm:gap-2 gap-1.5 mt-1">
                            <span className="text-blue-600 font-semibold text-base" style={{ fontFamily: "Outfit" }}>
                              {currency}.{(item?.offerPrice).toLocaleString()}
                            </span>
                            <span className="price text-gray-400 sm:text-sm text-xs line-through" style={{ fontFamily: "Outfit" }}>
                              {currency}.{(item?.price).toLocaleString()}
                            </span>
                          </div>

                          {/* Colors (optional) */}
                          {item?.colors && (
                            <div className="flex gap-2 mt-2">
                              {JSON.parse(item.colors).map((c, i) => (
                                <span
                                  key={i}
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: c }}
                                ></span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div> :
              <div className="md:col-span-3 space-y-6">

                {/* Account Info */}
                <div className="bg-white p-6 rounded-xl shadow">

                  <div className="flex justify-between">

                    <h2 className="text-xl font-semibold">
                      Account Information
                    </h2>

                    <button onClick={() => setModel(true)} className="cursor-pointer text-blue-600 text-sm">
                      Edit
                    </button>

                  </div>

                  <div className="mt-4 text-gray-600">
                    <p>{name}</p>
                    <p>{email}</p>
                    <p>{phone}</p>
                  </div>

                </div>

                {/* Orders + Wishlist */}
                <div className="grid md:grid-cols-2 gap-6">

                  <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="font-semibold mb-2">
                      My Orders
                    </h3>

                    <p className="text-gray-600">
                      Order #987654
                    </p>

                    <p className="text-green-600 text-sm">
                      Shipped
                    </p>

                    <button onClick={() => setLabel("Orders")} className="mt-3 text-blue-600 cursor-pointer">
                      View Orders →
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="font-semibold mb-2">
                      My Wishlist
                    </h3>

                    <p className="text-gray-600">
                      4 items saved
                    </p>

                    <button onClick={() => setLabel("Wishlist")} className="mt-3 cursor-pointer text-blue-600">
                      View Wishlist →
                    </button>
                  </div>

                </div>

                {/* Address */}
                <div className="bg-white p-6 rounded-xl shadow">

                  <div className="flex justify-between">

                    <h3 className="font-semibold">
                      Shipping Address
                    </h3>

                    <button className="text-blue-600 text-sm">
                      Edit
                    </button>

                  </div>

                  <p className="mt-3 text-gray-600">
                    Ahmed Sheikh
                  </p>

                  <p className="text-gray-600">
                    123 Green St
                  </p>

                  <p className="text-gray-600">
                    Karachi, Pakistan
                  </p>

                  <p className="text-gray-600">
                    +92 303 1234567
                  </p>

                </div>

              </div>}

      </div>
      {/* User Update */}
      <div className={`relative ${model ? 'block' : 'hidden'}`}>
        <form onSubmit={updateUserHandler} className='bg-white sm:p-10 p-8 z-50 fixed rounded-lg top-[50%] left-[50%] max-w-[500px] w-[93%] mx-auto h-fit shadow-[0px_4px_40px_0px_rgba(0,0,0,0.06)]' style={{ transform: 'translate(-50%,-50%)' }}>
          <span onClick={() => setModel(false)} className='absolute top-0 right-0 bg-red-500 text-white text-xl cursor-pointer p-1'><IoClose /></span>
          <h3 className='text-xl font-semibold'>Update Profile</h3>
          <div className='text-sm flex flex-col gap-4 mt-5'>
            <div className='flex flex-col gap-1 text-gray-800 w-full'>
              <label className='ml-1'>Full Name</label>
              <input required onChange={(e) => setName(e.target.value)} name='name' value={name} className='border bg-[#f4f7fa] border-gray-300 py-[10px] rounded-[10px] px-3.5 w-full outline-none' type="name" placeholder='Full Name' />
            </div>
            <div className='flex flex-col gap-1 text-gray-800 w-full'>
              <label className='ml-1'>Email Address</label>
              <input required onChange={(e) => setEmail(e.target.value)} name='email' value={email} className='border bg-[#f4f7fa] border-gray-300 py-[10px] rounded-[10px] px-3.5 w-full outline-none' type="email" placeholder='Email Address' />
            </div>
            <div className='flex flex-col gap-1 text-gray-800 w-full'>
              <label className='ml-1'>Phone</label>
              <input required onChange={(e) => setPhone(e.target.value)} name='phone' value={phone} className='border bg-[#f4f7fa] border-gray-300 py-[10px] rounded-[10px] px-3.5 w-full outline-none' type="number" placeholder='Phone' />
            </div>
            <img src={previewImage} onClick={() => file.current.click()} className='w-[70px] h-[70px] rounded-full cursor-pointer mt-1' alt="profile image" />
            <input type="file" ref={file} onChange={imageHandler} hidden />
            <button type='submit' className='cursor-pointer bg-[#2563EB] mt-4 text-white px-8 py-3 rounded-full' style={{ fontFamily: 'Outfit' }}>{loading ? 'saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
      {/* Overlay */}
      <div onClick={() => setModel(false)} className={`fixed top-0 left-0 right-0 bottom-0 h-screen w-full bg-black/70 z-40 ${model ? 'block' : 'hidden'}`}></div>

    </div >
  )
}

export default MyAccount