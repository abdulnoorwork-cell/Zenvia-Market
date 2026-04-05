import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import upload_area from '../../assets/upload_area.svg'
import { useContext } from 'react';
import Quill from 'quill';
import isAdmin from '../../context/AppContext';
import { MdCloudUpload } from 'react-icons/md';

const AddBlog = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null)
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('')

  const { backendUrl, isAdmin,fetchBlogs } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', quillRef.current.root.innerHTML);
      formData.append('image', image);

      const response = await axios.post(`${backendUrl}/api/blog/add`, formData, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      })
      if (response.data.success) {
        toast.success(response.data.messege);
        setLoading(false);
        setImage(false);
        setTitle('');
        quillRef.current.innerHTML = '';
        fetchBlogs()
        setTimeout(() => {
          navigate('/admin/listblog')
        }, 1000)
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error)
      if (error.response.status === 500) {
        localStorage.removeItem('token');
        window.location.href = "/admin"
      }
      toast.error(error.response.data.messege)
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  return (
    <form onSubmit={onSubmitHandler} className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 text-gray-600 h-full min-h-[85vh]'>
      <div className='bg-white flex flex-col w-full max-w-[700px] p-6 md:p-10 shadow rounded'>
        <label htmlFor="image">
          <img src={!image ? upload_area : URL.createObjectURL(image)} className='rounded cursor-pointer max-h-24 max-w-24' alt="" />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} hidden id='image' />
        </label>
        <label className="block sm:text-sm text-xs font-medium mt-4">
          Blog Title
        </label>
        <input type="text" placeholder='Type...' value={title} onChange={(e) => setTitle(e.target.value)} className='w-full mt-2 p-2 min-h-10 text-gray-600 border border-gray-300 outline-none rounded text-sm' required />
        <label className="block sm:text-sm text-xs font-medium mt-4 mb-2">
          Blog Description
        </label>
        <div ref={editorRef} placeholder='Type Here...' className='w-full relative border border-gray-300 min-h-[160px] max-h-[360px] overflow-y-auto outline-none'></div>
        <button style={{ fontFamily: 'Outfit' }} type='submit' className='mt-7 sm:text-sm text-xs px-8 w-fit py-[10px] bg-[#2563EB] text-white rounded cursor-pointer'>{loading ? 'Ading...' : 'Add Blog'}</button>
      </div>
    </form>
  )
}

export default AddBlog