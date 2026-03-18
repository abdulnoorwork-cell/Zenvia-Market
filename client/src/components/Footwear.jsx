import React, { useRef, useState } from 'react'
import ProductCard from './ProductCard'

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Footwear = () => {
    const {products} = useContext(AppContext);
    return (
        <div className='container mx-auto px-4 mt-10'>
            <h6 className='text-[22px] tracking-[0.1px] mb-5 font-semibold'>Footwear</h6>
            <div className='md:block hidden'>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={18}
                    loop={true}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1280: { slidesPerView: 5 },
                        1536: { slidesPerView: 6 },
                    }}
                >
                    {products.filter(product => product.category === "Footwear").slice(length - 10).reverse().map((product, index) => (
                        <SwiperSlide key={product.id}>
                            <div className="card">
                                <ProductCard key={index} product={product} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className='products grid grid-cols-2 sm:gap-[18px] gap-4 md:hidden'>
                {products.filter(product => product.category === "Footwear").slice(length - 4).reverse().map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default Footwear