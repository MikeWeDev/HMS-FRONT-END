"use client";

import { useEffect, useState } from "react";
import { getRooms, Room } from "../../guest/api/guestApi";
import RoomCard from "../../../components/RoomCard";
import { BedDouble, Loader2 } from "lucide-react";

export default function ReceptionistDashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [errorRooms, setErrorRooms] = useState<string | null>(null);

  useEffect(() => {
    getRooms()
      .then((data) => {
        setRooms(data);
        setLoadingRooms(false);
      })
      .catch((err) => {
        setErrorRooms(err.message || "Failed to load rooms");
        setLoadingRooms(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-10 max-w-7xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold mb-6">Receptionist Dashboard</h1>

      {/* Available Rooms */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <BedDouble className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Available Rooms</h2>
        </div>

        {loadingRooms && (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin w-5 h-5" />
            Loading rooms...
          </div>
        )}

        {errorRooms && <div className="text-red-600">{errorRooms}</div>}

        {!loadingRooms && rooms.length === 0 && (
          <div className="text-gray-600">No rooms available right now.</div>
        )}

        {!loadingRooms && rooms.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
