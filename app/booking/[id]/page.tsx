'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRoomById, createBooking } from '../../lib/api';

export default function BookingPage() {
  const router = useRouter();
const params = useParams();
const id = params?.id as string;
  const [room, setRoom] = useState<any>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    getRoomById(id as string).then(setRoom);
  }, [id]);

  const handleBooking = async (e: any) => {
    e.preventDefault();
    try {
      await createBooking({
        room: room._id,
        checkIn,
        checkOut,
        totalPrice: room.price, // Simplified
      });
      alert('Booking successful');
      router.push('/my-bookings');
    } catch {
      alert('Booking failed');
    }
  };

  if (!room) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-xl font-bold mb-2">{room.type}</h2>
      <p className="mb-4">Price: ${room.price}</p>
      <form onSubmit={handleBooking} className="space-y-4">
        <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full border px-3 py-2" />
        <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full border px-3 py-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Book</button>
      </form>
    </div>
  );
}
