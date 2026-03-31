import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios';
import loading_animation from '../../../public/loading_animation.svg'
import { TfiCommentAlt } from "react-icons/tfi";
import profile_image from '../../assets/profile_image.png'
import { AiFillStar } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa6";
import toast from 'react-hot-toast';

const Reviews = () => {
    const [model, setModel] = useState(false)
    const [singleReview, setSingleReview] = useState([]);
    const [reply, setReply] = useState('')
    const [replyLoading, setReplyLoading] = useState(false);
    const { backendUrl, isAdmin, currency,fetchAllReviews,loading,allReviews } = useContext(AppContext);

    const fetchSingleReview = async (review_id) => {
        try {
            let response = await axios.get(`${backendUrl}/api/review/get-single-review/${review_id}`, {
                headers: {
                    Authorization: `${isAdmin}`
                },
                withCredentials: true
            })
            if (response.data) {
                setModel(true)
                setSingleReview(response.data[0]);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleReply = async (review_id) => {
        try {
            setReplyLoading(true)
            let response = await axios.post(`${backendUrl}/api/review/reply/add`, { review_id, reply }, {
                headers: {
                    Authorization: `${isAdmin}`
                },
                withCredentials: true
            })
            if (response.data.success) {
                toast.success(response.data.messege)
                setReply('')
                setModel(false)
                setReplyLoading(false);
                fetchAllReviews()
            }
            setReplyLoading(false)
        } catch (error) {
            console.log(error)
            setReplyLoading(false)
            toast.error(error.response.data.messege)
        }
    }

    return (
        <div className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[95vh]'>
            <div className='flex flex-col w-full'>
                <h1 className='font-semibold sm:text-[22px] text-xl flex items-center gap-2 mb-4' style={{ fontFamily: 'Montserrat' }}><span className='text-2xl text-[#2563EB]'><TfiCommentAlt /></span>Reviews List</h1>
                <div className='w-full shadow bg-white'>
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
                                                <div onClick={() => fetchSingleReview(review._id)} className='bg-blue-50 text-blue-600 rounded-md cursor-pointer flex items-center gap-1 py-1.5 px-3 text-xs font-medium'>
                                                    <span className='text-lg'><FaRegCommentDots /></span>
                                                    Reply
                                                </div>
                                                {/* <div className='bg-red-50 text-red-500 text-xl p-1 rounded-md cursor-pointer'>
                                                    <span onClick={() => deleteProduct(product._id)} className=''><MdDeleteOutline /></span>
                                                </div> */}
                                            </div>
                                            {/* ================= ADMIN REPLY SECTION ================= */}
                                            <div className={`fixed inset-0 z-50 items-center justify-center ${model && singleReview ? "flex" : "hidden"}`}>
                                                {/* Overlay */}
                                                <div
                                                    className="absolute inset-0 bg-[#14102b44] backdrop-blur-[0.4px]"
                                                    onClick={() => setModel(false)}
                                                ></div>

                                                {/* Modal */}
                                                <div className="relative w-full max-w-lg bg-white rounded-lg z-10">

                                                    {/* Header */}
                                                    <div className="flex justify-between items-center px-5 py-2.5 rounded-tl-lg rounded-tr-lg border-b border-[#E2E8F0] bg-gray-100">
                                                        <h2 className="text-base font-semibold tracking-[-0.2px]" style={{ fontFamily: "Montserrat" }}>
                                                            Reply to Review
                                                        </h2>
                                                        <button
                                                            onClick={() => setModel(false)}
                                                            className="text-gray-700 hover:text-red-500 text-lg cursor-pointer"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-5">

                                                        {/* Customer Info */}
                                                        <div className="flex gap-3 items-center mb-4">
                                                            <img
                                                                src={singleReview.profile_image ? JSON.parse(singleReview?.profile_image) : profile_image}
                                                                alt="user"
                                                                className="w-10 h-10 rounded-full"
                                                            />
                                                            <div>
                                                                <h6 className="text-sm font-semibold">
                                                                    {singleReview.name}
                                                                </h6>
                                                                <p className="text-xs text-gray-500">
                                                                    {singleReview.email}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Review Box */}
                                                        <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-600 mb-4">
                                                            {singleReview.comment}
                                                        </div>

                                                        {/* Textarea */}
                                                        <textarea
                                                            value={reply}
                                                            onChange={(e) => setReply(e.target.value)}
                                                            placeholder="Write your reply..."
                                                            rows={4}
                                                            className="w-full border-2 border-gray-400 focus:border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                        ></textarea>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-400">
                                                        <button
                                                            onClick={() => setModel(false)}
                                                            style={{ fontFamily: "Montserrat" }}
                                                            className="cursor-pointer px-4 py-1.5 font-medium text-sm border border-gray-400 rounded-lg hover:bg-gray-100"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button style={{ fontFamily: "Montserrat" }} onClick={() => handleReply(singleReview._id)} className="cursor-pointer px-4 py-1.5 font-medium text-sm bg-[#2563EB] text-white rounded-lg hover:bg-blue-600">
                                                            {replyLoading ? "loading..." : "Send Reply"}
                                                        </button>
                                                    </div>
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
            </div >
        </div >
    )
}

export default Reviews