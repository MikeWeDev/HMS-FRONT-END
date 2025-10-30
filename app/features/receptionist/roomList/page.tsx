"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

// Define the interface for the raw data returned directly from the API
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

// Your existing Room interface, which represents the processed room data in your component
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

// Helper component for visual status indication
const StatusBadge = ({ status }: { status: Room["status"] }) => {
  let color = "bg-gray-200 text-gray-800";
  switch (status) {
    case "Available":
      color = "bg-green-100 text-green-700 ring-1 ring-green-300";
      break;
    case "Booked":
      color = "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300";
      break;
    case "Checked-In":
      color = "bg-blue-100 text-blue-700 ring-1 ring-blue-300";
      break;
    case "Checked-Out":
      color = "bg-red-100 text-red-700 ring-1 ring-red-300";
      break;
  }
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${color}`}>
      {status}
    </span>
  );
};


export default function AdminPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: Using the provided API endpoint
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
        // Provide a default status if the API doesn't return one
        status: room.status || (room.isAvailable ? "Available" : "Booked"),
      }));

      setRooms(mappedRooms);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Count summary
  const availableCount = rooms.filter((r) => r.status === "Available").length;
  const bookedCount = rooms.filter((r) => r.status === "Booked").length;
  const checkedInCount = rooms.filter((r) => r.status === "Checked-In").length;

  return (
    // Fixed: Ensure padding adapts for mobile (p-4) and desktop (sm:p-10)
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-10 w-full">
      <h1 className="text-3xl font-semibold mb-6">Hotel Rooms Dashboard</h1>

      {/* Summary Cards (Inherently responsive grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Available Rooms */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transform transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-2 text-green-600">
            <span className="text-3xl font-extrabold">{availableCount}</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-gray-600 mt-2 text-lg font-medium">Available Rooms</span>
        </div>

        {/* Booked Rooms */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transform transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-2 text-yellow-500">
            <span className="text-3xl font-extrabold">{bookedCount}</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-4h6v4M12 3v4m0 0l3-3m-3 3L9 3" />
            </svg>
          </div>
          <span className="text-gray-600 mt-2 text-lg font-medium">Booked Rooms</span>
        </div>

        {/* Checked-In Rooms */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transform transition-all duration-300 cursor-pointer">
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
        <div className="flex items-center gap-2 text-gray-600 mb-4 justify-center py-8">
          <Loader2 className="animate-spin w-5 h-5" /> Loading rooms...
        </div>
      )}
      {error && <div className="text-red-600 mb-4 text-center py-8 font-medium border border-red-200 bg-red-50 rounded-lg p-3">{error}</div>}

      {/* Rooms List/Table - Render only when not loading and data exists */}
      {!loading && rooms.length > 0 && (
        <>
          {/* 1. Desktop/Tablet View (Original Table) 
             Hidden on small screens (block only on md or larger) */}
          <div className="overflow-x-auto bg-white rounded-xl shadow w-full hidden md:block">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border text-left text-sm font-medium text-gray-600">Room #</th>
                  <th className="px-4 py-3 border text-left text-sm font-medium text-gray-600">Type</th>
                  <th className="px-4 py-3 border text-center text-sm font-medium text-gray-600">Price</th>
                  <th className="px-4 py-3 border text-center text-sm font-medium text-gray-600">Capacity</th>
                  <th className="px-4 py-3 border text-center text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 border text-left text-sm font-medium text-gray-600">Amenities</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 border text-left font-bold">{room.roomNumber}</td>
                    <td className="px-4 py-3 border text-left">{room.type}</td>
                    <td className="px-4 py-3 border text-center font-medium text-green-600">${room.price}</td>
                    <td className="px-4 py-3 border text-center">{room.capacity}</td>
                    <td className="px-4 py-3 border text-center">
                       <StatusBadge status={room.status} />
                    </td>
                    <td className="px-4 py-3 border text-left text-sm text-gray-500">{room.amenities.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. Mobile View (Card List) 
             Visible on small screens (hidden only on md or larger) */}
          <div className="space-y-4 w-full block md:hidden">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white p-4 rounded-xl shadow-md border-t-4 border-blue-500">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-extrabold text-gray-900">Room #{room.roomNumber}</span>
                  <StatusBadge status={room.status} />
                </div>
                
                <div className="text-sm text-gray-600 space-y-1 border-t pt-2 mt-2">
                  <p>
                    <span className="font-semibold text-gray-800">Type:</span> {room.type}
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Price:</span>
                    <span className="font-bold text-lg text-green-600">${room.price}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Capacity:</span> {room.capacity}
                  </p>
                  <p className="pt-2">
                    <span className="font-semibold text-gray-800">Amenities:</span> 
                    <span className="text-xs text-gray-500 block">{room.amenities.join(", ")}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
