import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import cross_icon from '../../assets/cross_icon.svg'
import { useContext } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { backendUrl, navigate, currency, isAdmin } = useContext(AppContext);

  const fetchProducts = async () => {
    let response = await axios.get(`${backendUrl}/api/product/get-products`, { withCredentials: true })
    if (response.data) {
      setProducts(response.data);
    }
  }

  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/product/delete/${productId}`, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      });
      if (response.data.success) {
        toast.success(response.data.messege)
        await fetchProducts();
      }
    } catch (error) {
      toast.error(error.response.data.messege);
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [])
  console.log(products)

  return (
    <div className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[95vh]'>
      <div className='flex flex-col w-full'>
        <h1 className='text-gray-800 font-medium'>Products List</h1>
        <div className='mt-4 w-full shadow rounded-lg bg-white'>
          <div className='w-full sm:text-sm text-xs'>
            <div className='md:grid grid xl:grid-cols-[3fr_1fr_1fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] hidden gap-2 py-[14px] px-2 border-b border-[#E5E7EB] text-xs uppercase font-semibold'>
              <label style={{ fontFamily: 'Inter' }}>Product</label>
              <label className='mx-auto max-sm:hidden' style={{ fontFamily: 'Inter' }}>Category</label>
              <label className='mx-auto' style={{ fontFamily: 'Inter' }}>Offer Price</label>
              <label className='mx-auto max-xl:hidden' style={{ fontFamily: 'Inter' }}>Date</label>
              <label className='mx-auto' style={{ fontFamily: 'Inter' }}>Action</label>
            </div>
            {products.length > 0 ?
              <div className='overflow-auto h-[75vh] scrollbar-hide relative text-gray-700 sm:text-[13px] text-xs'>
                {products?.reverse().map((product, index) => (
                  <div key={index} className='product_list border-b border-[#E5E7EB] px-2 py-1.5 grid xl:grid-cols-[3fr_1fr_1fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] sm:gap-2 gap-1.5 items-center text-gray-700'>
                    <div className='flex items-center sm:gap-4 gap-3'>
                      <img className='main_img sm:h-14 h-10 w-14 object-contain' src={product?.images[0]} alt="" />
                      <div className='flex flex-col'>
                        <h6 className='leading-[1.3em]' style={{ fontFamily: 'Outfit' }}>{product?.name}</h6>
                      </div>
                    </div>
                    <h6 className='category mx-auto text-center leading-[1.4em] max-sm:hidden' style={{ fontFamily: 'Outfit' }}>{product?.category}</h6>
                    <h6 className='category mx-auto text-center leading-[1.4em]' style={{ fontFamily: 'Outfit' }}>{currency}.{product?.offerPrice}</h6>
                    <h6 className='mx-auto max-xl:hidden text-center leading-[1.4em]' style={{ fontFamily: 'Outfit' }}>{new Date(product?.created_at).toDateString()}</h6>
                    <figure className='mx-auto'>
                      <img src={cross_icon} onClick={() => deleteProduct(product._id)} alt="" className='sm:h-[20px] sm:w-[20px] w-[17px] h-[17px] border border-red-400 rounded-full hover:scale-110 transition-all cursor-pointer ' />
                    </figure>
                  </div>
                ))}
              </div> : <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center bg-white rounded-md w-full'>You don,t have any products</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList