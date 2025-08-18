"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";
}

export default function AdminPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRooms() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");

      const data = await res.json();

      // Map room data to include a proper status
      const mappedRooms: Room[] = data.map((room: any) => ({
        ...room,
        status: room.status || (room.isAvailable ? "Available" : "Booked"),
      }));

      setRooms(mappedRooms);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  // Count summary
  const availableCount = rooms.filter((r) => r.status === "Available").length;
  const bookedCount = rooms.filter((r) => r.status === "Booked").length;
  const checkedInCount = rooms.filter((r) => r.status === "Checked-In").length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-10">
      <h1 className="text-3xl font-semibold mb-6">Hotel Rooms Dashboard</h1>

      {/* Summary Cards */}
     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
  {/* Available Rooms */}
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer">
    <div className="flex items-center gap-2 text-green-600">
      <span className="text-3xl font-extrabold">{availableCount}</span>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span className="text-gray-600 mt-2 text-lg font-medium">Available Rooms</span>
  </div>

  {/* Booked Rooms */}
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer">
    <div className="flex items-center gap-2 text-yellow-500">
      <span className="text-3xl font-extrabold">{bookedCount}</span>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-4h6v4M12 3v4m0 0l3-3m-3 3L9 3" />
      </svg>
    </div>
    <span className="text-gray-600 mt-2 text-lg font-medium">Booked Rooms</span>
  </div>

  {/* Checked-In Rooms */}
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer">
    <div className="flex items-center gap-2 text-blue-600">
      <span className="text-3xl font-extrabold">{checkedInCount}</span>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    </div>
    <span className="text-gray-600 mt-2 text-lg font-medium">Checked-In Rooms</span>
  </div>
</div>

      {/* Loading/Error */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Loader2 className="animate-spin w-5 h-5" /> Loading rooms...
        </div>
      )}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Rooms Table */}
      {!loading && rooms.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Room #</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Capacity</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Amenities</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{room.roomNumber}</td>
                  <td className="px-4 py-2 border text-center">{room.type}</td>
                  <td className="px-4 py-2 border text-center">{room.price}</td>
                  <td className="px-4 py-2 border text-center">{room.capacity}</td>
                  <td className="px-4 py-2 border text-center font-medium">{room.status}</td>
                  <td className="px-4 py-2 border text-center">{room.amenities.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
