import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar';
import { AppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useContext } from 'react';
import { BiLogOut } from "react-icons/bi";

const Layout = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    toast.success('Logout Successfully')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
  return (
    <>
      <div className='flex items-center justify-between py-3 px-4 sm:px-12 border-b border-[rgba(192,193,196,0.28)] gap-2 bg-[#FFFFFF]'>
        <div onClick={() => { navigate('/admin'); scrollTo(0, 0) }} className="logo leading-none sm:text-3xl text-2xl cursor-pointer">
          Admin<span className='text-[#2563EB] font-bold'> Panel</span>
        </div>
        <button onClick={logout} type='submit' className='sm:text-sm text-xs px-7 w-fit py-[10px] bg-orange-500 text-white rounded-full cursor-pointer font-medium flex items-center gap-1'><span className='text-lg'><BiLogOut /></span>Logout</button>
      </div>
      <div className='flex min-h-[95vh]'>
        <Sidebar />
        <Outlet />
      </div>
    </>
  )
}

export default Layout