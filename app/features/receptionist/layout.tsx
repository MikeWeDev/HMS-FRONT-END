"use client";

import { useState } from "react";
import ReceptionistSidebar from "./sidbar";
import { Menu, X } from "lucide-react";

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      {/* --- Mobile Navbar --- */}
      <header className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-20">
        <div className="text-lg font-semibold text-gray-800">Reception Dashboard</div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* --- Sidebar (Desktop) --- */}
      <div className="hidden md:block">
        <ReceptionistSidebar />
      </div>

      {/* --- Sidebar Drawer (Mobile) --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
          ></div>

          {/* Drawer */}
          <div className="relative bg-white w-64 h-full shadow-lg z-50 animate-slide-in">
            <ReceptionistSidebar isMobile />
          </div>
        </div>
      )}

      {/* --- Main Content --- */}
      <main className="flex-1 bg-gray-50">{children}</main>

      {/* --- Animation Styles --- */}
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
