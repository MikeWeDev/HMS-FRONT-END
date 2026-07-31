'use client';

import Link from 'next/link';
import {
    Building2,
    LayoutDashboard,
    CalendarDays,
    User,
    ClipboardList,
    MessageCircle,
    LogOut,
} from 'lucide-react';

interface AdminSidebarProps {
    isMobile?: boolean;
    active?: string; // Active route for styling
    notifications?: { [key: string]: number }; // Notification badges
    onLinkClick: () => void;
}

export default function AdminSidebar({
    isMobile = false,
    active,
    notifications = {},
    onLinkClick,
}: AdminSidebarProps) {
    const links = [
        { href: "/features/admine", label: "Dashboard", icon: LayoutDashboard },
        { href: "/features/admine/guest", label: "All Guests", icon: User },
        { href: "/features/admine/stough", label: "All Staff", icon: ClipboardList },
        { href: "/features/admine/rooms", label: "Edit Rooms", icon: CalendarDays },
        { href: "/features/admine/message", label: "Messages", icon: MessageCircle },
    ];

    // Define the primary accent color class
    const ACCENT_COLOR_CLASS = 'blue';

    return (
        <aside
            className={`${
                isMobile ? 'fixed inset-y-0 left-0 z-50 flex' : 'hidden md:sticky md:top-0 md:flex'
            } w-80 bg-gray-50 p-6 flex-col h-screen max-h-screen shadow-2xl overflow-hidden`}
        >
            {/* Top Profile Card (Fixed top) */}
            <div className="mb-6 shrink-0">
                <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
                    <Building2 className={`w-10 h-10 text-${ACCENT_COLOR_CLASS}-600 shrink-0`} />
                    <div className="min-w-0">
                        <h1 className="text-lg font-semibold text-gray-900 truncate">Royal Stay Hotel</h1>
                        <p className="text-sm text-gray-500 truncate">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation (Scrolls internally if viewport height is small) */}
            <nav className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = active === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onLinkClick}
                            className={`
                                relative flex items-center gap-4 px-5 py-3 rounded-2xl font-medium text-gray-700 transition-all shrink-0
                                ${
                                    isActive 
                                        ? `bg-${ACCENT_COLOR_CLASS}-600 text-white shadow-lg` 
                                        : `bg-white hover:bg-${ACCENT_COLOR_CLASS}-50 hover:scale-[1.02] shadow-sm`
                                }
                            `}
                        >
                            {/* Active bar */}
                            {isActive && <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-xl"></span>}

                            <Icon className={`w-6 h-6 shrink-0 transition-colors ${isActive ? 'text-white' : `text-${ACCENT_COLOR_CLASS}-600`}`} />
                            <span className="truncate">{link.label}</span>

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

            {/* Logout Card (Pinned bottom) */}
            <div className="pt-4 mt-auto shrink-0 border-t border-gray-200/60">
                <Link
                    href="/"
                    onClick={onLinkClick} 
                    className="flex items-center gap-4 px-5 py-3 rounded-2xl font-medium text-red-500 bg-white shadow-md hover:bg-red-50 hover:text-red-600 hover:scale-[1.02] transition"
                >
                    <LogOut className="w-6 h-6 shrink-0" />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
}