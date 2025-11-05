"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaCalendarAlt, FaUser, FaHotel, FaCheck, FaSpinner } from 'react-icons/fa';

interface BookingData {
    name: string;
    guests: number;
    checkIn: string;
    checkOut: string;
    room: { _id: string; name?: string; roomNumber?: string };
}

export default function EditBookingPage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.id as string;

    const [loading, setLoading] = useState(true); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    // 🔑 NEW STATE: Tracks successful submission right before redirect
    const [isSuccess, setIsSuccess] = useState(false); 
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<Partial<BookingData>>({});
    const [originalRoomId, setOriginalRoomId] = useState<string | null>(null);

    // 1. Fetch current booking details (unchanged)
    useEffect(() => {
        if (!bookingId) return;

        /* eslint-disable @typescript-eslint/no-explicit-any */
        async function fetchBooking() {
            setLoading(true);
            setError('');
            
            try {
                // ... (initial fetch logic remains the same)
                const url = `https://hms-backend-2k1m.onrender.com/api/bookings/${bookingId}`;
                const res = await fetch(url);
                
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to fetch booking details');
                }
                
                const data = await res.json();
                
                const defaultName = 'N/A';
                const defaultGuests = 1;
                const defaultDate = new Date().toISOString().split('T')[0];
                
                const bookingData = {
                    name: data.name || defaultName,
                    guests: data.guests || defaultGuests,
                    checkIn: data.checkIn,
                    checkOut: data.checkOut,
                    room: data.room || { _id: 'no_room_id', name: 'Unknown Room' }
                };

                let checkInDate = defaultDate;
                if (bookingData.checkIn) {
                    try {
                        checkInDate = new Date(bookingData.checkIn).toISOString().split('T')[0];
                    } catch (e) { /* warn */ }
                }
                
                let checkOutDate = defaultDate;
                if (bookingData.checkOut) {
                    try {
                        checkOutDate = new Date(bookingData.checkOut).toISOString().split('T')[0];
                    } catch (e) { /* warn */ }
                }
                
                const newFormData = {
                    name: bookingData.name,
                    guests: Number(bookingData.guests), 
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    room: bookingData.room 
                };

                setFormData(newFormData);
                setOriginalRoomId(bookingData.room._id);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false); 
            }
        }
        fetchBooking();
    }, [bookingId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? parseInt(value, 10) : value;
        setFormData({ ...formData, [name]: newValue });
    };

    // 2. Handle form submission (Modified for success state + redirect)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true); 
        setIsSuccess(false); // Reset success state
        
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("User not logged in.");
            setIsSubmitting(false); 
            return;
        }
        
        if (!formData.name || !formData.guests || !formData.checkIn || !formData.checkOut || !originalRoomId) {
            setError("Internal error: Form data is incomplete.");
            setIsSubmitting(false); 
            return;
        }

        try {
            const { room, ...dataToSend } = formData;
            const updatePayload: any = {
                ...dataToSend, 
                user: userId,
                room: originalRoomId, 
            };
            
            if (typeof updatePayload.guests !== 'number') {
                 updatePayload.guests = Number(updatePayload.guests);
            }

            const res = await fetch(
                `https://hms-backend-2k1m.onrender.com/api/bookings/${bookingId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatePayload),
                }
            );

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update booking');
            }

            // 🔑 NEW LOGIC: Set success state briefly before redirecting
            setIsSuccess(true);
            setTimeout(() => {
                // Execute redirect after brief success display (500ms)
                router.push(`/features/guest/my-bookings`); 
            }, 500); 

        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false); 
            setIsSuccess(false); // Ensure success is false on error
        } 
        // We handle setIsSubmitting(false) in catch or rely on redirect to unmount component
    };

    // --- Button Content Logic ---
    const getButtonContent = () => {
        if (isSuccess) {
            return (
                <>
                    <FaCheck className="w-4 h-4 mr-2" />
                    Updated!
                </>
            );
        }
        if (isSubmitting) {
             return (
                <>
                    <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                    Updating...
                </>
            );
        }
        return 'Update Booking';
    };

    const getButtonClass = () => {
        let baseClass = "w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50";
        
        if (isSuccess) {
            return `${baseClass} bg-green-500 hover:bg-green-600 focus:ring-green-500`;
        }
        if (isSubmitting) {
             return `${baseClass} bg-indigo-700 focus:ring-indigo-500`;
        }
        return `${baseClass} bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`;
    };
    // --- End Button Content Logic ---


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
    if (error) return <p className="text-red-600 bg-red-50 p-4 rounded-md text-center">{error}</p>;
    //if (!formData.name) return <p className="text-center p-8">Booking not found.</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">✏️ Edit Booking</h1>
                
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h2 className="text-xl font-semibold text-blue-800 flex items-center"><FaHotel className="mr-2"/>Room: {formData.room?.name || formData.room?.roomNumber || "Unknown"}</h2>
                    <p className="text-blue-700 text-sm">Room selection is disabled for editing in this basic view.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... (Input fields remain the same) ... */}
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Guest Name</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                                className="block w-full text-black rounded-md border-gray-300 pl-10 pr-3 py-2 border focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    {/* Guests */}
                    <div>
                        <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Number of Guests</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="number"
                                name="guests"
                                id="guests"
                                value={formData.guests !== undefined && formData.guests !== null ? formData.guests : 1}
                                onChange={handleChange}
                                min="1"
                                required
                                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 border focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    {/* Check-in Date */}
                    <div>
                        <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">Check-in Date</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="date"
                                name="checkIn"
                                id="checkIn"
                                value={formData.checkIn || ''}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 border focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    {/* Check-out Date */}
                    <div>
                        <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">Check-out Date</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="date"
                                name="checkOut"
                                id="checkOut"
                                value={formData.checkOut || ''}
                                onChange={handleChange}
                                min={formData.checkIn || ''}
                                required
                                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 border focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        // Disable if submitting or if success state is active (to prevent early navigation)
                        disabled={isSubmitting || isSuccess} 
                        className={getButtonClass()}
                    >
                        {getButtonContent()}
                    </button>
                </form>
            </div>
        </div>
    );
}