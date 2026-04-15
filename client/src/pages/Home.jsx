import React, { Suspense } from 'react'
import Hero from '../components/Hero'
const LatestProducts = React.lazy(() => import('../components/LatestProducts'))
const Categories = React.lazy(() => import('../components/Categories'))
const BeautyProducts = React.lazy(() => import('../components/BeautyProducts'))
const ElectronicsAndGadgets = React.lazy(() => import('../components/ElectronicsAndGadgets'))
const BagsAndAccessories = React.lazy(() => import('../components/BagsAndAccessories'))
const Footwear = React.lazy(() => import('../components/Footwear'))
const Clothing = React.lazy(() => import('../components/Clothing.jsx'))
const LatestBlog = React.lazy(() => import('../components/LatestBlog.jsx'))

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <Suspense fallback={<p>Loading...</p>}>
        <LatestProducts />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <BeautyProducts />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <BagsAndAccessories />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <ElectronicsAndGadgets />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <Footwear />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <Clothing />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <LatestBlog />
      </Suspense>
    </div>
  )
}

export default React.memo(Home);