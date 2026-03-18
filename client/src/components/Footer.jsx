import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'

const Footer = () => {

  return (
    <div className='pt-16 mt-13 border-t bg-[#0F172A]'>
      <div className="container mx-auto px-4 lg:flex grid sm:grid-cols-3 grid-cols-2 gap-7 justify-between">
        <div>
          <div onClick={() => { navigate('/'); scrollTo(0, 0) }} className="cursor-pointer flex items-center gap-1.5">
            <img src={logo} className='h-14' alt="" />
            <div className="logo leading-none sm:text-3xl text-2xl cursor-pointer font-medium text-white" style={{ fontFamily: 'Urbanist' }}>
              Zenvia<span className='text-[#2563EB] font-semibold tracking-[-0.2px]' style={{ fontFamily: 'Poppins' }}> Market</span>
            </div>
          </div>
          <h6 className='max-w-[320px] mt-5 text-[#CBD5F5] text-[13px]'>Welcome to Zenvia Market, where quality meets convenience. We bring you carefully selected products, secure shopping, and fast delivery—all in one place.</h6>
        </div>
        <div>
          <h5 className='font-medium text-lg text-white'>Shop</h5>
          <div className='text-[13px] flex flex-col gap-2 mt-3 text-[#CBD5F5]'>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Clothing</Link>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Footwear</Link>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Bags & Accessories</Link>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Beauty & Wellness</Link>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Electronics</Link>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Home Decor</Link>
          </div>
        </div>
        <div>
          <h5 className='font-medium text-lg text-white sm:block hidden'>Customer Policies</h5>
          <h5 className='font-medium text-lg text-white sm:hidden block'>Policy</h5>
          <div className='text-[13px] flex flex-col gap-2 mt-3 text-[#CBD5F5]'>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Privacy Policy</Link>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Terms & Conditions</Link>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Refund Policy</Link>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Payments & Shipping</Link>
          </div>
        </div>
        <div>
          <h5 className='font-medium text-lg text-white'>Info</h5>
          <div className='text-[13px] flex flex-col gap-2 mt-3 text-[#CBD5F5]'>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Contact</Link>
            <Link className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>FaQs</Link>
            <Link onClick={() => scrollTo(0, 0)} to={'/blogs'} className='hover:text-[#2563EB] transition' style={{ fontFamily: 'Inter' }}>Blogs</Link>
          </div>
        </div>
      </div>
      <div className='text-[#CBD5F5] flex items-center gap-5 py-3 justify-center border-t border-[rgba(192,193,196,0.28)] mt-16'>
        <h6 className='sm:text-sm text-xs'>Copyright © AbdulNoor. All rights reserved.</h6>
      </div>
    </div>
  )
}

export default Footer