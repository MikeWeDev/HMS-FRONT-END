"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

// --- Type Definitions ---
export interface RawRoom {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  status?: "Available" | "Booked" | "Checked-In" | "Checked-Out";
}

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

  // --- Fetch Rooms ---
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://hms-backend-2k1m.onrender.com/api/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");

      const data: RawRoom[] = await res.json();

      const mappedRooms: Room[] = data.map((room: RawRoom) => ({
        _id: room._id,
        roomNumber: room.roomNumber,
        type: room.type,
        price: room.price,
        capacity: room.capacity,
        amenities: room.amenities,
        isAvailable: room.isAvailable,
        status: room.status || (room.isAvailable ? "Available" : "Booked"),
      }));

      setRooms(mappedRooms);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // --- Summary Counts ---
  const availableCount = rooms.filter((r) => r.status === "Available").length;
  const bookedCount = rooms.filter((r) => r.status === "Booked").length;
  const checkedInCount = rooms.filter((r) => r.status === "Checked-In").length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 md:p-10 w-[100vw]">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
        Hotel Rooms Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Available */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer  w-[90%] md:w-full">
          <div className="flex items-center gap-2 text-green-600">
            <span className="text-3xl font-extrabold">{availableCount}</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-gray-600 mt-2 text-lg font-medium">Available Rooms</span>
        </div>

        {/* Booked */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer  w-[90%] md:w-full">
          <div className="flex items-center gap-2 text-yellow-500">
            <span className="text-3xl font-extrabold">{bookedCount}</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-4h6v4M12 3v4m0 0l3-3m-3 3L9 3"
              />
            </svg>
          </div>
          <span className="text-gray-600 mt-2 text-lg font-medium">Booked Rooms</span>
        </div>

        {/* Checked-In */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer w-[90%] md:w-full">
          <div className="flex items-center gap-2 text-blue-600">
            <span className="text-3xl font-extrabold">{checkedInCount}</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </div>
          <span className="text-gray-600 mt-2 text-lg font-medium">Checked-In Rooms</span>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
          <Loader2 className="animate-spin w-5 h-5" /> Loading rooms...
        </div>
      )}
      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

      {/* Rooms Table */}
      {!loading && rooms.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full border-collapse text-sm md:text-base">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border text-left whitespace-nowrap">Room #</th>
                <th className="px-4 py-3 border text-left whitespace-nowrap">Type</th>
                <th className="px-4 py-3 border text-left whitespace-nowrap">Price</th>
                <th className="px-4 py-3 border text-left whitespace-nowrap">Capacity</th>
                <th className="px-4 py-3 border text-left whitespace-nowrap">Status</th>
                <th className="px-4 py-3 border text-left whitespace-nowrap">Amenities</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr
                  key={room._id}
                  className="hover:bg-gray-50 transition-all duration-150 border-b last:border-none"
                >
                  <td className="px-4 py-2">{room.roomNumber}</td>
                  <td className="px-4 py-2">{room.type}</td>
                  <td className="px-4 py-2">${room.price}</td>
                  <td className="px-4 py-2">{room.capacity}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      room.status === "Available"
                        ? "text-green-600"
                        : room.status === "Booked"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  >
                    {room.status}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                      {room.amenities.map((a, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs md:text-sm"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
