import React from 'react'
import BlogCard from './BlogCard'
import { useContext } from 'react'
import {AppContext} from '../context/AppContext'
import loading_animation from '../../public/loading_animation.svg'

const LatestBlog = () => {
  const {blogs} = useContext(AppContext);
  return (
    <div className='container mx-auto px-4 mt-16'>
      <h6 className='text-[22px] tracking-[0.1px] mb-5 font-semibold'>Latest Post</h6>
      <div className='blogs grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 sm:gap-[18px] gap-4'>
        {blogs.length>0 ? blogs?.slice(length - 8).reverse().map((blog,index)=>(
          <BlogCard key={index} blog={blog} />
        )) : <img src={loading_animation} alt='loader' className='mx-auto' />}
      </div>
    </div>
  )
}

export default React.memo(LatestBlog)