'use client'; 
import React from 'react';
import Link from 'next/link'; // Import Link for navigation

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200  antialiased p-8">
        <h1>Hotel Management System</h1>

      <div className="bg-white rounded-xl shadow-2xl p-10 max-w-lg w-full text-center space-y-8 transform transition-all duration-300 hover:scale-105">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to HMS!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          **Please log in or register to access full features and manage your experience.**
        </p>

        {/* Primary Authentication Section */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          {/* Login Button */}
          <Link href="/auth/login" passHref>
            <button className="w-full sm:w-auto flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-bold shadow-md hover:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg">
              Login
            </button>
          </Link>

          {/* Register Button */}
          <Link href="/auth/register" passHref>
            <button className="w-full sm:w-auto flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg text-lg font-bold shadow-md hover:bg-purple-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg">
              Register
            </button>
          </Link>
        </div>

        {/* Secondary Access Section */}
        <hr className="my-6 border-gray-300" />

        <p className="text-lg text-gray-700 mb-4">
          Or, for a quick view of specific dashboards:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Guest Portal Button */}
          <Link href="/features/guest" passHref>
            <button className="w-full bg-green-600 text-white py-4 px-6 rounded-lg text-xl font-bold shadow-md hover:bg-green-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg">
              Guest Portal
            </button>
          </Link>

          {/* Receptionist Portal Button */}
          <Link href="/features/receptionist" passHref>
            <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-xl font-bold shadow-md hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg">
              Reception Panel
            </button>
          </Link>

          {/* Admin Portal Button */}
          <Link href="/features/admine" passHref>
            <button className="w-full bg-red-600 text-white py-4 px-6 rounded-lg text-xl font-bold shadow-md hover:bg-red-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg">
              Admin Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
