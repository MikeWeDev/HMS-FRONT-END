"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export interface Room {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  capacity: number;
}

interface Props {
  room: Room;
}



export default function RoomCard({ room }: Props) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const fallbackImage = "https://via.placeholder.com/400x300?text=Room+Image";

  return (
    <div className="border rounded-2xl shadow-md p-4 max-w-md bg-white">
      <img
        src={imgError ? fallbackImage : room.image}
        alt={room.name}
        onError={() => setImgError(true)}
        className="rounded-xl h-48 w-full object-cover mb-3"
      />
      <h2 className="text-xl font-semibold">{room.name}</h2>
      <p className="text-sm text-gray-500">{room.description}</p>
      <div className="mt-2 text-sm">
        💰 <strong>${room.price}</strong> per night <br />
        🧍 Capacity: {room.capacity}
      </div>
      <button
        onClick={() => router.push(`/guest/book/${room.id}`)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Book Now
      </button>
    </div>
  );
}
