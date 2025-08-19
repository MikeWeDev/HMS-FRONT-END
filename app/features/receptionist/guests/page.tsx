"use client";

import { useEffect, useState } from "react";
import RoomCard from "../../../components/RoomCard";
import { BedDouble, Loader2 } from "lucide-react";

export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function BOOKEDGUST() {
  const [bookedRooms, setBookedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookedRooms() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://hms-backend-2k1m.onrender.com/api/rooms");
        if (!res.ok) throw new Error("Failed to fetch rooms");

        const data = await res.json();

        const filtered = data
          .filter((room: any) => room.status === "Booked")
          .map((room: any) => ({
            ...room,
            id: room._id,
            name: `Room ${room.roomNumber}`,
            description: `Type: ${room.type} • Capacity: ${room.capacity}`,
            image: "/room-placeholder.jpg",
          }));

        setBookedRooms(filtered);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchBookedRooms();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-1 p-10">
        <div className="mb-6 flex items-center gap-3">
          <BedDouble className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Booked Rooms</h2>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin w-5 h-5" />
            Loading booked rooms...
          </div>
        )}

        {error && <div className="text-red-600">{error}</div>}

        {!loading && bookedRooms.length === 0 && (
          <div className="text-gray-600">No rooms are currently booked.</div>
        )}

        {!loading && bookedRooms.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookedRooms.map((room) => (
              <RoomCard key={room.id} room={room} status={room.status} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
