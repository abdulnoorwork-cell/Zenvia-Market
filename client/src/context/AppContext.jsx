import axios from "axios";
import React, { createContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const initAuthUser = localStorage.getItem('User');
    const [authenticated, setAuthenticated] = useState(initAuthUser ? JSON.parse(initAuthUser) : undefined)
    const token = authenticated?.token;
    const userId = authenticated?.data?.[0]._id;
    const isAdmin = localStorage.getItem('token');
    const [blogs, setBlogs] = useState([]);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([])
    const [totalCartItems,setTotalCartItems]=useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState([])
    const navigate = useNavigate()
    const currency = "Rs"
    const shippingFee = 150;
    const discount = 28
    const fetchBlogs = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/blog/get-blogs`, { withCredentials: true });
            if (response.data) {
                setBlogs(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const fetchProducts = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/product/get-products`, { withCredentials: true });
            if (response.data) {
                setProducts(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleSearchProducts = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/product/search-products?q=${search}`, { withCredentials: true });
            if (response.data) {
                setProducts(response.data)
                scrollTo(0, 0)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleClearSearch = () => {
        setSearch('');
        setProducts([]);
        fetchProducts();

    }
    const getCartItems = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/cart/getcartitems/${userId}`, {
                headers: {
                    Authorization: `${token}`
                },
                withCredentials: true
            })
            if (response.data) {
                setCartItems(response.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getTotalCartItems = async () => {
        try {
            let response=await axios.get(`${backendUrl}/api/cart/totalitems/${userId}`,{withCredentials:true});
            if(response.data){
                setTotalCartItems(response.data[0].total_items)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBlogs();
        fetchProducts();
        handleSearchProducts();
        getCartItems()
        getTotalCartItems()
        handleClearSearch()
    }, [])

    return (
        <AppContext.Provider value={{ navigate, userId, discount, backendUrl, token, shippingFee, blogs, isAdmin, products,setProducts, currency, handleSearchProducts, search, setSearch, cartItems, getCartItems,totalCartItems,getTotalCartItems,handleClearSearch }}>{children}</AppContext.Provider>
    )
}

export default React.memo(AppContextProvider);