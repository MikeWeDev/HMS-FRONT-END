'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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

export default function RoomCheckInPage() {
  const { id } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const log = (msg: string, data?: any) => {
    console.log(`[DEBUG] ${msg}`, data);
    setDebugLog((prev) => [...prev, `${msg}${data ? ': ' + JSON.stringify(data) : ''}`]);
  };

  useEffect(() => {
    async function fetchRoom() {
      log('Fetching room with ID', id);
      try {
        const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/rooms/${id}`);
        const data = await res.json();
        log('Fetched room data', data);
        setRoom(data);
      } catch (error) {
        log('Error fetching room', error);
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!id) {
      log('Missing ID from useParams!');
    } else {
      fetchRoom();
    }
  }, [id]);

  const handleCheckIn = async () => {
    log('Attempting to check in room', id);
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/checkin/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
});


      log('Check-in response status', res.status);

      if (!res.ok) throw new Error('Failed to check in');

      const updatedRoom = await res.json();
      log('Updated room after check-in', updatedRoom);

      setRoom(updatedRoom.room);
      setSuccess(true);
    } catch (err) {
      log('Check-in error', err);
      console.error('Check-in error:', err);
    }
  };

  if (loading) return <div className="p-6">Loading room data...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">🛎️ Check In Room</h1>

      <div className="mb-2">
        <p><strong>Room ID:</strong> {id}</p>
        <p><strong>Room Name:</strong> {room?.name || 'N/A'}</p>
        <p><strong>Status:</strong> {room?.status || 'N/A'}</p>
      </div>

      {success ? (
        <p className="text-green-600 mt-4">✅ Guest checked in successfully!</p>
      ) : (
        <button
          onClick={handleCheckIn}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Confirm Check-In
        </button>
      )}

      {/* 🐞 Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-md font-semibold mb-2">🔍 Debug Log</h2>
        <pre className="text-xs max-h-64 overflow-y-auto text-gray-700 whitespace-pre-wrap">
          {debugLog.join('\n')}
        </pre>
      </div>
    </div>
  );
}
