import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import cross_icon from '../../assets/cross_icon.svg'
import { useContext } from 'react';
import { FaEdit } from "react-icons/fa";
import loading_animation from '../../../public/loading_animation.svg'
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const ListBlog = () => {
  const { backendUrl, navigate, isAdmin, blogs, fetchBlogs, blogLoading } = useContext(AppContext);

  const deleteBlog = async (blogId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/blog/delete/${blogId}`, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      });
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchBlogs();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
      if (error.response.status === 500) {
        localStorage.removeItem('token');
        window.location.href = "/admin"
      }
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[95vh]'>
      <div className='flex flex-col w-full'>
        <h1 className='font-semibold sm:text-[22px] text-xl flex items-center gap-2 mb-4' style={{ fontFamily: 'Montserrat' }}>Blog List</h1>
        <div className='relative max-h-[75vh] overflow-y-auto custom-scrollbar'>
          <div className='w-full sm:text-sm text-xs'>
            <div className='blog_list_title text-xs uppercase sm:py-3 py-2 px-3 font-semibold grid lg:grid-cols-[2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr] grid-cols-[4fr_1fr] gap-2 bg-[#2563EB] bg-[#fff] text-[#2c3338] rounded-tr-lg rounded-tl-lg border border-gray-300'>
              <label className=' l:px-6' style={{ fontFamily: "Montserrat" }}>Blog</label>
              <label className=' l:px-6 hidden sm:block' style={{ fontFamily: "Montserrat" }}>Description</label>
              <label className=' max-lg:hidden mx-auto' style={{ fontFamily: "Montserrat" }}>Date</label>
              <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Action</label>
            </div>
            {blogLoading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
              {blogs.length > 0 ?
                <div className='bg-[#f6f7f7]'>
                  {blogs?.reverse().map((blog, index) => (
                    <div key={index} className='blog_list sm:text-sm text-[13px] border border-t-0 border-gray-300  px-3 py-2.5 grid lg:grid-cols-[2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr] grid-cols-[4fr_1fr] gap-2 items-center text-[#50575e]'>
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
                      <h6 className='max-lg:hidden mx-auto text-gray-500 text-[13px]' style={{ fontFamily: 'Outfit' }}>{new Date(blog.created_at).toDateString()}</h6>

                      <div className="flex justify-end gap-3 text-[15px] mx-auto">
                        <button
                          onClick={() => { navigate(`/admin/updateblog/${blog?._id}`) }}
                          className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 cursor-pointer"
                        >
                          <FiEdit />
                        </button>

                        <button
                          onClick={() => deleteBlog(blog._id)}
                          className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 cursor-pointer"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div> : <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center bg-white rounded-md w-full'>You don,t have any blogs</div>}
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListBlog