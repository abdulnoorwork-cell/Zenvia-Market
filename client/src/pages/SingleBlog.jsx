import axios from 'axios';
import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import BlogCard from '../components/BlogCard';
import loading_animation from '../../public/loading_animation.svg'

const SingleBlog = () => {
    const [blog, setBlog] = useState([]);
    const { blog_id } = useParams();
    const { backendUrl, blogs } = useContext(AppContext)
    const fetchBog = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/blog/blog-detail/${blog_id}`, { withCredentials: true });
            if (response.data) {
                setBlog(response.data[0]);
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchBog();
    }, [blog_id])
    console.log(blog)
    const cleanHTML = blog?.description
        ?.replace(/style="[^"]*color:[^";]+;?[^"]*"/gi, "")
        ?.replace(/color:[^;"]+;?/gi, "");
    return (
        <div className="container mx-auto min-h-screen pt-10">

            <div className="max-w-[1080px] mx-auto px-4">

                {blog.length>0 ? 
                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <img
                        src={blog?.image}
                        alt="blog"
                        className="w-full max-h-[360px] object-cover"
                    />

                    <div className="sm:p-8 p-5">

                        <h1 className="md:text-3xl sm:text-2xl text-[22px] max-sm:leading-[1.3em] font-bold text-gray-800 mb-3">
                            {blog?.title}
                        </h1>

                        <div className="flex items-center sm:text-sm text-xs sm:gap-4 gap-3 sm:mb-5 mb-4">
                            <span>By Admin</span>
                            <span>•</span>
                            <span>{new Date(blog?.created_at).toDateString()}</span>
                            {/* <span>•</span>
                            <span>5 min read</span> */}
                        </div>

                        {/* Blog Content */}
                        <p className="space-y-6 leading-relaxed sm:text-sm text-xs" dangerouslySetInnerHTML={{__html: cleanHTML}}>
                        </p>

                        {/* Tags */}
                        {/* <div className="mt-8 flex flex-wrap gap-2">

                            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                                Technology
                            </span>

                            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                                Gadgets
                            </span>

                            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                                Reviews
                            </span>

                        </div> */}

                    </div>

                </div> : <img src={loading_animation} alt='loader' className='mx-auto' />}

                {/* Related Posts */}
                <div className="mt-10">

                    <h2 className="text-[22px] tracking-[0.1px] mb-5 font-semibold">
                        Related Articles
                    </h2>

                    <div className="blogs grid md:grid-cols-3 grid-cols-2 sm:gap-[18px] gap-4">

                        {blogs.length>0 ? blogs?.slice(length - 3).map((blog,index) => (
                            <BlogCard key={index} blog={blog} />
                        )) : <img src={loading_animation} alt='loader' className='mx-auto' />}

                    </div>

                </div>

            </div>

        </div>
    )
}

export default SingleBlog