'use client';

import { useEffect, useState } from 'react';
import { getMyBookings } from '../lib/api';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getMyBookings().then(data => {
      console.log('Bookings data:', data);
      setBookings(data);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <ul className="space-y-4">
        {Array.isArray(bookings) ? (
          bookings.map((b: any) => (
            <li key={b._id} className="p-4 border rounded">
              Room: {b.room.type} | Check-in: {b.checkIn.slice(0, 10)} | Check-out: {b.checkOut.slice(0, 10)}
            </li>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </ul>
    </div>
  );
}
