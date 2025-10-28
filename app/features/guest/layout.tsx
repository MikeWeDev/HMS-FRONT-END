"use client";

import { useState } from "react";
import GustSidebar from "./Sidebar"; // Assuming this is the GuestSidebar component
import { Menu, X } from "lucide-react";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to close the sidebar. This will be passed to the links.
  const closeSidebar = () => setIsSidebarOpen(false); 

  // Function to toggle the sidebar (used by the hamburger button and the overlay).
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      {/* --- Mobile Navbar --- */}
      <header className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-20">
        <div className="text-lg font-semibold text-gray-800">Royal Stay Hotel</div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* --- Sidebar (Desktop) --- */}
      {/* Note: The desktop version doesn't need the close function because it's always visible. 
          However, GuestSidebar requires the prop, so we pass a placeholder function here. */}
      <div className="hidden md:block">
        <GustSidebar onLinkClick={() => {}} /> 
      </div>

      {/* --- Sidebar Drawer (Mobile) --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay - Clicks outside the sidebar close it */}
          <div
            onClick={closeSidebar} // Use closeSidebar here
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
          ></div>

          {/* Drawer */}
          <div className="relative bg-white w-64 h-full shadow-lg z-50 animate-slide-in">
            {/* 💡 THE FIX: PASS closeSidebar AS onLinkClick PROP */}
            <GustSidebar 
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