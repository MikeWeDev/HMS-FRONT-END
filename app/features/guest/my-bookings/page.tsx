"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // 🔑 Import useRouter
import { FaTrashAlt, FaEdit } from "react-icons/fa"; // 🔑 Import FaEdit

interface Room {
    _id: string;
    name?: string;
    roomNumber?: string;
    image?:string;
}

interface Booking {
    _id: string;
    name: string;
    guests: number;
    checkIn: string;
    checkOut: string;
    room: Room;
    createdAt: string;
    image?:string;
}

function MyBookingsContent() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter(); // 🔑 Initialize router for redirection

    const fetchBookings = useCallback(async () => {
        // ... (existing fetchBookings logic remains the same)
        setLoading(true);
        setError("");
        
        const userId = localStorage.getItem("userId");

        if (!userId) {
            setError("Please log in. User ID (MongoDB ID) is required to view your bookings.");
            setBookings([]);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `https://hms-backend-2k1m.onrender.com/api/bookings/my/${userId}`
            );
            const responseData = await res.json();

            if (!res.ok) {
                if (res.status === 404 && responseData.message === "No bookings found for this user ID") {
                    setBookings([]);
                    setError("");
                    return;
                }
                throw new Error(responseData.message || "Failed to fetch bookings");
            }

            if (!Array.isArray(responseData)) {
                throw new Error("Fetched data is not an array");
            }

            // Match room images from public folder
            const bookingsWithImages = (responseData as Booking[]).map((b) => ({
                ...b,
                room: {
                    ...b.room,
                    image: `/room-${b.room.roomNumber}.jpg`, // Match public folder image
                },
            }));

            setBookings(
                bookingsWithImages.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
            );
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message || "An error occurred");
            else setError("An unknown error occurred");
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
        // ... (existing useEffect logic remains the same)
        if (searchParams.get("success") === "1") {
            setSuccessMsg("✅ Booking confirmed!");
            const timeout = setTimeout(() => setSuccessMsg(""), 3000);

            const url = new URL(window.location.href);
            url.searchParams.delete("success");
            window.history.replaceState(null, "", url.toString());

            return () => clearTimeout(timeout);
        }
        if (searchParams.get("editSuccess") === "1") { // 🔑 Handle edit success message
             setSuccessMsg("✅ Booking updated successfully!");
             const timeout = setTimeout(() => setSuccessMsg(""), 3000);
 
             const url = new URL(window.location.href);
             url.searchParams.delete("editSuccess");
             window.history.replaceState(null, "", url.toString());
 
             return () => clearTimeout(timeout);
         }
    }, [searchParams, fetchBookings]);

    async function deleteBooking(index: number) {
        // ... (existing deleteBooking logic remains the same)
        const bookingToDelete = bookings[index];

        try {
            const res = await fetch(
                `https://hms-backend-2k1m.onrender.com/api/bookings/${bookingToDelete._id}`,
                { method: "DELETE" }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete booking");
            }

            const updated = [...bookings];
            updated.splice(index, 1);
            setBookings(updated);

            setSuccessMsg("❌ Booking successfully canceled.");

        } catch (err: unknown) {
            if (err instanceof Error) console.error(`Error deleting booking: ${err.message}`);
            else console.error("An unknown error occurred while deleting the booking.");
            setError(err instanceof Error ? `Error deleting booking: ${err.message}` : "An unknown error occurred while deleting the booking.");
        }
    }

    // 🔑 New function to redirect to the edit page
    function redirectToEdit(bookingId: string) {
        router.push(`/features/guest/my-bookings/edit/${bookingId}`); 
    }

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}, ${date.getFullYear()}`;
    }

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


    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-gray-900 text-center">📚 My Bookings</h1>

                {successMsg && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-md text-center font-medium">
                        {successMsg}
                    </div>
                )}
                {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-center font-medium">{error}</p>}
                
                {!loading && !error && bookings.length === 0 && (
                    <p className="text-gray-600 text-center font-medium">No bookings yet.</p>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking, index) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Room Image */}
                                <div className="relative w-full h-48">
                                    <img
                                        src={booking.room.image}
                                        alt={booking.room.name || booking.room.roomNumber}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-5 flex flex-col gap-2">
                                    
                                    <>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Room: {booking.room?.name || booking.room?.roomNumber || "Unknown"}
                                        </h2>
                                        <p className="text-gray-700">Name: {booking.name}</p>
                                        <p className="text-gray-700">Guests: {booking.guests}</p>
                                        <p className="text-gray-700 font-medium text-sm">
                                            Dates: {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                                        </p>

                                        {/* 🔑 Add Edit Button */}
                                        <div className="flex justify-start gap-3 mt-4 pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() => redirectToEdit(booking._id)} // 🔑 Call new redirect function
                                                className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition shadow-md group relative"
                                                title="Edit Booking"
                                            >
                                                <FaEdit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteBooking(index)}
                                                className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition shadow-md group relative"
                                                title="Cancel Booking"
                                            >
                                                <FaTrashAlt className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MyBookingsPage() {
    return (
        <Suspense fallback={<div className="text-gray-600 text-center p-4">Loading...</div>}>
            <MyBookingsContent />
        </Suspense>
    );
}