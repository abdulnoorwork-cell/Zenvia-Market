import React, { useContext, useRef } from 'react'
import banner1 from '../assets/banner1.png'
import banner2 from '../assets/banner2.png'
import banner3 from '../assets/banner3.png'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import banner4 from '../assets/banner4.png'
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { HiOutlineArrowRight } from "react-icons/hi";
import { AppContext } from '../context/AppContext';

const Hero = () => {
    const banners = [
        {
            id: "1",
            label: 'Top Quality Sound Products',
            heading: "Premium Audio & Smart Accessories ",
            button: 'Shop Collection',
            content: "From immersive headphones to portable speakers and cutting-edge audio accessories, find the perfect gear for music, gaming, and entertainment.",
            image: banner1,
            link: '/shop/electronics-&-gadgets/audio-&-accessories'
        },
        {
            id: "2",
            label: 'Trending Beauty Products',
            heading: "Beauty & Wellness For a Healthier You",
            button: 'Beauty Collection',
            content: "Discover premium skincare, beauty essentials, and wellness products designed to nourish your skin, refresh your routine, and enhance your natural glow.",
            image: banner2,
            link: '/category/beauty'
        },
        {
            id: "3",
            label: 'Explore Latest Tech Accessories',
            heading: "Smart Computer & Mobile Accessories",
            button: 'Tech Accessories',
            content: "Discover powerful accessories for your computer and mobile devices including chargers, cables, keyboards, headphones, and smart gadgets designed to boost productivity and performance.",
            image: banner3,
            link: '/shop/electronics-&-gadgets/mobile-&-computers'
        },
        {
            id: "4",
            label: 'Latest Footwear Collection',
            heading: "Trendy Footwear For Every Step",
            button: 'Explore Shoes',
            content: "Discover premium footwear crafted for comfort, durability, and modern fashion. Perfect for casual wear, sports, and everyday adventures.",
            image: banner4,
            link: '/category/footwear'
        },
    ]
    const {navigate} = useContext(AppContext)
    return (
        <div className='relative border-b border-gray-200 bg-[linear-gradient(135deg,#f8fbff,#eef3ff)] min-h-[90vh] flex items-center to-indigo-100 2xl:py-28 pb-14 pt-6 overflow-hidden'>
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-10 right-20 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-30"></div>
            <div className='slider-container container mx-auto px-4'>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={0}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        // 320: { slidesPerView: 1 },
                        // 640: { slidesPerView: 2 },
                        // 768: { slidesPerView: 3 },
                        // 1024: { slidesPerView: 4 },
                        // 1280: { slidesPerView: 5 },
                        // 1536: { slidesPerView: 6 },
                    }}
                >
                    {banners.map((banner, index) => (
                        <SwiperSlide key={banner.id}>
                            <main
                                className="flex flex-col-reverse md:flex-row items-center max-md:text-center justify-between lg:px-14 max-w-7xl mx-auto w-full">
                                <div className="flex flex-col items-center md:items-start">
                                    <button
                                        className="mb-6 flex items-center space-x-2 border border-[#2563EB] text-[#2563EB] text-xs rounded-full px-4 pr-1.5 py-1.5 hover:bg-indigo-50 transition"
                                        type="button">
                                        <span>
                                             {banner.label}
                                        </span>
                                        <span className="flex items-center justify-center size-6 p-1 rounded-full bg-[#2563EB] text-white">
                                            <HiOutlineArrowRight />
                                        </span>
                                    </button>
                                    <h1 className="font-bold text-3xl sm:text-4xl 2xl:text-[40px] max-w-[500px]">
                                        {banner.heading}
                                        <span className="text-[#2563EB]">
                                            {banner.boldHeading}
                                        </span>
                                    </h1>
                                    <p className="mt-4 max-w-[500px] sm:text-sm text-[13px] leading-relaxed">
                                        {banner.content}
                                    </p>
                                    <div className="mt-8">
                                        <button onClick={()=>{navigate(banner.link);scrollTo(0,0)}}
                                            className="cursor-pointer gap-1.5 bg-[#2563EB] text-white px-10 py-3 rounded-xl uppercase text-sm flex items-center space-x-2 hover:bg-blue-700 transition font-medium sm:text-sm text-xs"
                                            type="button">
                                            {banner.button}
                                            <span className='text-xl'><HiOutlineArrowNarrowRight /></span>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <img alt="" className="hover:scale-105 transition duration-300 max-w-[280px] md:max-w-[100%]"
                                        src={banner.image} />
                                </div>
                            </main>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default Hero