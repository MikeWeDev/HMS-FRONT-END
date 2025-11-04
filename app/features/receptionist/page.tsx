"use client";

import { useEffect, useState } from "react";
import RoomCard from "../../components/RoomCardRecption";
import { BedDouble, Loader2 } from "lucide-react";

// New interface for the raw data fetched from the API
interface RawRoomApiData {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";
  image?:string;
}

// Your existing Room interface remains the same
export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function ReceptionistDashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [filterStatus, setFilterStatus] = useState<"All" | Room["status"]>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRooms() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://hms-backend-2k1m.onrender.com/api/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");

      const data: RawRoomApiData[] = await res.json();
      
      const roomsWithStatus: Room[] = data.map((room) => {
        const status = room.status || "Available"; // fallback
        
        const mappedRoom: Room = {
          ...room,
          id: room._id,
          name: `Room ${room.roomNumber}`,
          description: `Type: ${room.type} • Capacity: ${room.capacity}`,
          image: `/room-${room.roomNumber}.jpg`,  
          status,
        };
        
        return mappedRoom;
      });
      
      setRooms(roomsWithStatus);
      setFilteredRooms(roomsWithStatus);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (filterStatus === "All") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => room.status === filterStatus);
      setFilteredRooms(filtered);
    }
  }, [filterStatus, rooms]);

  // List of filter options
  const filterOptions: Array<"All" | Room["status"]> = [
    "All",
    "Available",
    "Booked",
    "Checked-In",
   
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-1 p-10">
        <div className="mb-6 flex items-center gap-3">
          <BedDouble className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">All Rooms</h2>
        </div>

        {/* Filter Section */}
<div className="mb-6 flex items-center gap-4">
  <label htmlFor="status-filter" className="font-medium text-gray-700">
    Filter by Status:
  </label>

  {/* NEW: Relative wrapper for the custom arrow */}
  <div className="relative max-w-xs">
    <select
      id="status-filter"
      value={filterStatus}
      onChange={(e) => 
        setFilterStatus(e.target.value as "Available" | "Booked" | "Checked-In" | "Checked-Out" | "All")
      }
      // Added pr-10 to make room for the custom arrow icon
      className="appearance-none block w-full bg-white text-gray-800 border-1 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 px-5 py-3 pr-10 rounded-xl leading-tight shadow-sm transition duration-200 ease-in-out cursor-pointer text-base font-medium"
    >
      {/* Map over filterOptions to create the dropdown options */}
      {filterOptions.map((option) => (
        <option key={option} value={option} className="text-gray-700">
          {option}
        </option>
      ))}
    </select>
    
    {/* Custom Dropdown Arrow Icon */}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
      </svg>
    </div>
  </div>

  <button
    onClick={() => fetchRooms()}
    className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
  >
    Refresh
  </button>
</div>

        {loading && (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin w-5 h-5" />
            Loading rooms...
          </div>
        )}

        {error && <div className="text-red-600">{error}</div>}

        {!loading && filteredRooms.length === 0 && (
          <div className="text-gray-600">No rooms match the selected filter.</div>
        )}

        {!loading && filteredRooms.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} status={room.status} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
