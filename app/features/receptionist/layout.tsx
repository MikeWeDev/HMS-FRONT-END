'use client';

import { useState } from 'react';
// 💡 IMPORTANT: Change the import path to reference the ReceptionistSidebar
import ReceptionistSidebar from './sidbar'; 
import { Menu, X } from 'lucide-react';

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Function to close the sidebar. This will be passed to the links.
    const closeSidebar = () => setIsSidebarOpen(false); 

    // Function to toggle the sidebar (used by the hamburger button and the overlay).
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex flex-col md:flex-row min-h-screen relative">
            {/* --- Mobile Navbar (Matching Guest UI) --- */}
            <header className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-20">
                {/* 💡 Updated text for Receptionist */}
                <div className="text-lg font-semibold text-gray-800">Royal Stay Reception</div> 
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md hover:bg-gray-100 transition"
                    aria-label="Toggle menu"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-black" />}
                </button>
            </header>

            {/* --- Sidebar (Desktop) --- */}
            <div className="hidden md:block">
                {/* 💡 Use the ReceptionistSidebar component */}
                <ReceptionistSidebar onLinkClick={() => {}} /> 
            </div>

            {/* --- Sidebar Drawer (Mobile) --- */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-40 flex">
                    {/* Overlay - Clicks outside the sidebar close it */}
                    <div
                        onClick={closeSidebar} 
                        className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
                    ></div>

                    {/* Drawer */}
                    <div className="relative bg-white w-64 h-full shadow-lg z-50 animate-slide-in">
                        {/* 💡 Use the ReceptionistSidebar component and pass the close function */}
                        <ReceptionistSidebar 
                            isMobile 
                            onLinkClick={closeSidebar} 
                        />
                    </div>
                </div>
            )}

            {/* --- Main Content --- */}
            <main className="flex-1 bg-gray-50">{children}</main>

            {/* --- Animation Styles (Keeping for completeness) --- */}
            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}