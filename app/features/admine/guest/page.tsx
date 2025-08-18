'use client';

import { useEffect, useState } from "react";
import { HiOutlineUser, HiOutlineTrash } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';

interface User {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchGuests() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();

      // ✅ Only guests
      const guestUsers = data.data.filter((u: User) => u.role === "guest");
      setGuests(guestUsers);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guest?")) return;
    setRefreshing(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/admin/users/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      setGuests(guests.filter(u => u._id !== id));
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setRefreshing(false);
    }
  };

  // Counts for cards
  const totalGuests = guests.length;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-1 p-10">
        <h2 className="text-2xl font-bold mb-6">Registered Guests</h2>

        {/* Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300">
            <div className="flex items-center gap-2 text-green-600">
              <HiOutlineUser className="w-6 h-6" />
              <span className="text-3xl font-extrabold">{totalGuests}</span>
            </div>
            <span className="text-gray-600 mt-2 text-lg font-medium">Total Guests</span>
          </div>
        </div>

        {/* Guests Table */}
        {loading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin w-5 h-5" />
            Loading guests...
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Username</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Registered At</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {guests.map(guest => (
                  <tr key={guest._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{guest.username}</td>
                    <td className="px-6 py-4">{guest.role}</td>
                    <td className="px-6 py-4">{new Date(guest.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(guest._id)}
                        disabled={refreshing}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <HiOutlineTrash className="w-5 h-5 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
                {guests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No guests registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
