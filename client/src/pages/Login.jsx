import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GoEyeClosed } from "react-icons/go";
import { RxEyeOpen } from "react-icons/rx";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AppContext } from '../context/AppContext'
import profileImage from '../assets/profile_image.png'
import Navbar from '../components/Navbar';

const Login = () => {
    const [loginModel, setLoginModel] = useState(true);
    const [passwordShow, setPasswordShow] = useState(false);
    const [signupModel, setSignupModel] = useState();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [profile_image, setProfile_Image] = useState();
    const [previewImage, setPreviewImage] = useState(profileImage);

    const { backendUrl, navigate, token } = useContext(AppContext)

    const file = useRef();
    const imageHandler = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setProfile_Image(file)
            setPreviewImage(reader.result)
        }
    }

    const onSignupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phone', phone);
            formData.append('profile_image', profile_image || '')
            let response = await axios.post(`${backendUrl}/api/user/signup`, formData, {
                headers: { "Content-Type": 'multipart/form-data' },
                withCredentials: true
            })
            if (response.data.success) {
                setLoading(false)
                toast.success(response.data.messege)
                setName('');
                setEmail('');
                setPassword('');
                setPhone('');
                setSignupModel(false)
                setLoginModel(true)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            { error.response.data.messege === 'Email already exist' ? toast.error(error.response.data.messege) : null }
            setError(error.response.data)
        }
    }

    const onLoginHandler = async (e) => {
        e.preventDefault()
        try {
            let response = await axios.post(`${backendUrl}/api/user/login`, { email, password }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })
            if (response.data.success) {
                localStorage.setItem('User', JSON.stringify(response.data))
                toast.success(response.data.messege)
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    navigate('/')
                    window.location.reload();
                }, 1000)
            }
        } catch (error) {
            console.log(error)
            setError(error.response.data)
        }
    }

    return loginModel ? (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">

                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">

                    {/* Left Section */}
                    <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-10">
                        <h2 className="text-3xl font-bold mb-4">
                            Welcome Back
                        </h2>

                        <h6 className="text-blue-100 mb-6 text-sm">
                            Login to access your account, track orders and continue shopping
                            with exclusive deals.
                        </h6>

                        <ul className="space-y-3 text-sm">
                            <li>✔ Secure Login</li>
                            <li>✔ Order Tracking</li>
                            <li>✔ Exclusive Discounts</li>
                            <li>✔ Fast Checkout</li>
                        </ul>
                    </div>

                    {/* Login Form */}
                    <div className="p-10">

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Login to your account
                        </h2>

                        <p className="text-gray-500 mb-6 text-sm">
                            Enter your details below
                        </p>

                        <form onSubmit={onLoginHandler} className="space-y-4 text-sm">

                            {/* Email */}
                            <div>
                                <label className="text-sm text-gray-600">
                                    Email Address <span className='text-red-600'>*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email} onChange={(e)=>setEmail(e.target.value)}
                                    className="w-full mt-1 px-4 py-3 border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm text-gray-600">
                                    Password <span className='text-red-600'>*</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password} onChange={(e)=>setPassword(e.target.value)}
                                    className="w-full mt-1 px-4 py-3 border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between text-sm">

                                <label className="flex items-center gap-2 text-gray-600">
                                    <input type="checkbox" />
                                    Remember me
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-blue-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>

                            </div>

                            {/* Login Button */}
                            <button type='submit' className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                                {loading ? 'loading...' : "Login"}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center my-4">
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span className="px-3 text-gray-400 text-sm">OR</span>
                                <div className="flex-1 h-px bg-gray-200"></div>
                            </div>

                            {/* Social Login */}
                            <div className="grid grid-cols-2 gap-3 text-sm">

                                <button className="border border-gray-300 py-2 rounded-lg hover:bg-gray-50">
                                    Google
                                </button>

                                <button className="border border-gray-300 py-2 rounded-lg hover:bg-gray-50">
                                    Facebook
                                </button>

                            </div>

                            {/* Signup Link */}
                            <p className="text-center text-sm text-gray-500 mt-6">
                                Don't have an account?{" "}
                                <Link onClick={()=>{setSignupModel(true);setLoginModel(false)}}
                                    className="text-blue-600 font-semibold"
                                >
                                    Sign Up
                                </Link>
                            </p>

                        </form>
                    </div>

                </div>

            </div>
        </div>
    ) : (
        <div>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">

                <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* Left Section */}
                    <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-10">
                        <h2 className="text-3xl font-bold mb-4">
                            Welcome to MyCart
                        </h2>

                        <h6 className="text-blue-100 mb-6 text-sm">
                            Create your account and start shopping premium products with
                            exclusive discounts and fast delivery.
                        </h6>

                        <ul className="space-y-3 text-sm">
                            <li>✔ Secure Payments</li>
                            <li>✔ Fast Delivery</li>
                            <li>✔ Exclusive Deals</li>
                            <li>✔ Easy Returns</li>
                        </ul>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={onSignupHandler} className="p-10">

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Create Account
                        </h2>

                        <p className="text-gray-500 mb-6 text-sm">
                            Join MyCart and enjoy seamless shopping
                        </p>

                        <form className="space-y-4 text-sm">

                            {/* Name */}
                            <div>
                                <label className="text-sm text-gray-600">
                                    Full Name <span className='text-red-600'>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e)=>setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full mt-1 px-4 py-3 border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm text-gray-600">
                                    Email Address <span className='text-red-600'>*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full mt-1 px-4 py-3 border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm text-gray-600">
                                    Password <span className='text-red-600'>*</span>
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full mt-1 px-4 py-3 border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-sm text-gray-600">
                                    Phone
                                </label>
                                <input
                                    type="number"
                                    placeholder="Phone"
                                    className="w-full mt-1 px-4 py-3 border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* image */}
                            <div>
                                <img src={previewImage} onClick={()=>file.current.click()} className='w-18 h-18 rounded-full cursor-pointer' alt="" />
                                <input type="file" hidden ref={file} onChange={imageHandler} name="" id="" />
                            </div>

                            {/* Terms */}
                            <div className="flex items-center text-sm">
                                <input type="checkbox" className="mr-2" />
                                <span>
                                    I agree to the{" "}
                                    <span className="text-blue-600 cursor-pointer">
                                        Terms & Conditions
                                    </span>
                                </span>
                            </div>

                            {/* Button */}
                            <button type='submit' className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                                Create Account
                            </button>

                            {/* Divider */}
                            <div className="flex items-center my-4">
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span className="px-3 text-gray-400 text-sm">OR</span>
                                <div className="flex-1 h-px bg-gray-200"></div>
                            </div>

                            {/* Social Login */}
                            <div className="grid grid-cols-2 gap-3">

                                <button className="border border-gray-300 py-2 rounded-lg hover:bg-gray-50">
                                    Google
                                </button>

                                <button className="border border-gray-300 py-2 rounded-lg hover:bg-gray-50">
                                    Facebook
                                </button>

                            </div>

                            {/* Login Link */}
                            <p className="text-center text-sm text-gray-500 mt-6">
                                Already have an account?{" "}
                                <Link
                                    onClick={()=>{setSignupModel(false);setLoginModel(true)}}
                                    className="text-blue-600 font-semibold"
                                >
                                    Login
                                </Link>
                            </p>

                        </form>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Login