"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function fetchRooms() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data = await res.json();
      setRooms(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Booked":
        return "bg-yellow-100 text-yellow-800";
      case "Checked-In":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-10">
      <h1 className="text-3xl font-semibold mb-6">Hotel Rooms</h1>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin w-5 h-5" /> Loading...
        </div>
      )}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && rooms.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Capacity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amenities</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Edit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr
                  key={room._id}
                  className="hover:bg-gray-50 transition duration-200 ease-in-out"
                >
                  <td className="px-4 py-3">{room.roomNumber}</td>
                  <td className="px-4 py-3">{room.type}</td>
                  <td className="px-4 py-3">{room.price} Birr</td>
                  <td className="px-4 py-3">{room.capacity}</td>
                  <td>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${statusColor(
                        room.status
                      )}`}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{room.amenities.join(", ")}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => router.push(`/features/admine/rooms/${room._id}`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && rooms.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No rooms available.</div>
      )}
    </div>
  );
}
