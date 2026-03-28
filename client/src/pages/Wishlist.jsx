import React, { useContext } from 'react'
import { Heart, ShoppingCart, Star } from "lucide-react";
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { HiMiniArrowRight } from "react-icons/hi2";

const Wishlist = ({ addToCart }) => {
    const { wishlist, currency, toggleWishlist, navigate } = useContext(AppContext);
    return (
        <div className=" min-h-screen">

            {/* Header */}
            <div className="container mx-auto px-4 my-10">
                <h6 className="text-sm text-gray-600 mb-2"><Link to={'/'}>Home</Link> > Wishlist</h6>

                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div className='flex flex-col gap-1'>
                        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Outfit' }}>
                            Your Wishlist
                        </h1>
                        <h6 className="text-gray-600">
                            Your favorite products in one place
                        </h6>
                    </div>

                    {/* <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow">
                        Move All to Cart →
                    </button> */}
                </div>

                {/* Empty State */}
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
                        <div className="products bg-white p-3 rounded-lg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-[18px] gap-4">
                            {wishlist.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-gray-50/20 rounded-xl hover:shadow-lg transition p-4 relative border border-[#E2E8F0]"
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

                                    {/* Button
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                                    >
                                        <ShoppingCart size={16} />
                                        Add to Cart
                                    </button> */}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col md:flex-row justify-between items-center mt-10">
                            <h6 className="text-gray-700">
                                You have {wishlist.length} items in your wishlist
                            </h6>

                            <button onClick={()=>{navigate('/');scrollTo(0,0)}} className="mt-4 cursor-pointer flex items-center gap-1 md:mt-0 border bg-blue-600 text-white px-6 py-2.5 rounded-lg cursor-pointer">
                                Continue Shopping <span className='text-lg'><HiMiniArrowRight /></span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Wishlist