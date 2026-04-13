import React, { useContext, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './MainLayout'
import Home from './pages/Home'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryProducts from './pages/CategoryProducts';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import Blogs from './pages/Blogs';
import MyAccount from './pages/MyAccount';
import ProductType from './pages/ProductType';
import AllProducts from './pages/AllProducts';
import SingleBlog from './pages/SingleBlog';
import SingleProduct from './pages/SingleProduct';
import { AppContext } from './context/AppContext';
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AdminLogin from './pages/admin/Login'
import AddBlog from './pages/admin/AddBlog';
import AddProduct from './pages/admin/AddProduct';
import ListBlog from './pages/admin/ListBlog'
import Orders from './pages/admin/Orders'
import ProductList from './pages/admin/ProductList'
import UpdateBlog from './pages/admin/UpdateBlog'

import 'quill/dist/quill.snow.css'
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OrderSuccessfull from './pages/OrderSuccessfull';
import Wishlist from './pages/Wishlist';
import WishlistProducts from './pages/admin/WishlistProducts';
import Reviews from './pages/admin/Reviews';
import OrderCancelled from './pages/OrderCancelled';

const App = () => {
  const { isAdmin, token, navigate } = useContext(AppContext);
  useEffect(() => {
    const interval = setInterval(() => {
      const expiryTime = localStorage.getItem("expiryTime");

      if (!expiryTime) return;

      if (Date.now() > expiryTime) {
        // ✅ AUTO LOGOUT
        localStorage.removeItem("User");
        localStorage.removeItem("expiryTime");

        window.location.href = "/login";
      }
    }, 60000); // check every 1 minute

    return () => clearInterval(interval);
  }, []);
  return (
    <div className='bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 min-h-screen'>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/my-account' element={token && <MyAccount />} />
          <Route path='/blog/:blog_id' element={<SingleBlog />} />
          <Route path='/shop/all-products' element={<AllProducts />} />
          <Route path='/shop/product/:product_id' element={<SingleProduct />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/checkout' element={token && <Checkout />} />
          <Route path='/category/clothing' element={<CategoryProducts category="Clothing & Style" />} />
          <Route path='/category/footwear' element={<CategoryProducts category="Footwear" />} />
          <Route path='/category/bags' element={<CategoryProducts category="Bags & Accessories" />} />
          <Route path='/category/home-decor' element={<CategoryProducts category="Home Decor" />} />
          <Route path='/category/electronics' element={<CategoryProducts category="Electronics & Gadgets" />} />
          <Route path='/category/beauty' element={<CategoryProducts category="Beauty & Wellness" />} />
          <Route path='/shop/clothing/men' element={<ProductType type="Men" />} />
          <Route path='/shop/clothing/women' element={<ProductType type="Women" />} />
          <Route path='/shop/clothing/kids' element={<ProductType type="Kids" />} />
          <Route path='/shop/footwear/formal-shoes' element={<ProductType type="Formal Shoes" />} />
          <Route path='/shop/footwear/casual-shoes' element={<ProductType type="Casual Shoes" />} />
          <Route path='/shop/footwear/sneakers' element={<ProductType type="Sneakers" />} />
          <Route path='/shop/bags-&-accessories/handbags' element={<ProductType type="Handbags" />} />
          <Route path='/shop/bags-&-accessories/crossbody-bags' element={<ProductType type="Crossbody Bags" />} />
          <Route path='/shop/bags-&-accessories/wallet' element={<ProductType type="Wallet" />} />
          <Route path='/shop/beauty-&-wellness/shampoo-&-facewashes' element={<ProductType type="Shampoo & Facewashes" />} />
          <Route path='/shop/beauty-&-wellness/skin-treatments' element={<ProductType type="Skin Treatments" />} />
          <Route path='/shop/beauty-&-wellness/haircolor-&-treatments' element={<ProductType type="Hair Color & Treatments" />} />
          <Route path='/shop/electronics-&-gadgets/mobile-&-computers' element={<ProductType type="Mobile & Computers" />} />
          <Route path='/shop/electronics-&-gadgets/watch-&-tv' element={<ProductType type="Smart Watch & Smart TV" />} />
          <Route path='/shop/electronics-&-gadgets/audio-&-accessories' element={<ProductType type="Audio & Accessories" />} />
        </Route>
        <Route path='/user/login' element={!token ? <Login /> : undefined} />
        <Route path='/success' element={<OrderSuccessfull />} />
        <Route path='/cancel' element={<OrderCancelled />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        {isAdmin ? <Route path='/admin' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='addblog' element={<AddBlog />} />
          <Route path='listblog' element={<ListBlog />} />
          <Route path='listproduct' element={<ProductList />} />
          <Route path='addproduct' element={<AddProduct />} />
          <Route path='updateblog/:blogId' element={<UpdateBlog />} />
          <Route path='listorders' element={<Orders />} />
          <Route path='wishlist' element={<WishlistProducts />} />
          <Route path='reviews' element={<Reviews />} />
        </Route> : <Route path='/admin' element={<AdminLogin />} />}
      </Routes>
      <Toaster />
    </div>
  )
}

export default App