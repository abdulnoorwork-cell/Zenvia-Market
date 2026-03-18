import React from 'react'
import home_appliances from '../assets/home_appliances.webp';
import electronics_banner from '../assets/electronics-banner.webp'
import woman_fashion from '../assets/woman-fashion.webp'
import men_fashion from '../assets/man-fashion.webp'

const BannerProducts = () => {
  return (
    <div>
        <div className="container mx-auto px-4 grid grid-cols-3 gap-4 mt-12">
            <div className='flex flex-col gap-4'>
                <img src={home_appliances} className='rounded-lg w-full h-full cursor-pointer' alt="" />
                <img src={electronics_banner} className='rounded-lg w-full h-full cursor-pointer' alt="" />
            </div>
            <div>
               <img src={men_fashion} className='rounded-lg w-fit cursor-pointer' alt="" />
            </div>
            <div>
                <img src={woman_fashion} className='rounded-lg w-fit cursor-pointer' alt="" />
            </div>
        </div>
    </div>
  )
}

export default BannerProducts