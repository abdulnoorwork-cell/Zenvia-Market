import React, { useEffect, useRef, useState } from 'react'
const ProductCard = React.lazy(()=>import('./ProductCard'))
import loading_animation from '../../public/loading_animation.svg'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Suspense } from 'react';

const LatestProducts = () => {
    const { latestProducts } = useContext(AppContext);
    return (
        <div className='container mx-auto px-4 mt-10'>
            <h6 className='text-[22px] tracking-[0.1px] mb-4 font-semibold' style={{fontFamily:"Outfit"}}>Latest Products</h6>
            <div>
                {latestProducts.length > 0 ?
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={18}
                        loop={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            260: { slidesPerView: 2 },
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                            1280: { slidesPerView: 5 },
                            1536: { slidesPerView: 6 },
                        }}
                    >
                        {latestProducts.reverse().map((product, index) => (
                            <SwiperSlide key={product.id}>
                                <div className="card">
                                    <Suspense key={index}>
                                        <ProductCard product={product} />
                                    </Suspense>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper> : <img src={loading_animation} alt='loader' className='mx-auto' />}
            </div>
        </div>
    )
}

export default React.memo(LatestProducts)