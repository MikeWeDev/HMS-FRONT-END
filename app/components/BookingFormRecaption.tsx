"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import { Loader2, Users, Calendar, DollarSign, Hotel } from "lucide-react"; 

// Define the structure of the room data needed for the form
export interface RoomDetails {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
}

interface BookingFormProps {
  room: RoomDetails; 
}

export default function BookingForm({ room }: BookingFormProps) {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Helper for date validation
  function validateDates(checkinDate: string, checkoutDate: string) {
    if (!checkinDate || !checkoutDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkinTime = new Date(checkinDate).getTime();
    const checkoutTime = new Date(checkoutDate).getTime();
    
    // Check-in must be today or in the future
    if (checkinTime < today.getTime()) return false; 
    // Check-out must be strictly after check-in
    if (checkoutTime <= checkinTime) return false; 
    
    return true;
  }

  // Calculate total price based on dates
  const calculatedPrice = useMemo(() => {
    if (!checkin || !checkout || !room.price || !validateDates(checkin, checkout)) {
      return null;
    }
    const checkinTime = new Date(checkin).getTime();
    const checkoutTime = new Date(checkout).getTime();
    const nights = Math.round((checkoutTime - checkinTime) / (1000 * 60 * 60 * 24));
    
    if (nights < 1) return null; 

    return {
        nights,
        totalPrice: nights * room.price
    };
  }, [checkin, checkout, room.price]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const userId = localStorage.getItem("userId");
    const maxGuests = room.capacity;

    if (!userId) {
      setError("Please log in to complete your booking. User ID is required.");
      setLoading(false);
      return;
    }
    if (!name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }
    if (guests < 1 || guests > maxGuests) {
      setError(`Guests must be between 1 and ${maxGuests}.`);
      setLoading(false);
      return;
    }
    if (!calculatedPrice) {
      setError("Please select valid check-in and check-out dates.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://hms-backend-2k1m.onrender.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          room: room.id, 
          name,
          guests,
          checkIn: checkin,
          checkOut: checkout,
          totalPrice: calculatedPrice.totalPrice,
          status: "pending",
          user: userId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Booking failed");
      }

      router.push("/features/receptionist");
       setLoading(false);
    } catch (error: unknown) {
      console.error("Booking failed:", error);
      if (error instanceof Error) setError("Booking failed: " + error.message);
      else setError("Booking failed: Unknown error");
    } 
  }

  const fallbackImage = "https://via.placeholder.com/400x250?text=Room+Image";
  const imgSrc = room.image || fallbackImage;

  return (
    // Invert the grid: Form takes 2/3 (lg:col-span-2) and Details take 1/3 (lg:col-span-1)
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:p-6 p-0">
        
        {/* === COLUMN 1: BOOKING FORM (2/3 width on large screens) === */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8 border border-gray-100 order-2 lg:order-1">
            <h2 className="text-2xl font-extrabold text-gray-900 border-b pb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Your Reservation Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl text-sm">
                        {error}
                    </p>
                )}
                
                {/* --- INPUT BLOCK: Name & Guests --- */}
                <div className="grid sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="relative">
                        <label htmlFor="name" className="text-xs font-semibold text-gray-500 absolute top-2 left-4 px-1 bg-white z-10">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl pt-6 pb-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                            placeholder=""
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Guests */}
                    <div className="relative">
                        <label htmlFor="guests" className="text-xs font-semibold text-gray-500 absolute top-2 left-4 px-1 bg-white z-10">
                            Guests (max {room.capacity})
                        </label>
                        <input
                            type="number"
                            id="guests"
                            min={1}
                            max={room.capacity}
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-xl pt-6 pb-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                            required
                            disabled={loading}
                        />
                        <Users className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 mt-1 pointer-events-none" />
                    </div>
                </div>

                {/* --- INPUT BLOCK: Dates --- */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                        <label htmlFor="checkin" className="text-xs font-semibold text-gray-500 absolute top-2 left-4 px-1 bg-white z-10">Check-In Date</label>
                        <input
                            type="date"
                            id="checkin"
                            value={checkin}
                            onChange={(e) => setCheckin(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl pt-6 pb-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="checkout" className="text-xs font-semibold text-gray-500 absolute top-2 left-4 px-1 bg-white z-10">Check-Out Date</label>
                        <input
                            type="date"
                            id="checkout"
                            value={checkout}
                            onChange={(e) => setCheckout(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl pt-6 pb-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>
                
                {/* --- PRICING SUMMARY --- */}
                <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Final Price Calculation
                    </h3>
                    {calculatedPrice ? (
                        <div className="space-y-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex justify-between text-base text-gray-700 font-medium">
                                <span>{calculatedPrice.nights} Nights @ ${room.price}/night</span>
                                <span>${room.price * calculatedPrice.nights}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-blue-200">
                                <span className="text-2xl font-extrabold text-gray-800">
                                    Total Booking Price
                                </span>
                                <span className="text-4xl font-extrabold text-blue-600">${calculatedPrice.totalPrice}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-base text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            Please select valid check-in and check-out dates to see the total price.
                        </p>
                    )}
                </div>

                {/* --- SUBMIT BUTTON --- */}
                <button
                    type="submit"
                    disabled={loading || !calculatedPrice}
                    className={`w-full py-4 text-white font-bold text-lg rounded-2xl shadow-xl transition duration-300 flex items-center justify-center gap-3 ${
                        loading || !calculatedPrice
                            ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-2xl'
                    }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing Booking...
                        </>
                    ) : (
                        "Confirm & Secure Your Reservation"
                    )}
                </button>
                
                <p className="text-xs text-center text-gray-500 pt-4 border-t">
                    Note: Your booking will be confirmed upon successful submission. A logged-in account is required.
                </p>
            </form>
        </div>

        {/* === COLUMN 2: ROOM INFO SUMMARY (1/3 width on large screens) === */}
        <div className="lg:col-span-1 bg-gray-50 rounded-2xl shadow-md p-4 space-y-4 sticky top-6 self-start order-1 lg:order-2">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <Hotel className="w-5 h-5 text-blue-600" />
                Room Summary
            </h3>
            
            <div className="relative h-40 w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <Image 
                    src={imgSrc} 
                    alt={room.name} 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    style={{ objectFit: "cover" }} 
                />
            </div>

            <p className="text-xl font-bold text-gray-900">{room.name}</p>

            <div className="space-y-2 text-sm text-gray-700">
                <p className="flex justify-between items-center border-b pb-1">
                    <span className="font-medium">Price Per Night:</span>
                    <span className="font-bold text-green-600">${room.price}</span>
                </p>
                <p className="flex justify-between items-center border-b pb-1">
                    <span className="font-medium">Max Capacity:</span>
                    <span className="font-bold">{room.capacity} Guests</span>
                </p>
            </div>

            <div className="pt-2">
                <p className="font-medium text-gray-800 mb-2 text-sm">Key Amenities:</p>
                <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 4).map((feature) => (
                        <span key={feature} className="text-xs bg-white text-blue-600 px-3 py-1 rounded-full border border-blue-200 shadow-sm">
                            {feature}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}