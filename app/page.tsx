'use client'; 
import React from 'react';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation'; // Assuming Next.js App Router

// (Keep the handleDemoLogin function here, as it was in the previous fix)
// ...

export default function Home() {
    const router = useRouter(); 

    // [handleDemoLogin function content here (omitted for brevity, but should be included)]
    const handleDemoLogin = async (role: string, redirectPath: string) => {
        // ... (Your handleDemoLogin logic from the previous answer)
        const existingUserId = localStorage.getItem('userId');
        const existingUserRole = localStorage.getItem('userRole');

        if (existingUserId && existingUserRole === role) {
            router.push(redirectPath);
            return;
        }

        try {
            const response = await fetch('https://hms-backend-2k1m.onrender.com/api/auth/demo-login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.userId) {
                    localStorage.setItem('userId', data.userId); 
                    localStorage.setItem('userRole', role); 
                }
                router.push(redirectPath);
            } else {
                console.error('Demo Login failed:', data.message);
                alert(`Demo login failed: ${data.message}`); 
            }
        } catch (error) {
            console.error('Network or system error during demo login:', error);
            alert('A network error occurred. Ensure your Express server is running on localhost:5000.');
        }
    };


    return (
        // Increased max-width of the container and added padding for better space utilization
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 antialiased p-4 sm:p-8">

            {/* 🔑 MAIN CARD: Increased max-width to accommodate side-by-side content */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-200 p-8 sm:p-12 max-w-4xl w-full text-center border border-gray-100 transform transition-all duration-500 hover:shadow-3xl hover:shadow-indigo-300/50">
                
                {/* 🔑 HEADER: Separated from the content sections below */}
                <header className="mb-10">
                    <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-2 tracking-tight">
                        <span className="text-indigo-600">HMS</span> Access Portal 🛎️
                    </h1>
                    <p className="text-lg text-gray-500 mt-4">
                        Securely log in or use the quick access options below.
                    </p>
                </header>

                <hr className="border-gray-200 mb-10" />

                {/* 🔑 NEW: FLEX/GRID CONTAINER for Side-by-Side Sections */}
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 text-left">

                    {/* 4. PRIMARY AUTH SECTION (Login/Register) - Takes up 1/3 space on large screens */}
                    <section className="flex-1 md:w-1/3 p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Official Access</h2>
                        <div className="space-y-4 flex flex-col gap-2">
                            {/* Login Button */}
                            <Link href="/auth/login" passHref>
                                <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl text-lg font-bold shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 transition duration-300 hover:scale-[1.01] border-b-4 border-indigo-800">
                                    Log In
                                </button>
                            </Link>

                            {/* Register Button */}
                            <Link href="/auth/register" passHref>
                                <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl text-lg font-bold shadow-lg shadow-purple-500/50 hover:bg-purple-700 transition duration-300 hover:scale-[1.01] border-b-4 border-purple-800">
                                    Register New Account
                                </button>
                            </Link>
                        </div>
                    </section>

                    {/* 5. DEMO ACCESS SECTION - Takes up 2/3 space on large screens */}
                    <section className="md:w-2/3 p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Quick Demo Access</h2>
                        <p className="text-base text-gray-500 mb-6">
                            Select a role to instantly view the corresponding dashboard (no login required).
                        </p>

                        {/* Button Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            
                            {/* Guest Portal Button */}
                            <button 
                                onClick={() => handleDemoLogin('guest', '/features/guest')}
                                className="flex flex-col items-center justify-center h-full p-4 bg-green-50 text-green-800 border-2 border-green-300 rounded-xl font-semibold shadow-md hover:bg-green-100 transition-all duration-200 transform hover:scale-[1.05]"
                            >
                                <span className="text-3xl mb-1">👤</span>
                                <span className="text-sm font-bold">Guest Portal</span>
                            </button>

                            {/* Receptionist Portal Button */}
                            <button 
                                onClick={() => handleDemoLogin('receptionist', '/features/receptionist')}
                                className="flex flex-col items-center justify-center h-full p-4 bg-blue-50 text-blue-800 border-2 border-blue-300 rounded-xl font-semibold shadow-md hover:bg-blue-100 transition-all duration-200 transform hover:scale-[1.05]"
                            >
                                <span className="text-3xl mb-1">👩‍💼</span>
                                <span className="text-sm font-bold">Reception Panel</span>
                            </button>

                            {/* Admin Portal Button */}
                            <button 
                                onClick={() => handleDemoLogin('admin', '/features/admine')}
                                className="flex flex-col items-center justify-center h-full p-4 bg-red-50 text-red-800 border-2 border-red-300 rounded-xl font-semibold shadow-md hover:bg-red-100 transition-all duration-200 transform hover:scale-[1.05]"
                            >
                                <span className="text-3xl mb-1">👑</span>
                                <span className="text-sm font-bold">Admin Dashboard</span>
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}