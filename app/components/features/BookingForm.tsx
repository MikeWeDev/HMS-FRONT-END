"use client";

import { useState } from "react";

type Props = {
  roomId: string;
  price: number;
  token: string;
};

export default function BookingForm({ roomId, price, token }: Props) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBooking = async () => {
    if (!checkIn || !checkOut) return alert("Please select both dates");

    const nights =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24);

    const totalPrice = nights * price;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            room: roomId,
            checkIn,
            checkOut,
            totalPrice,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Booking failed");

      setMessage("✅ Booking successful!");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 space-y-4 shadow">
      <h2 className="text-lg font-semibold">Book this Room</h2>
      <label className="block text-sm">
        Check-in:
        <input
          type="date"
          className="mt-1 w-full border rounded px-3 py-2"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Check-out:
        <input
          type="date"
          className="mt-1 w-full border rounded px-3 py-2"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </label>
      <button
        onClick={handleBooking}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}
