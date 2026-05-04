import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdFormatListBulleted } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { IoHomeOutline } from "react-icons/io5";
import { BsCartPlus } from "react-icons/bs";
import { BsCartCheck } from "react-icons/bs";
import { RiBox3Line } from "react-icons/ri";
import { TfiWrite } from "react-icons/tfi";
import { CgHeart } from "react-icons/cg";
import { MdOutlineReviews } from "react-icons/md";

const Sidebar = () => {
    return (
        <div className='flex flex-col gap-2.5 bg-[#FFFFFF] px-5 border-r border-gray-200 min-h-full pt-7 text-[15px] font-medium'>
            <NavLink end={true} to={'/admin'} className={({ isActive }) => `flex items-center gap-2 p-3 xl:min-w-60 lg:min-w-52 md:min-w-48 cursor-pointer rounded-md ${isActive ? 'bg-[rgb(236,243,255)] text-[rgb(70,95,255)]' : 'text-gray-700'}`}>
                <span className='text-xl'><RxDashboard /></span>
                {/* <img src={home_icon} alt="" className='min-w-4 w-5' /> */}
                <h6 className='hidden md:inline-block text-sm'>Dashboard</h6>
            </NavLink>
            <NavLink end={true} to={'/admin/addproduct'} className={({ isActive }) => `flex items-center gap-2 p-3 xl:min-w-60 lg:min-w-52 md:min-w-48 cursor-pointer rounded-md ${isActive ? 'bg-[rgb(236,243,255)] text-[rgb(70,95,255)]' : 'text-gray-700'}`}>
                <span className='text-xl'><BsCartPlus /></span>
                {/* <img src={add_icon} alt="" className='min-w-4 w-5' /> */}
                <h6 className='hidden md:inline-block text-sm'>Add Product</h6>
            </NavLink>
            <NavLink end={true} to={'/admin/addblog'} className={({ isActive }) => `flex items-center gap-2 p-3 xl:min-w-60 lg:min-w-52 md:min-w-48 cursor-pointer rounded-md ${isActive ? 'bg-[rgb(236,243,255)] text-[rgb(70,95,255)]' : 'text-gray-700'}`}>
                <span className='text-xl'><TfiWrite /></span>
                {/* <img src={add_icon} alt="" className='min-w-4 w-5' /> */}
                <h6 className='hidden md:inline-block text-sm'>Add Blog</h6>
            </NavLink>
            <NavLink end={true} to={'/admin/listproduct'} className={({ isActive }) => `flex items-center gap-2 p-3 xl:min-w-60 lg:min-w-52 md:min-w-48 cursor-pointer rounded-md ${isActive ? 'bg-[rgb(236,243,255)] text-[rgb(70,95,255)]' : 'text-gray-700'}`}>
                <span className='text-xl'><BsCartCheck /></span>
                {/* <img src={list_icon} alt="" className='min-w-4 w-5' /> */}
                <h6 className='hidden md:inline-block text-sm'>Products List</h6>
            </NavLink>
            <NavLink end={true} to={'/admin/wishlist'} className={({ isActive }) => `flex items-center gap-2 p-3 xl:min-w-60 lg:min-w-52 md:min-w-48 cursor-pointer rounded-md ${isActive ? 'bg-[rgb(236,243,255)] text-[rgb(70,95,255)]' : 'text-gray-700'}`}>
                <span className='text-xl'><CgHeart /></span>
                {/* <img src={list_icon} alt="" className='min-w-4 w-5' /> */}
                <h6 className='hidden md:inline-block text-sm'>Wishlist</h6>
            </NavLink>
            <NavLink end={true} to={'/admin/listblog'} className={({ isActive }) => `flex items-center gap-2 p-3 xl:min-w-60 lg:min-w-52 md:min-w-48 cursor-pointer rounded-md ${isActive ? 'bg-[rgb(236,243,255)] text-[rgb(70,95,255)]' : 'text-gray-700'}`}>
                <span className='text-xl'><MdFormatListBulleted /></span>
                {/* <img src={list_icon} alt="" className='min-w-4 w-5' /> */}
                <h6 className='hidden md:inline-block text-sm'>Blog List</h6>
            </NavLink>
            <NavLink end={true} to={'/admin/listorders'} className={({ isActive }) => `flex items-center gap-2 p-3 xl:min-w-60 lg:min-w-52 md:min-w-48 cursor-pointer rounded-md ${isActive ? 'bg-[rgb(236,243,255)] text-[rgb(70,95,255)]' : 'text-gray-700'}`}>
                <span className='text-xl'><RiBox3Line /></span>
                {/* <img src={list_icon} alt="" className='min-w-4 w-5' /> */}
                <h6 className='hidden md:inline-block text-sm'>Order List</h6>
            </NavLink>
            <NavLink end={true} to={'/admin/reviews'} className={({ isActive }) => `flex items-center gap-2 p-3 xl:min-w-60 lg:min-w-52 md:min-w-48 cursor-pointer rounded-md ${isActive ? 'bg-[rgb(236,243,255)] text-[rgb(70,95,255)]' : 'text-gray-700'}`}>
                <span className='text-xl'><MdOutlineReviews /></span>
                {/* <img src={list_icon} alt="" className='min-w-4 w-5' /> */}
                <h6 className='hidden md:inline-block text-sm'>Reviews</h6>
            </NavLink>
            <NavLink end={true} to={'/'} className={({ isActive }) => `flex items-center gap-2 p-3 xl:min-w-60 lg:min-w-52 md:min-w-48 cursor-pointer rounded-md ${isActive && 'bg-[rgb(236,243,255)] text-[rgb(70,95,255)]'}`}>
                <span className='text-xl'><IoHomeOutline /></span>
                {/* <img src={list_icon} alt="" className='min-w-4 w-5' /> */}
                <h6 className='hidden md:inline-block text-sm leading-none'>Home</h6>
            </NavLink>
        </div>
    )
}

export default Sidebar