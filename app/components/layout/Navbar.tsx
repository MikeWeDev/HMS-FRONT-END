'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: "Rooms", path: "/rooms" },
  { name: "My Bookings", path: "/my-bookings" },
  { name: "Login", path: "/auth/login" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">HotelSys</Link>
        <div className="flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`hover:text-blue-500 transition ${
                pathname === link.path ? "text-blue-600 font-semibold" : "text-gray-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
