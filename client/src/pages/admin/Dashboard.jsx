import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useContext } from 'react'
import dashboard_icon_1 from '../../assets/dashboard_icon_1.svg'
import dashboard_icon_4 from '../../assets/dashboard_icon_4.svg'
import { FaEdit } from 'react-icons/fa'
import cross_icon from '../../assets/cross_icon.svg'

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const { backendUrl, navigate, isAdmin, currency } = useContext(AppContext);

  const fetchBlogs = async () => {
    try {
      let response = await axios.get(`${backendUrl}/api/blog/get-blogs`, { withCredentials: true })
      if (response.data) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProducts = async () => {
    try {
      let response = await axios.get(`${backendUrl}/api/product/get-products`, { withCredentials: true })
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async (blogId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/blog/delete/${blogId}`, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      });
      if (response.data.success) {
        toast.success(response.data.messege)
        await fetchBlogs();
      }
    } catch (error) {
      console.log(error)
      if (error.response.status === 500) {
        localStorage.removeItem('token');
        window.location.href = "/admin"
      }
      toast.error(error.response.data.messege);
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
      if (error.response.status === 500) {
        localStorage.removeItem('token');
        window.location.href = "/admin"
      }
    }
  }

  const fetchAllOrders = async () => {
    try {
      let response = await axios.get(`${backendUrl}/api/order/get-orders`, { withCredentials: true })
      if (response.data) {
        setOrders(response.data)
      } else {
        console.log(error.response.data.messege);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateOrderStatus = async (event, order_id) => {
    try {

      let response = await axios.put(`${backendUrl}/api/order/update-order/${order_id}`, { order_status: event.target.value }, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      });
      if (response.data.success) {
        fetchAllOrders()
        toast.success(response.data.messege);
      } else {
        toast.error(response.data.messege)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchBlogs();
    fetchProducts();
    fetchAllOrders();
  }, [])
  return (
    <div className='flex-1 px-4 py-8 lg:px-10'>
      <div className='flex flex-wrap gap-4'>
        <div className='flex items-center gap-3 bg-white p-4 min-w-54 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={dashboard_icon_1} className='sm:w-14 w-12' alt="" />
          <div>
            <p className='sm:text-xl text-lg font-semibold text-gray-600'>{products.length}</p>
            <h6 style={{ fontFamily: 'Outfit' }} className='text-gray-500 font-light text-sm'>Products</h6>
          </div>
        </div>
        <div className='flex items-center gap-3 bg-white p-4 min-w-54 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={dashboard_icon_1} className='sm:w-14 w-12' alt="" />
          <div>
            <p className='sm:text-xl text-lg font-semibold text-gray-600'>{blogs.length}</p>
            <h6 style={{ fontFamily: 'Outfit' }} className='text-gray-500 font-light text-sm'>Blogs</h6>
          </div>
        </div>
        <div className='flex items-center gap-3 bg-white p-4 min-w-54 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={dashboard_icon_1} className='sm:w-14 w-12' alt="" />
          <div>
            <p className='sm:text-xl text-lg font-semibold text-gray-600'>{orders?.length}</p>
            <h6 style={{ fontFamily: 'Outfit' }} className='text-gray-500 font-light text-sm'>Orders</h6>
          </div>
        </div>
      </div>
      {/* Products */}
      <div>
        <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
          <img src={dashboard_icon_4} alt="" />
          <p>Latest Products</p>
        </div>
        {products.length > 0 ?
          <div className='relative w-fulloverflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
            <div className='w-full sm:text-[13px] text-xs'>
              <div className='md:grid grid xl:grid-cols-[3fr_1fr_1fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] hidden gap-2 py-[14px] px-2 border-b border-[#E5E7EB] text-xs uppercase font-semibold'>
                <label style={{ fontFamily: 'Inter' }}>Product</label>
                <label className='mx-auto max-sm:hidden' style={{ fontFamily: 'Inter' }}>Category</label>
                <label className='mx-auto' style={{ fontFamily: 'Inter' }}>Offer Price</label>
                <label className='mx-auto max-xl:hidden' style={{ fontFamily: 'Inter' }}>Date</label>
                <label className='mx-auto' style={{ fontFamily: 'Inter' }}>Action</label>
              </div>
              <div>
                {products?.slice(length - 3).reverse().map((product, index) => (
                  <div key={index} className='product_list border-b border-[#E5E7EB] px-2 py-1.5 grid xl:grid-cols-[3fr_1fr_1fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] sm:gap-2 gap-1.5 items-center text-gray-700'>
                    <div className='flex items-center sm:gap-4 gap-3'>
                      <img className='main_img sm:h-14 h-10 w-14' src={product?.images[0]} alt="" />
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
              </div>
            </div>
          </div> : <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center bg-white rounded-md w-full'>You don,t have any products</div>}
      </div>
      {/* blogs */}
      <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
        <img src={dashboard_icon_4} alt="" />
        <p>Latest Blogs</p>
      </div>
      {blogs.length > 0 ?
        <div className='w-full'>
          <div className='relative w-full text-sm overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
            <div className='w-full sm:text-sm text-xs'>
              <div className='blog_list_title text-xs uppercase p-3 border-b border-[#E5E7EB] font-semibold grid lg:grid-cols-[2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr] grid-cols-[4fr_1fr] gap-2'>
                <label className=' l:px-6' style={{ fontFamily: 'Inter' }}>Blog</label>
                <label className=' l:px-6 hidden sm:block' style={{ fontFamily: 'Inter' }}>Description</label>
                <label className=' max-lg:hidden mx-auto' style={{ fontFamily: 'Inter' }}>Date</label>
                <label className='mx-auto' style={{ fontFamily: 'Inter' }}>Action</label>
              </div>
              <div>
                {blogs?.slice(length - 3).reverse().map((blog, index) => (
                  <div key={index} className='blog_list sm:text-sm text-xs border-b text-gray-700 border-[#E5E7EB] px-3 py-2.5 grid lg:grid-cols-[2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr] grid-cols-[4fr_1fr] gap-2 items-center'>
                    <div className='flex items-center sm:gap-4 gap-3'>
                      <img className='main_image h-8 w-14' src={blog.image} alt="" />
                      <h6 className='leading-[1.3em] xl:text-[13.4px] text-xs' style={{ fontFamily: 'Outfit' }}>{blog.title}</h6>
                    </div>
                    <div className='hidden sm:block'>
                      <h6 style={{ fontFamily: 'Outfit' }} className='line-clamp-3 text-gray-700 text-xs' dangerouslySetInnerHTML={{
                        __html: blog?.description
                          ?.replace(/style="[^"]*color:[^";]+;?[^"]*"/gi, "")
                          ?.replace(/color:[^;"]+;?/gi, "")
                      }}></h6>
                    </div>
                    <h6 className='max-lg:hidden mx-auto text-xs' style={{ fontFamily: 'Outfit' }}>{new Date(blog.created_at).toDateString()}</h6>
                    <div className=' flex text-sm items-center sm:gap-2 gap-1.5 mx-auto'>
                      <span onClick={() => { navigate(`/admin/updateblog/${blog?._id}`) }} className='lg:text-lg text-[16px] text-[#15173D] hover:scale-105 transition-all cursor-pointer'>
                        <FaEdit />
                      </span>
                      {/* <img src={edit_icon} onClick={() => { navigate(`/admin/updateblog/${blog._id}`) }} alt="" className='md:h-[20px] md:w-[20px] h-5 W-5 hover:scale-110 transition-all cursor-pointer' /> */}
                      <img src={cross_icon} onClick={() => deleteBlog(blog._id)} alt="" className='lg:h-[20px] lg:w-[20px] w-[16px] h-[16px] border border-red-400 rounded-full hover:scale-110 transition-all cursor-pointer' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> : <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center bg-white rounded-md w-full'>You don,t have any blogs</div>}
      {/* Orders */}
      <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
        <img src={dashboard_icon_4} alt="" />
        <p>Latest Orders</p>
      </div>
      {orders.length > 0 ?
        <div>
          <div className='w-full overflow-auto'>
            {orders?.slice(length - 3).reverse().map((order, index) => (
              <div key={index} className="bg-white grid xl:grid-cols-[2fr_2fr_1fr_2fr_1fr] md:grid-cols-[2fr_2fr_1fr] sm:grid-cols-2 items-center gap-4 py-4 px-3 rounded-md border border-gray-300 text-gray-800">
                <div className="order_image_parent flex gap-2">
                  <img className="w-12 h-12 object-cover" src={order.images[0] ? order.images[0] : parcel_icon} alt="product_image" />
                  <div className="flex flex-col justify-center">
                    <p className="font-medium text-sm">
                      {order?.name} <span className={`text-[#2563EB]`}>x{order?.quantity}</span>
                    </p>
                    <div className='flex flex-col leading-none gap-1 text-[13.2px] mt-1'>
                      <p style={{ fontFamily: 'Outfit' }}>{order.size && "Size:"} {order.size && order.size}</p>
                      <p style={{ fontFamily: 'Outfit' }}>{order.color && "Color:"} {order.color && order.color}</p>
                      <p style={{ fontFamily: 'Outfit' }}>{order.footwear_size && "Size:"} {order.footwear_size && order.footwear_size}</p>
                    </div>
                  </div>
                </div>

                <div className="text-sm">
                  <p className='font-medium mb-1'>{JSON.parse(order.address).firstName} {JSON.parse(order.address).lastName}</p>
                  <p className='text-xs'>{JSON.parse(order.address).address}, {JSON.parse(order.address).city},{JSON.parse(order.address).postal_code}</p>
                  <p className='text-xs'>{JSON.parse(order.address).email}</p>
                  <p className='text-xs'>{JSON.parse(order.address).phone}</p>
                </div>

                <p className="font-medium text-[13.2px] my-auto text-black/70">{currency}. {(order?.total_amount).toLocaleString()}</p>

                <div className="flex flex-col text-xs">
                  <p>Method: {order.payment_method}</p>
                  <p>Date: {new Date(order.created_at).toDateString()}</p>
                  <p>Payment: {order.payment_status}</p>
                </div>
                <select value={order.order_status?.trim()} onChange={(event) => updateOrderStatus(event, order.order_id)} className='p-2 font-semibold text-xs bg-gray-50 border border-[#E2E8F0] outline-[#2563EB] w-fit text-gray-600 rounded-sm'>
                  <option value="PLACED">Order Placed</option>
                  <option value="PACKING">Packing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="OUT FOR DELIVERY">Out for delivery</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            ))}
          </div>
        </div> : <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center bg-white rounded-md w-full'>You don,t have any orders</div>}
    </div >
  )
}

export default Dashboard