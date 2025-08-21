'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
interface Room {
  _id: string;
  roomNumber: string;
  name: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  status: 'Available' | 'Booked' | 'Checked-In' | 'Checked-Out';
  isAvailable: boolean;
  image: string;
}


const CheckoutPage = () => {
  const [checkedInRooms, setCheckedInRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheckedInRooms = async () => {
      try {
        const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/checkout`);
        if (!res.ok) {
          throw new Error('Failed to fetch checked-in rooms');
        }
        const data = await res.json();
        setCheckedInRooms(data);
      } catch (err: unknown) { // Corrected the typo to 'err: unknown'
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching rooms.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCheckedInRooms();
  }, []);

  const handleCheckout = async (roomId: string) => {
    try {
      const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/checkout/${roomId}`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to complete checkout');
      }

      setCheckedInRooms(checkedInRooms.filter(room => room._id !== roomId));
      alert('Checkout successful!');
    } catch (err: unknown) { // Added 'err: unknown' to handle the error type
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during checkout.');
      }
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Checkout | Hotel Management</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">Checked-In Rooms</h1>
      {checkedInRooms.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">No rooms are currently checked in.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {checkedInRooms.map((room) => (
            <div key={room._id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold">Room {room.roomNumber}</h2>
              <p>Type: {room.type}</p>
              <p>Price: ${room.price}</p>
              <button
                onClick={() => handleCheckout(room._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Check-Out
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;