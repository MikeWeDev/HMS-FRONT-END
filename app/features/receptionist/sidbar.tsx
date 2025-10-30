'use client';

import Link from 'next/link';
import {
    Building2,
    LayoutDashboard,
    CalendarDays,
    User,
    ClipboardList,
    MessageCircle,
    Settings,
    LogOut,
} from 'lucide-react';

interface ReceptionistSidebarProps {
    isMobile?: boolean;
    active?: string; // Active route for styling
    notifications?: { [key: string]: number }; // Notification badges
    // NEW PROP: Function to close the sidebar after a link is clicked (for mobile)
    onLinkClick: () => void;
}

export default function ReceptionistSidebar({
    isMobile = false,
    active,
    notifications = {},
    onLinkClick,
}: ReceptionistSidebarProps) {
    const links = [
        { href: '/features/receptionist', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/features/receptionist/guests', label: 'Check In', icon: User },
        { href: '/features/receptionist/checkout', label: 'Check Out', icon: ClipboardList },
        { href: '/features/receptionist/roomList', label: 'Room List', icon: CalendarDays },
        { href: '/features/receptionist/messages', label: 'Messages', icon: MessageCircle },
        { href: '/features/receptionist/settings', label: 'Settings', icon: Settings },
    ];

    // Define the primary accent color class for Receptionist
    const ACCENT_COLOR_CLASS = 'green'; // Use green for contrast with Guest blue

    return (
        <aside
            className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 flex' : 'hidden md:sticky md:top-0 md:flex'} 
                w-80 bg-gray-50 p-6 flex-col justify-between shadow-2xl`}
        >
            {/* Top Profile Card */}
            <div className="mb-10">
                <div className="flex items-center gap-4 bg-white rounded-2xl p-4 ">
                    <Building2 className={`w-10 h-10 text-${ACCENT_COLOR_CLASS}-600`} />
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">Royal Stay Hotel</h1>
                        <p className="text-sm text-gray-500">Reception Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = active === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onLinkClick}
                            className={`
                                relative flex items-center gap-4 px-5 py-3 rounded-2xl font-medium text-gray-700 transition-all
                                ${isActive 
                                    ? `bg-${ACCENT_COLOR_CLASS}-600 text-white shadow-lg` 
                                    : `bg-white hover:bg-${ACCENT_COLOR_CLASS}-50 hover:scale-[1.03] shadow-md`}
                            `}
                        >
                            {/* Active bar */}
                            {isActive && <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-xl"></span>}

                            <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-white' : `text-${ACCENT_COLOR_CLASS}-600`}`} />
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

            {/* Logout Card */}
            <div className="mt-10">
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