"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react"; // Import a spinner icon

export interface Room {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";
}

interface Props {
  room: Room;
  status: string; // passed from parent
}

export default function RoomCard({ room, status }: Props) {
  const router = useRouter();
  // Renamed to actionLoading for clarity across all actions
  const [actionLoading, setActionLoading] = useState(false); 

  const fallbackImage = "https://via.placeholder.com/400x300?text=Room+Image";
  const imgSrc = room.image || fallbackImage;
  const normalizedStatus = status.toLowerCase();

  // Status dot color
const statusColor =
  normalizedStatus === "available"
    ? "bg-green-500"
    : normalizedStatus === "booked"
    ? "bg-yellow-500"
    : normalizedStatus === "checked-in"
    ? "bg-red-500"
    : "bg-gray-400";
  // Button logic
  let buttonLabel = "";
  let onClickHandler: () => void = () => {};
  let buttonDisabled = false; // New variable to control final button disabled state

  if (normalizedStatus === "available") {
    // Client-side navigation action
    buttonLabel = "Book Now";
    onClickHandler = () => {
      setActionLoading(true); // Start loading immediately
      router.push(`/features/guest/book/${room.id}`);
      // Note: setActionLoading(false) isn't strictly needed here 
      // because navigation will unmount the component.
    };
    buttonDisabled = actionLoading;

  } else if (normalizedStatus === "booked") {
    // Client-side navigation action
    buttonLabel = "Check In";
    onClickHandler = () => {
      setActionLoading(true); // Start loading immediately
      router.push(`/features/receptionist/checkin/${room.id}`);
      // Note: setActionLoading(false) isn't strictly needed here 
      // because navigation will unmount the component.
    };
    buttonDisabled = actionLoading;

  } else if (normalizedStatus === "checked-in") {
    // Async API call action
    buttonLabel = "Check Out";
    onClickHandler = () => {
      setActionLoading(true); // Start loading immediately
      router.push(`/features/receptionist/checkout/${room.id}`);
      // Note: setActionLoading(false) isn't strictly needed here 
      // because navigation will unmount the component.
    };
    buttonDisabled = actionLoading; // Disable while waiting for API response
  }
  
  // Use a spinner for the button label when loading
  const displayButtonContent = actionLoading ? (
    <div className="flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        {buttonLabel === 'Book Now' || buttonLabel === 'Check In' ? 'Loading...' : 'Processing...'}
    </div>
  ) : (
    buttonLabel || room.status // Fallback to room status if no action is defined
  );
  
  // Determine if the whole card should have a processing overlay
// while navigation is starting for Book Now and Check In.
const isCardProcessing = actionLoading && normalizedStatus !== "checked-in";

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 transition-transform ${
        isCardProcessing ? 'opacity-70 pointer-events-none' : 'hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl'
    }`}>
      
      {/* Optional: Overlay for when navigation is starting (Book Now / Check In) */}
      {isCardProcessing && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
            <div className="text-blue-600 font-bold flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-sm">Redirecting...</span>
            </div>
        </div>
      )}

      {/* Room Image */}
      <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-3">
        <Image src={imgSrc} alt={room.name} fill style={{ objectFit: "cover" }} className="rounded-2xl" />
      </div>

      {/* Room Name */}
      <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>

      {/* Status Dot */}
      <span className={`w-3 h-3 rounded-full ${statusColor}`}></span>

      {/* Price */}
      <p className="text-gray-600 font-medium">${room.price}/night</p>

      {/* Amenities */}
      <div className="flex flex-wrap gap-2 mt-2">
        {room.amenities.map((feature) => (
          <span
            key={feature}
            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Call to Action */}
      <button
        onClick={onClickHandler}
      disabled={buttonDisabled || !buttonLabel}     
     className={`mt-auto py-2 rounded-xl font-medium shadow-md transition w-full ${
    buttonLabel // <--- Check if any action button label was set (Book, Check In, Check Out)
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
} ${actionLoading ? 'bg-blue-400 cursor-wait' : ''}`}
      >
        {displayButtonContent}
      </button>
    </div>
  );
}