import React, { memo, useContext } from 'react'
import clothing_image from '../assets/clothing.webp'
import footwear_image from '../assets/footwear.png'
import bag_image from '../assets/bag_image.png'
import electronics_image from '../assets/electronics.png'
import beauty from '../assets/beauty.png'
import { AppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import CategoryCard from './CategoryCard'
// import mobiles from '../assets/mobiles.png'
import home_decor from '../assets/home_decor.png'

const Categories = () => {
    const { navigate, products } = useContext(AppContext);
    const categories = [
        {
            name: "Clothing",
            slug: "clothing",
            count: products?.filter(prod => prod.category === "Clothing & Style").length,
            image: clothing_image,
        },
        {
            name: "Footwear",
            slug: "footwear",
            count: products?.filter(prod => prod.category === "Footwear").length,
            image: footwear_image,
        },
        {
            name: "Bags",
            slug: "bags",
            count: products?.filter(prod => prod.category === "Bags & Accessories").length,
            image: bag_image,
        },
        {
            name: "Electronics",
            slug: "electronics",
            count: products?.filter(prod => prod.category === "Electronics & Gadgets").length,
            image: electronics_image,
        },
        {
            name: "Beauty",
            slug: "beauty",
            count: products?.filter(prod => prod.category === "Beauty & Wellness").length,
            image: beauty,
        },
        {
            name: "Home Decor",
            slug: "home-decor",
            count: products?.filter(prod => prod.category === "Home Decor").length,
            image: home_decor,
        },
    ];

    return (
        <section>
            <section className="pt-12 pb-4">
                <div className="container mx-auto px-4">

                    <h2 className="text-[22px] tracking-[0.1px] mb-5 font-semibold">
                        Shop by Category
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-[18px] gap-4">
                        {categories.map((cat, index) => (
                            <CategoryCard key={index} category={cat} />
                        ))}
                    </div>

                </div>
            </section>
        </section>
    )
}

export default React.memo(Categories);