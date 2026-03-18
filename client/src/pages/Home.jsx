import React from 'react'
import Hero from '../components/Hero'
import LatestProducts from '../components/LatestProducts'
import Categories from '../components/Categories'
import BeautyProducts from '../components/BeautyProducts'
import ElectronicsAndGadgets from '../components/ElectronicsAndGadgets'
import HomeDecor from '../components/HomeDecor'
import BagsAndAccessories from '../components/BagsAndAccessories'
import Footwear from '../components/Footwear'
import Clothing from '../components/Clothing.jsx'
import LatestBlog from '../components/LatestBlog.jsx'

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <LatestProducts />
      <BeautyProducts />
      <BagsAndAccessories />
      <ElectronicsAndGadgets />
      <HomeDecor />
      <Footwear />
      <Clothing />
      <LatestBlog />
    </div>
  )
}

export default React.memo(Home);