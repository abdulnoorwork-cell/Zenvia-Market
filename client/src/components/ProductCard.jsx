import React, { useMemo } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { ShoppingCart } from "lucide-react";
import { Star } from "lucide-react";

const ProductCard = React.memo(({ product }) => {
  const { currency, navigate } = useContext(AppContext);
  return (
    <div onClick={() => { navigate(`/shop/product/${product?._id}`); scrollTo(0, 0) }} className="product_card group relative bg-white rounded-xl border border-gray-200 hover:shadow-xl transition duration-300 overflow-hidden">

      <span className="absolute top-3 left-3 bg-[#EB6325] font-medium text-white text-xs px-2 py-1 rounded-md z-10">
        {Math.round(((product?.price - product?.offerPrice) / product?.price) * 100)}% OFF
      </span>

      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product?.images?.[0]}
          alt={product?.name}
          className="cursor-pointer max-h-54 sm:h-54 w-full object-contain p-3 transition duration-300 group-hover:scale-105"
        />

        {/* Hover Image */}
        {product.images[1] && <img
          src={product?.images?.[1]}
          alt="hover"
          className="cursor-pointer absolute top-0 left-0 max-h-54 sm:h-54 w-full object-contain p-3 opacity-0 group-hover:opacity-100 transition duration-300"
        />}
      </div>

      {/* Product Info */}
      <div className="sm:px-4 px-3 sm:pb-4 pb-3">

        {/* Category */}
        {product.subCategory ?
          <h6 className='text-xs text-[#EB6325] leading-[1.1em] mb-1.5'>{product?.subCategory}</h6> : <span className='text-xs text-orange-500 leading-none'>{product?.category}</span>}

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="rating flex items-center mt-1.5 text-orange-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
          ))}
          <span className="text-gray-500 text-xs ml-1">(24)</span>
        </div>

        {/* Price */}
        <div className="flex items-center sm:gap-2 gap-1.5 mt-2">
          <span className="text-blue-600 font-semibold">
            {currency}.{(product?.offerPrice).toLocaleString()}
          </span>
          <span className="price text-gray-400 sm:text-sm text-xs line-through">
            {currency}.{(product?.price).toLocaleString()}
          </span>
        </div>

        {/* Add to Cart */}
        {/* <button className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition">
          <ShoppingCart size={16} />
          Add to Cart
        </button> */}

      </div>
    </div>
  )
})

export default React.memo(ProductCard)