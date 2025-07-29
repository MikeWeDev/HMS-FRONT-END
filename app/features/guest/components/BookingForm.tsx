"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  maxGuests: number;
  roomId: string;
}

export default function BookingForm({ maxGuests, roomId }: BookingFormProps) {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function isTodayOrLater(dateStr: string) {
    const inputDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate inputs
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!checkin || !checkout) {
      setError("Both check-in and check-out dates are required.");
      return;
    }

    if (!isTodayOrLater(checkin)) {
      setError("Check-in date must be today or later.");
      return;
    }

    if (checkout <= checkin) {
      setError("Check-out must be after check-in.");
      return;
    }

    if (guests < 1 || guests > maxGuests) {
      setError(`Guests must be between 1 and ${maxGuests}.`);
      return;
    }

    // Create booking object
    const booking = {
      name,
      guests,
      checkin,
      checkout,
      roomId,
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage under 'guest-bookings'
    const existing = JSON.parse(localStorage.getItem("guest-bookings") || "[]");
    existing.push(booking);
    localStorage.setItem("guest-bookings", JSON.stringify(existing));

    // Redirect with success message
    router.push("/guest/my-bookings?success=1");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded">
          {error}
        </p>
      )}

      <label className="block">
        Your Name:
        <input
          type="text"
          name="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          className="border rounded px-3 py-2 w-full"
        />
      </label>

      <label className="block">
        Number of Guests:
        <input
          type="number"
          name="guests"
          min={1}
          max={maxGuests}
          required
          value={guests}
          onChange={(e) => {
            setGuests(Number(e.target.value));
            setError("");
          }}
          className="border rounded px-3 py-2 w-full"
        />
      </label>

      <label className="block">
        Check-in Date:
        <input
          type="date"
          name="checkin"
          required
          value={checkin}
          onChange={(e) => {
            setCheckin(e.target.value);
            setError("");
          }}
          className="border rounded px-3 py-2 w-full"
        />
      </label>

      <label className="block">
        Check-out Date:
        <input
          type="date"
          name="checkout"
          required
          value={checkout}
          onChange={(e) => {
            setCheckout(e.target.value);
            setError("");
          }}
          className="border rounded px-3 py-2 w-full"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Confirm Booking
      </button>
    </form>
  );
}
