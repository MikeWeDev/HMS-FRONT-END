'use client';

import Link from 'next/link';

export default function RoomCard({ room }: { room: any }) {
  return (
    <div className="border rounded p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{room.type}</h3>
      <p>Capacity: {room.capacity}</p>
      <p>Price: ${room.price}</p>
      <Link href={`/booking/${room._id}`}>
        <button className="mt-2 bg-blue-500 text-white px-3 py-1">Book Now</button>
      </Link>
    </div>
  );
}
