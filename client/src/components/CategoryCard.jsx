import { ArrowRight } from 'lucide-react'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const CategoryCard = ({category}) => {
    const {navigate} = useContext(AppContext)
    return (
        <div onClick={()=>{navigate(`/category/${category.slug}`);scrollTo(0,0)}} className="group cursor-pointer bg-white max-w-[280px] rounded-2xl border border-gray-200 p-6 text-center hover:shadow-xl transition duration-300 hover:-translate-y-1">

            {/* Image */}
            <div className="flex justify-center sm:mb-4 mb-1.5">
                <img
                    src={category.image}
                    alt={category.name}
                    className="h-24 object-contain group-hover:scale-110 transition"
                />
            </div>

            {/* Category Name */}
            <h3 className="sm:text-lg font-semibold leading-[1.1em]">
                {category.name}
            </h3>

            {/* Product Count */}
            <p className="text-gray-500 text-xs mt-1">
                {category.count} Products
            </p>

            {/* Button */}
            <Link
                to={`/category/${category.slug}`} onClick={()=>scrollTo(0,0)}
                className="mt-4 sm:inline-flex hidden items-center gap-2 font-medium bg-gray-100 hover:bg-blue-600 hover:text-white text-xs px-4 py-2 rounded-lg transition"
            >
                See More
                <ArrowRight size={16} />
            </Link>

        </div>
    )
}

export default CategoryCard