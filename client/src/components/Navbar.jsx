import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg'
import { FiHeart, FiSearch } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa6";
import { AppContext } from '../context/AppContext'
import { RiMenu3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FaTshirt } from "react-icons/fa";
import { PiSneakerFill } from "react-icons/pi";
import { FaBagShopping } from "react-icons/fa6";
import { RiBrushAiFill } from "react-icons/ri";
import { RiComputerFill } from "react-icons/ri";
import { RiArmchairFill } from "react-icons/ri";
import { AiFillProduct } from "react-icons/ai";
import { FaCommentDots } from "react-icons/fa6";
import { BsTelephoneFill } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { ImSearch } from "react-icons/im";
import { BiSolidUser } from "react-icons/bi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import loading_animation from '../../public/loading_animation.svg'
import { TbLoader2 } from "react-icons/tb";
import { RiAdminLine } from "react-icons/ri";

const Navbar = () => {

    const [sticky, setSticky] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false);
    const [searchBox, setSearchBox] = useState(false)
    const [clothing, setClothing] = useState(false)
    const [footwear, setFootwear] = useState(false)
    const [bags, setBags] = useState(false)
    const [beauty, setBeauty] = useState(false)
    const [electronics, setElectronics] = useState(false)
    const { navigate, token, handleSearchProducts, query, setQuery, suggestions, setSuggestions, totalCartItems, handleClearSearch, wishlist,searchLoading,setSearchLoading,suggestionLoading,setSuggestionLoading } = useContext(AppContext)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            setSticky(true)
        } else {
            setSticky(false)
        }
    })

    return (
        <>
            <div className='bg-blue-800/80 text-white text-center sm:text-[13px] text-xs p-2 flex items-center justify-center gap-2 px-4'><span className='sm:text-xl text-lg'><TbTruckDelivery /></span> <span>Free Shipping on Orders Over Rs.2000!</span></div>
            <div className={`sticky top-0 flex items-center justify-between bg-[#FFFFFF] py-2 border-b z-40 border-[#E2E8F0] ${sticky ? "shadow-[0_10px_30px_rgba(0,0,0,0.1)]" : "bg-[#FFFFFF]"}`}>
                <nav className='container mx-auto px-4 flex items-center justify-between'>
                    <div onClick={() => { navigate('/'); scrollTo(0, 0) }} className="cursor-pointer flex items-center gap-1.5">
                        <img src={logo} className='h-13' alt="" />
                        <div className="logo leading-none sm:text-3xl text-2xl cursor-pointer font-medium text-blue-950/80" style={{ fontFamily: 'Urbanist' }}>
                            Zenvia<span className='text-[#2563EB] font-semibold tracking-[-0.2px]' style={{ fontFamily: 'Poppins' }}> Market</span>
                        </div>
                    </div>
                    <div className="search relative hidden lg:flex items-center w-full max-w-[500px] 2l:h-[45px] h-10">
                        <div className='flex items-center justify-between w-full h-full px-3 py-2 rounded-tl-md rounded-bl-md border border-gray-300'>
                            <input type="text" placeholder='Search Products...' value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => {
                                if (e.key === "Enter" || e.keyCode === 13) {
                                    e.preventDefault();
                                    handleSearchProducts();
                                    setQuery('')
                                }
                                if (e.key === "Backspace") {
                                    e.preventDefault();
                                    setQuery("")
                                    setSuggestions([])
                                    handleClearSearch()
                                }
                            }} className='text-xs 2xl:text-[13.2px] outline-none w-full h-full font-medium' style={{ fontFamily: 'Poppins' }} />
                            {suggestionLoading ? <span className='text-lg animate-spin'><TbLoader2 /></span> : <span onClick={(handleClearSearch)} className={`text-lg cursor-pointer text-green-800/80 ${query !== "" ? 'block' : 'hidden'}`}><IoClose /></span>}
                        </div>
                        <span onClick={handleSearchProducts} className='text-xl cursor-pointer bg-blue-500 text-white h-full w-[50px] flex items-center justify-center rounded-tr-md rounded-br-md'>
                            <ImSearch />
                        </span>
                        {query && suggestions.length > 0 &&
                            <div className="suggestions absolute top-[45px] rounded-md shadow left-0 bg-white w-full border border-[#E2E8F0]">
                                <ul className='px-3 w-full'>
                                    {suggestions?.map((v, i) => (
                                        <li key={i} onClick={() => {
                                            setQuery("");  // select suggestion
                                            setSearchBox(false);
                                            navigate(`/shop/product/${v._id}`)
                                        }} className='cursor-pointer flex items-center gap-1 w-full border-b border-[#E2E8F0]'>
                                            <img src={v?.images[0]} className='w-14 h-14 object-contain' alt="" />
                                            <h6 className='text-[13px]'>{v.name}</h6>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => { handleSearchProducts(); setSearchBox(false); setQuery(''); setSuggestions([]) }} className='cursor-pointer text-white bg-[#2563EB] px-4 py-2 mx-auto my-2 text-xs rounded ml-2'>View All Result</button>
                            </div>
                        }
                    </div>
                    <Link className='border border-gray-500 px-4 py-1.5 text-xs xl:block hidden' to={'/admin'} onClick={()=>scrollTo(0,0)}>Admin Panel</Link>
                    <div className='header_icons flex items-center gap-3 sm:gap-4 font-medium'>
                        {/* Search Icon */}
                        <span onClick={() => setSearchBox(true)} className='text-base cursor-pointer relative bg-gray-100 border border-[#E5E7EB] p-2 sm:p-2.5 flex items-center justify-center rounded-full max-lg:block hidden'><FiSearch /></span>
                        <Link to={'/wishlist'} onClick={() => scrollTo(0, 0)} className='relative flex items-center text-blue-950/80 gap-1 cursor-pointer'>
                            <span className='text-[22px] text-blue-950/80'>
                                <FiHeart />
                                <small className='absolute top-1.5 -right-1 bg-red-500 text-white sm:text-[10px] text-[9px] rounded-full px-[3px] py-[2px] min-w-[14px] text-center leading-none' style={{ fontFamily: 'Montserrat' }}>{wishlist.length > 0 ? wishlist.length : "0"}</small>
                            </span>
                        </Link>
                        <Link to={'/cart'} onClick={() => scrollTo(0, 0)} className='relative flex items-center text-blue-950/80 gap-1 cursor-pointer'>
                            <span className='text-[22px] text-blue-950/80'>
                                <HiOutlineShoppingBag />
                                <small className='absolute top-1.5 -right-1.5 bg-blue-500 text-white sm:text-[10px] text-[9px] rounded-full px-[3px] py-[2px] min-w-[14px] text-center leading-none' style={{ fontFamily: 'Montserrat' }}>{totalCartItems > 0 ? totalCartItems : "0"}</small>
                            </span>
                        </Link>
                        {token ?
                            <Link to={'/my-account'} onClick={() => scrollTo(0, 0)} className='flex items-center text-blue-950/80 gap-1 cursor-pointer'>
                                <span className='text-[22px] text-blue-950/80'>
                                    <BiSolidUser />
                                </span>
                                <h6 className='hidden xl:block leading-none text-sm font-medium' style={{ fontFamily: 'Montserrat' }}>Account</h6>
                            </Link> :
                            <Link to={'/user/login'} onClick={() => scrollTo(0, 0)} className='flex items-center text-blue-950/80 gap-1 cursor-pointer'>
                                <span className='text-[22px] text-blue-950/80'>
                                    <BiSolidUser />
                                </span>
                                <h6 className='leading-none text-sm font-medium sm:block hidden' style={{ fontFamily: 'Montserrat' }}>Account</h6>
                            </Link>}
                        <span onClick={() => setMobileMenu(true)} className='cursor-pointer text-xl xl:hidden block text-blue-950/90'><RiMenu3Fill /></span>
                        <span onClick={() => setMobileMenu(true)} className={`cursor-pointer text-xl text-blue-950/90 ${sticky ? 'xl:block hidden' : 'hidden'}`}><RiMenu3Fill /></span>
                    </div>
                </nav>
            </div>
            <div className={`relative hidden xl:block border-b border-[#E2E8F0] bg-[#FFFFFF] z-20 text-[13.4px] transition duration-100 font-medium ${sticky ? "translate-y-[-100%]" : ""}`}>
                <div className='container mx-auto px-4'>
                    <div className='flex items-center gap-6 text-blue-950'>
                        <div className='group'>
                            <NavLink className={"flex items-center gap-2 py-2 hover:text-[#2563EB] transition-all duration-150"}>Clothing & Style <span><FaAngleDown /></span></NavLink>
                            <div className={`w-full opacity-0 invisible -z-10 group-hover:opacity-100 py-0 group-hover:py-8 group-hover:z-10 transition-all group-hover:opacity-100 group-hover:visible duration-300 bg-[#FFFFFF] border-t border-b border-[rgba(192,193,196,0.28)] absolute top-[100%] left-0`}>
                                <div className='container mx-auto px-4 flex items-center gap-24'>
                                    <ul className='flex flex-col'>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/clothing/men'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Men</NavLink>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/clothing/women'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Women</NavLink>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/clothing/kids'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Kids</NavLink>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='group'><NavLink className={"flex items-center gap-2 py-2 hover:text-[#2563EB] transition-all duration-150"}>Footwear <span><FaAngleDown /></span></NavLink>
                            <div className={`w-full opacity-0 invisible -z-10 group-hover:opacity-100 py-0 group-hover:py-8 group-hover:z-10 transition-all group-hover:opacity-100 group-hover:visible duration-300 bg-[#FFFFFF] border-t border-b border-[rgba(192,193,196,0.28)] absolute top-[100%] left-0`}>
                                <div className='container mx-auto px-4 flex items-center gap-24'>
                                    <ul className='flex flex-col'>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/footwear/formal-shoes'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Formal Shoes</NavLink>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/footwear/casual-shoes'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Casual Shoes</NavLink>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/footwear/sneakers'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Sneakers</NavLink>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='group'><NavLink className={"flex items-center gap-2 py-2 hover:text-[#2563EB] transition-all duration-150"}>Bags & Accessories <span><FaAngleDown /></span></NavLink>
                            <div className={`w-full opacity-0 invisible -z-10 group-hover:opacity-100 py-0 group-hover:py-8 group-hover:z-10 transition-all group-hover:opacity-100 group-hover:visible duration-300 bg-[#FFFFFF] border-t border-b border-[rgba(192,193,196,0.28)] absolute top-[100%] left-0`}>
                                <div className='container mx-auto px-4 flex gap-24'>
                                    <ul className='flex flex-col'>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/bags-&-accessories/handbags'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Handbags</NavLink>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/bags-&-accessories/crossbody-bags'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Crossbody Bags</NavLink>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/bags-&-accessories/wallet'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Wallet</NavLink>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='group'><NavLink className={"flex items-center gap-2 py-2 hover:text-[#2563EB] transition-all duration-150"}>Beauty & Wellness <span><FaAngleDown /></span></NavLink>
                            <div className={`w-full opacity-0 invisible -z-10 group-hover:opacity-100 py-0 group-hover:py-8 group-hover:z-10 transition-all group-hover:opacity-100 group-hover:visible duration-300 bg-[#FFFFFF] border-t border-b border-[rgba(192,193,196,0.28)] absolute top-[100%] left-0`}>
                                <div className='container mx-auto px-4 flex items-center gap-24'>
                                    <ul className='flex flex-col'>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/beauty-&-wellness/shampoo-&-facewashes'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Shampoo & Facewashes</NavLink>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/beauty-&-wellness/skin-treatments'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Skin Treatments</NavLink>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/beauty-&-wellness/haircolor-&-treatments'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Hair Color & Treatments</NavLink>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='group'><NavLink className={"flex items-center gap-2 py-2 hover:text-[#2563EB] transition-all duration-150"}>Electronics & Gadgets <span><FaAngleDown /></span></NavLink>
                            <div className={`w-full opacity-0 invisible -z-10 group-hover:opacity-100 py-0 group-hover:py-8 group-hover:z-10 transition-all group-hover:opacity-100 group-hover:visible duration-300 bg-[#FFFFFF] border-t border-b border-[rgba(192,193,196,0.28)] absolute top-[100%] left-0`}>
                                <div className='container mx-auto px-4 flex items-center gap-24'>
                                    <ul className='flex flex-col'>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/electronics-&-gadgets/mobile-&-computers'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Mobile & Computers</NavLink>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/electronics-&-gadgets/watch-&-tv'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Watch & TVs</NavLink>
                                        <NavLink onClick={() => scrollTo(0, 0)} to={'/shop/electronics-&-gadgets/audio-&-accessories'} className={"py-1.5 hover:text-[#2563EB] transition-all duration-150"}>Audio & Accessories</NavLink>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div><NavLink onClick={() => scrollTo(0, 0)} to={'/category/home-decor'} className={"py-2 hover:text-[#2563EB] transition-all duration-150"}>Home Decor</NavLink></div>
                        <div><NavLink onClick={() => scrollTo(0, 0)} to={'/shop/all-products'} className={"py-2 hover:text-[#2563EB] transition-all duration-150"}>All Products</NavLink></div>
                        <div><NavLink onClick={() => scrollTo(0, 0)} to={'/about'} className={"py-2 hover:text-[#2563EB] transition-all duration-150"}>About us</NavLink></div>
                        <div><NavLink onClick={() => scrollTo(0, 0)} to={'/blogs'} className={"py-2 hover:text-[#2563EB] transition-all duration-150"}>Blogs</NavLink></div>
                        <div><NavLink onClick={() => scrollTo(0, 0)} to={'/contact'} className={"py-2 hover:text-[#2563EB] transition-all duration-150"}>Contact us</NavLink></div>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            <div className={`bg-white w-[90%] max-w-[400px] fixed top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 px-5 py-12 rounded text-gray-800 flex flex-col justify-center gap-2 z-50 text-sm transition-all duration-150 ${mobileMenu ? 'flex flex-col' : 'hidden'}`}>
                <span onClick={() => setMobileMenu(false)} className='absolute top-0 right-0 bg-red-500 text-white text-base px-1.5 py-1 cursor-pointer'><IoClose /></span>
                <h3 className='text-xl font-bold tracking-[-0.2px] mb-3' style={{ fontFamily: 'Montserrat' }}>Categories</h3>
                <NavLink onClick={() => { setClothing(!clothing); setFootwear(false); setBags(false); setBeauty(false); setElectronics(false) }} className='group'>
                    <div className={`flex items-center gap-2 justify-between p-2 hover:text-white hover:bg-[#2563EB] transition-all duration-150 border rounded ${clothing ? 'bg-[#2563EB] text-white' : 'border-[#E5E7EB] bg-[#e4e4f56c]'}`}>
                        <div style={{ fontFamily: 'Montserrat' }} className='font-medium flex items-center gap-2'><span className='text-xl text-blue-950/90'><FaTshirt /></span>Clothing & Style</div><span><FaAngleDown /></span>
                    </div>
                    <ul className={`text-gray-600 pl-2 text-[13px] font-medium ${clothing ? 'flex flex-col' : 'hidden'}`}>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/clothing/men'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Men</NavLink>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/clothing/women'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Women</NavLink>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/clothing/kids'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Kids</NavLink>
                    </ul>
                </NavLink>
                <NavLink onClick={() => { setFootwear(!footwear); setClothing(false); setBags(false); setBeauty(false); setElectronics(false) }} className='group'>
                    <div className={`flex items-center gap-2 justify-between p-2 hover:text-white hover:bg-[#2563EB] transition-all duration-150 border rounded ${footwear ? 'bg-[#2563EB] text-white' : 'border-[#E5E7EB] bg-[#e4e4f56c]'}`}>
                        <div style={{ fontFamily: 'Montserrat' }} className='font-medium flex items-center gap-2'><span className='text-xl text-blue-950/90'><PiSneakerFill /></span>Footwear</div> <span><FaAngleDown /></span>
                    </div>
                    <ul className={`text-gray-600 pl-2 text-[13px] font-medium ${footwear ? 'flex flex-col' : 'hidden'}`}>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/footwear/formal-shoes'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Formal Shoes</NavLink>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/footwear/casual-shoes'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Casual Shoes</NavLink>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/footwear/sneakers'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Sneakers</NavLink>
                    </ul>
                </NavLink>
                <NavLink onClick={() => { setBags(!bags); setFootwear(false); setClothing(false); setBeauty(false); setElectronics(false) }} className='group'>
                    <div className={`flex items-center gap-2 justify-between p-2 hover:text-white hover:bg-[#2563EB] transition-all duration-150 border rounded ${bags ? 'bg-[#2563EB] text-white' : 'border-[#E5E7EB] bg-[#e4e4f56c]'}`}>
                        <div style={{ fontFamily: 'Montserrat' }} className='font-medium flex items-center gap-2'><span className='text-xl text-red-700/70'><FaBagShopping /></span>Bags & Accessories</div> <span><FaAngleDown /></span>
                    </div>
                    <ul className={`text-gray-600 pl-2 text-[13px] font-medium ${bags ? 'flex flex-col' : 'hidden'}`}>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/bags-&-accessories/handbags'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Handbags</NavLink>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/bags-&-accessories/crossbody-bags'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Crossbody Bags</NavLink>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/bags-&-accessories/wallet'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Wallet</NavLink>
                    </ul>
                </NavLink>
                <NavLink onClick={() => { setBeauty(!beauty); setFootwear(false); setBags(false); setClothing(false); setElectronics(false) }} className='group'>
                    <div className={`flex items-center gap-2 justify-between p-2 hover:text-white hover:bg-[#2563EB] transition-all duration-150 border rounded ${beauty ? 'bg-[#2563EB] text-white' : 'border-[#E5E7EB] bg-[#e4e4f56c]'}`}>
                        <div style={{ fontFamily: 'Montserrat' }} className='font-medium flex items-center gap-2'><span className='text-xl text-pink-400'><RiBrushAiFill /></span>Beauty & Wellness</div> <span><FaAngleDown /></span>
                    </div>
                    <ul className={`text-gray-600 pl-2 text-[13px] font-medium ${beauty ? 'flex flex-col' : 'hidden'}`}>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/beauty-&-wellness/shampoo-&-facewashes'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Shampoo & Facewashes</NavLink>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/beauty-&-wellness/skin-treatments'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Skin Treatments</NavLink>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/beauty-&-wellness/haircolor-&-treatments'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Hair Color & Treatments</NavLink>
                    </ul>
                </NavLink>
                <NavLink onClick={() => { setElectronics(!electronics); setFootwear(false); setBags(false); setBeauty(false); setClothing(false) }} className='group'>
                    <div className={`flex items-center gap-2 justify-between p-2 hover:text-white hover:bg-[#2563EB] transition-all duration-150 border rounded ${electronics ? 'bg-[#2563EB] text-white' : 'border-[#E5E7EB] bg-[#e4e4f56c]'}`}>
                        <div style={{ fontFamily: 'Montserrat' }} className='font-medium flex items-center gap-2'><span className='text-xl text-cyan-600'><RiComputerFill /></span>Electronics & Gadgets</div> <span><FaAngleDown /></span>
                    </div>
                    <ul className={`text-gray-600 pl-2 text-[13px] font-medium ${electronics ? 'flex flex-col' : 'hidden'}`}>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/electronics-&-gadgets/mobile-&-computers'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Mobile & Computers</NavLink>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/electronics-&-gadgets/watch-&-tv'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Watch & TVs</NavLink>
                        <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/electronics-&-gadgets/audio-&-accessories'} className={"p-2 border-b border-gray-300/90 rounded"} style={{ fontFamily: 'Montserrat' }}>Audio & Accessories</NavLink>
                    </ul>
                </NavLink>
                <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/category/home-decor'} className={'p-2 hover:text-white hover:bg-[#2563EB] transition-all duration-150 rounded border border-[#E5E7EB] bg-[#e4e4f56c]'}><div style={{ fontFamily: 'Montserrat' }} className='font-medium flex items-center gap-2'><span className='text-xl text-amber-800/70'><RiArmchairFill />
                </span>Home Decor</div></NavLink>
                <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/shop/all-products'} className={'p-2 hover:text-white hover:bg-[#2563EB] transition-all duration-150 rounded border border-[#E5E7EB] bg-[#e4e4f56c]'}><div style={{ fontFamily: 'Montserrat' }} className='font-medium flex items-center gap-2'><span className='text-xl text-sky-700'><AiFillProduct />
                </span>All Products</div></NavLink>
                <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/about'} className={'p-2 hover:text-white hover:bg-[#2563EB] transition-all duration-150 rounded border border-[#E5E7EB] bg-[#e4e4f56c]'}><div style={{ fontFamily: 'Montserrat' }} className='font-medium flex items-center gap-2'><span className='text-xl text-orange-700/70'><FaUserCheck />
                </span>About us</div></NavLink>
                <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/blogs'} className={'p-2 hover:text-white hover:bg-[#2563EB] transition-all duration-150 rounded border border-[#E5E7EB] bg-[#e4e4f56c]'}><div style={{ fontFamily: 'Montserrat' }} className='font-medium flex items-center gap-2'><span className='text-xl text-gray-500/70'><FaCommentDots />
                </span>Blogs</div></NavLink>
                <NavLink onClick={() => { scrollTo(0, 0); setMobileMenu(false) }} to={'/contact'} className={'p-2 hover:text-white hover:bg-[#2563EB] transition-all duration-150 rounded border border-[#E5E7EB] bg-[#e4e4f56c]'}><div style={{ fontFamily: 'Montserrat' }} className='font-medium flex items-center gap-2'><span className='text-xl text-green-700/70'><BsTelephoneFill />
                </span>Contact us</div></NavLink>
                <Link className='p-2 flex items-center gap-2 text-white bg-[#2563EB] transition-all duration-150 rounded border font-medium' to={'/admin'} onClick={()=>scrollTo(0,0)} style={{fontFamily:'Montserrat'}}><span className='text-xl text-green-700/70'><RiAdminLine /></span> Admin Panel</Link>
            </div>
            {/* Mobile Search Box */}
            <div className={`relative ${searchBox ? 'flex lg:hidden' : 'hidden'}`}>
                <div className={`search flex items-center w-[90%] max-w-[500px] h-[50px] fixed top-[30%] left-1/2 -translate-x-1/2 z-50`}>
                    <div className='flex items-center justify-between w-full h-full px-3 py-2 rounded-tl-md rounded-bl-md border border-gray-300/90 bg-white'>
                        <input type="text" placeholder='Search Products...' value={query} onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.keyCode === 13) {
                                    e.preventDefault();
                                    handleSearchProducts();
                                    setSearchBox(false);
                                    setQuery('')
                                }
                                if (e.key === "Backspace") {
                                    e.preventDefault();
                                    setQuery("")
                                    setSuggestions([])
                                    handleClearSearch()
                                }
                            }} className='text-xs 2xl:text-[13.2px] outline-none w-full h-full font-medium' style={{ fontFamily: 'Poppins' }} />
                        {suggestionLoading ? <span className='text-lg animate-spin'><TbLoader2 /></span> : <span onClick={(handleClearSearch)} className={`text-lg cursor-pointer text-green-800/80 ${query !== "" ? 'block' : 'hidden'}`}><IoClose /></span>}
                    </div>
                    <span onClick={() => { handleSearchProducts(); setSearchBox(false); }} className='text-xl cursor-pointer bg-blue-500 text-white h-full w-[50px] flex items-center justify-center rounded-tr-md rounded-br-md'>
                        <ImSearch />
                    </span>
                    {query && suggestions.length > 0 &&
                        <div className="suggestions absolute top-[45px] rounded-md shadow left-0 bg-white w-full border border-[#E2E8F0]">
                            <ul className='px-3 w-full overflow-y-auto max-h-[300px]'>
                                {suggestions?.map((v, i) => (
                                    <li key={i} onClick={() => {
                                        setQuery("");  // select suggestion
                                        setSearchBox(false);
                                        navigate(`/shop/product/${v._id}`)
                                    }} className='cursor-pointer flex items-center gap-1 w-full border-b border-[#E2E8F0]'>
                                        <img src={v?.images[0]} className='w-14 h-14 object-contain' alt="" />
                                        <h6 className='text-[13px]'>{v.name}</h6>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => { handleSearchProducts(); setSearchBox(false); setQuery(''); setSuggestions('') }} className='cursor-pointer text-white bg-[#2563EB] px-4 py-2 mx-auto my-2 text-xs rounded ml-2'>View All Result</button>
                        </div>
                    }
                </div>
            </div>
            {/* Overlay */}
            <div onClick={() => {
                setMobileMenu(false);
                setSearchBox(false);
                setQuery("");
                setSuggestions([]);
                handleClearSearch();
                setSearchLoading(false);
            }} className={`fixed top-0 left-0 w-full h-screen bg-[#0f0b25af] backdrop-blur-[0.6px] z-40 ${mobileMenu || searchBox || searchLoading ? 'block' : 'hidden'}`}></div>
            {/* Loader */}
            <img src={loading_animation} alt='loader' className={`fixed top-2/4 left-2/4 z-50 -translate-y-2/4 -translate-x-2/4 ${searchLoading ? "block" : "hidden"}`} />
        </>
    )
}

export default Navbar