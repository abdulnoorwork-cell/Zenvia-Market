import React from 'react'

const PriceFilter = ({ price,setPrice,maxPrice }) => {
    return (
        <div>
            <h3 className="font-semibold mb-3">Price Range</h3>

            {/* Slider */}
            <input
                type="range"
                min={50}
                max={10000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full"
            />

            {/* Value */}
            <p className="mt-1.5 text-sm text-gray-600">
                Up to: <span className="font-semibold">Rs. {price}</span>
            </p>
        </div>
    )
}

export default PriceFilter