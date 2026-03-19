import React from 'react'
const BlogCard = React.lazy(() => import('./BlogCard'))
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import loading_animation from '../../public/loading_animation.svg'
import { Suspense } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

const LatestBlog = () => {
  const [blogs, setBlogs] = useState([])
  const { backendUrl } = useContext(AppContext);
  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        let response = await axios.get(`${backendUrl}/api/blog/latest-blogs`, { withCredentials: true })
        if (response.data) {
          setBlogs(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchLatestBlogs()
  }, [])
  return (
    <div className='container mx-auto px-4 mt-16'>
      <h6 className='text-[22px] tracking-[0.1px] mb-5 font-semibold'>Latest Post</h6>
      <div className='blogs grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 sm:gap-[18px] gap-4'>
        {blogs.length > 0 ? blogs?.slice(length - 8).reverse().map((blog, index) => (
          <Suspense key={index} fallback={<p>Loading...</p>}>
            <BlogCard blog={blog} />
          </Suspense>
        )) : <img src={loading_animation} alt='loader' className='mx-auto' />}
      </div>
    </div>
  )
}

export default React.memo(LatestBlog)