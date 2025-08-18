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
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";
}

interface Props {
  room: Room;
  status: string; // status passed from parent
}

export default function RoomCard({ room, status }: Props) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fallbackImage = "https://via.placeholder.com/400x300?text=Room+Image";
  const normalizedStatus = status?.toLowerCase();

  // Status label with color
  let statusElement;
  switch (normalizedStatus) {
    case "booked":
      statusElement = <span className="text-red-600 font-semibold">Booked</span>;
      break;
    case "checked-in":
      statusElement = <span className="text-yellow-600 font-semibold">Checked-In</span>;
      break;
    case "checked-out":
      statusElement = <span className="text-gray-600 font-semibold">Checked-Out</span>;
      break;
    case "available":
    default:
      statusElement = <span className="text-green-600 font-semibold">Available</span>;
      break;
  }

  // Determine button label and click handler
  let buttonLabel = "";
  let onClickHandler: () => void = () => {};

  if (normalizedStatus === "available") {
    buttonLabel = "Book Now";
    onClickHandler = () => router.push(`/features/guest/book/${room.id}`);
  } else if (normalizedStatus === "booked") {
    buttonLabel = "Check In";
    onClickHandler = () => router.push(`/features/receptionist/checkin/${room.id}`);
  } else if (normalizedStatus === "checked-in") {
    buttonLabel = loading ? "Processing..." : "Check Out";
    onClickHandler = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/rooms/checkout/${room.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to check out");

        // Refresh current page or trigger data reload
        router.refresh();
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert("Checkout failed: " + error.message);
        } else {
          alert("Checkout failed: Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };
  }

  return (
    <div className="border rounded-2xl shadow-md p-4 max-w-md bg-white">
      <img
        src={imgError ? fallbackImage : room.image}
        alt={room.name}
        onError={() => setImgError(true)}
        className="rounded-xl h-48 w-full object-cover mb-3"
      />
      <h2 className="text-xl font-semibold">{room.name}</h2>
      <p className="text-sm text-gray-500 mb-2">{room.description}</p>

      <div className="mb-2">
        <span className="font-bold">Status: </span>
        {statusElement}
      </div>

      <div className="text-sm mb-2">
        💰 <strong>${room.price}</strong> per night <br />
        🧍 Capacity: {room.capacity}
      </div>

      {/* Show button only when applicable */}
      {buttonLabel && (
        <button
          onClick={onClickHandler}
          disabled={loading}
          className={`mt-4 px-4 py-2 rounded-lg text-white transition ${
            normalizedStatus === "available" || normalizedStatus === "booked"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
