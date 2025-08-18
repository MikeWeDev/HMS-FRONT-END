"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  roomId: string;
  maxGuests?: number;
  roomPrice?: number;
}

export default function BookingForm({ maxGuests, roomId, roomPrice }: BookingFormProps) {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔐 Generate or retrieve guestId from localStorage
  function getOrCreateGuestId(): string {
    if (typeof window === "undefined") return "";
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  }

  function validateDates(checkinDate: string, checkoutDate: string) {
    if (!checkinDate || !checkoutDate) return false;
    const checkinTime = new Date(checkinDate).getTime();
    const checkoutTime = new Date(checkoutDate).getTime();
    if (isNaN(checkinTime) || isNaN(checkoutTime)) return false;
    if (checkoutTime <= checkinTime) return false;
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (maxGuests && (guests < 1 || guests > maxGuests)) {
      setError(`Guests must be between 1 and ${maxGuests}.`);
      return;
    }

    if (!validateDates(checkin, checkout)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    // 📅 Calculate total price
    let totalPrice = 0;
    if (roomPrice) {
      const nights = (new Date(checkout).getTime() - new Date(checkin).getTime()) / (1000 * 60 * 60 * 24);
      totalPrice = nights * roomPrice;
    }

    const guestId = getOrCreateGuestId(); // 🆔 Get guestId

    try {
      const token = localStorage.getItem("token"); // Optional JWT

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          room: roomId,
          name,
          guests,
          checkIn: checkin,
          checkOut: checkout,
          totalPrice,
          status: "pending",
          guestId, // 🆔 Send to backend
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Booking failed");
      }

      router.push("/features/guest/my-bookings?success=1");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded">{error}</p>
      )}

      <div>
        <label htmlFor="name" className="block font-semibold mb-1">Full Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="guests" className="block font-semibold mb-1">
          Guests {maxGuests ? `(max ${maxGuests})` : ""}
        </label>
        <input
          type="number"
          id="guests"
          min={1}
          max={maxGuests}
          value={guests}
          onChange={e => setGuests(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="checkin" className="block font-semibold mb-1">Check-In Date</label>
        <input
          type="date"
          id="checkin"
          value={checkin}
          onChange={e => setCheckin(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="checkout" className="block font-semibold mb-1">Check-Out Date</label>
        <input
          type="date"
          id="checkout"
          value={checkout}
          onChange={e => setCheckout(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Confirm Booking
      </button>
    </form>
  );
}
