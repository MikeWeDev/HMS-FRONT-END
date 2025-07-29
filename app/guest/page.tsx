"use client";

import { useEffect, useState } from "react";
import { getRooms, Room } from "../features/guest/api/guestApi";
import RoomCard from "../features/guest/components/RoomCard";
import {
  BedDouble,
  Loader2,
} from "lucide-react";


export default function GuestDashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRooms()
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load rooms");
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">

      <main className="flex-1 p-10">
        <div className="mb-6 flex items-center gap-3">
          <BedDouble className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Available Rooms</h2>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin w-5 h-5" />
            Loading rooms...
          </div>
        )}

        {error && <div className="text-red-600">{error}</div>}

        {!loading && rooms.length === 0 && (
          <div className="text-gray-600">No rooms available right now.</div>
        )}

        {!loading && rooms.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
