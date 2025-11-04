"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  CheckCircle,
  Clock,
  KeyRound,
  BedDouble,
  DollarSign,
  Users,
  AlertCircle,
  ExternalLink,
  ClipboardList,
} from "lucide-react";

// --- Type Definitions ---
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

const statusColorMap: Record<Room["status"], string> = {
  Available: "bg-green-50 text-green-700 ring-green-600/20",
  Booked: "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Checked-In": "bg-blue-50 text-blue-700 ring-blue-600/20",
  "Checked-Out": "bg-gray-50 text-gray-700 ring-gray-600/20",
};

// Custom router hook to handle navigation without Next.js dependency
const useSimpleRouter = () => ({
  push: (path: string) => {
    // In a real application, this would be a full client-side route change
    console.log(`Navigating to: ${path}`);
    // Fallback for browser environment
    window.location.href = path; 
  },
});


// --- Reusable Components ---

const StatusBadge: React.FC<{ status: Room["status"] }> = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusColorMap[status]}`}
  >
    {status}
  </span>
);

const SummaryCard: React.FC<{ title: string, count: number, icon: React.ElementType, color: string }> = ({ title, count, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
    <div className={`p-3 rounded-full ${color} bg-opacity-10 mb-3`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div className="text-4xl font-extrabold text-gray-900">{count}</div>
    <span className="text-gray-500 mt-1 text-base font-semibold">{title}</span>
  </div>
);


// --- Main Component ---

export default function AdminPage() {
  const simpleRouter = useSimpleRouter();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Rooms ---
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://hms-backend-2k1m.onrender.com/api/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");

      const data: Room[] = await res.json(); // Use any for raw fetch data

      const mappedRooms: Room[] = data.map((room) => ({
        _id: room._id,
        roomNumber: room.roomNumber,
        type: room.type,
        price: room.price,
        capacity: room.capacity,
        amenities: room.amenities || [],
        isAvailable: room.isAvailable,
        // Ensure status field exists, defaulting based on isAvailable if missing
        status: room.status || (room.isAvailable ? "Available" : "Booked"),
      }));

      // Sort by room number for cleaner display
      mappedRooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true, sensitivity: 'base' }));

      setRooms(mappedRooms);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // --- Summary Counts ---
  const availableCount = rooms.filter((r) => r.status === "Available").length;
  const bookedCount = rooms.filter((r) => r.status === "Booked").length;
  const checkedInCount = rooms.filter((r) => r.status === "Checked-In").length;
  const totalCount = rooms.length;


  // --- Render Functions ---

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
      <span className="mt-4 text-xl font-medium text-gray-700">Loading Hotel Rooms Dashboard...</span>
    </div>
  );

  if (error && rooms.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-8 text-red-700">
      <AlertCircle className="w-12 h-12 mb-4" />
      <div className="text-xl font-bold">Data Fetch Error</div>
      <p className="mt-2 text-center max-w-lg">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-8 w-[100vw] md:w-[calc(100vw-22rem)]">
      {/* Header */}
      <h1 className="md:text-4xl text-xl font-extrabold text-gray-900 mb-8 tracking-tight border-b pb-2">
        Hotel Room Inventory
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <SummaryCard 
          title="Total Rooms" 
          count={totalCount} 
          icon={BedDouble} 
          color="text-gray-500" 
        />
        <SummaryCard 
          title="Available" 
          count={availableCount} 
          icon={CheckCircle} 
          color="text-green-600" 
        />
        <SummaryCard 
          title="Booked" 
          count={bookedCount} 
          icon={Clock} 
          color="text-amber-500" 
        />
        <SummaryCard 
          title="Checked-In" 
          count={checkedInCount} 
          icon={KeyRound} 
          color="text-blue-600" 
        />
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="p-6 border-b flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-gray-700"/>
            <h2 className="text-xl font-bold text-gray-800">Room Status List ({rooms.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Room #</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Type / Capacity</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Price (Birr)</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Amenities</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rooms.map((room) => (
                <tr key={room._id} className="hover:bg-blue-50 transition-all duration-150">
                  
                  {/* Room Number */}
                  <td className="px-6 py-4 font-bold text-lg text-gray-900 whitespace-nowrap">
                    {room.roomNumber}
                  </td>
                  
                  {/* Type / Capacity */}
                  <td className="px-6 py-4">
                    <div className="text-base font-medium text-gray-700">{room.type}</div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Users className="w-3 h-3 mr-1" /> Max {room.capacity}
                    </div>
                  </td>
                  
                  {/* Price */}
                  <td className="px-6 py-4 text-gray-700 hidden sm:table-cell">
                    <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-green-600" /> 
                        {new Intl.NumberFormat('en-US').format(room.price)}
                    </div>
                  </td>
                  
                  {/* Amenities */}
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {room.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs whitespace-nowrap">
                          {a}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-0.5">+{room.amenities.length - 3} more</span>
                      )}
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={room.status} />
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => simpleRouter.push(`/features/admine/rooms/${room._id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-blue-500 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition shadow-md"
                    >
                      <ExternalLink className="w-4 h-4" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
