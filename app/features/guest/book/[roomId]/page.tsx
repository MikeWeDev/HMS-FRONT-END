"use client";

import BookingForm from "@/app/components/BookingForm";
import { useParams } from "next/navigation";

// Directly type the params in the function signature
export default function BookingPage() {
  const params = useParams();
  const roomId = params.roomId;

  // Check if roomId is a string before rendering the form
  if (typeof roomId !== 'string') {
    // Optionally, handle the case where roomId is not available
    // For example, by showing a loading state or an error message.
    return <div>Room not found or invalid ID.</div>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Book Room: {roomId}</h1>
      <BookingForm roomId={roomId} />
    </main>
  );
}