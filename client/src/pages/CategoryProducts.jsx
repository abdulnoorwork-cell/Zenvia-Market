import React from 'react'
const ProductCard = React.lazy(()=>import('../components/ProductCard'))
import { useState } from 'react'
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import { useEffect } from 'react';
import { Suspense } from 'react';
import { Star } from "lucide-react";
import loading_animation from '../../public/loading_animation.svg'

const CategoryProducts = ({ category }) => {
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('latest');
  const { products, setProducts } = useContext(AppContext);
  const filteredProducts = subCategory.length === 0 ? products.filter(prod => prod.category === category) : products.filter((product) => subCategory.includes(product.subCategory))
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
    if (subCategory.includes(e.target.value)) {
      // remove category if unchecked//
      setSubCategory(subCategory.filter((c) => c !== e.target.value))
    } else {
      // add category if checked
      setSubCategory([...subCategory, e.target.value])
    }
  }
  return (
    <div className="min-h-screen 2xl:mt-14 mt-12">

      <div className="container mx-auto px-4 grid grid-cols-12 gap-8">

        {/* Sidebar */}
        <div className="col-span-3 bg-white p-6 rounded-xl shadow-sm h-fit">

          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          {category !== "Home Decor" ?
            <div className="mb-6 flex flex-col gap-2">
              <h3 className="font-medium mb-2">Sub Categories</h3>

              {category === "Clothing & Style" ?
                <div className='flex flex-col gap-2 sm:text-sm text-[13px] font-normal'>
                  <p className='flex gap-2'>
                    <input type='checkbox' className='w-3' value={'Men'} onChange={handleCategoryChange} />Men
                  </p>
                  <p className='flex gap-2'>
                    <input type='checkbox' className='w-3' value={'Women'} onChange={handleCategoryChange} />Women
                  </p>
                  <p className='flex gap-2'>
                    <input type='checkbox' className='w-3' value={'Kids'} onChange={handleCategoryChange} />Kids
                  </p>
                </div> :
                category === "Footwear" ?
                  <div className='flex flex-col gap-2 sm:text-sm text-[13px] font-normal'>
                    <p className='flex gap-2'>
                      <input type='checkbox' className='w-3' value={'Formal Shoes'} onChange={handleCategoryChange} />Formal Shoes
                    </p>
                    <p className='flex gap-2'>
                      <input type='checkbox' className='w-3' value={'Casual Shoes'} onChange={handleCategoryChange} />Casual Shoes
                    </p>
                    <p className='flex gap-2'>
                      <input type='checkbox' className='w-3' value={'Sneakers'} onChange={handleCategoryChange} />Sneakers
                    </p>
                    <p className='flex gap-2'>
                      <input type='checkbox' className='w-3' value={'Boots'} onChange={handleCategoryChange} />Boots
                    </p>
                  </div> : category === "Bags & Accessories" ?
                    <div className='flex flex-col gap-2 sm:text-sm text-[13px] font-normal'>
                      <p className='flex gap-2'>
                        <input type='checkbox' className='w-3' value={'Handbags'} onChange={handleCategoryChange} />Handbags
                      </p>
                      <p className='flex gap-2'>
                        <input type='checkbox' className='w-3' value={'Crossbody Bags'} onChange={handleCategoryChange} />Crossbody Bags
                      </p>
                      <p className='flex gap-2'>
                        <input type='checkbox' className='w-3' value={'Wallets'} onChange={handleCategoryChange} />Wallets
                      </p>
                    </div> : category === "Beauty & Wellness" ?
                      <div className='flex flex-col gap-2 sm:text-sm text-[13px] font-normal'>
                        <p className='flex gap-2'>
                          <input type='checkbox' className='w-3' value={'Shampoo & Facewashes'} onChange={handleCategoryChange} />Shampoo & Facewashes
                        </p>
                        <p className='flex gap-2'>
                          <input type='checkbox' className='w-3' value={'Skin Treatments'} onChange={handleCategoryChange} />Skin Treatments
                        </p>
                        <p className='flex gap-2'>
                          <input type='checkbox' className='w-3' value={'Oil & Treatments'} onChange={handleCategoryChange} />Sneakers
                        </p>
                        <p className='flex gap-2'>
                          <input type='checkbox' className='w-3' value={'Hair Color & Treatments'} onChange={handleCategoryChange} />Hair Color & Treatments
                        </p>
                      </div> : category === "Electronics & Gadgets" ?
                        <div className='flex flex-col gap-2 sm:text-sm text-[13px] font-normal'>
                          <p className='flex gap-2'>
                            <input type='checkbox' className='w-3' value={'Mobiles & Computers'} onChange={handleCategoryChange} />Mobiles & Computers
                          </p>
                          <p className='flex gap-2'>
                            <input type='checkbox' className='w-3' value={'Smart Watch & Smart TV'} onChange={handleCategoryChange} />Smart Watch & Smart TV
                          </p>
                          <p className='flex gap-2'>
                            <input type='checkbox' className='w-3' value={'Audio & Accessories'} onChange={handleCategoryChange} />Audio & Accessories
                          </p>
                          <p className='flex gap-2'>
                            <input type='checkbox' className='w-3' value={'Refrigerator & Cooling'} onChange={handleCategoryChange} />Refrigerator & Cooling
                          </p>
                        </div> : null}
            </div> : null}

          <div className="mb-6">
            <h3 className="font-medium mb-2">Price</h3>
            <input type="range" className="w-full" />
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
        <div className="col-span-9">

          {/* Sort */}
          <div className="flex justify-between text-[13px] text-gray-600 font-medium items-center p-2.5 mb-6 bg-white rounded-sm">

            <h6>
              Showing {itemsPerPage} of {filteredProducts.length} from {category}
            </h6>

            <div className='flex items-center gap-2'>
              <h6>Sort By: </h6>
              <select value={sortType} onChange={(e) => { setSortType(e.target.value) }} className="border px-4 py-1.5 rounded-lg outline-[#2563EB] bg-gray-50 border-[#E5E7EB]">
                <option value='latest'>Latest</option>
                <option value='low-high'>Price Low to High</option>
                <option value='high-low'>Price High to Low</option>
              </select>
            </div>

          </div>

          {/* Product Grid */}
          <div className={`grid 2xl:grid-cols-5 xl:grid-cols-4 grid-cols-3 sm:gap-[18px] gap-4`}>

            {currentProducts.length > 0 ? currentProducts.map((product, index) => (
              <Suspense fallback={<p>Loading...</p>}>
                <ProductCard key={index} product={product} />
              </Suspense>
            )) : <img src={loading_animation} alt='loader' className='mx-auto' />}

          </div>

          {/* Pagination Buttons */}
          {totalPages > 1 ? <div className='flex items-center justify-center gap-2 mt-6'>
            <button
              disabled={currentPage === 1}
              className='bg-indigo-600 text-white px-6 cursor-pointer py-2 rounded-sm'
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{ fontFamily: 'Outfit' }}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  padding: "8px 12px",
                  background: currentPage === i + 1 ? "black" : "white",
                  color: currentPage === i + 1 ? "white" : "#0F172A",
                  border: "none",
                  fontFamily: 'Outfit',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  minWidth: '35px'
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{ fontFamily: 'Outfit' }}
              className='bg-indigo-600 text-white px-6 cursor-pointer py-2 rounded-sm'
            >
              Next
            </button>
          </div> : null}
        </div>

      </div>

    </div>
  )
}

export default CategoryProducts