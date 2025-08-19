"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";

// Assuming this Room interface is consistent with your backend data structure
// You might want to define this in a shared types file (e.g., types/index.ts)
export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";
}

const statusOptions: Room["status"][] = ["Available", "Booked", "Checked-In"];

export default function EditRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  // 1. Specify the type for room state: Room or null
  const [room, setRoom] = useState<Room | null>(null);
  // Ensure status state matches the defined Room status types
  const [status, setStatus] = useState<Room["status"]>('Available'); // Default to 'Available' or suitable initial

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchRoom = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure id is a string before using it in the URL
      if (typeof id !== 'string') {
        throw new Error("Invalid Room ID provided.");
      }
      const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/rooms/${id}`);
      if (!res.ok) {
        const errorData = await res.json(); // Attempt to parse error message
        throw new Error(errorData.message || "Failed to fetch room");
      }
      // 2. Type the fetched data
      const data: Room = await res.json();
      setRoom(data);
      // Ensure the fetched status is one of the valid RoomStatus types
      if (statusOptions.includes(data.status)) {
        setStatus(data.status);
      } else {
        // Handle unexpected status from backend, e.g., default to 'Available'
        setStatus('Available');
        console.warn(`Unexpected room status received: ${data.status}. Defaulting to 'Available'.`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Error fetching room: " + err.message);
        console.error("Error fetching room:", err);
      } else {
        setError("An unknown error occurred while fetching the room.");
        console.error("Unknown error fetching room:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [id]); // Add id to dependency array

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]); // Dependency array includes fetchRoom (due to useCallback)

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg("");
    try {
      if (typeof id !== 'string') {
        throw new Error("Invalid Room ID for saving.");
      }
      const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/rooms/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      // 3. Type the response data for update
      const data: { message: string } = await res.json(); // Assuming the API returns a message
      if (!res.ok) throw new Error(data.message || "Failed to update room");

      setSuccessMsg(`Room status updated to "${status}" successfully!`);

      setTimeout(() => router.push("/features/admine/rooms"), 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Error saving changes: " + err.message);
        console.error("Error saving changes:", err);
      } else {
        setError("An unknown error occurred while saving changes.");
        console.error("Unknown error saving changes:", err);
      }
    } finally {
      setSaving(false);
    }
  };

  const statusBadgeColor = (status: Room["status"]) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Booked": return "bg-yellow-100 text-yellow-800";
      case "Checked-In": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-20px)]">
      <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      <span className="ml-2 text-lg text-gray-600">Loading room details...</span>
    </div>
  );

  // Handle case where room is null after loading (e.g., room not found)
  if (error || !room) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-20px)] text-red-600 text-lg font-medium">
      {error || "Room details could not be loaded or room not found."}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-10 flex justify-center items-start">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Edit Room {room.roomNumber}</h1>

        {/* Current Status */}
        <div className="mb-6 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBadgeColor(room.status)}`}>
            Current Status: {room.status}
          </span>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded font-medium flex items-center gap-2">
            <Check className="w-4 h-4" /> {successMsg}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded font-medium">{error}</div>
        )}

        {/* Status Dropdown */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-gray-700">Room Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Room["status"])} // Cast to correct type
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt} disabled={opt === room.status}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl text-white font-medium transition ${
            saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}