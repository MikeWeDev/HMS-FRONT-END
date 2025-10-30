// THIS IS THE PAGE THAT RENDER BOOKING FORM COMPONEJT

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookingForm, { RoomDetails } from "@/app/components/BookingFormRecaption"; // Import RoomDetails
import { Loader2, BedDouble } from "lucide-react";

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
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="ml-3 text-lg text-gray-700">Loading room details...</p>
            </div>
        );
    }

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
                
                <h1 className="text-3xl font-bold text-gray-900 text-center flex items-center justify-center gap-3">
                    <BedDouble className="w-8 h-8 text-blue-600" />
                    Book Room: {roomData.name}
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