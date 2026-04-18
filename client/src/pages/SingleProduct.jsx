import React, { useContext, useEffect, Suspense, useRef } from 'react'
const ProductCard = React.lazy(() => import('../components/ProductCard'))
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import loading_animation from '../../public/loading_animation.svg'
import { FiHeart } from "react-icons/fi";
import { Star } from "lucide-react";
import { LuUpload } from "react-icons/lu";
import { IoIosPaperPlane } from "react-icons/io";
import { MdOutlineReviews } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import admin_profile from '../assets/admin_profile.png'

const SingleProduct = () => {
    const file = useRef()
    const [product, setProduct] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([])
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [getRating, setGetRating] = useState([]);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);
    const [thumbnail, setThumbnail] = useState("");
    const [label, setLabel] = useState("Description");
    const { product_id } = useParams()
    const { products, currency, backendUrl, token, userId, getCartItems, getTotalCartItems, navigate, toggleWishlist, isInWishlist, fetchAllReviews } = useContext(AppContext);
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

    const fetchRelatedProducts = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/product/subcategory-products/${product.subCategory}`, { withCredentials: true })
            if (response.data) {
                setRelatedProducts(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchReviews = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/review/get-reviews/${product_id}`, { withCredentials: true });
            if (response.data) {
                setReviews(response.data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchRating = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/review/get-product-rating/${product_id}`, { withCredentials: true })
            if (response.data) {
                setGetRating(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (product?.subCategory) {
            fetchRelatedProducts()
        }
    }, [product])

    useEffect(() => {
        fetchProduct();
        fetchReviews();
        fetchRating()
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
                    toast.success(response.data.message)
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

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        })
    }

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const filtered = files.filter(file => file.size < 2 * 1024 * 1024)// 2MB
        if (filtered.length !== files.length) {
            toast.error("Some images are too large (max 2MB)");
        }
        const base64Images = await Promise.all(
            files.map((file) => convertToBase64(file))
        )
        setImages(base64Images);
        //previewImage
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreview(previewUrls)
    }

    const submitReview = async () => {
        if (!rating || !comment) {
            toast.error("Please fill all fields");
            return;
        }
        try {
            setLoading(true)
            let response = await axios.post(`${backendUrl}/api/review/add`, { product_id, user_id: userId, rating, comment, images }, {
                headers: {
                    Authorization: `${token}`
                },
                withCredentials: true
            })
            if (response.data.success) {
                setLoading(false)
                toast.success(response.data.message)
                setRating(0);
                setComment("");
                setImages([]);
                setPreview([])
                fetchReviews()
                fetchAllReviews()
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error(error.response.data.message)
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
                                        {thumbnail && <img src={thumbnail} alt="Selected product" className="rounded-lg w-full h-full object-contain max-h-[550px] border border-gray-200 bg-gray-50" />}
                                    </div>
                                    <div className="flex lg:gap-4 gap-3">
                                        {product?.images?.map((image, index) => (
                                            <div key={index} onClick={() => setThumbnail(image)} className="rounded overflow-hidden cursor-pointer" >
                                                <img src={image} className='lg:w-20 lg:h-20 max-h-[80px] object-contain bg-gray-50 border border-gray-200 rounded-md cursor-pointer hover:scale-105 transition' alt={`Thumbnail ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:w-[55%] w-full flex flex-col gap-1">
                                    <h1 style={{ fontFamily: "Outfit" }} className="lg:text-3xl sm:text-2xl text-xl font-bold tracking-[-0.2px]">{product.name}</h1>
                                    {/* Rating */}
                                    <div className='flex items-center gap-0.5'>
                                        <div className='flex items-center gap-0.5'>
                                            {[...Array(5)].map((_, i) => (
                                                <AiFillStar
                                                    size={16}
                                                    key={i}
                                                    className={
                                                        i < Math.round(getRating.average_rating || 0)
                                                            ? "text-yellow-500 fill-yellow-500"
                                                            : "text-gray-300 fill-gray-300"
                                                    }
                                                />
                                            ))}
                                        </div>
                                            <span className="text-gray-600 text-sm" style={{ fontFamily: "Outfit" }}>({getRating.average_rating ? getRating.average_rating.slice(0,3) : "0 Reviews"})</span>
                                    </div>

                                    <div className="flex items-center gap-3 mt-2">
                                        <h6 className="lg:text-3xl sm:text-2xl text-xl font-bold" style={{ fontFamily: 'Outfit' }}>{currency}. {(product.offerPrice)?.toLocaleString()}</h6>
                                        <h6 className="line-through text-gray-500 font-medium lg:text-base text-sm" style={{ fontFamily: 'Outfit' }}>{currency}. {(product.price)?.toLocaleString()}</h6>
                                        <span className='text-green-600 font-semibold lg:text-[13px] text-xs'>Save {Math.round(((product?.price - product?.offerPrice) / product?.price) * 100)}%</span>
                                        {/* <span className="">(inclusive of all taxes)</span> */}
                                    </div>

                                    <p style={{ fontFamily: "Outfit" }} className='mt-3 mb-1.5 sm:text-sm text-xs' dangerouslySetInnerHTML={{ __html: cleanHTML }}>
                                    </p>
                                    {product.sizes !== "[]" && product.sizes !== "[\"[]\"]" ?
                                        <div className="mt-3">
                                            <h3 className="font-semibold mb-2">Select Size</h3>

                                            <div className="flex gap-3 flex-wrap">
                                                {product?.sizes ? JSON.parse(product.sizes).map((v, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelectedSize(v)}
                                                        className={`sm:w-10 w-9 sm:h-10 h-9 border border-gray-200 rounded-md flex items-center justify-center font-medium cursor-pointer
                    ${selectedSize === v
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-gray-200 hover:border-blue-500"
                                                            }`}
                                                    >
                                                        {v}
                                                    </button>

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
                                                    <button key={index} onClick={() => setSelectedFootwearSize(item)} className={`py-1.5 px-4 border border-gray-200 rounded-md flex items-center justify-center font-medium cursor-pointer sm:text-[12.8px] text-xs text-gray-700 ${selectedFootwearSize === item ? "bg-blue-600 text-white" : "bg-gray-200"}`} style={{ fontFamily: 'Outfit' }}>{item}</button>
                                                )) : []}
                                            </div>
                                        </div> : null}
                                    <div className="flex items-center gap-4 mt-4 mb-2">
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
                                    {/* Wishlist */}
                                    <div className='flex items-center gap-1 mb-1 mt-1'>
                                        <button onClick={() => toggleWishlist(product._id)} className='text-base w-fit'>
                                            {isInWishlist(product._id) ? <span className='cursor-pointer'>❤️</span> : <span className='cursor-pointer text-lg'><FiHeart /></span>}
                                        </button>
                                        <h6 style={{ fontFamily: "Outfit" }}>Add To Wishlist</h6>
                                    </div>
                                    {/* Buttons */}
                                    <div className="flex gap-4 mt-4 sm:text-sm text-xs">
                                        <button onClick={() => addToCart(product?._id, qty, selectedSize, selectedColor, selectedFootwearSize)} className="flex-1 cursor-pointer bg-gray-100 border border-gray-200 rounded-lg py-3 font-semibold hover:bg-gray-100 transition">
                                            Add to Cart
                                        </button>

                                        <button onClick={() => { addToCart(product?._id, qty, selectedSize, selectedColor, selectedFootwearSize); navigate('/checkout', scrollTo(0, 0)) }} className="flex-1 cursor-pointer bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition">
                                            Buy Now
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="mt-10 bg-white sm:p-7 p-5 rounded-2xl">
                            <div className="border-b border-gray-300 flex font-semibold">
                                <button onClick={() => setLabel('Description')} className={`text-[13px] sm:text-sm cursor-pointer border border-r-[0] border-b-[0] border-gray-300 sm:px-8 px-6 py-2 text-gray-600 ${label === "Description" ? "bg-[#2563EB] text-white" : ""}`} style={{ fontFamily: "Outfit" }}>Description</button>
                                <button onClick={() => setLabel('Reviews')} className={`text-[13px] sm:text-sm cursor-pointer border border-b-[0] border-gray-300 px-8 py-2 texsm:t-gr px-6ay-600 ${label === "Reviews" ? "bg-[#2563EB] text-white" : ""}`} style={{ fontFamily: "Outfit" }}>Reviews</button>
                            </div>

                            {label === "Reviews" ?
                                <div className='sm:px-6 pt-8 pb-0 flex flex-col lg:flex-row gap-8'>
                                    <div className='w-full'>
                                        {/* Header */}
                                        <div className="flex flex-col sm:flex-row items-center sm:gap-3 gap-2 sm:mb-4 mb-6">
                                            <h2 className="sm:text-2xl text-xl font-bold tracking-[-0.2px] text-gray-800 leading-none">
                                                Submit Your Review
                                            </h2>

                                            <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                                <span className='bg-green-600 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-center'>✔</span> Verified Purchase
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        <div className="mb-4">
                                            <h6 className="text-sm text-gray-700 mb-2 font-bold" style={{ fontFamily: "Outfit" }}>Your Rating</h6>

                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={22}
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHover(star)}
                                                        onMouseLeave={() => setHover(0)}
                                                        className={`cursor-pointer transition ${(hover || rating) >= star
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-400"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Images */}
                                        <div>
                                            <h6 className="text-sm text-gray-700 font-bold mb-0.5" style={{ fontFamily: "Outfit" }}>Add Photos (Optional)</h6>
                                            <p>Help other shoppers by adding photos of the product</p>
                                            {preview.length === 0 ? <div onClick={() => file.current.click()} className='bg-gray-50 border-dashed border-2 border-gray-300 flex flex-col items-center justify-center font-medium py-6 rounded-lg mt-3 cursor-pointer gap-1.5'>
                                                <span className='text-[#2563EB] text-2xl'><LuUpload /></span>
                                                <h6 className='text-gray-600 font-semibold text-[13px]'>Upload Images</h6>
                                                <h6 className='text-xs text-gray-500/80'>PNG,JPG,JPEG,WEBP up to 5MB</h6>
                                            </div> : <div className="flex gap-2 mt-3">
                                                {preview.map((img, index) => (
                                                    <img key={index} src={img} alt='preview image' className='w-20 object-contain' />
                                                ))}
                                            </div>}
                                            <input type="file" multiple onChange={handleImageChange} ref={file} hidden />
                                        </div>
                                    </div>
                                    <div className='w-full h-full'>
                                        {/* Comment */}
                                        <div className="mb-4">
                                            <h6 className="text-sm text-gray-700 mb-2 font-bold" style={{ fontFamily: "Outfit" }}>Your Review</h6>

                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Share your experience..."
                                                className="w-full h-[180px] border border-[#E2E8F0] bg-gray-50 rounded-lg p-3 focus:outline-blue-500"
                                                rows={4}
                                            />
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => {
                                                    setRating(0);
                                                    setComment("");
                                                }}
                                                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer sm:text-sm text-[12.6px] leading-none font-medium"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                onClick={submitReview}
                                                disabled={loading}
                                                className="cursor-pointer flex items-center gap-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:text-sm text-[12.6px] leading-none font-medium"
                                            >
                                                {loading ? "Submitting..." : "Submit Review"}
                                                <span className='sm:block hidden'><IoIosPaperPlane /></span>
                                            </button>
                                        </div>
                                    </div>
                                </div> :
                                <h6 className={`mt-5 sm:text-sm text-xs`} dangerouslySetInnerHTML={{ __html: cleanDescription }}>
                                </h6>}
                        </div>
                        {label === "Reviews" &&
                            <div className='p-6 bg-white mt-8 rounded-2xl'>
                                <h3 className='text-xl font-bold mb-5 w-full'>All Reviews({reviews.length})</h3>
                                <div className='flex flex-col gap-5 w-full'>
                                    {reviews.length !== 0 ? reviews.map((v, i) => (
                                        <div key={i} className='p-4 border-b border-[#E2E8F0]'>
                                            <div className='flex sm:flex-row flex-col sm:items-center gap-2'>
                                                <figure>
                                                    <img src={v.profile_image} alt="profile_image" className='w-12 h-12 rounded-full' />
                                                </figure>
                                                <div>
                                                    {/* name */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                                        <h4 className='text-[15px] font-semibold leading-none'>{v.name}</h4>
                                                        <span className="bg-green-100 text-green-600 text-xs px-3 py-0.5 rounded-full w-fit">Verified Purchase
                                                        </span>
                                                    </div>
                                                    {/* rating */}
                                                    <div className='flex items-center gap-1'>
                                                        <div className='flex items-center'>
                                                            {[...Array(5)].map((_, i) => (
                                                                <AiFillStar key={i}
                                                                    size={16}
                                                                    className={`cursor-pointer ${i < v.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 fill-gray-300"}}`} />
                                                            ))}
                                                        </div>
                                                        -
                                                        <h6 className='text-xs text-gray-500/80 font-medium'>{new Date(v.created_at).toDateString()}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <h6 style={{ fontFamily: "Outfit" }} className='my-3 text-gray-700 text-sm'>{v.comment}</h6>
                                            <figure className='flex items-center gap-3'>
                                                {v.images && JSON.parse(v.images).map((img, i) => {
                                                    return <img src={img} key={i} alt="" className='rounded-md bg-gray-50 border border-[#E2E8F0] max-w-[100px]' />
                                                })}
                                            </figure>
                                            {/* Admin Reply */}
                                            {v.reply &&
                                                <div className="mt-5 ml-12 border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-xl">
                                                    <div className="flex gap-3">
                                                        <img
                                                            src={admin_profile}
                                                            alt="admin"
                                                            className="w-11 h-11 rounded-full"
                                                        />

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-semibold text-gray-800 text-base">Abdul Noor</h4>
                                                                <span className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                                                                    Admin
                                                                </span>
                                                                <span className="text-xs text-gray-400 ml-auto">
                                                                    {new Date(v.reply_created_at).toDateString()}
                                                                </span>
                                                            </div>

                                                            <h6 className="text-gray-700 mt-1 text-sm" style={{ fontFamily: "Outfit" }}>
                                                                {v.reply}
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </div>}
                                        </div>
                                    )) : <div className='text-center flex items-center gap-1 w-full font-medium text-gray-600 text-base min-h-[40px]'>
                                        <span className='text-[#2563EB] text-lg'><MdOutlineReviews /></span>
                                        <h6 className='leading-none' style={{ fontFamily: "Outfit" }}>Product doesn,t have any reviews</h6>
                                    </div>
                                    }
                                </div>
                            </div>
                        }
                    </div> : <img src={loading_animation} alt='loader' className='mx-auto' />}
                <div className="mt-10 flex flex-col mx-auto">
                    <h6 className='text-[22px] tracking-[0.1px] mb-5 font-semibold'>Related Products</h6>
                    <div className='md:block hidden'>
                        {relatedProducts.length > 0 ?
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
                                {relatedProducts.reverse().map((product, index) => (
                                    <SwiperSlide key={product.id}>
                                        <div className="card">
                                            <Suspense key={index}>
                                                <ProductCard product={product} />
                                            </Suspense>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            : <img src={loading_animation} alt='loader' className='mx-auto' />}
                    </div>
                    <div className='products grid grid-cols-2 sm:gap-[18px] gap-4 md:hidden'>
                        {relatedProducts.length > 0 ? relatedProducts?.reverse().map((product, index) => (
                            <Suspense key={index}>
                                <ProductCard product={product} />
                            </Suspense>
                        )) : <img src={loading_animation} alt='loader' className='mx-auto' />}
                    </div>

                </div>
            </div>
        </div >
    );
}

export default SingleProduct