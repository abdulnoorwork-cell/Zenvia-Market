import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import upload_area from '../../assets/upload_area.svg'
import { useContext } from 'react';
import Quill from 'quill'

const AddProduct = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null)
  const editorRef2 = useRef(null);
  const quillRef2 = useRef(null)
  const navigate = useNavigate()
  const { backendUrl, token, isAdmin } = useContext(AppContext);

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
  const [previewImage, setPreviewImage] = useState([upload_area])

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
        toast.success(response.data.messege);
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
        setTimeout(() => {
          navigate('/admin/listproduct')
        }, 1000)
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error)
      if (error.response.status === 500) {
        localStorage.removeItem('token');
        window.location.href = "/admin"
      }
      toast.error(error.response.data.messege)
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
    <form onSubmit={onSubmitHandler} className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 text-gray-600 h-full min-h-[95vh]'>
      <div className='bg-white flex flex-col w-full max-w-[700px] p-6 md:p-10 shadow rounded'>
        <div className='flex flex-col gap-1.5'>
          <h6 className='text-sm'>Select Images</h6>
          <label htmlFor="image" className='flex items-center gap-2'>
            {previewImage.map((img, index) => (
              <img key={index} src={img ? img : upload_area} className='rounded cursor-pointer max-h-24 max-w-24 bg-gray-100' alt="" />
            ))}
            <input type="file" multiple onChange={imagesHandler} hidden id='image' />
          </label>
        </div>
        <h6 className='mt-4 text-sm'>Product Name</h6>
        <input type="text" placeholder='Type...' id='name' name='name' value={name} onChange={(e) => setName(e.target.value)} className='w-full mt-2 p-2 min-h-10 text-gray-600 bg-gray-100 border border-gray-300 outline-none rounded text-sm' required />
        <h6 className='mt-4 mb-2 text-sm'>About</h6>
        <div ref={editorRef} className='w-full relative bg-gray-100 border border-gray-300 min-h-[80px] max-h-[160px] overflow-y-auto'>
        </div>
        <h6 className='mt-4 mb-2 text-sm'>Description</h6>
        <div ref={editorRef2} className='w-full relative bg-gray-100 border border-gray-300 min-h-[120px] max-h-[230px] overflow-y-auto'>
        </div>
        <div className='flex items-center w-full gap-4'>
          <div className='w-full relative'>
            <h6 className='mt-4 text-sm'>Price</h6>
            <input type='number' placeholder='120' id='price' name='price' value={price} onChange={(e) => setPrice(e.target.value)} className='w-full mt-2 p-2 border border-gray-300 bg-gray-100 outline-none rounded text-sm' required></input>
          </div>
          <div className='w-full relative'>
            <h6 className='mt-4 text-sm'>Offer Price</h6>
            <input type='number' placeholder='100' id='offerPrice' name='offerPrice' value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} className='w-full mt-2 p-2 border border-gray-300 bg-gray-100 outline-none rounded text-sm' required></input>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex flex-col max-w-[200px] w-full'>
            <h6 className='mt-4 text-sm'>Category</h6>
            <select defaultValue={0} onChange={(e) => setCategory(e.target.value)} name="category" className='w-full mt-2 w-fit px-3 py-2 text-[13px] bg-gray-100 border text-gray-500 border-gray-300 outline-none rounded'>
              <option disabled value={0}>--Select Category--</option>
              <option id='Clothing & Style' value="Clothing & Style">Clothing & Style</option>
              <option id="Footwear" value="Footwear">Footwear</option>
              <option id="Bags & Accessories" value="Bags & Accessories">Bags & Accessories</option>
              <option id="Beauty & Wellness" value="Beauty & Wellness">Beauty & Wellness</option>
              <option id="Electronics & Gadgets" value="Electronics & Gadgets">Electronics & Gadgets</option>
              <option id="Home Decor" value="Home Decor">Home Decor</option>
            </select>
          </div>
          {category === "Clothing & Style" ?
            <div className='flex flex-col max-w-[200px] w-full'>
              <h6 className='mt-4 text-sm'>Sub Category</h6>
              <select defaultValue={0} onChange={(e) => setSubCategory(e.target.value)} name="category" className='w-full mt-2 w-fit px-3 py-2 text-[13px] bg-gray-100 border text-gray-500 border-gray-300 outline-none rounded'>
                <option disabled value={0}>--Select Sub Category--</option>
                <option id='Men' value="Men">Men</option>
                <option id="Women" value="Women">Women</option>
                <option id="Kids" value="Kids">Kids</option>
              </select>
            </div> : category === "Footwear" ?
              <div className='flex flex-col max-w-[200px] w-full'>
                <h6 className='mt-4 text-sm'>Sub Category</h6>
                <select defaultValue={0} onChange={(e) => setSubCategory(e.target.value)} name="category" className='w-full mt-2 w-fit px-3 py-2 text-[13px] bg-gray-100 border text-gray-500 border-gray-300 outline-none rounded'>
                  <option disabled value={0}>--Select Sub Category--</option>
                  <option id='Formal Shoes' value="Formal Shoes">Formal Shoes</option>
                  <option id="Casual Shoes" value="Casual Shoes">Casual Shoes</option>
                  <option id="Sneakers" value="Sneakers">Sneakers</option>
                </select>
              </div> :
              category === "Bags & Accessories" ?
                <div className='flex flex-col max-w-[200px] w-full'>
                  <h6 className='mt-4 text-sm'>Sub Category</h6>
                  <select defaultValue={0} onChange={(e) => setSubCategory(e.target.value)} name="category" className='w-full mt-2 w-fit px-3 py-2 text-[13px] bg-gray-100 border text-gray-500 border-gray-300 outline-none rounded'>
                    <option disabled value={0}>--Select Sub Category--</option>
                    <option id='Handbags' value="Handbags">Handbags</option>
                    <option id="Crossbody Bags" value="Crossbody Bags">Crossbody Bags</option>
                    <option id="Wallet" value="Wallet">Wallet</option>
                  </select>
                </div> :
                category === "Beauty & Wellness" ?
                  <div className='flex flex-col max-w-[200px] w-full'>
                    <h6 className='mt-4 text-sm'>Sub Category</h6>
                    <select defaultValue={0} onChange={(e) => setSubCategory(e.target.value)} name="category" className='w-full mt-2 w-fit px-3 py-2 text-[13px] bg-gray-100 border text-gray-500 border-gray-300 outline-none rounded'>
                      <option disabled value={0}>--Select Sub Category--</option>
                      <option id='Shampoo & Facewashes' value="Shampoo & Facewashes">Shampoo & Facewashes</option>
                      <option id="Skin Treatments" value="Skin Treatments">Skin Treatments</option>
                      <option id="Hair Color & Treatments" value="Hair Color & Treatments">Hair Color & Treatments</option>
                    </select>
                  </div> :
                  category === "Electronics & Gadgets" ?
                    <div className='flex flex-col max-w-[200px] w-full'>
                      <h6 className='mt-4 text-sm'>Sub Category</h6>
                      <select defaultValue={0} onChange={(e) => setSubCategory(e.target.value)} name="category" className='w-full mt-2 w-fit px-3 py-2 text-[13px] bg-gray-100 border text-gray-500 border-gray-300 outline-none rounded'>
                        <option disabled value={0}>--Select Sub Category--</option>
                        <option id='Mobile & Computers' value="Mobile & Computers">Mobile & Computers</option>
                        <option id="Smart Watch & Smart TV" value="Smart Watch & Smart TV">Watch & TV</option>
                        <option id="Audio & Accessories" value="Audio & Accessories">Audio & Accessories</option>
                      </select>
                    </div> : null}
        </div>
        {category === "Clothing & Style" ?
          <div>
            <div>
              <h6 className='mt-4 text-sm'>Sizes (Optional)</h6>
              <div className='flex sm:gap-3 gap-2 items-center mt-2 text-sm'>
                <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
                  <h6 className={`w-[40px] h-[36px] flex items-center justify-center cursor-pointer ${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"}`}>S</h6>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
                  <h6 className={`w-[40px] h-[36px] flex items-center justify-center cursor-pointer ${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"}`}>M</h6>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
                  <h6 className={`w-[40px] h-[36px] flex items-center justify-center cursor-pointer ${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"}`}>L</h6>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
                  <h6 className={`w-[40px] h-[36px] flex items-center justify-center cursor-pointer ${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"}`}>XL</h6>
                </div>
                <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
                  <h6 className={`w-[40px] h-[36px] flex items-center justify-center cursor-pointer ${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"}`}>XXL</h6>
                </div>
              </div>
            </div>
          </div> : category === "Footwear" ?
            <div>
              <h6 className='mt-4 text-sm'>Sizes (Oprional)</h6>
              <div className='grid grid-cols-6 sm:gap-3 gap-2 items-center mt-2 text-xs'>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 11") ? prev.filter(item => item !== "US/PAK 11") : [...prev, "US/PAK 11"])}>
                  <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 11") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 11</h6>
                </div>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 10") ? prev.filter(item => item !== "US/PAK 10") : [...prev, "US/PAK 10"])}>
                  <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 10") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 10</h6>
                </div>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 9") ? prev.filter(item => item !== "US/PAK 9") : [...prev, "US/PAK 9"])}>
                  <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 9") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 9</h6>
                </div>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 8") ? prev.filter(item => item !== "US/PAK 8") : [...prev, "US/PAK 8"])}>
                  <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 8") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 8</h6>
                </div>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 7") ? prev.filter(item => item !== "US/PAK 7") : [...prev, "US/PAK 7"])}>
                  <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 7") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 7</h6>
                </div>
                <div onClick={() => setfootwear_Sizes(prev => prev.includes("US/PAK 6") ? prev.filter(item => item !== "US/PAK 6") : [...prev, "US/PAK 6"])}>
                  <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${footwear_sizes.includes("US/PAK 6") ? "bg-pink-100" : "bg-slate-200"}`}>US/PAK 6</h6>
                </div>
              </div>
            </div> : null}
        <div>
          <h6 className='mt-4 text-sm'>Colors (Optional)</h6>
          <div className='grid grid-cols-6 sm:gap-3 gap-2 items-center mt-2 text-xs'>
            <div onClick={() => setColors(prev => prev.includes("Red") ? prev.filter(item => item !== "Red") : [...prev, "Red"])}>
              <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${colors.includes("Red") ? "bg-pink-100" : "bg-slate-200"}`}>Red</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Blue") ? prev.filter(item => item !== "Blue") : [...prev, "Blue"])}>
              <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${colors.includes("Blue") ? "bg-pink-100" : "bg-slate-200"}`}>Blue</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Green") ? prev.filter(item => item !== "Green") : [...prev, "Green"])}>
              <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${colors.includes("Green") ? "bg-pink-100" : "bg-slate-200"}`}>Green</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("White") ? prev.filter(item => item !== "White") : [...prev, "White"])}>
              <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${colors.includes("White") ? "bg-pink-100" : "bg-slate-200"}`}>White</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Black") ? prev.filter(item => item !== "Black") : [...prev, "Black"])}>
              <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${colors.includes("Black") ? "bg-pink-100" : "bg-slate-200"}`}>Black</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Grey") ? prev.filter(item => item !== "Grey") : [...prev, "Grey"])}>
              <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${colors.includes("Grey") ? "bg-pink-100" : "bg-slate-200"}`}>Grey</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Orange") ? prev.filter(item => item !== "Orange") : [...prev, "Orange"])}>
              <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${colors.includes("Orange") ? "bg-pink-100" : "bg-slate-200"}`}>Orange</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Brown") ? prev.filter(item => item !== "Brown") : [...prev, "Brown"])}>
              <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${colors.includes("Brown") ? "bg-pink-100" : "bg-slate-200"}`}>Brown</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Pink") ? prev.filter(item => item !== "Pink") : [...prev, "Pink"])}>
              <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${colors.includes("Pink") ? "bg-pink-100" : "bg-slate-200"}`}>Pink</h6>
            </div>
            <div onClick={() => setColors(prev => prev.includes("Yellow") ? prev.filter(item => item !== "Yellow") : [...prev, "Yellow"])}>
              <h6 className={`py-2 px-3 flex items-center justify-center cursor-pointer ${colors.includes("Yellow") ? "bg-pink-100" : "bg-slate-200"}`}>Yellow</h6>
            </div>
          </div>
        </div>
        <button style={{ fontFamily: 'Outfit' }} type='submit' className='mt-7 sm:text-sm text-xs px-8 w-fit py-[10px] bg-[#2563EB] text-white rounded cursor-pointer'>{loading ? 'Ading...' : 'Add Product'}</button>
      </div>
    </form>
  )
}

export default AddProduct