import React, { useContext, useEffect } from 'react'
import ProductCard from '../components/ProductCard';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import loading_animation from '../../public/loading_animation.svg'

const SingleProduct = () => {
    const [product, setProduct] = useState([]);
    const [thumbnail, setThumbnail] = useState("");
    const { product_id } = useParams()
    const { products, currency, backendUrl, token, userId, getCartItems, getTotalCartItems } = useContext(AppContext);
    const [qty, setQty] = useState(1);

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedFootwearSize, setSelectedFootwearSize] = useState('');
    const fetchProduct = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/product/product-detail/${product_id}`, { withCredentials: true });
            if (response.data) {
                setProduct(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchProduct();
    }, [product_id])

    useEffect(() => {
        if (product?.images?.length) {
            setThumbnail(product.images[0])
        }
    }, [product])

    const addToCart = async (product_id, quantity, size, color, footwear_size) => {
        if (!token) {
            return toast.error('Please login first')
        }
        if (token) {
            if (product.sizes !== "[]" && !size) {
                return toast.error('Please select size')
            }
            if (product.colors !== "[]" && !color) {
                return toast.error('Please select color')
            }
            if (product.footwear_sizes !== "[]" && !footwear_size) {
                return toast.error('Please select footwear size')
            }
            try {
                let response = await axios.post(`${backendUrl}/api/cart/addtocart/${userId}`, { product_id, quantity, size, color, footwear_size }, {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                })
                if (response.data) {
                    getCartItems()
                    getTotalCartItems()
                    toast.success(response.data.messege)
                }
            } catch (error) {
                console.log(error)
                if (error.response?.status === 500) {
                    localStorage.removeItem("User");
                    window.location.href = "/user/login"
                }
            }
        }
    }

    const cleanHTML = product?.about
        ?.replace(/style="[^"]*color:[^";]+;?[^"]*"/gi, "")
        ?.replace(/color:[^;"]+;?/gi, "");
    const cleanDescription = product?.description
        ?.replace(/style="[^"]*color:[^";]+;?[^"]*"/gi, "")
        ?.replace(/color:[^;"]+;?/gi, "");

    return product && (
        <div className='container mx-auto'>
            <div className="max-w-7xl mx-auto px-4 pt-12">
                {product ?
                    <div>
                        <div className="w-full mx-auto">

                            <div className="mx-auto flex flex-col md:flex-row lg:gap-10 sm:gap-8 gap-6 bg-white sm:p-8 px-5.5 pt-6 pb-8 rounded-2xl">

                                <div className="md:w-[45%] w-full flex flex-col gap-3">
                                    <div className="flex items-center justify-center">
                                        {thumbnail && <img src={thumbnail} alt="Selected product" className="rounded-xl w-full h-full object-contain max-h-[550px] border border-gray-200 bg-gray-50" />}
                                    </div>
                                    <div className="flex lg:gap-4 gap-3">
                                        {product?.images?.map((image, index) => (
                                            <div key={index} onClick={() => setThumbnail(image)} className="rounded overflow-hidden cursor-pointer" >
                                                <img src={image} className='lg:w-20 lg:h-20 max-h-[80px] object-fill bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:scale-105 transition' alt={`Thumbnail ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:w-[55%] w-full flex flex-col gap-2.5">
                                    <h1 className="lg:text-3xl sm:text-2xl text-xl font-bold tracking-[-0.2px]">{product.name}</h1>
                                    {/* Rating */}
                                    <div className="text-yellow-500">★★★★☆ <span className="text-gray-500 text-sm">(128 Reviews)</span></div>

                                    {/* <div className="flex items-center gap-0.5 mt-1">
                            {Array(5).fill('').map((_, i) => (
                                product.rating > i ? (
                                    <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#615fff" />
                                    </svg>
                                ) : (
                                    <svg width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z" fill="#615fff" fill-opacity="0.35" />
                                    </svg>
                                )
                            ))}
                            <p className="text-base ml-2">({product.rating})</p>
                        </div> */}

                                    <div className="flex items-center gap-3">
                                        <h6 className="lg:text-3xl sm:text-2xl text-xl font-bold" style={{ fontFamily: 'Outfit' }}>{currency}.{(product.offerPrice)?.toLocaleString()}</h6>
                                        <h6 className="line-through text-gray-500 lg:text-base text-sm" style={{ fontFamily: 'Outfit' }}>{currency}.{(product.price)?.toLocaleString()}</h6>
                                        <span className='text-green-600 font-semibold lg:text-[13px] text-xs'>Save {Math.round(((product?.price - product?.offerPrice) / product?.price) * 100)}%</span>
                                        {/* <span className="">(inclusive of all taxes)</span> */}
                                    </div>

                                    <p className=' mt-3 text-[#64748B] sm:text-sm text-xs' dangerouslySetInnerHTML={{ __html: cleanHTML }}>
                                    </p>
                                    {product.sizes !== "[]" ?
                                        <div className="mt-3">
                                            <h3 className="font-semibold mb-2">Select Size</h3>

                                            <div className="flex gap-3 flex-wrap">
                                                {product?.sizes ? JSON.parse(product.sizes).map((size, index) => (
                                                    JSON.parse(size).map((v, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setSelectedSize(v)}
                                                            className={`w-10 h-10 border border-gray-200 rounded-md flex items-center justify-center font-medium cursor-pointer
                    ${selectedSize === v
                                                                    ? "bg-blue-600 text-white"
                                                                    : "bg-gray-200 hover:border-blue-500"
                                                                }`}
                                                        >
                                                            {v}
                                                        </button>
                                                    ))
                                                )) : []}
                                            </div>
                                        </div> : null
                                    }
                                    {product.colors !== "[]" ?
                                        <div className="mt-3">
                                            <h3 className="font-semibold mb-2">Select Color</h3>

                                            <div className="flex gap-3">

                                                {product?.colors ? JSON.parse(product?.colors).map((color, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`w-8 h-8 rounded-full border cursor-pointer ${color === "Blue" ? "bg-blue-600" : color === "Black" ? "bg-black" : color === "Pink" ? "bg-pink-600" : color === "Red" ? "bg-red-600" : color === "Green" ? "bg-green-600" : color === "White" ? "bg-white" : color === "Grey" ? "bg-gray-600" : color === "Orange" ? "bg-orange-500" : color === "Brown" ? "bg-amber-700" : color === " Pink" ? "bg-pink-600" : color === "Yellow" ? "bg-yellow-500" : ""} ${selectedColor === color ? "border-2 border-blue-600" : ""}`}
                                                    />
                                                )) : []}

                                            </div>
                                        </div> : null
                                    }
                                    {product.footwear_sizes !== "[]" ?
                                        <div className='mt-3'>
                                            <h3 className="font-semibold mb-2">Select Size</h3>
                                            <div className="flex gap-3 flex-wrap">
                                                {product?.footwear_sizes ? JSON.parse(product?.footwear_sizes).map((item, index) => (
                                                    <button key={index} onClick={() => setSelectedFootwearSize(item)} className={`py-1.5 px-4 border border-gray-200 rounded-md flex items-center justify-center font-medium cursor-pointer text-[12.8px] text-gray-700 ${selectedFootwearSize === item ? "bg-blue-600 text-white" : "bg-gray-200"}`} style={{ fontFamily: 'Inter' }}>{item}</button>
                                                )) : []}
                                            </div>
                                        </div> : null}
                                    <div className="flex items-center gap-4 my-3">
                                        <h6 className="font-semibold">Quantity</h6>
                                        <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                                                className="px-3 py-1"
                                            >
                                                -
                                            </button>
                                            <span className="px-4">{qty}</span>
                                            <button
                                                onClick={() => setQty(qty + 1)}
                                                className="px-3 py-1"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-4 mt-2 sm:text-sm text-xs">
                                        <button onClick={() => addToCart(product?._id, qty, selectedSize, selectedColor, selectedFootwearSize)} className="flex-1 cursor-pointer bg-gray-100 border border-gray-200 rounded-lg py-3 font-semibold hover:bg-gray-100 transition">
                                            Add to Cart
                                        </button>

                                        <button className="flex-1 cursor-pointer bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition">
                                            Buy Now
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="mt-12 bg-white p-8 rounded-2xl">
                            <div className="border-b border-gray-300 flex gap-8 pb-3 font-semibold">
                                <button>Description</button>
                                <button>Reviews</button>
                            </div>

                            <p className="mt-5 sm:text-sm text-xs" dangerouslySetInnerHTML={{ __html: cleanDescription }}>
                            </p>
                        </div>
                    </div> : <img src={loading_animation} alt='loader' className='mx-auto' />}
                <div className="mt-10 flex flex-col mx-auto">
                    <h6 className='text-[22px] tracking-[0.1px] mb-5 font-semibold'>Related Products</h6>
                    <div className='md:block hidden'>
                        {products.length > 0 ?
                            <Swiper
                                modules={[Autoplay]}
                                spaceBetween={18}
                                loop={true}
                                autoplay={{
                                    delay: 2000,
                                    disableOnInteraction: false,
                                }}
                                breakpoints={{
                                    320: { slidesPerView: 1 },
                                    640: { slidesPerView: 2 },
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                    1280: { slidesPerView: 5 },
                                    // 1536: { slidesPerView: 6 },
                                }}
                            >
                                {products?.filter(prod => prod.subCategory === product.subCategory).reverse().map((product, index) => (
                                    <SwiperSlide key={product.id}>
                                        <div className="card">
                                            <ProductCard key={index} product={product} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            : <img src={loading_animation} alt='loader' className='mx-auto' />}
                    </div>
                    <div className='products grid grid-cols-2 sm:gap-[18px] gap-4 md:hidden'>
                        {products.length > 0 ? products?.filter(prod => prod.subCategory === product.subCategory).reverse().map((product, index) => (
                            <ProductCard key={index} product={product} />
                        )) : <img src={loading_animation} alt='loader' className='mx-auto' />}
                    </div>

                </div>
            </div>
        </div >
    );
}

export default SingleProduct