"use client";

import { useEffect, useState } from "react";
import RoomCard from "../../components/RoomCard";
import { BedDouble, Loader2 } from "lucide-react";

// Room interface extended to match RoomCard expected props
export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";

  // Fields expected by RoomCard
  id: string;         // Alias of _id
  name: string;       // e.g., "Room 101"
  description: string; // e.g., "Type: Deluxe • Capacity: 2"
  image: string;      // e.g., placeholder path
}

// Define the interface for the raw data from the API
export interface RawRoom {
    _id: string;
    roomNumber: string;
    type: string;
    price: number;
    capacity: number;
    amenities: string[];
    isAvailable: boolean;
    // status and other fields might not exist in the raw data
    status?: "Available" | "Booked" | "Checked-In" | "Checked-Out";
}

export default function GuestDashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchRooms() {
    try {
      const res = await fetch("https://hms-backend-2k1m.onrender.com/api/rooms");
      if (!res.ok) {
        throw new Error("Failed to fetch rooms");
      }

       const data: RawRoom[] = await res.json();  
      // Filter only available rooms
 const availableRooms = data.filter((room) => room.isAvailable === true);
     const roomsWithStatus: Room[] = availableRooms.map((room) => ({
          ...room,
          id: room._id, // Add id field for RoomCard
          status: "Available", // Since filtered only available
          name: `Room ${room.roomNumber}`,
          description: `Type: ${room.type} • Capacity: ${room.capacity}`,
          image: "/room-placeholder.jpg", // Replace with real image if available
        }));

        setRooms(roomsWithStatus);
    } catch (err: unknown) {
  if (err instanceof Error) {
    // TypeScript now knows 'err' is an Error object
    setError(err.message);
  } else {
    // Handle cases where the error isn't an Error object
    setError('An unknown error occurred');
  }
    } finally {
      setLoading(false);
    }
  }

  fetchRooms();
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
              <RoomCard key={room.id} room={room}  status={room.status}/>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
