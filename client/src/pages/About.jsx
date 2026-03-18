import React from 'react'

const About = () => {
    return (
        <div className="min-h-screen">

            {/* Hero Section */}
            <div className="bg-[#e4e4f56c] py-10">
                <div className="container mx-auto">
                    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 sm:gap-10 gap-6 items-center">

                        <div>
                            <h1 className="sm:text-3xl md:text-4xl text-2xl font-bold text-gray-800">
                                About Us
                            </h1>

                            <p className="text-gray-600 sm:mt-4 mt-2.5 max-w-[370px] sm:text-sm text-xs">
                                Learn more about our store and our commitment to bringing you
                                the best online shopping experience.
                            </p>
                        </div>

                        <img
                            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200"
                            className="w-full max-w-md mx-auto"
                        />

                    </div>
                </div>
            </div>

            {/* Our Story */}
            <div className="container mx-auto">
                <div className="max-w-7xl mx-auto px-4 sm:py-16 py-12 grid md:grid-cols-2 gap-10 items-center">

                    <div>
                        <h2 className="text-2xl font-bold mb-4">
                            Our Story
                        </h2>

                        <p className="text-gray-600 leading-relaxed sm:text-sm text-xs">
                            Our ecommerce platform was created with a passion for providing
                            high-quality products at affordable prices. Our journey began with
                            a simple mission — to make online shopping easy, reliable and
                            accessible for everyone.
                        </p>

                        <p className="text-gray-600 mt-4 sm:text-sm text-xs">
                            Today we proudly serve thousands of customers and continue to grow
                            while delivering excellent products and services.
                        </p>
                    </div>

                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                        className="rounded-xl shadow"
                    />

                </div>
            </div>

            {/* Mission Section */}
            <div className="bg-white sm:py-16 py-12">
                <div className='container mx-auto'>
                    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">

                        <img
                            src="https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=1200"
                            className="rounded-xl shadow"
                        />

                        <div>
                            <h2 className="text-2xl font-bold mb-4">
                                Our Mission
                            </h2>

                            <p className="text-gray-600 leading-relaxed sm:text-sm text-xs">
                                Our mission is to provide a wide range of products that combine
                                quality, affordability and convenience. We aim to become the most
                                trusted online shopping destination by focusing on customer
                                satisfaction and delivering the best service.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="container mx-auto">
                <div className="max-w-7xl mx-auto px-4 sm:py-16 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">

                    <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                        <h3 className="text-3xl font-bold text-blue-600">
                            10,000+
                        </h3>
                        <p className="text-gray-600 mt-2 sm:text-sm text-xs">
                            Happy Customers
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                        <h3 className="text-3xl font-bold text-blue-600">
                            5,000+
                        </h3>
                        <p className="text-gray-600 mt-2 sm:text-sm text-xs">
                            Products Available
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                        <h3 className="text-3xl font-bold text-blue-600">
                            99%
                        </h3>
                        <p className="text-gray-600 mt-2 sm:text-sm text-xs">
                            Customer Satisfaction
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                        <h3 className="text-3xl font-bold text-blue-600">
                            50+
                        </h3>
                        <p className="text-gray-600 mt-2 sm:text-sm text-xs">
                            Team Members
                        </p>
                    </div>

                </div>
            </div>

            {/* Team Section */}
            <div className="bg-white sm:py-16 py-12 mb-[-48px]">
                <div className="container mx-auto">
                    <div className="max-w-7xl mx-auto px-4">

                        <h2 className="text-2xl font-bold mb-10 text-center">
                            Meet Our Team
                        </h2>

                        <div className="grid md:grid-cols-4 gap-6">

                            <div className="text-center">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600"
                                    className="rounded-xl mb-3"
                                />
                                <h4 className="font-semibold">Sarah Khan</h4>
                                <p className="text-gray-500 sm:text-sm text-xs">CEO</p>
                            </div>

                            <div className="text-center">
                                <img
                                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600"
                                    className="rounded-xl mb-3"
                                />
                                <h4 className="font-semibold">Ali Raza</h4>
                                <p className="text-gray-500 sm:text-sm text-xs">
                                    Chief Operating Officer
                                </p>
                            </div>

                            <div className="text-center">
                                <img
                                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600"
                                    className="rounded-xl mb-3"
                                />
                                <h4 className="font-semibold">Ayesha Ahmed</h4>
                                <p className="text-gray-500 sm:text-sm text-xs">
                                    Marketing Director
                                </p>
                            </div>

                            <div className="text-center">
                                <img
                                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600"
                                    className="rounded-xl mb-3"
                                />
                                <h4 className="font-semibold">Ahmed Sheikh</h4>
                                <p className="text-gray-500 sm:text-sm text-xs">
                                    Lead Developer
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default About