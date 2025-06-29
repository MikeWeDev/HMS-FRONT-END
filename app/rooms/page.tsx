'use client';

import { useEffect, useState } from 'react';
import { getRooms } from '../lib/api';
import RoomCard from '../components/RoomCard';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms().then(setRooms);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Available Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room: any) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
}
