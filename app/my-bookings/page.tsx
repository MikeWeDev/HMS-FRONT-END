"use client";

import GuestLayout from "@/components/layout/GuestLayout";
import { useEffect, useState } from "react";

type Booking = {
  _id: string;
  room: {
    roomNumber: string;
    type: string;
    price: number;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const token = ""; // TODO: replace with token from context or cookies

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load bookings");
        }

        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchBookings();
  }, []);

  return (
    <GuestLayout>
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {bookings.length === 0 && <p>No bookings yet.</p>}

        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-xl shadow p-4 space-y-2"
          >
            <h2 className="text-lg font-semibold">
              Room {booking.room.roomNumber} • {booking.room.type}
            </h2>
            <p>
              <span className="font-medium">Check-in:</span>{" "}
              {new Date(booking.checkIn).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Check-out:</span>{" "}
              {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p>Status: <span className="text-blue-600">{booking.status}</span></p>
            <p>Total: ${booking.totalPrice}</p>
          </div>
        ))}
      </div>
    </GuestLayout>
  );
}
