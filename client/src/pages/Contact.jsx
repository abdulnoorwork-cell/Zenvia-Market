import React from 'react'
import { Phone, Mail, MapPin } from "lucide-react";
import contact_image from '../assets/contact-us.png'

const Contact = () => {
    return (
        <div className="min-h-screen">

            {/* Hero Section */}
            <div className='bg-[#e4e4f56c]'>
                <div className="container mx-auto">
                    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 sm:gap-10 gap-1 py-9 items-center">

                        <div>
                            <h1 className="sm:text-3xl md:text-4xl text-2xl font-bold text-gray-800">
                                Contact Us
                            </h1>

                            <p className="text-gray-600 sm:mt-4 mt-2.5 max-w-[370px] sm:text-sm text-xs">
                                We're here to help! Get in touch with us for any queries,
                                support or product information.
                            </p>
                        </div>

                        <img
                            src={contact_image}
                            className="w-full max-w-md mx-auto"
                        />

                    </div>
                </div>
            </div>

            <div className='container mx-auto'>
                {/* Contact Section */}
                <div className="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-10">

                    {/* Contact Info */}
                    <div className="contact grid grid-cols-2 sm:gap-6 gap-5">

                        <div className="bg-white sm:p-6 p-4.5 rounded-xl shadow-sm">
                            <Phone className="text-blue-600 mb-3" />
                            <h3 className="font-semibold">Call Us</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">+92 303 1234567</p>
                        </div>

                        <div className="bg-white sm:p-6 p-4.5 rounded-xl shadow-sm">
                            <Mail className="text-blue-600 mb-3" />
                            <h3 className="font-semibold">Email Us</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                yourstore@ gmail.com
                            </p>
                        </div>

                        <div className="bg-white sm:p-6 p-4.5 rounded-xl shadow-sm">
                            <MapPin className="text-blue-600 mb-3" />
                            <h3 className="font-semibold">Visit Us</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                Karachi, Pakistan
                            </p>
                        </div>

                        <div className="bg-white sm:p-6 p-4.5 rounded-xl shadow-sm">
                            <MapPin className="text-blue-600 mb-3" />
                            <h3 className="font-semibold">Address</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                Your Street Address Here
                            </p>
                        </div>

                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-xl shadow-sm">

                        <h2 className="text-xl font-semibold mb-6">
                            Contact Form
                        </h2>

                        <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4 text-xs sm:text-sm">
                            <input type="hidden" name="access_key" value="44a0df73-c478-46b6-af8f-27518e08c08e" />
                            <div className="grid sm:grid-cols-2 gap-4">

                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 outline-[#2563EB]"
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 outline-[#2563EB]"
                                />

                            </div>

                            <input
                                type="text"
                                placeholder="Phone"
                                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 outline-[#2563EB]"
                            />

                            <textarea
                                placeholder="Message"
                                rows="5"
                                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 outline-[#2563EB]"
                            ></textarea>

                            <button
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700"
                            >
                                Send Message
                            </button>

                        </form>

                    </div>

                </div>

                {/* Map Section */}
                <div className="max-w-7xl mx-auto px-4">

                    <div className="rounded-xl overflow-hidden shadow">

                        <iframe
                            title="map"
                            width="100%"
                            height="350"
                            loading="lazy"
                            src="https://maps.google.com/maps?q=karachi&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        ></iframe>

                    </div>

                </div>
            </div>

        </div>
    )
}

export default Contact