import React, { useContext, useState,Suspense } from "react";
import { Star } from "lucide-react";
import { AppContext } from "../context/AppContext";
import profile_image from '../assets/profile_image.png'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const ReviewsSection = () => {
    const { allReviews, navigate } = useContext(AppContext)
    console.log(allReviews)
    return (
        <section className="pt-14 pb-2">
            <div className="container mx-auto px-4">
                {/* Heading */}
                <div className="text-center mb-8">
                    <p className="text-blue-600 font-semibold">Testimonials</p>
                    <h2 className="sm:text-3xl text-2xl font-bold tracking-tight leading-tight">
                        Customer Reviews
                    </h2>
                    <h6 className="text-gray-500 mt-0.5">
                        See what our happy customers are saying
                    </h6>
                </div>

                {/* Content */}
                <div className="h-full">
                    {allReviews.length > 0 ?
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={18}
                            loop={true}
                            autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                                1280: { slidesPerView: 4 },
                            }}
                        >
                            {allReviews.reverse().map((review, index) => (
                                <SwiperSlide key={index}>
                                    <div className="card">
                                        <Suspense key={index}>
                                            <div
                                                key={index}
                                                className="bg-white min-h-[250px] rounded-xl p-6 shadow-sm hover:shadow-md transition"
                                            >
                                                <div className="flex items-center gap-2 mb-4">
                                                    <img
                                                        src={review.profile_image ? review?.profile_image : profile_image}
                                                        alt={review.name}
                                                        className="w-14 h-14 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <h4 className="font-semibold text-base tracking-tight">
                                                            {review.name}
                                                        </h4>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-0.5">{[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={18} className={`${i < Math.round(review.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300 fill-gray-300"}`} />
                                                ))}</div>

                                                <h6 className="text-gray-600 mt-3 text-xs sm:text-sm">
                                                    "{review.comment}"
                                                </h6>

                                                <div className="mt-5 text-green-600 text-xs font-medium">
                                                    ✔ Verified Buyer
                                                </div>
                                            </div>
                                        </Suspense>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper> : ""}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;