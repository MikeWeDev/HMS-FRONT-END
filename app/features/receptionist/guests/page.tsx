"use client";

import { useEffect, useState } from "react";
import RoomCard from "../../../components/RoomCardRecption";
import { BedDouble, Loader2 } from "lucide-react";
import Link from 'next/link';

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
          image:`/room-${room.roomNumber}.jpg`, 
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
  <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-gray-200">
    {/* Icon - Use an actual SVG icon (e.g., from Heroicons or Lucide) */}
    <svg className="w-12 h-12 text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
    </svg>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      No Bookings Yet!
    </h3>
    <p className="text-gray-500 text-center max-w-sm">
  It looks like you haven&apos;t booked any rooms yet. Start exploring available options to plan your stay.
</p>
     {/* Optional CTA to View Upcoming Bookings */}
        <Link href="/features/receptionist" className="mt-4 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition duration-150 border border-green-200">
         View Current Avaliable Rooms
        </Link>
  </div>
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