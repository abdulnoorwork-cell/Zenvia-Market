import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import loading_animation from '../../public/loading_animation.svg'

const ProductType = ({ type }) => {
  const { products } = useContext(AppContext);
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(4)
      }
      else if (window.innerWidth < 1024) {
        setItemsPerPage(6)
      }
      else if (window.innerWidth < 1280) {
        setItemsPerPage(8)
      }
      else if (window.innerWidth < 1536) {
        setItemsPerPage(10)
      }
      else {
        setItemsPerPage(12)
      }
    }
    updateItems()
    window.addEventListener('resize', updateItems);
    return () => window.removeEventListener('resize', updateItems)
  }, [])
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentProducts = products.filter(prod => prod.subCategory === type).slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(products?.filter(prod => prod.subCategory === type).length / itemsPerPage);
  return (
    <div>
      <div className="container mx-auto px-4 mt-10 min-h-screen">
        <h6 className='mb-3'>Showing {itemsPerPage} of {products.filter(prod => prod.subCategory === type).length} from {type}</h6>
        <div className='products grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-[18px] gap-4'>
          {currentProducts.length>0 ? currentProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          )) : <img src={loading_animation} alt='loader' className='mx-auto' />}
        </div>
        {/* Pagination Buttons */}
        {totalPages > 1 && <div className='flex items-center justify-center gap-2 mt-6'>
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
        </div>}
      </div>
    </div>
  )
}

export default ProductType