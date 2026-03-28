import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
const ProductCard = React.lazy(() => import('../components/ProductCard'))
import { useContext, Suspense } from 'react'
import { AppContext } from '../context/AppContext'
import loading_animation from '../../public/loading_animation.svg'
import axios from 'axios'

const ProductType = ({ type }) => {
  const [products, setProducts] = useState([])
  const { backendUrl } = useContext(AppContext);
  useEffect(() => {
    const fetchSubCategoryProducts = async () => {
      try {
        let response = await axios.get(`${backendUrl}/api/product/subcategory-products/${type}`, { withCredentials: true })
        if (response.data) {
          setProducts(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchSubCategoryProducts()
  }, [])
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
  const currentProducts = products.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(products?.length / itemsPerPage);

  return (
    <div>
      <div className="container mx-auto px-4 mt-10 min-h-screen">
        <h6 className='mb-3'>Showing {itemsPerPage} of {products.length} from {type}</h6>
        <div className='products grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-[18px] gap-4'>
          {currentProducts.length > 0 ? currentProducts.map((product, index) => (
            <Suspense key={index}>
              <ProductCard product={product} />
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
                currentPage + (window.innerWidth < 640 ? 2 : 2)
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
  )
}

export default ProductType