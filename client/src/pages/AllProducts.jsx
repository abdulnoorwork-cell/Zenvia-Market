import React from 'react'
const ProductCard = React.lazy(() => import('../components/ProductCard'))
import { useState } from 'react'
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import { useEffect } from 'react';
import { Suspense } from 'react';
import { Star } from "lucide-react";
import loading_animation from '../../public/loading_animation.svg'
import PriceFilter from '../components/PriceFilter'
import { FaAngleDown } from "react-icons/fa6";
import { IoClose } from 'react-icons/io5';

const AllProducts = () => {
    const [model, setModel] = useState(false)
    const { products, setProducts } = useContext(AppContext);
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState([]);
    const [sortType, setSortType] = useState('latest');
    useEffect(() => {
        if (products.length > 0) {
            const max = Math.max(...products.map(p => Number(p.offerPrice)));
            // setMaxPrice(max);
            setPrice(max); // 🔥 default filter = all products
        }
    }, [products]);
    const filteredProducts = products.filter((product) => {
        const categoryMatch = category.length === 0 || category.includes(product.category);
        const priceMatch = product.offerPrice <= price;
        return categoryMatch && priceMatch;
    })
    const [itemsPerPage, setItemsPerPage] = useState(15)
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        const updateItems = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(4)
            } else if (window.innerWidth < 1536) {
                setItemsPerPage(8)
            }
            else {
                setItemsPerPage(15)
            }
        }
        updateItems()
        window.addEventListener('resize', updateItems);
        return () => window.removeEventListener('resize', updateItems)
    }, [])
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortType === "latest") {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        if (sortType === "low-high") {
            return a.offerPrice - b.offerPrice;
        }
        if (sortType === "high-low") {
            return b.offerPrice - a.offerPrice;
        }
        return 0;
    })
    const currentProducts = sortedProducts.slice(firstIndex, lastIndex);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handleCategoryChange = (e) => {
        if (category.includes(e.target.value)) {
            // remove category if unchecked//
            setCategory(category.filter((c) => c !== e.target.value))
        } else {
            // add category if checked
            setCategory([...category, e.target.value])
        }
    }
    return (
        <div className="filter_main_parent min-h-screen 2xl:mt-14 sm:mt-12 mt-8">

            <div className="container mx-auto px-4 flex lg:flex-row flex-col xl:gap-8 gap-6">

                {/* Sidebar */}
                <div className="lg:w-[20%] lg:block hidden w-full bg-white p-6 rounded-xl shadow-sm h-fit">

                    <h2 className="text-lg font-semibold mb-4">Filters</h2>

                    <div className="mb-6 flex flex-col gap-2">
                        <h3 className="font-medium mb-2">Categories</h3>

                        <div className="space-y-2 text-gray-800 text-[13px]">
                            <label className="flex gap-2">
                                <input type="checkbox" value={'Clothing & Style'} onChange={handleCategoryChange} /> Clothing
                            </label>

                            <label className="flex gap-2">
                                <input type="checkbox" value={'Footwear'} onChange={handleCategoryChange} /> Footwear
                            </label>

                            <label className="flex gap-2">
                                <input type="checkbox" value={'Bags & Accessories'} onChange={handleCategoryChange} /> Bags
                            </label>

                            <label className="flex gap-2">
                                <input type="checkbox" value={'Electronics & Gadgets'} onChange={handleCategoryChange} /> Electronics
                            </label>

                            <label className="flex gap-2">
                                <input type="checkbox" value={'Beauty & Wellness'} onChange={handleCategoryChange} /> Beauty
                            </label>
                        </div>
                    </div>

                    <div className="mb-6">
                        <PriceFilter price={price} setPrice={setPrice} />
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Rating</h3>
                        <div className="flex text-yellow-400 gap-1">
                            <Star size={16} />
                            <Star size={16} />
                            <Star size={16} />
                            <Star size={16} />
                            <Star size={16} />
                        </div>
                    </div>

                </div>
                {/* Mobile Sidebar */}
                <div className={`lg:w-[20%] lg:hidden block w-[90%] mx-auto bg-white p-6 rounded-xl shadow-sm h-fit fixed top-2/4 left-2/4 z-50 ${model ? "block" : "hidden"}`} style={{ transform: 'translate(-50%,-50%)' }}>
                    <span onClick={() => setModel(false)} className='absolute top-0 right-0 bg-red-500 text-white text-base cursor-pointer p-1'><IoClose /></span>

                    <h2 className="text-lg font-semibold mb-4">Filters</h2>

                    <div className="mb-6 flex flex-col gap-2">
                        <h3 className="font-medium mb-2">Categories</h3>

                        <div className="space-y-2 text-gray-800 text-[13px]">
                            <label className="flex gap-2">
                                <input type="checkbox" value={'Clothing & Style'} onChange={handleCategoryChange} /> Clothing
                            </label>

                            <label className="flex gap-2">
                                <input type="checkbox" value={'Footwear'} onChange={handleCategoryChange} /> Footwear
                            </label>

                            <label className="flex gap-2">
                                <input type="checkbox" value={'Bags & Accessories'} onChange={handleCategoryChange} /> Bags
                            </label>

                            <label className="flex gap-2">
                                <input type="checkbox" value={'Electronics & Gadgets'} onChange={handleCategoryChange} /> Electronics
                            </label>

                            <label className="flex gap-2">
                                <input type="checkbox" value={'Beauty & Wellness'} onChange={handleCategoryChange} /> Beauty
                            </label>
                        </div>
                    </div>

                    <div className="mb-6">
                        <PriceFilter price={price} setPrice={setPrice} />
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Rating</h3>
                        <div className="flex text-yellow-400 gap-1">
                            <Star size={16} />
                            <Star size={16} />
                            <Star size={16} />
                            <Star size={16} />
                            <Star size={16} />
                        </div>
                    </div>

                </div>

                {/* Products */}
                <div className="lg:w-[80%] w-full">

                    {/* Sort */}
                    <div className="filter flex justify-between sm:text-[13px] text-xs text-gray-600 font-medium items-center p-2.5 mb-6 bg-white rounded-sm">
                        <button onClick={() => setModel(true)} className='lg:hidden flex items-center gap-1.5 border border-gray-300 px-4 py-[7px] cursor-pointer rounded-md'>Filter Products <span><FaAngleDown /></span></button>
                        <h6 className='lg:block hidden'>
                            Showing {itemsPerPage} Products of {products.length}
                        </h6>

                        <div className='flex items-center gap-2'>
                            <h6 className='sm:block hidden'>Sort By: </h6>
                            <select value={sortType} onChange={(e) => { setSortType(e.target.value) }} className="border px-4 py-1.5 rounded-md outline-[#2563EB] bg-gray-50 border-[#E5E7EB]">
                                <option value='latest'>Latest</option>
                                <option value='low-high'>Price Low to High</option>
                                <option value='high-low'>Price High to Low</option>
                            </select>
                        </div>

                    </div>

                    {/* Product Grid */}
                    <div className={`products grid 2xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-[18px]`}>

                        {currentProducts.length > 0 ? currentProducts.map((product, index) => (
                            <Suspense>
                                <ProductCard key={index} product={product} />
                            </Suspense>
                        )) : <img src={loading_animation} alt='loader' className='mx-auto' />}

                    </div>

                    {/* Pagination Buttons */}
                    {totalPages > 1 ? (
                        <div className='flex items-center justify-center gap-2 mt-6 flex-wrap'>

                            {/* Prev */}
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className='bg-indigo-600 text-white px-3 sm:px-6 py-2 rounded-sm disabled:opacity-50'
                                style={{ fontFamily: 'Outfit' }}
                            >
                                Prev
                            </button>

                            {/* Pages */}
                            {[
                                1,

                                ...(currentPage > 3 ? ["..."] : []),

                                ...Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                                    Math.max(currentPage - (window.innerWidth < 640 ? 1 : 2), 0),
                                    currentPage + (window.innerWidth < 640 ? 2 : 3)
                                ),

                                ...(currentPage < totalPages - 2 ? ["..."] : []),

                                totalPages
                            ]
                                .filter((item, index, arr) => arr.indexOf(item) === index)
                                .map((page, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof page === "number" && setCurrentPage(page)}
                                        style={{
                                            padding: "6px 10px",
                                            background: currentPage === page ? "black" : "white",
                                            color: currentPage === page ? "white" : "#0F172A",
                                            border: "none",
                                            fontFamily: "Outfit",
                                            borderRadius: "4px",
                                            cursor: page === "..." ? "default" : "pointer",
                                            minWidth: "32px"
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}

                            {/* Next */}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className='bg-indigo-600 text-white px-3 sm:px-6 py-2 rounded-sm disabled:opacity-50'
                                style={{ fontFamily: 'Outfit' }}
                            >
                                Next
                            </button>

                        </div>
                    ) : null}
                </div>

            </div>
            {/* Overlay */}
            <div onClick={() => setModel(false)} className={`fixed top-0 left-0 right-0 bottom-0 h-screen w-full bg-black/70 z-40 ${model ? 'block' : 'hidden'}`}></div>

        </div>
    )
}

export default AllProducts