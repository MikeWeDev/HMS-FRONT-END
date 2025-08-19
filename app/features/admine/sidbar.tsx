"use client";

import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  CalendarDays,
  User,
  ClipboardList,
  MessageCircle,
  LogOut,
} from "lucide-react";

export default function AdmineistSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between sticky top-0 h-screen overflow-y-auto">
      <div>
        {/* Logo */}
        <div className="text-2xl font-bold text-primary flex items-center gap-2 mb-10">
          <Building2 className="w-6 h-6 text-green-600" />
          <span className="text-gray-800">Royal Stay Reception</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 text-sm font-medium">
          <Link
            href="/features/admine"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-green-600" />
            Dashboard
          </Link>   
          <Link
            href="/features/admine/guest"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <User className="w-4 h-4 text-green-600" />
            ALL GUST
          </Link>
          <Link
            href="/features/admine/stough"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <ClipboardList className="w-4 h-4 text-green-600" />
            ALL STOUGH
          </Link>
          <Link
            href="/features/admine/rooms"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <CalendarDays className="w-4 h-4 text-green-600" />
            EDIT ROOM
          </Link>
          <Link
            href="/features/admine"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <MessageCircle className="w-4 h-4 text-green-600" />
            Messages
          </Link>
      <Link
            href="/auth/login"
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-green-50 transition"
          >
            <LogOut className="w-4 h-4 text-green-600" />
            Logout
          </Link>
        </nav>
      </div>

   
    </aside>
  );
}
