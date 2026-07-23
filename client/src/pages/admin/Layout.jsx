import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar';
import { AppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useContext } from 'react';
import { BiLogOut } from "react-icons/bi";
import { IoHomeSharp } from 'react-icons/io5';
import blank_profile from '../../assets/blank-profile.png'

const Layout = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    toast.success('Logout Successfully')
    setTimeout(() => {
      window.location.href = '/admin'
    }, 1000)
  }
  return (
    <div className=''>
      <div className='flex items-center justify-between py-2 px-5 gap-2 bg-black text-white'>
        <div onClick={() => { navigate('/dashboard'); scrollTo(0, 0) }} className="logo flex items-end gap-1.5 leading-none cursor-pointer text-white tracking-tight">
          <span className='text-base'>
            <IoHomeSharp />
          </span>
          <sapn className='sm:text-sm text-[13px] leading-none'>Dashboard</sapn>
        </div>
        <button onClick={logout} type='submit' className='sm:text-sm text-[13px] text-white rounded-md cursor-pointer flex items-center gap-1 font-medium'><span className='text-lg'><BiLogOut /></span>Logout</button>
        {/* <div className='flex items-center gap-1.5 cursor-pointer'>
          <span className='sm:text-sm text-xs'>Abdul Hasnat</span>
          <img src={blank_profile} className='w-6 h-6' alt="profile" />
        </div> */}
      </div>
      <div className='flex min-h-[96vh] bg-[#f0f0f0]'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout