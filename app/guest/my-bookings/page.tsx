"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Booking {
  name: string;
  guests: number;
  checkin: string;
  checkout: string;
  roomId: string;
  timestamp: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [successMsg, setSuccessMsg] = useState("");
  const searchParams = useSearchParams();

  // Track which booking is being edited by index (-1 means none)
  const [editIndex, setEditIndex] = useState<number>(-1);
  // Editable fields state while editing
  const [editFields, setEditFields] = useState<Partial<Booking>>({});

  useEffect(() => {
    const data = localStorage.getItem("guest-bookings");
    if (data) {
      const parsed: Booking[] = JSON.parse(data);
      setBookings(parsed.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)));
    }

    if (searchParams.get("success") === "1") {
      setSuccessMsg("✅ Booking confirmed!");

      const timeout = setTimeout(() => setSuccessMsg(""), 3000);

      // Remove 'success' param from URL so message doesn't show again on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState(null, "", url.toString());

      return () => clearTimeout(timeout);
    }
  }, [searchParams]);

  function deleteBooking(index: number) {
    const updated = [...bookings];
    updated.splice(index, 1);
    setBookings(updated);
    localStorage.setItem("guest-bookings", JSON.stringify(updated));
    if (editIndex === index) {
      setEditIndex(-1);
      setEditFields({});
    }
  }

  function startEditing(index: number) {
    setEditIndex(index);
    setEditFields(bookings[index]);
  }

  function cancelEditing() {
    setEditIndex(-1);
    setEditFields({});
  }

  function saveEdit(index: number) {
    // Basic validation
    if (!editFields.name?.trim()) {
      alert("Name is required.");
      return;
    }
    if (!editFields.checkin || !editFields.checkout) {
      alert("Both check-in and check-out dates are required.");
      return;
    }
    if (new Date(editFields.checkout) <= new Date(editFields.checkin)) {
      alert("Check-out must be after check-in.");
      return;
    }
    if (!editFields.guests || editFields.guests < 1) {
      alert("Guests must be at least 1.");
      return;
    }
    // Update booking
    const updated = [...bookings];
    updated[index] = { ...(updated[index]), ...editFields };
    setBookings(updated);
    localStorage.setItem("guest-bookings", JSON.stringify(updated));
    setEditIndex(-1);
    setEditFields({});
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}, ${date.getFullYear()}`;
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "768px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        📚 My Bookings
      </h1>

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

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {bookings.map((booking, index) => (
            <div
              key={booking.timestamp}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "1rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {editIndex === index ? (
                <div>
                  {/* Editable form */}
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>
                      Name:{" "}
                      <input
                        type="text"
                        value={editFields.name || ""}
                        onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                        style={{ padding: "0.25rem", width: "100%" }}
                      />
                    </label>
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>
                      Guests:{" "}
                      <input
                        type="number"
                        min={1}
                        value={editFields.guests || 1}
                        onChange={(e) =>
                          setEditFields({ ...editFields, guests: Number(e.target.value) || 1 })
                        }
                        style={{ padding: "0.25rem", width: "100%" }}
                      />
                    </label>
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>
                      Check-in:{" "}
                      <input
                        type="date"
                        value={editFields.checkin?.slice(0, 10) || ""}
                        onChange={(e) => setEditFields({ ...editFields, checkin: e.target.value })}
                        style={{ padding: "0.25rem", width: "100%" }}
                      />
                    </label>
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>
                      Check-out:{" "}
                      <input
                        type="date"
                        value={editFields.checkout?.slice(0, 10) || ""}
                        onChange={(e) => setEditFields({ ...editFields, checkout: e.target.value })}
                        style={{ padding: "0.25rem", width: "100%" }}
                      />
                    </label>
                  </div>
                  <div>
                    <button
                      onClick={() => saveEdit(index)}
                      style={{
                        backgroundColor: "#16a34a",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                        marginRight: "0.5rem",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      style={{
                        backgroundColor: "#9ca3af",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
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
                    <h2 style={{ fontWeight: "600" }}>Room: {booking.roomId}</h2>
                    <p>Name: {booking.name}</p>
                    <p>Guests: {booking.guests}</p>
                    <p>
                      {formatDate(booking.checkin)} → {formatDate(booking.checkout)}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => startEditing(index)}
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Edit
                    </button>
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
