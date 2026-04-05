import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useContext } from 'react'
import dashboard_icon_1 from '../../assets/dashboard_icon_1.svg'
import dashboard_icon_4 from '../../assets/dashboard_icon_4.svg'
import { FaEdit } from 'react-icons/fa'
import cross_icon from '../../assets/cross_icon.svg'
import loading_animation from '../../../public/loading_animation.svg'

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const { backendUrl, navigate, isAdmin, currency, products, fetchProducts, blogs, fetchBlogs, loading, blogLoading, orderLoading, setOrderLoading, fetchAdminOrders } = useContext(AppContext);

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

  const fetchLatestOrders = async () => {
    try {
      setOrderLoading(true)
      let response = await axios.get(`${backendUrl}/api/order/get-latest-orders`, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      })
      if (response.data) {
        setOrders(response.data)
        setOrderLoading(false)
      } else {
        setOrderLoading(false)
        console.log(error.response.data.messege);
      }
    } catch (error) {
      setOrderLoading(false)
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
        toast.success(response.data.messege);
        await fetchAdminOrders()
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
    fetchLatestOrders();
  }, [])

  return (
    <div className='flex-1 px-4 py-8 lg:px-10'>
      <div className='flex flex-wrap gap-4'>
        <div className='flex items-center gap-3 bg-white p-4 min-w-54 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={dashboard_icon_1} className='sm:w-14 w-12' alt="" />
          <div>
            <p className='sm:text-xl text-lg font-semibold'>{products.length}</p>
            <h6 style={{ fontFamily: 'Montserrat' }} className='text-gray-500 text-sm'>Products</h6>
          </div>
        </div>
        <div className='flex items-center gap-3 bg-white p-4 min-w-54 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={dashboard_icon_1} className='sm:w-14 w-12' alt="" />
          <div>
            <p className='sm:text-xl text-lg font-semibold'>{blogs.length}</p>
            <h6 style={{ fontFamily: 'Montserrat' }} className='text-gray-500 text-sm'>Blogs</h6>
          </div>
        </div>
        <div className='flex items-center gap-3 bg-white p-4 min-w-54 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <img src={dashboard_icon_1} className='sm:w-14 w-12' alt="" />
          <div>
            <p className='sm:text-xl text-lg font-semibold'>{orders?.length}</p>
            <h6 style={{ fontFamily: 'Montserrat' }} className='text-gray-500 text-sm'>Orders</h6>
          </div>
        </div>
      </div>
      {/* Products */}
      <div>
        <div className='flex items-center gap-3 m-4 mt-6'>
          <img src={dashboard_icon_4} alt="" />
          <h6 className='font-semibold text-gray-700'>Latest Products</h6>
        </div>
        <div className='admin_products_label grid xl:grid-cols-[3fr_1fr_1fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] gap-2 sm:py-3 py-2 px-3 border-b border-[#E5E7EB] text-xs uppercase font-semibold bg-[#2563EB] text-white'>
          <label style={{ fontFamily: "Montserrat" }}>Product</label>
          <label className='mx-auto max-sm:hidden' style={{ fontFamily: "Montserrat" }}>Category</label>
          <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Price</label>
          <label className='mx-auto max-xl:hidden' style={{ fontFamily: "Montserrat" }}>Date</label>
          <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Action</label>
        </div>
        {loading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
          {products.length > 0 ?
            <div className='relative w-fulloverflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
              <div className='w-full sm:text-[13px] text-xs'>
                <div>
                  {products?.slice(length - 3).reverse().map((product, index) => (
                    <div key={index} className='product_list border-b border-[#E5E7EB] px-2 py-1.5 grid xl:grid-cols-[3fr_1fr_1fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] sm:gap-2 gap-1.5 items-center text-gray-800 sm:text-sm text-[13px]'>
                      <div className='main_img flex items-center sm:gap-4 gap-3'>
                        <img className='sm:h-14 h-10 w-14 object-contain' src={product?.images[0]} alt="" />
                        <div className='flex flex-col'>
                          <h6 className='leading-[1.3em] font-medium' style={{ fontFamily: 'Outfit' }}>{product?.name}</h6>
                        </div>
                      </div>
                      <h6 className='category mx-auto text-center leading-[1.4em] max-sm:hidden' style={{ fontFamily: 'Outfit' }}>{product?.category}</h6>
                      <h6 className='category mx-auto text-center leading-[1.4em] font-medium' style={{ fontFamily: 'Outfit' }}>{currency}.{product?.offerPrice}</h6>
                      <h6 className='mx-auto max-xl:hidden text-center leading-[1.4em]' style={{ fontFamily: 'Outfit' }}>{new Date(product?.created_at).toDateString()}</h6>
                      <figure className='mx-auto'>
                        <img src={cross_icon} onClick={() => deleteProduct(product._id)} alt="" className='sm:h-[20px] sm:w-[20px] w-[17px] h-[17px] border border-red-400 rounded-full hover:scale-110 transition-all cursor-pointer ' />
                      </figure>
                    </div>
                  ))}
                </div>
              </div>
            </div> : <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center bg-white rounded-md w-full'>You don,t have any products</div>}
        </div>}
      </div>
      {/* blogs */}
      <div className='flex items-center gap-3 m-4 mt-6'>
        <img src={dashboard_icon_4} alt="" />
        <h6 className='font-semibold text-gray-700'>Latest Blogs</h6>
      </div>
      <div className='blog_list_title text-xs uppercase sm:py-3 py-2 px-3 border-b border-[#E5E7EB] font-semibold grid lg:grid-cols-[2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr] grid-cols-[4fr_1fr] gap-2 bg-[#2563EB] text-white'>
        <label className=' l:px-6' style={{ fontFamily: "Montserrat" }}>Blog</label>
        <label className=' l:px-6 hidden sm:block' style={{ fontFamily: "Montserrat" }}>Description</label>
        <label className=' max-lg:hidden mx-auto' style={{ fontFamily: "Montserrat" }}>Date</label>
        <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Action</label>
      </div>
      {blogLoading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
        {blogs.length > 0 ?
          <div className='w-full'>
            <div className='relative w-full text-sm overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
              <div className='w-full sm:text-sm text-xs'>
                <div>
                  {blogs?.slice(length - 3).reverse().map((blog, index) => (
                    <div key={index} className='blog_list text-gray-800 sm:text-sm text-[13px] border-b border-[#E5E7EB] px-3 py-2.5 grid lg:grid-cols-[2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr] grid-cols-[4fr_1fr] gap-2 items-center'>
                      <div className='flex items-center sm:gap-4 gap-3'>
                        <img className='main_image h-8 w-14' src={blog.image} alt="" />
                        <h6 style={{ fontFamily: 'Outfit' }}>{blog.title}</h6>
                      </div>
                      <div className='hidden sm:block'>
                        <h6 style={{ fontFamily: 'Outfit' }} className='line-clamp-3 text-xs' dangerouslySetInnerHTML={{
                          __html: blog?.description
                            ?.replace(/style="[^"]*color:[^";]+;?[^"]*"/gi, "")
                            ?.replace(/color:[^;"]+;?/gi, "")
                        }}></h6>
                      </div>
                      <h6 className='max-lg:hidden mx-auto text-xs' style={{ fontFamily: 'Outfit' }}>{new Date(blog.created_at).toDateString()}</h6>
                      <div className=' flex text-sm items-center sm:gap-2 gap-1.5 mx-auto'>
                        <span onClick={() => { navigate(`/admin/updateblog/${blog?._id}`) }} className='lg:text-lg text-[16px] hover:scale-105 transition-all cursor-pointer'>
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
      </div>}
      {/* Orders */}
      <div className='flex items-center gap-3 m-4 mt-6'>
        <img src={dashboard_icon_4} alt="" />
        <h6 className='font-semibold text-gray-700'>Latest Orders</h6>
      </div>
      <div className='xl:grid hidden xl:grid-cols-[2fr_2fr_1fr_2fr_1fr] md:grid-cols-[2fr_2fr_1fr] sm:grid-cols-2 hidden gap-2 py-3 px-3 border-b border-[#E5E7EB] text-xs uppercase font-semibold bg-[#2563EB] text-white'>
        <label style={{ fontFamily: "Montserrat" }}>Order</label>
        <label className='max-sm:hidden' style={{ fontFamily: "Montserrat" }}>Delivery</label>
        <label className='' style={{ fontFamily: "Montserrat" }}>Amount</label>
        <label className='max-xl:hidden' style={{ fontFamily: "Montserrat" }}>Payment</label>
        <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Status</label>
      </div>
      {orderLoading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
        {orders.length > 0 ?
          <div>
            <div className='w-full overflow-auto'>
              {orders?.map((order, index) => (
                <div key={index} className="bg-white grid xl:grid-cols-[2fr_2fr_1fr_2fr_1fr] md:grid-cols-[2fr_2fr_1fr] sm:grid-cols-2 items-center gap-4 py-4 px-3 border-b border-gray-300 text-gray-800">
                  <div className="order_image_parent flex gap-2">
                    <img className="w-12 h-12 object-cover" src={order.images[0] ? order.images[0] : parcel_icon} alt="product_image" />
                    <div className="flex flex-col justify-center">
                      <h6 className="font-medium text-sm">
                        {order?.name} <span className={`text-[#2563EB]`}>x{order?.quantity}</span>
                      </h6>
                      <div className='flex flex-col leading-none gap-1 text-gray-700 text-[13.2px] mt-1'>
                        <h6 style={{ fontFamily: 'Outfit' }}>{order.size && "Size:"} {order.size && order.size}</h6>
                        <h6 style={{ fontFamily: 'Outfit' }}>{order.color && "Color:"} {order.color && order.color}</h6>
                        <h6 style={{ fontFamily: 'Outfit' }}>{order.footwear_size && "Size:"} {order.footwear_size && order.footwear_size}</h6>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <h6 className='font-medium mb-1'>{JSON.parse(order.address).firstName} {JSON.parse(order.address).lastName}</h6>
                    <h6 className='text-xs text-gray-700'>{JSON.parse(order.address).address}, {JSON.parse(order.address).city}, {JSON.parse(order.address).postal_code}</h6>
                    <h6 className='text-xs text-gray-700'>{JSON.parse(order.address).email}</h6>
                    <h6 className='text-xs text-gray-700'>{JSON.parse(order.address).phone}</h6>
                  </div>

                  <h6 className="font-medium" style={{ fontFamily: "Outfit" }}>{currency}. {(order?.total_amount).toLocaleString()}</h6>

                  <div className="flex flex-col text-xs text-gray-700 font-medium">
                    <h6>Method: {order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1).toLowerCase()}</h6>
                    <h6>Date: {new Date(order.created_at).toDateString()}</h6>
                    <h6>Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1).toLowerCase()}</h6>
                  </div>
                  <select value={order.order_status?.trim()} onChange={(event) => updateOrderStatus(event, order.order_id)} className='p-2 font-medium text-xs border border-gray-400/80 outline-[#2563EB] w-fit text-gray-700 rounded-sm'>
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
      </div>}
    </div >
  )
}

export default Dashboard