'use client';

import { useEffect, useState } from 'react';
import { useParams,useRouter } from 'next/navigation';

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
  image?: string;
}

export default function RoomCheckInPage() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  // const [debugLog, setDebugLog] = useState<string[]>([]); // REMOVED: Unused, Error at line 80

  // Removed: The 'log' helper function is not needed if 'debugLog' is unused.
  // const log = (msg: string, data?: unknown) => {
  //   console.log(`[DEBUG] ${msg}`, data);
  //   setDebugLog((prev) => [...prev, `${msg}${data ? ': ' + JSON.stringify(data) : ''}`]);
  // };

  useEffect(() => {
    async function fetchRoom() {
      console.log(`[DEBUG] Fetching room with ID: ${id}`);
      try {
        const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/rooms/${id}`);
        const data = await res.json();
        console.log('[DEBUG] Fetched room data', data);

        const mappedRoom: Room = {
          ...data,
          image: `/room-${data.roomNumber}.jpg`,
        };

        setRoom(mappedRoom);
      } catch (error) {
        console.log('[DEBUG] Error fetching room', error);
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!id) {
      console.log('[DEBUG] Missing ID from useParams!');
    } else {
      fetchRoom();
    }
  }, [id]);

  const handleCheckIn = async () => {
    console.log(`[DEBUG] Attempting to check in room: ${id}`);
    try {
      const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/rooms/checkin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('[DEBUG] Check-in response status', res.status);

      if (!res.ok) throw new Error('Failed to check in');

      const updatedRoom = await res.json();
      console.log('[DEBUG] Updated room after check-in', updatedRoom);

      setRoom({
        ...updatedRoom.room,
        image: `/room-${updatedRoom.room.roomNumber}.jpg`,
      });
      setSuccess(true);
       setTimeout(() => {
       router.push('/features/receptionist/guests');
      }, 1000);
    } catch (err) {
      console.log('[DEBUG] Check-in error', err);
      console.error('Check-in error:', err);
    }
  };

  const statusColors = {
    'Available': 'bg-green-100 text-green-800',
    'Booked': 'bg-yellow-100 text-yellow-800',
    'Checked-In': 'bg-blue-100 text-blue-800',
    'Checked-Out': 'bg-gray-100 text-gray-800',
  };


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

if (!room)
  return (
    // Error Screen: Clear visual error indication
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
      <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.39 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      <h1 className="text-4xl font-bold text-red-500 mb-2">404 - Room Access Denied</h1>
      <p className="text-xl text-gray-400">The requested room does not exist or the link is broken.</p>
    </div>
  );

return (
// Header Image Focus Layout (Full-Width Header and Stacked Content)
<div className="min-h-screen bg-gray-900 text-white">

  {/* 1. Full-Width Header Image Section */}
  <div className="relative h-[60vh] md:h-[80vh] overflow-hidden shadow-2xl">
    
    {/* Image Container */}
    <img
      src={room.image}
      alt={room.name}
      // Key Change: object-cover for full background visual impact
      className="w-full h-full object-cover transition-all duration-700 ease-in-out brightness-75"
    />
    
    {/* Gradient for Text Readability and Style */}
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent pointer-events-none"></div>

    {/* Header Content - Centered */}
    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
      <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight drop-shadow-lg leading-tight text-white">
        {room.name}
      </h1>
      <p className="mt-4 text-2xl font-light text-indigo-300 max-w-3xl">
        {room.description}
      </p>
    </div>
    
  </div>

  {/* 2. Main Content Section - Stacked Cards */}
  <div className="max-w-7xl mx-auto -mt-16 relative z-10 px-4 md:px-8 pb-12">
    
    {/* Top Row: Price/Status Card & Action Button */}
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-4 md:mb-8 mb-2">
      
      {/* Price & Status Card (Left 2/3) */}
     <div className="md:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center border-l-8 border-indigo-500 gap-4">
    
    {/* Price Section */}
    <div className="text-left">
        <span className="text-sm sm:text-lg font-medium text-gray-400 block">Current Price</span>
        <span className="text-2xl sm:text-4xl font-extrabold text-green-400">${room.price} / night</span>
    </div>

    {/* Status Section */}
    <div className="text-left sm:text-right">
        <span className="text-sm sm:text-lg font-medium text-gray-400 block">Current Status</span>
        <span className={`mt-1 inline-block px-3 py-1 sm:px-5 sm:py-2 rounded-lg font-extrabold text-base sm:text-lg shadow-md ${statusColors[room.status]}`}>
            {room.status}
        </span>
    </div>
</div>

      {/* Action Button (Right 1/3) */}
      <div className="md:col-span-1">
    {success ? (
      <div className="w-full h-auto py-4 sm:h-full text-center bg-green-900/50 rounded-2xl flex items-center justify-center transition-all duration-300">
        <p className="text-xl sm:text-2xl text-green-400 font-extrabold p-2">
          ✅ Confirmed!
        </p>
      </div>
    ) : (
      <button
        onClick={handleCheckIn}
        // KEY CHANGE: Removed h-full on mobile, added specific py-3/4 for button height
        className="w-full px-8 py-5 sm:py-4 bg-red-600 text-white rounded-2xl font-extrabold uppercase tracking-wider text-base sm:text-lg shadow-2xl shadow-red-500/50 
                 hover:bg-red-500 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
      >
        Process Check-In
      </button>
    )}
</div>

    </div>
    


    {/* Room Details Panel */}
    <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border-t-4 border-indigo-500">
    <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 border-b border-gray-700 pb-2 sm:pb-3 text-indigo-400">
        Key Room Attributes
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Room Type */}
        <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-medium text-gray-400">Type</span>
            <span className="text-base sm:text-xl font-bold">{room.type}</span>
        </div>
        
        {/* Max Capacity */}
        <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-medium text-gray-400">Capacity</span>
            <span className="text-base sm:text-xl font-bold">{room.capacity} Guests</span>
        </div>

        {/* Notes/Long Description */}
        <div  className="flex flex-col col-span-2 sm:col-span-4 mt-2 sm:mt-4">
            <span className="text-xs sm:text-sm font-medium text-gray-400">Room Overview</span>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">This premium room includes a complimentary breakfast and access to the executive lounge. It is situated on the 10th floor, offering a stunning panoramic view of the city skyline. Perfect for business travelers or couples seeking a luxurious escape.</p>
        </div>
        
    </div>
</div>

  </div>
</div>
);
}