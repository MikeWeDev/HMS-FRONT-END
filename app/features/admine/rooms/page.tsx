"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
// Removed: import { useRouter } from "next/navigation"; // Not supported in this environment
import {
  Loader2,
  X,
  AlertCircle,
  CheckCircle,
  Pencil,
  BedDouble,
  CalendarCheck,
  CalendarPlus,
  Users,
  Wifi,
  ShowerHead,
  Tv,
} from "lucide-react";

// --- Interfaces ---

export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";
}

interface NotificationState {
  message: string;
  type: 'success' | 'error' | null;
}

// --- Utility Components ---

/**
 * Custom Notification Banner to replace alert()
 */
const NotificationBanner = ({ notification, setNotification }: {
  notification: NotificationState;
  setNotification: React.Dispatch<React.SetStateAction<NotificationState>>;
}) => {
  const bgColor = notification.type === 'error' ? 'bg-red-500' : 'bg-blue-600';
  const Icon = notification.type === 'error' ? AlertCircle : CheckCircle;

  if (!notification.message) return null;

  useEffect(() => {
    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
        setNotification({ message: '', type: null });
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, setNotification]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl text-white flex items-center space-x-3 ${bgColor} transition-all duration-300 ease-in-out transform`}>
      <Icon className="w-5 h-5" />
      <p className="text-sm font-medium">{notification.message}</p>
      <button
        onClick={() => setNotification({ message: '', type: null })}
        className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// --- Main Component ---

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState>({ message: '', type: null });
  // const router = useRouter(); // Removed the hook dependency

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  }, []);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://hms-backend-2k1m.onrender.com/api/rooms");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch rooms");
      }
      
      setRooms(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred.";
      setError(errorMessage);
      // Replaced alert() with custom notification
      showNotification(`Fetch failed: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // --- Data Calculations for Cards ---

  const availableRooms = useMemo(() => rooms.filter(r => r.status === "Available").length, [rooms]);
  const bookedRooms = useMemo(() => rooms.filter(r => r.status === "Booked").length, [rooms]);
  const totalRooms = useMemo(() => rooms.length, [rooms]);

  const cardData = [
    {
      title: "Total Rooms",
      count: totalRooms,
      icon: BedDouble,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "All registered rooms in the system.",
    },
    {
      title: "Available Now",
      count: availableRooms,
      icon: CalendarPlus,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Rooms ready for new check-ins.",
    },
    {
      title: "Occupied/Booked",
      count: totalRooms - availableRooms,
      icon: CalendarCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Rooms currently in use or reserved.",
    },
  ];

  // --- Utility Functions ---

  const statusColor = (status: Room["status"]) => {
    switch (status) {
      case "Available":
        return "bg-green-200 text-green-900 border-green-500";
      case "Booked":
        return "bg-yellow-200 text-yellow-900 border-yellow-500";
      case "Checked-In":
        return "bg-blue-200 text-blue-900 border-blue-500";
      case "Checked-Out": // Should generally be "Available" after cleaning, but good to handle
        return "bg-gray-200 text-gray-900 border-gray-500";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const amenityIcon = (amenity: string) => {
    const lowerCaseAmenity = amenity.toLowerCase();
    if (lowerCaseAmenity.includes("wifi") || lowerCaseAmenity.includes("internet")) return <Wifi className="w-4 h-4 mr-1 text-blue-500" />;
    if (lowerCaseAmenity.includes("bath") || lowerCaseAmenity.includes("shower")) return <ShowerHead className="w-4 h-4 mr-1 text-blue-500" />;
    if (lowerCaseAmenity.includes("tv") || lowerCaseAmenity.includes("television")) return <Tv className="w-4 h-4 mr-1 text-blue-500" />;
    if (lowerCaseAmenity.includes("capacity") || lowerCaseAmenity.includes("guests")) return <Users className="w-4 h-4 mr-1 text-blue-500" />;
    return null;
  };

  // --- Render Components ---

  const SummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {cardData.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between border-b-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.title}</span>
            <span className="text-4xl font-extrabold text-gray-900 mt-1">{card.count}</span>
            <p className="text-xs text-gray-400 mt-1">{card.description}</p>
          </div>
          <div className={`p-3 rounded-full ${card.bgColor} opacity-90`}>
            <card.icon className={`w-8 h-8 ${card.color}`} />
          </div>
        </div>
      ))}
    </div>
  );

  const RoomsTable = () => (
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden ring-1 ring-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Room #</th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Price (Birr)</th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Amenities</th>
              <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rooms.map((room, index) => (
              <tr
                key={room._id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition duration-200 ease-in-out cursor-pointer`}
                // Use window.location.href for simple navigation
                onClick={() => window.location.href = `/features/admine/rooms/${room._id}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-gray-900">{room.roomNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{room.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {new Intl.NumberFormat('en-US').format(room.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center">
                  <Users className="w-4 h-4 mr-1 text-gray-500" />
                  {room.capacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border border-2 ${statusColor(
                      room.status
                    )}`}
                  >
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 3).map((amenity, i) => (
                        <div key={i} className="flex items-center text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full font-medium">
                            {amenityIcon(amenity)}
                            {amenity}
                        </div>
                    ))}
                    {room.amenities.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">+{room.amenities.length - 3} more</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        // Use window.location.href for simple navigation
                        window.location.href = `/features/admine/rooms/${room._id}`;
                    }}
                    className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all duration-200 group"
                    aria-label={`Edit room ${room.roomNumber}`}
                  >
                    <Pencil className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans w-[100vw] md:w-[calc(100vw-22rem)]">
      <NotificationBanner notification={notification} setNotification={setNotification} />
      
      {/* Header Bar */}
     <header className="bg-white shadow-md p-4 sticky top-0 z-10 border-b border-green-100 w-full">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight text-center">Room Mangment</h1>
      </header>

      <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto  w-[90%] md:w-full ">
        
        <SummaryCards />
        
        <h2 className="2xl font-bold text-gray-800 mb-6 border-b pb-2">Room Inventory</h2>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-lg">
            <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-3" /> 
            <p className="text-xl font-medium text-gray-600">Fetching room inventory...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md mb-6">
            <p className="font-semibold">Data Loading Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Room Table */}
        {!loading && totalRooms > 0 && <RoomsTable />}

        {/* Empty State */}
        {!loading && totalRooms === 0 && (
          <div className="text-center text-gray-500 mt-10 p-10 bg-white rounded-xl shadow-lg">
            <BedDouble className="w-12 h-12 mx-auto text-blue-300 mb-3" />
            <p className="text-lg font-medium">No rooms have been registered yet.</p>
          </div>
        )}
      </main>

      <footer className="p-4 text-center text-sm text-gray-500 border-t mt-10">
        Room Data Interface &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
