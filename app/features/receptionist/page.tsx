"use client";

import { useEffect, useState } from "react";
import RoomCard from "../../components/RoomCard";
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
          image: room.image || `/room-${room.roomNumber}.jpg`, 
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
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <span className="font-medium text-gray-700 mr-3">Filter by Status:</span>

          {filterOptions.map((option) => {
            const isActive = filterStatus === option;
            return (
              <button
                key={option}
                onClick={() => setFilterStatus(option)}
                className={`px-4 py-2 rounded-lg border transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {option}
              </button>
            );
          })}

          <button
            onClick={() => fetchRooms()}
            className="ml-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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