"use client";

import { useEffect, useState } from "react";
import RoomCard from "../../../components/RoomCard";
import { BedDouble, Loader2 } from "lucide-react";

// Define the interface for the raw data from the API
export interface RawRoom {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";
 image ?: string;

}

// Define the final interface that includes the derived fields
export interface Room extends RawRoom {
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

        // Explicitly type the fetched data as an array of RawRoom
        const data: RawRoom[] = await res.json();

        // Filter and map the data using the defined types
        const filtered: Room[] = data
          .filter((room) => room.status === "Booked")
          .map((room) => ({
            ...room,
            id: room._id,
            name: `Room ${room.roomNumber}`,
            description: `Type: ${room.type} • Capacity: ${room.capacity}`,
          image: room.image || `/room-${room.roomNumber}.jpg`, 
          }));

        setBookedRooms(filtered);
      } catch (err: unknown) { // Change 'any' to 'unknown' for better type safety
        if (err instanceof Error) {
          setError(err.message || "Something went wrong");
        } else {
          setError("An unknown error occurred.");
        }
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