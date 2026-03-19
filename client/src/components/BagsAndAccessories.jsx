import React, { useRef, useState, Suspense } from 'react'
const ProductCard = React.lazy(() => import('./ProductCard'))
import loading_animation from '../../public/loading_animation.svg'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useEffect } from 'react';
import axios from 'axios';

const BagsAndAccessories = () => {
    const [products, setProducts] = useState([])
    const { backendUrl } = useContext(AppContext);
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                let response = await axios.get(`${backendUrl}/api/product/latest-category-products/${'Bags & Accessories'}`, { withCredentials: true })
                if (response.data) {
                    setProducts(response.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchCategoryProducts()
    }, [])
    return (
        <div className='container mx-auto px-4 mt-10'>
            <h6 className='text-[22px] tracking-[0.1px] mb-5 font-semibold'>Bags & Accessories</h6>
            <div className='md:block hidden'>
                {products.length > 0 ?
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
                        {products.reverse().map((product, index) => (
                            <SwiperSlide key={product.id}>
                                <div className="card">
                                    <Suspense key={index} fallback={<p>Loading...</p>}>
                                        <ProductCard product={product} />
                                    </Suspense>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper> : <img src={loading_animation} alt='loader' className='mx-auto' />}
            </div>
            <div className='products grid grid-cols-2 sm:gap-[18px] gap-4 md:hidden'>
                {products.length > 0 ? products.reverse().map((product, index) => (
                    <Suspense key={index} fallback={<p>Loading...</p>}>
                        <ProductCard product={product} />
                    </Suspense>
                )) : <img src={loading_animation} alt='loader' className='mx-auto' />}
            </div>
        </div>
    )
}

export default React.memo(BagsAndAccessories)