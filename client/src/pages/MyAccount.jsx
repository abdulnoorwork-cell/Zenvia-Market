import React from 'react'

const MyAccount = () => {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <div className="bg-[#e4e4f56c] py-12">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              My Account
            </h1>

            <p className="text-gray-600 mt-3">
              Welcome back, Ahmed Sheikh. Manage your information, orders
              and wishlist here.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600"
            className="hidden md:block w-80"
          />

        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">

        {/* Sidebar */}
        <div className="bg-white p-6 rounded-xl shadow">

          <div className="text-center">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="w-20 h-20 rounded-full mx-auto"
            />

            <h3 className="mt-3 font-semibold">
              Ahmed Sheikh
            </h3>

            <p className="text-gray-500 text-sm">
              ahmed@sheikh.com
            </p>
          </div>

          <div className="mt-6 space-y-3">

            <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
              Dashboard
            </button>

            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
              Orders
            </button>

            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
              Wishlist
            </button>

            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
              Account Details
            </button>

            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-red-500">
              Logout
            </button>

          </div>
        </div>

        {/* Dashboard */}
        <div className="md:col-span-3 space-y-6">

          {/* Account Info */}
          <div className="bg-white p-6 rounded-xl shadow">

            <div className="flex justify-between">

              <h2 className="text-xl font-semibold">
                Account Information
              </h2>

              <button className="text-blue-600 text-sm">
                Edit
              </button>

            </div>

            <div className="mt-4 text-gray-600">
              <p>Ahmed Sheikh</p>
              <p>ahmed@sheikh.com</p>
              <p>+92 303 1234567</p>
            </div>

          </div>

          {/* Orders + Wishlist */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-2">
                My Orders
              </h3>

              <p className="text-gray-600">
                Order #987654
              </p>

              <p className="text-green-600 text-sm">
                Shipped
              </p>

              <button className="mt-3 text-blue-600">
                View Orders →
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-2">
                My Wishlist
              </h3>

              <p className="text-gray-600">
                4 items saved
              </p>

              <button className="mt-3 text-blue-600">
                View Wishlist →
              </button>
            </div>

          </div>

          {/* Address */}
          <div className="bg-white p-6 rounded-xl shadow">

            <div className="flex justify-between">

              <h3 className="font-semibold">
                Shipping Address
              </h3>

              <button className="text-blue-600 text-sm">
                Edit
              </button>

            </div>

            <p className="mt-3 text-gray-600">
              Ahmed Sheikh
            </p>

            <p className="text-gray-600">
              123 Green St
            </p>

            <p className="text-gray-600">
              Karachi, Pakistan
            </p>

            <p className="text-gray-600">
              +92 303 1234567
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default MyAccount