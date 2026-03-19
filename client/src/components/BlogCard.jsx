import React from 'react'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext'
import { LuMoveRight } from "react-icons/lu";

const BlogCard = React.memo(({ blog }) => {
  const { navigate } = useContext(AppContext)
  const cleanHTML = blog?.description
    ?.replace(/style="[^"]*color:[^";]+;?[^"]*"/gi, "")
    ?.replace(/color:[^;"]+;?/gi, "");
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-xl transition duration-300 overflow-hidden">

      {/* Image */}
      <div className="relative">
        <img onClick={() => { navigate(`/blog/${blog?._id}`); scrollTo(0, 0) }}
          className="w-full sm:h-48 h-40 object-cover cursor-pointer"
          src={blog?.image}
          alt="blog"
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
          E-commerce
        </span>
      </div>

      {/* Content */}
      <div className="sm:p-5 p-3.5">
        <h3 onClick={() => { navigate(`/blog/${blog?._id}`); scrollTo(0, 0) }} className="blog_card_title 2xl:text-[17px] sm:text-base text-sm leading-[1.4em] font-medium text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2">
          {blog?.title}
        </h3>

        <p className="blog_card_content text-gray-500 text-xs mt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: cleanHTML }}>
        </p>

        {/* Author */}
        <div className="flex items-center justify-between sm:mt-4 mt-2">
          <button onClick={() => { navigate(`/blog/${blog?._id}`); scrollTo(0, 0) }} className='cursor-pointer hover:text-[#2563EB] sm:text-[13.2px] text-xs flex items-center gap-1' style={{ fontFamily: 'Inter' }}>Read More <span className=''><LuMoveRight /></span></button>
          <span className="sm:block hidden text-xs text-gray-400">{new Date(blog?.created_at).toDateString()}</span>
        </div>
      </div>
    </div>
  )
})

export default React.memo(BlogCard);