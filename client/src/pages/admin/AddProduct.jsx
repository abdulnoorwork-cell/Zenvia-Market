import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import upload_area from '../../assets/upload_area.svg'
import { useContext } from 'react';
import Quill from 'quill'
import { MdCloudUpload } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";

const AddProduct = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null)
  const editorRef2 = useRef(null);
  const quillRef2 = useRef(null)
  const navigate = useNavigate()
  const { backendUrl, isAdmin, fetchProducts } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [about, setAbout] = useState('');
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState();
  const [offerPrice, setOfferPrice] = useState();
  const [sizes, setSizes] = useState([]);
  const [footwear_sizes, setfootwear_Sizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState([])

  const file = useRef()

  const imagesHandler = async (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewImage(previewUrls)
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
        reader.onload = error => reject(error);
      }
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      const base64Images = [];

      for (const img of images) {
        const base64 = await convertBase64(img);
        base64Images.push(base64);
      }
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('about', quillRef.current.root.innerHTML);
      formData.append('description', quillRef2.current.root.innerHTML);
      formData.append('price', price);
      formData.append('offerPrice', offerPrice);
      base64Images.forEach((img) => {
        formData.append("images", img);
      })
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('footwear_sizes', JSON.stringify(footwear_sizes));
      formData.append('colors', JSON.stringify(colors));

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      })
      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        setImages(upload_area);
        setName('');
        setAbout('')
        setCategory('');
        setSubCategory('');
        setPrice('');
        setOfferPrice('')
        setSizes([]);
        setfootwear_Sizes([]);
        setColors([]);
        quillRef.current.root.innerHTML = ''
        quillRef2.current.root.innerHTML = ''
        fetchProducts()
        setTimeout(() => {
          navigate('/admin/listproduct')
        }, 1000)
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error)
      // if (error.response.status === 500) {
      //   localStorage.removeItem('token');
      //   window.location.href = "/admin"
      // }
      toast.error(error.response.data.message)
    }
  }

  // initiate Quill only once
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
    if (!quillRef2.current && editorRef2.current) {
      quillRef2.current = new Quill(editorRef2.current, { theme: 'snow' })
    }
  }, [])

  return (
    <form onSubmit={onSubmitHandler} className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 text-gray-600 h-full min-h-[85vh]'>
      <div className='w-full max-w-5xl bg-white rounded-2xl shadow-lg sm:p-8 p-6'>
        {/* Header */}
        <div className="mb-6 lg:block hidden">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Add Product
            </h2>
            <h6 className='text-gray-500/90'>Fill in the details below to add new product</h6>
          </div>
        </div>
        <div className="flex flex-col sm:gap-5 gap-4">
          <div className='grid sm:grid-cols-2 sm:gap-5 gap-4 h-full'>
            {/* Upload */}
            <div className='h-full w-full'>
              {previewImage.length < 1 ? <div onClick={() => file.current.click()} className="flex flex-col items-center justify-center h-full border-2 border-dashed border-[#E2E8F0] bg-gray-50 rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer">
                <span className='text-3xl text-gray-400/70'><MdCloudUpload /></span>
                <h6 style={{ fontFamily: "Outfit" }} className="text-gray-500/90 leading-none sm:text-sm text-xs mb-1">Drag & drop images here</h6>
                <button className="sm:block hidden mt-2 px-4 py-2 bg-white text-blue-600 rounded-lg sm:text-xs text-[11px] font-medium cursor-pointer border border-[#E2E8F0]">
                  Upload Images
                </button>
              </div> : <div className='grid grid-cols-3 items-center gap-2'>{previewImage.map((img, index) => (
                <figure><img key={index} src={img} className='rounded cursor-pointer w-full h-full max-h-[70px] bg-gray-100 object-cover' alt="" /></figure>
              ))}</div>}
              <input type="file" ref={file} multiple onChange={imagesHandler} hidden id='image' />
            </div>

            {/* Product Name */}
            {/* CATEGORY
            SUBCATEGORY */}
            <div className='flex flex-col gap-3.5 w-full'>
              <div>
                <label className="block sm:text-sm text-xs font-medium mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id='name' name='name' value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none sm:text-[13.4px] text-xs placeholder:text-gray-400/90"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block sm:text-sm text-xs font-medium mb-1">
                  Category
                </label>
                <select defaultValue={0} onChange={(e) => setCategory(e.target.value)} name="category" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none sm:text-[13px] text-xs text-gray-700">
                  <option disabled value={0}>--Select Category--</option>
                  <option id='Clothing & Style' value="Clothing & Style">Clothing & Style</option>
                  <option id="Footwear" value="Footwear">Footwear</option>
                  <option id="Bags & Accessories" value="Bags & Accessories">Bags & Accessories</option>
                  <option id="Beauty & Wellness" value="Beauty & Wellness">Beauty & Wellness</option>
                  <option id="Electronics & Gadgets" value="Electronics & Gadgets">Electronics & Gadgets</option>
                  <option id="Home Decor" value="Home Decor">Home Decor</option>
                </select>
              </div>

              {/* SubCategory */}
              <div>
                {category === "Clothing & Style" ?
                  <div className='flex flex-col w-full'>
                    <label className="block sm:text-sm text-xs font-medium mb-1">SubCategory</label>
                    <select defaultValue={0} onChange={(e) => setSubCategory(e.target.value)} name="category" className='w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-[13px] text-grasm:y-600'>
                      text-xs                   <option disabled value={0}>--Select SubCategory--</option>
                      <option id='Men' value="Men">Men</option>
                      <option id="Women" value="Women">Women</option>
                      <option id="Kids" value="Kids">Kids</option>
                    </select>
                  </div> : category === "Footwear" ?
                    <div className='flex flex-col w-full'>
                      <label className="block sm:text-sm text-xs font-medium mb-1">
                        SubCategory
                      </label>
                      <select defaultValue={0} onChange={(e) => setSubCategory(e.target.value)} name="category" className='w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none sm:text-[13px] text-xs text-gray-600'>
                        <option disabled value={0}>--Select SubCategory--</option>
                        <option id='Formal Shoes' value="Formal Shoes">Formal Shoes</option>
                        <option id="Casual Shoes" value="Casual Shoes">Casual Shoes</option>
                        <option id="Sneakers" value="Sneakers">Sneakers</option>
                      </select>
                    </div> :
                    category === "Bags & Accessories" ?
                      <div className='flex flex-col w-full'>
                        <label className="block sm:text-sm text-xs font-medium mb-1">
                          SubCategory
                        </label>
                        <select defaultValue={0} onChange={(e) => setSubCategory(e.target.value)} name="category" className='w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none sm:text-[13px] text-xs text-gray-600'>
                          <option disabled value={0}>--Select SubCategory--</option>
                          <option id='Handbags' value="Handbags">Handbags</option>
                          <option id="Crossbody Bags" value="Crossbody Bags">Crossbody Bags</option>
                          <option id="Wallet" value="Wallet">Wallet</option>
                        </select>
                      </div> :
                      category === "Beauty & Wellness" ?
                        <div className='flex flex-col w-full'>
                          <label className="block sm:text-sm text-xs font-medium mb-1">
                            SubCategory
                          </label>
                          <select defaultValue={0} onChange={(e) => setSubCategory(e.target.value)} name="category" className='w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none sm:text-[13px] text-xs text-gray-600'>
                            <option disabled value={0}>--Select SubCategory--</option>
                            <option id='Shampoo & Facewashes' value="Shampoo & Facewashes">Shampoo & Facewashes</option>
                            <option id="Skin Treatments" value="Skin Treatments">Skin Treatments</option>
                            <option id="Hair Color & Treatments" value="Hair Color & Treatments">Hair Color & Treatments</option>
                          </select>
                        </div> :
                        category === "Electronics & Gadgets" ?
                          <div className='flex flex-col w-full'>
                            <label className="block sm:text-sm text-xs font-medium mb-1">
                              SubCategory
                            </label>
                            <select defaultValue={0} onChange={(e) => setSubCategory(e.target.value)} name="category" className='w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-[13px] text-gray-6sm:00'>
                              text-xs                        <option disabled value={0}>--Select SubCategory--</option>
                              <option id='Mobile & Computers' value="Mobile & Computers">Mobile & Computers</option>
                              <option id="Smart Watch & Smart TV" value="Smart Watch & Smart TV">Watch & TV</option>
                              <option id="Audio & Accessories" value="Audio & Accessories">Audio & Accessories</option>
                            </select>
                          </div> : null}
              </div>

            </div>
          </div>

          <div className='grid sm:grid-cols-2 items-center sm:gap-5 gap-3 h-full -mt-0.5'>
            {/* About */}
            <div className="w-full">
              <label className="block sm:text-sm text-xs font-medium mb-1.5">
                About Product
              </label>
              <div>
                <div
                  ref={editorRef}
                  className="w-full relative border border-gray-300 sm:min-h-[160px] min-h-[120px] sm:max-h-[160px] max-h-[120px] placeholder:text-gray-400 overflow-y-auto"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block sm:text-sm text-xs font-medium mb-1.5">
                Description
              </label>
              <div>
                <div
                  ref={editorRef2}
                  className="w-full relative border border-gray-300 sm:min-h-[160px] min-h-[120px] sm:max-h-[160px] max-h-[120px] placeholder:text-gray-400 overflow-y-auto"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center sm:gap-5 gap-4 -mt-1">
            {/* Price */}
            <div className='w-full'>
              <label className="block sm:text-sm text-xs font-medium mb-1">
                Price
              </label>
              <input
                type='number' placeholder='120' id='price' name='price' value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none sm:text-[13.4px] text-xs placeholder:text-gray-400/90"
              />
            </div>

            {/* Offer Price */}
            <div className='w-full'>
              <label className="block sm:text-sm text-xs font-medium mb-1">
                Offer Price
              </label>
              <input
                type='number' placeholder='100' id='price' name='price' value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none sm:text-[13.4px] text-xs placeholder:text-gray-400/90"
              />
            </div>
          </div>

        </div>
        {/* <div className='flex flex-col gap-1.5'>
          <h6 className='text-sm'>Select Images</h6>
          <label htmlFor="image" className='flex items-center gap-2'>
            {previewImage.map((img, index) => (
              <img key={index} src={img ? img : upload_area} className='rounded cursor-pointer max-h-24 max-w-24 bg-gray-100' alt="" />
            ))}
            <input type="file" multiple onChange={imagesHandler} hidden id='image' />
          </label>
        </div> */}
        {category === "Clothing & Style" ?
          <div>
            <div>
              <h6 className='mt-4 text-sm'>Sizes (Optional)</h6>
              <div className='add_product_sizes flex sm:gap-3 gap-2 items-center mt-2 sm:text-sm text-xs font-medium'>
                <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
                  <h6 className={`px-3.5 py-2 flex items-center justify-center cursor-pointer ${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"}`}>S</h6>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
                  <h6 className={`px-3.5 py-2 flex items-center justify-center cursor-pointer ${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"}`}>M</h6>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
                  <h6 className={`px-3.5 py-2 flex items-center justify-center cursor-pointer ${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"}`}>L</h6>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
                  <h6 className={`px-3.5 py-2 flex items-center justify-center cursor-pointer ${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"}`}>XL</h6>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
                  <h6 className={`px-3.5 py-2 flex items-center justify-center cursor-pointer ${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"}`}>XXL</h6>
                </div>
              </div>
            </div>
          </div> : category === "Footwear" ?
            <div className='max-w-2xl'>
              <h6 className='mt-4 text-sm'>Sizes (Oprional)</h6>
              <div className='grid grid-cols-6 sm:gap-3 gap-2 items-center mt-2 text-xs'>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 11") ? prev.filter(item => item !== "US/PAK 11") : [...prev, "US/PAK 11"])}>
                  <h6 className={`sm:py-2 py-1.5 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 11") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 11</h6>
                </div>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 10") ? prev.filter(item => item !== "US/PAK 10") : [...prev, "US/PAK 10"])}>
                  <h6 className={`sm:py-2 py-1.5 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 10") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 10</h6>
                </div>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 9") ? prev.filter(item => item !== "US/PAK 9") : [...prev, "US/PAK 9"])}>
                  <h6 className={`sm:py-2 py-1.5 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 9") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 9</h6>
                </div>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 8") ? prev.filter(item => item !== "US/PAK 8") : [...prev, "US/PAK 8"])}>
                  <h6 className={`sm:py-2 py-1.5 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 8") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 8</h6>
                </div>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 7") ? prev.filter(item => item !== "US/PAK 7") : [...prev, "US/PAK 7"])}>
                  <h6 className={`sm:py-2 py-1.5 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 7") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 7</h6>
                </div>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 6") ? prev.filter(item => item !== "US/PAK 6") : [...prev, "US/PAK 6"])}>
                  <h6 className={`sm:py-2 py-1.5 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 6") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 6</h6>
                </div>
              </div>
            </div> : null}
        <div className='mt-4'>
          <label className="block sm:text-sm text-xs font-medium mb-1">
            Colors (Optional)
          </label>
          <div className='add_product_color grid xl:grid-cols-10 lg:grid-cols-8 sm:grid-cols-5 grid-cols-4 sm:gap-3 gap-2 items-center mt-2 text-xs font-medium text-gray-700'>
            <div onClick={() => setColors(prev => prev.includes("Red") ? prev.filter(item => item !== "Red") : [...prev, "Red"])}>
              <h6 className={`colors sm:py-2 py-1.5 px-3 flex items-center justify-center gap-2 cursor-pointer rounded ${colors.includes("Red") ? "bg-pink-100" : "bg-gray-200/80"}`}><span className='text-base text-red-500'><FaCircle /></span> Red</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Blue") ? prev.filter(item => item !== "Blue") : [...prev, "Blue"])}>
              <h6 className={`colors sm:py-2 py-1.5 px-3 flex items-center justify-center gap-2 cursor-pointer rounded ${colors.includes("Blue") ? "bg-pink-100" : "bg-gray-200/80"}`}><span className='text-base text-blue-500'><FaCircle /></span>Blue</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Green") ? prev.filter(item => item !== "Green") : [...prev, "Green"])}>
              <h6 className={`colors sm:py-2 py-1.5 px-3 flex items-center justify-center gap-2 cursor-pointer rounded ${colors.includes("Green") ? "bg-pink-100" : "bg-gray-200/80"}`}><span className='text-base text-green-500'><FaCircle /></span>Green</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("White") ? prev.filter(item => item !== "White") : [...prev, "White"])}>
              <h6 className={`colors sm:py-2 py-1.5 px-3 flex items-center justify-center gap-2 cursor-pointer rounded ${colors.includes("White") ? "bg-pink-100" : "bg-gray-200/80"}`}><span className='text-base text-white'><FaCircle /></span>White</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Black") ? prev.filter(item => item !== "Black") : [...prev, "Black"])}>
              <h6 className={`colors sm:py-2 py-1.5 px-3 flex items-center justify-center gap-2 cursor-pointer rounded ${colors.includes("Black") ? "bg-pink-100" : "bg-gray-200/80"}`}><span className='text-base text-black'><FaCircle /></span>Black</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Grey") ? prev.filter(item => item !== "Grey") : [...prev, "Grey"])}>
              <h6 className={`colors sm:py-2 py-1.5 px-3 flex items-center justify-center gap-2 cursor-pointer rounded ${colors.includes("Grey") ? "bg-pink-100" : "bg-gray-200/80"}`}><span className='text-base text-gray-500'><FaCircle /></span>Grey</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Orange") ? prev.filter(item => item !== "Orange") : [...prev, "Orange"])}>
              <h6 className={`colors sm:py-2 py-1.5 px-3 flex items-center justify-center gap-2 cursor-pointer rounded ${colors.includes("Orange") ? "bg-pink-100" : "bg-gray-200/80"}`}><span className='text-base text-orange-500'><FaCircle /></span>Orange</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Brown") ? prev.filter(item => item !== "Brown") : [...prev, "Brown"])}>
              <h6 className={`colors sm:py-2 py-1.5 px-3 flex items-center justify-center gap-2 cursor-pointer rounded ${colors.includes("Brown") ? "bg-pink-100" : "bg-gray-200/80"}`}><span className='text-base text-amber-700'><FaCircle /></span>Brown</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Pink") ? prev.filter(item => item !== "Pink") : [...prev, "Pink"])}>
              <h6 className={`colors sm:py-2 py-1.5 px-3 flex items-center justify-center gap-2 cursor-pointer rounded ${colors.includes("Pink") ? "bg-pink-100" : "bg-gray-200/80"}`}><span className='text-base text-pink-500'><FaCircle /></span>Pink</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Yellow") ? prev.filter(item => item !== "Yellow") : [...prev, "Yellow"])}>
              <h6 className={`colors sm:py-2 py-1.5 px-3 flex items-center justify-center gap-2 cursor-pointer rounded ${colors.includes("Yellow") ? "bg-pink-100" : "bg-gray-200/80"}`}><span className='text-base text-yellow-400'><FaCircle /></span>Yellow</h6>
            </div>
          </div>
        </div>
        <button style={{ fontFamily: 'Outfit' }} type='submit' className='mt-7 flex items-center gap-1 sm:text-sm text-xs px-8 w-fit py-[10px] bg-[#2563EB] text-white rounded cursor-pointer'><span className='text-white text-base'><LuPlus /></span>{loading ? 'Ading...' : 'Add Product'}</button>
      </div>
    </form>
  )
}

export default AddProduct