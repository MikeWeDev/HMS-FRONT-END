"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Room {
  _id: string;
  name?: string;
  roomNumber?: string;
}

interface Booking {
  _id: string;
  name: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  room: Room;
  createdAt: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const searchParams = useSearchParams();

  // Editing state
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [editFields, setEditFields] = useState<Partial<Booking>>({});

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError("");
      const guestId = localStorage.getItem("guestId");

      if (!guestId) {
        setError("No guest ID found. You have not booked any rooms yet.");
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/bookings/my/${guestId}`);
        const responseData = await res.json();

        if (!res.ok) {
          // Handle 404 (no bookings) separately from real errors
          if (res.status === 404 && responseData.message === "No bookings found for this guest ID") {
            setBookings([]);
            setError(""); // suppress red error message
            return;
          }

          throw new Error(responseData.message || "Failed to fetch bookings");
        }

        if (!Array.isArray(responseData)) {
          throw new Error("Fetched data is not an array");
        }

        setBookings(
          responseData.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (err: any) {
        setError(err.message || "An error occurred");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();

    if (searchParams.get("success") === "1") {
      setSuccessMsg("✅ Booking confirmed!");
      const timeout = setTimeout(() => setSuccessMsg(""), 3000);

      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState(null, "", url.toString());

      return () => clearTimeout(timeout);
    }
  }, [searchParams]);

  async function deleteBooking(index: number) {
    const bookingToDelete = bookings[index];

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete booking");
      }

      const updated = [...bookings];
      updated.splice(index, 1);
      setBookings(updated);

      if (editIndex === index) {
        setEditIndex(-1);
        setEditFields({});
      }
    } catch (err: any) {
      alert(`Error deleting booking: ${err.message || err.toString()}`);
    }
  }

  function startEditing(index: number) {
    setEditIndex(index);
    setEditFields(bookings[index]);
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}, ${date.getFullYear()}`;
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "768px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>📚 My Bookings</h1>

      {successMsg && (
        <div
          style={{
            backgroundColor: "#D1FAE5",
            color: "#065F46",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {successMsg}
        </div>
      )}

      {loading && <p>Loading bookings...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && bookings.length === 0 && <p>No bookings yet.</p>}

      {!loading && !error && bookings.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {bookings.map((booking, index) => (
            <div
              key={booking._id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "1rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {editIndex === index ? (
                <div>
                  {/* Editable form implementation can be added later */}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <h2 style={{ fontWeight: "600" }}>
                      Room: {booking.room?.name || booking.room?.roomNumber || booking.room?._id || "Unknown"}
                    </h2>
                    <p>Name: {booking.name}</p>
                    <p>Guests: {booking.guests}</p>
                    <p>
                      {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                   
                    <button
                      onClick={() => deleteBooking(index)}
                      style={{
                        backgroundColor: "#dc2626",
                        color: "white",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
