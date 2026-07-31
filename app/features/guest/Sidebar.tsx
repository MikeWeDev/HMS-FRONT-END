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

interface GuestSidebarProps {
  isMobile?: boolean;
  active?: string; // Optional active route
  notifications?: { [key: string]: number };
  onLinkClick: () => void; 
}

export default function GuestSidebar({ 
    isMobile = false, 
    active, 
    notifications = {}, 
    onLinkClick 
}: GuestSidebarProps) {
  const links = [
    { href: "/features/guest", label: "Dashboard", icon: LayoutDashboard },
    { href: "/features/guest/my-bookings", label: "My Bookings", icon: CalendarDays },
    { href: "/features/guest/profile", label: "Profile", icon: User },
    { href: "/features/guest/payment-history", label: "Payment History", icon: CreditCard },
    { href: "/features/guest/contact-support", label: "Contact Support", icon: Phone },
    { href: "/features/guest/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`${
        isMobile ? "fixed inset-y-0 left-0 z-50 flex" : "hidden md:sticky md:top-0 md:flex"
      } w-80 bg-gray-50 p-6 flex-col h-dvh shadow-2xl overflow-hidden`}
    >
      {/* Top Profile Card */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
          <Building2 className="w-10 h-10 text-blue-600 flex-shrink-0" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Royal Stay Hotel</h1>
            <p className="text-sm text-gray-500">Guest Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation - Make only this middle area scrollable if needed */}
      <nav className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = active === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={`
                relative flex items-center gap-4 px-5 py-3 rounded-2xl font-medium text-gray-700 transition-all flex-shrink-0
                ${isActive ? "bg-blue-600 text-white shadow-lg" : "bg-white hover:bg-blue-50 hover:scale-[1.03] shadow-md"}
              `}
            >
              {/* Active bar */}
              {isActive && <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-xl"></span>}

              <Icon className={`w-6 h-6 transition-colors ${isActive ? "text-white" : "text-blue-600"}`} />
              <span>{link.label}</span>

              {/* Optional badge */}
              {notifications[link.label] && (
                <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse">
                  {notifications[link.label]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Card - Pinned to the bottom */}
      <div className="pt-6 mt-auto flex-shrink-0">
        <Link
          href="/"
          onClick={onLinkClick} 
          className="flex items-center gap-4 px-5 py-3 rounded-2xl font-medium text-red-500 bg-white shadow-md hover:bg-red-50 hover:text-red-600 hover:scale-[1.03] transition"
        >
          <LogOut className="w-6 h-6" />
          Logout
        </Link>
      </div>
    </aside>
  );
}