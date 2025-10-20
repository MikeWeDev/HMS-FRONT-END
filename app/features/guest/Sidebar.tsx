"use client";

import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  CalendarDays,
  User,
  CreditCard,
  Phone,
  Settings,
  LogOut,
} from "lucide-react";

interface GustSidebarProps {
  isMobile?: boolean;
}

export default function GustSidebar({ isMobile = false }: GustSidebarProps) {
  return (
    <aside
      className={`${isMobile ? "flex " : "hidden md:flex"} 
      w-64 bg-white border-r border-gray-200 p-6 flex-col justify-between sticky top-0 h-screen overflow-y-auto`}>
      <div>
        {/* Logo */}
        <div className="text-2xl font-bold text-primary flex items-center gap-2 mb-10">
          <Building2 className="w-6 h-6 text-blue-600" />
          <span className="text-gray-800">Royal Stay Hotel</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 text-sm font-medium">
          <Link href="/features/guest" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 transition">
            <LayoutDashboard className="w-4 h-4 text-blue-600" />
            Dashboard
          </Link>

          <Link href="/features/guest/my-bookings" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 transition">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            My Bookings
          </Link>

          <Link href="/features/guest/profile" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 transition">
            <User className="w-4 h-4 text-blue-600" />
            Profile
          </Link>

          <Link href="/features/guest/payment-history" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 transition">
            <CreditCard className="w-4 h-4 text-blue-600" />
            Payment History
          </Link>

          <Link href="/features/guest/contact-support" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 transition">
            <Phone className="w-4 h-4 text-blue-600" />
            Contact Support
          </Link>

          <Link href="/features/guest/settings" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 transition">
            <Settings className="w-4 h-4 text-blue-600" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Logout */}
      <Link href="/auth/login" className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition">
        <LogOut className="w-4 h-4" />
        Logout
      </Link>
    </aside>
  );
}
