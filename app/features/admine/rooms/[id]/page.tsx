"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Check,
  AlertCircle,
  BedDouble,
  DollarSign,
  Users,
  Tag,
  Clock,
  ArrowLeft,
  Settings,
} from "lucide-react";

// --- Interfaces ---

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

// --- Utility Functions ---

/**
 * Custom function to extract the ID from the URL path.
 */
const getIdFromPath = (): string | null => {
  if (typeof window === 'undefined') return null; // Ensure this runs only on the client
  const parts = window.location.pathname.split('/');
  const id = parts[parts.length - 1];
  // Basic validation to ensure the ID looks like an actual MongoDB ID (e.g., at least 1 character)
  return id && id.length > 0 ? id : null;
};

/**
 * Custom hook to simulate router.push functionality for compatibility.
 */
const useSimpleRouter = () => ({
  push: (path: string) => {
    window.location.href = path;
  },
});

// --- Main Component ---

export default function EditRoomPage() {
  // Use state to hold the ID, initialized to null to avoid hydration mismatch
  const [roomId, setRoomId] = useState<string | null>(null); 
  const simpleRouter = useSimpleRouter(); 

  const [room, setRoom] = useState<Room | null>(null);
  const [status, setStatus] = useState<Room["status"]>('Available');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // 1. Resolve ID on mount to prevent hydration error
  useEffect(() => {
    setRoomId(getIdFromPath());
  }, []);

  const fetchRoom = useCallback(async (idToFetch: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/rooms/${idToFetch}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch room details");
      }
      
      const data: Room = await res.json();
      setRoom(data);
      
      // Initialize local status state from fetched room status
      if (statusOptions.includes(data.status)) {
        setStatus(data.status);
      } else {
        setStatus('Available');
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Error fetching room: " + err.message);
      } else {
        setError("An unknown error occurred while fetching the room.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Trigger fetch only after roomId is resolved
  useEffect(() => {
    if (roomId) {
      fetchRoom(roomId);
    } else if (roomId === null && !loading) {
        // If ID is null after mount, means invalid URL path
        setError("Invalid URL or Room ID not found.");
        setLoading(false);
    }
  // FIX: Added 'loading' to the dependency array to satisfy the linter rule
  }, [roomId, fetchRoom, loading]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg("");

    try {
      if (!roomId) {
        throw new Error("Cannot save, Room ID is missing.");
      }

      const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/rooms/${roomId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data: { message: string } = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update room status");
      }

      setSuccessMsg(`Room status updated to "${status}" successfully! Redirecting...`);
      setRoom(prev => prev ? { ...prev, status: status } : null);

      setTimeout(() => simpleRouter.push("/features/admine/rooms"), 1500);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Error saving changes: " + err.message);
      } else {
        setError("An unknown error occurred while saving changes.");
      }
    } finally {
      setSaving(false);
    }
  };

  const statusBadgeColor = (status: Room["status"]) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800 border-green-400";
      case "Booked": return "bg-yellow-100 text-yellow-800 border-yellow-400";
      case "Checked-In": return "bg-blue-100 text-blue-800 border-blue-400";
      default: return "bg-gray-100 text-gray-800 border-gray-400";
    }
  };

  if (loading || roomId === null) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
      <span className="mt-4 text-xl font-medium text-gray-700">
        Loading Room {roomId ? roomId.substring(0, 8) + '...' : 'details'}...
      </span>
    </div>
  );

  if (error && !room) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-8">
      <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
      <div className="text-xl font-semibold text-red-800">Error Loading Room</div>
      <div className="text-gray-600 mt-2 text-center max-w-lg">{error}</div>
      <button
        onClick={() => simpleRouter.push("/features/admine/rooms")}
        className="mt-6 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Rooms List
      </button>
    </div>
  );

  if (!room) return null; // Should be covered by error state but good practice

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg shadow-sm">
      <Icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
      <div>
        <div className="text-xs font-medium text-gray-500">{label}</div>
        <div className="text-base font-semibold text-gray-800">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header and Back Button */}
        <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Room {room.roomNumber} Status Management
            </h1>
            <button
                onClick={() => simpleRouter.push("/features/admine/rooms")}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
                <ArrowLeft className="w-4 h-4" /> Back to List
            </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Room Details Card (2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-2xl border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BedDouble className="w-6 h-6 text-blue-600" /> Room Information
            </h2>

            {/* Status Indicator */}
            <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg flex items-center justify-between">
                <div className="text-lg font-medium text-blue-800">
                    Current Status:
                </div>
                <span className={`px-4 py-2 rounded-full text-base font-bold uppercase border-2 shadow-md ${statusBadgeColor(room.status)}`}>
                    {room.status}
                </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem icon={Tag} label="Room Type" value={room.type} />
                <DetailItem icon={DollarSign} label="Price (Birr)" value={new Intl.NumberFormat('en-US').format(room.price)} />
                <DetailItem icon={Users} label="Max Capacity" value={room.capacity} />
            </div>

            {/* Amenities */}
            <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                    {room.amenities.map((a, index) => (
                        <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-medium">
                            {a}
                        </span>
                    ))}
                </div>
            </div>
          </div>

          {/* Status Update Form (1/3 width on large screens) */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-2xl border border-blue-100">
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-600" /> Update Status
            </h2>

            {/* Message Area */}
            {successMsg && (
              <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg font-medium flex items-center gap-3 border border-green-400 animate-pulse">
                <Check className="w-5 h-5" /> {successMsg}
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg font-medium flex items-center gap-3 border border-red-400">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            {/* Status Dropdown */}
            <div className="mb-6  ">
              <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" /> New Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Room["status"])}
                className="w-full border-2 border-gray-300 rounded-xl px-4 border-4 border-green-600 py-3 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-inner appearance-none transition"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} {opt === room.status ? "(Current)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              // Disable if saving or if the status hasn't changed from the current room status
              disabled={saving || status === room.status} 
              className={`w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl text-white font-semibold text-lg transition duration-300 shadow-lg ${
                saving || status === room.status
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Saving...
                </>
              ) : (
                "Apply Status Change"
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">Changes will be visible in the room inventory immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
