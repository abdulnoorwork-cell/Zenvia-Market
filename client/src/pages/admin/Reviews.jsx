import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios';
import loading_animation from '../../../public/loading_animation.svg'
import { TfiCommentAlt } from "react-icons/tfi";
import profile_image from '../../assets/profile_image.png'
import { AiFillStar } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa6";

const Reviews = () => {
    const [allReviews, setAllReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const { backendUrl, isAdmin, currency } = useContext(AppContext);
    const fetchAllReviews = async () => {
        try {
            setLoading(true)
            let response = await axios.get(`${backendUrl}/api/review/all-reviews`, {
                headers: {
                    Authorization: `${isAdmin}`
                },
                withCredentials: true
            })
            if (response.data) {
                setAllReviews(response.data)
                setLoading(false)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllReviews();
    }, [])

    console.log(allReviews)

    return (
        <div className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[95vh]'>
            <div className='flex flex-col w-full'>
                <h1 className='font-semibold sm:text-[22px] text-xl flex items-center gap-2' style={{ fontFamily: 'Montserrat' }}><span className='text-2xl text-[#2563EB]'><TfiCommentAlt /></span>Reviews List</h1>
                <div className='mt-4 w-full shadow bg-white'>
                    <div className='w-full sm:text-sm text-xs'>
                        <div className='sm:grid hidden xl:grid-cols-[2fr_2fr_2fr_1fr_1fr_1fr] lg:grid-cols-[2fr_2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_2fr_1fr] gap-2 sm:py-3 py-2 px-3 border-b border-[#E5E7EB] text-xs uppercase font-semibold bg-[#2563EB] text-white'>
                            <label style={{ fontFamily: "Montserrat" }}>Customer</label>
                            <label style={{ fontFamily: "Montserrat" }}>Review</label>
                            <label style={{ fontFamily: "Montserrat" }}>Product</label>
                            <label className='mx-auto xl:block hidden' style={{ fontFamily: "Montserrat" }}>Price</label>
                            <label className='mx-auto lg:block hidden' style={{ fontFamily: "Montserrat" }}>Date</label>
                            <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Action</label>
                        </div>
                        {loading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
                            {allReviews.length > 0 ?
                                <div className='overflow-auto max-h-[75vh] scrollbar-hide relative sm:text-sm text-[13px]'>
                                    {allReviews?.reverse().map((review, index) => (
                                        <div key={index} className='border-b border-[#E5E7EB] sm:p-3 p-5 sm:grid flex flex-col text-center sm:text-start xl:grid-cols-[2fr_2fr_2fr_1fr_1fr_1fr] lg:grid-cols-[2fr_2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_2fr_1fr] gap-2 items-center'>
                                            <div className='flex flex-col 2xl:flex-row max-sm:items-center 2xl:items-center 2xl:gap-3 gap-2'>
                                                <img className='h-12 w-12 object-contain rounded-full' src={review.profile_image ? JSON.parse(review?.profile_image) : profile_image} alt="profile_image" />
                                                <div className='flex flex-col'>
                                                    <h6 className='leading-[1.3em] font-medium text-base'>{review?.name}</h6>
                                                    <h6 className='text-gray-700 text-[13.4px]'>{review?.email}</h6>
                                                </div>
                                            </div>
                                            {/* Reviews */}
                                            <div>
                                                <div className='flex items-center max-sm:justify-center gap-[1px] text-yellow-500 text-base'>
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <AiFillStar key={i} />
                                                    ))}
                                                </div>
                                                <h6 className='lg:text-[13.4px] text-[12.8px] mt-0.5 max-sm:text-gray-500'>{review?.comment}</h6>
                                            </div>
                                            <div className='flex flex-col lg:flex-row lg:items-center sm:gap-2 gap-1.5'>
                                                <img src={review?.images[0]} className='sm:w-14 sm:h-14 w-20 h-20 max-sm:mx-auto' alt="" />
                                                <h5 className='font-medium leading-[1.2em] lg:text-[14.8px] text-sm tracking-[-0.2px]' style={{ fontFamily: "Montserrat" }}>{review.product_name}</h5>
                                            </div>
                                            <div className="mx-auto xl:block hidden">
                                                <h6 className='category mx-auto text-center leading-[1.4em] font-semibold text-[15px]' style={{ fontFamily: 'Montserrat' }}>{currency}. {review?.offerPrice}</h6>
                                                <h6 className='category mx-auto text-center leading-[1.4em] font-medium line-through text-gray-600/90' style={{ fontFamily: 'Montserrat' }}>{currency}. {review?.price}</h6>
                                            </div>
                                            <div className="mx-auto lg:block hidden">
                                                <p className='mx-auto text-center leading-[1.4em] font-medium' style={{ fontFamily: 'Montserrat' }}>{new Date(review?.created_at).toDateString()}</p>
                                            </div>
                                            <div className='flex items-center gap-2 mx-auto max-sm:mt-2'>
                                                <div className='bg-blue-50 text-blue-600 rounded-md cursor-pointer flex items-center gap-1 py-1.5 px-3 text-xs font-medium'>
                                                    <span onClick={() => deleteProduct(product._id)} className='text-lg'><FaRegCommentDots /></span>
                                                    Reply
                                                </div>
                                                <div className='bg-red-50 text-red-500 text-xl p-1 rounded-md cursor-pointer'>
                                                    <span onClick={() => deleteProduct(product._id)} className=''><MdDeleteOutline /></span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div> :
                                <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center bg-white rounded-md w-full'>You don,t have any reviews</div>
                            }
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reviews