// components/navbar.tsx

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  // Placeholder for user login state
  const [user, setUser] = useState<{ name: string } | null>(null);

  // Simulate user login state fetching, replace with real auth logic
  useEffect(() => {
    // Example: check localStorage or API call to get user info
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Add your logout logic here
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">
        HotelSys
      </Link>

      <div className="space-x-6 flex items-center">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/rooms" className="hover:underline">
          Rooms
        </Link>
        <Link href="/my-bookings" className="hover:underline">
          Bookings
        </Link>
        {user && (
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">
            Logout
          </button>
        ) : (
          <Link href="/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
