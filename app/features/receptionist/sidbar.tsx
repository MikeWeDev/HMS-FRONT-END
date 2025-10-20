"use client";

import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  CalendarDays,
  User,
  ClipboardList,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";

interface ReceptionistSidebarProps {
  isMobile?: boolean;
}

export default function ReceptionistSidebar({ isMobile = false }: ReceptionistSidebarProps) {
  return (
    <aside
      className={`${isMobile ? "flex" : "hidden md:flex"} 
      w-64 bg-white border-r border-gray-200 p-6 flex-col justify-between sticky top-0 h-screen overflow-y-auto`}
    >
      <div>
        {/* Logo */}
        <div className="text-2xl font-bold text-primary flex items-center gap-2 mb-10">
          <Building2 className="w-6 h-6 text-green-600" />
          <span className="text-gray-800">Royal Stay Reception</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 text-sm font-medium">
          <Link
            href="/features/receptionist"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-green-600" />
            Dashboard
          </Link>

          <Link
            href="/features/receptionist/guests"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <User className="w-4 h-4 text-green-600" />
            Check In
          </Link>

          <Link
            href="/features/receptionist/checkout"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <ClipboardList className="w-4 h-4 text-green-600" />
            Check Out
          </Link>

          <Link
            href="/features/receptionist/roomList"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <CalendarDays className="w-4 h-4 text-green-600" />
            Room List
          </Link>

          <Link
            href="/features/receptionist/messages"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <MessageCircle className="w-4 h-4 text-green-600" />
            Messages
          </Link>

          <Link
            href="/features/receptionist/settings"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <Settings className="w-4 h-4 text-green-600" />
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
