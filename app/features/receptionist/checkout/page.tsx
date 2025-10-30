'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';

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
  
  // Initialize the router
  const router = useRouter();


  useEffect(() => {
    const fetchCheckedInRooms = async () => {
      try {
        const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/checkout`);
        if (!res.ok) {
          throw new Error('Failed to fetch checked-in rooms');
        }
        const data: Room[] = await res.json();
        
        // Map over the fetched data to explicitly set the local image path
        const roomsWithLocalImagePaths = data.map(room => ({
            ...room,
            // Explicitly set the path to match the required format
            image: `/room-${room.roomNumber}.jpg`, 
        }));
        
        setCheckedInRooms(roomsWithLocalImagePaths);
      } catch (err: unknown) {
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


  // Update handleCheckout to redirect to the specific room's checkout page
  const handleCheckout = (roomId: string) => {
    router.push(`/features/receptionist/checkout/${roomId}`);
  };


   if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-indigo-500 text-2xl font-light">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4">Fetching checkout details...</p>
      </div>
    );
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;


  return (
   <div className="container mx-auto p-4">
  <Head>
    <title>Checkout | Hotel Management</title>
  </Head>
  <h1 className="text-3xl font-bold mb-6">Checked-In Rooms</h1>

 {checkedInRooms.length === 0 ? (
  <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-gray-300 rounded-xl shadow-inner">
    {/* Icon: Using a Key or Door to symbolize Check-In/Stay */}
    <svg className="w-14 h-14 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2v5.5a3.5 3.5 0 01-7 0V9a2 2 0 012-2M12 21h.01M12 3a7 7 0 00-7 7v4.5a7 7 0 0014 0V10a7 7 0 00-7-7z"></path>
    </svg>
    
    <h3 className="text-xl font-bold text-gray-800 mb-2">
     No Departures to Process
    </h3>
    
    <p className="text-md text-gray-500 text-center max-w-md">
      There are **no rooms currently pending check-out**. Guests who have departed and require final billing will appear here.
    </p>
    
    {/* Optional CTA to View Upcoming Bookings */}
    <Link href="/features/receptionist/guests" className="mt-4 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition duration-150 border border-green-200">
     View Current Check-Ins
    </Link>
  </div>
) : (
    <div className="flex flex-wrap -mx-2 items-start">
      {checkedInRooms.map((room) => (
        <div
          key={room._id}
          className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex"
        >
          <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-full w-full">
            
            {/* 1. Room Image */}
            <div className="relative h-48 w-full">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              {/* Status badge */}
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {room.status}
              </span>
            </div>

            {/* 2. Room Details */}
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{room.name}</h2>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Room {room.roomNumber}</h3>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm mb-4 gap-2">
                <p className="text-gray-600">
                  Type: <span className="font-medium text-gray-900">{room.type}</span>
                </p>
                <p className="text-gray-600">
                  Price: <span className="font-extrabold text-green-600">${room.price}</span> / night
                </p>
              </div>

              {/* Button */}
              <button
                onClick={() => handleCheckout(room._id)}
                className="mt-auto w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
              >
                Process Check-Out
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default CheckoutPage;