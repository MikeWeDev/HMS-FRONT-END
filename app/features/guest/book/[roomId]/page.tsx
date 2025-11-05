// THIS IS THE PAGE THAT RENDER BOOKING FORM COMPONEJT

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookingForm, { RoomDetails } from "@/app/components/BookingForm"; // Import RoomDetails
import { Loader2 } from "lucide-react";

// Define the interface for the raw data from the API (if needed)
interface RawRoomData {
    _id: string;
    roomNumber: string;
    type: string;
    price: number;
    capacity: number;
    amenities: string[];
    image?: string;
}

export default function BookingPage() {
    const params = useParams();
    const roomId = params.roomId;
    const [roomData, setRoomData] = useState<RoomDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch Room Data on Mount
    useEffect(() => {
        async function fetchRoom() {
            if (typeof roomId !== "string") {
                setError("Invalid Room ID.");
                setLoading(false);
                return;
            }
            
            try {
                // Fetch room details from your backend API
                const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/rooms/${roomId}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch room details");
                }

                const data: RawRoomData = await res.json();
                
                // Map the fetched data to the required RoomDetails structure
                const mappedRoom: RoomDetails = {
                    id: data._id,
                    name: `Room ${data.roomNumber} - ${data.type}`,
                    image:`/room-${data.roomNumber}.jpg`, // Use local image if API image is missing
                    description: `A lovely ${data.type} room with a capacity of ${data.capacity} guests.`,
                    price: data.price,
                    capacity: data.capacity,
                    amenities: data.amenities,
                };

                setRoomData(mappedRoom);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError('An unknown error occurred while fetching room details.');
            } finally {
                setLoading(false);
            }
        }
        fetchRoom();
    }, [roomId]); // Re-run if roomId changes

    // 2. Loading State UI
   if (loading)
  return (
    // Loading Screen: Minimalist and centered with a clear spinner or animation (represented by text here)
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-indigo-500 text-2xl font-light">
      <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4">Fetching  room details...</p>
    </div>
  );

    // 3. Error/Not Found State UI
    if (error || !roomData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                 <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                    <h1 className="text-2xl text-red-600 font-bold">Error Loading Room</h1>
                    <p className="text-gray-600 mt-2">{error || "The requested room was not found."}</p>
                </div>
            </div>
        );
    }

    // 4. Render Booking Form with Fetched Data
    return (
        <main className="flex justify-center items-start min-h-screen bg-gray-50 p-6">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
                
               <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center flex items-center justify-center gap-3 py-6">
    Complete Your Reservation
</h1>

               <p className="text-center text-gray-600 border-b pb-4">
                    Review the room details and fill in the form below to confirm your booking.
                </p>

                {/* Pass the fully loaded roomData object to the form */}
                <BookingForm room={roomData} />

                <p className="text-sm text-gray-500 text-center mt-2">
                    You can cancel or modify your booking before check-in.
                </p>
            </div>
        </main>
    );
}