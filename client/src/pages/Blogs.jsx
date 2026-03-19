import React from 'react'
const BlogCard = React.lazy(()=>import('../components/BlogCard'))
import { FiSearch } from 'react-icons/fi'
import { useContext } from 'react'
import { Suspense } from 'react'
import { AppContext } from '../context/AppContext'
import loading_animation from '../../public/loading_animation.svg'

const Blogs = () => {
    const { blogs } = useContext(AppContext);
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-[#e4e4f56c] lg:py-16 py-14">
                <div className="max-w-7xl mx-auto px-4 text-center">

                    <h1 className="lg:text-4xl text-3xl font-bold text-gray-800">
                        Our Blog
                    </h1>

                    <p className="text-gray-600 lg:mt-3 mt-2 max-w-xl mx-auto sm:text-sm text-xs">
                        Read our latest articles and stay updated with the newest trends
                        in shopping, lifestyle and more.
                    </p>

                </div>
            </div>

            {/* Blog Grid */}
            <div className="container mx-auto px-4 2xl:pt-15 pt-14 2xl:pb-3 pb-2">

                <div className="blogs grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 sm:gap-[18px] gap-4">

                    {blogs.length>0 ? blogs.map((blog,index) => (
                        <Suspense>
                            <BlogCard key={index} blog={blog} />
                        </Suspense>
                    )) : <img src={loading_animation} alt='loader' className='mx-auto' />}

                </div>

                {/* Pagination */}
                {/* <div className="flex justify-center mt-12 gap-2">

                    <button className="px-4 py-2 border rounded-lg">
                        Prev
                    </button>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        1
                    </button>

                    <button className="px-4 py-2 border rounded-lg">
                        2
                    </button>

                    <button className="px-4 py-2 border rounded-lg">
                        3
                    </button>

                    <button className="px-4 py-2 border rounded-lg">
                        Next
                    </button>

                </div> */}

            </div>

        </div>
    )
}

export default Blogs