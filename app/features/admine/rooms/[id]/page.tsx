"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";

const statusOptions = ["Available", "Booked", "Checked-In"];

export default function EditRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function fetchRoom() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/rooms/${id}`);
        if (!res.ok) throw new Error("Failed to fetch room");
        const data = await res.json();
        setRoom(data);
        setStatus(data.status);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg("");
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update room");

      setSuccessMsg(`Room status updated to "${status}" successfully!`);

      setTimeout(() => router.push("/features/admine/rooms"), 1200);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Booked": return "bg-yellow-100 text-yellow-800";
      case "Checked-In": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-600">
      <Loader2 className="animate-spin w-5 h-5" /> Loading...
    </div>
  );

  if (error) return <div className="text-red-600 font-medium">{error}</div>;

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
            onChange={(e) => setStatus(e.target.value)}
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
