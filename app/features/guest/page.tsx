"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import RoomCard from "../../components/RoomCard";
import { BedDouble ,Filter} from "lucide-react";

// --- Price Range Definitions ---
interface PriceRange {
  label: string;
  min: number;
  max: number;
}

// Define the price ranges as requested (adjusted 2090 to 300 for logical steps)
const PRICE_RANGES: PriceRange[] = [
  { label: "$0 - $100", min: 0, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200 - $300", min: 200, max: 300 }, // Changed 2090 to 300
  { label: "$300+", min: 300, max: Infinity }, // Use Infinity for the open-ended range
];
// --- End Price Range Definitions ---

// Room interface extended to match RoomCard expected props
export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  status: "Available" | "Booked" | "Checked-In" | "Checked-Out";
  image: string;

  // Fields expected by RoomCard
  id: string; // Alias of _id
  name: string; // e.g., "Room 101"
  description: string; // e.g., "Type: Deluxe • Capacity: 2"
}

// Define the interface for the raw data from the API
export interface RawRoom {
    _id: string;
    roomNumber: string;
    type: string;
    price: number;
    capacity: number;
    amenities: string[];
    isAvailable: boolean;
    status?: "Available" | "Booked" | "Checked-In" | "Checked-Out";
    image?: string;
}

export default function GuestDashboardPage() {
  // Renamed for clarity: store all fetched rooms here
  const [allRooms, setAllRooms] = useState<Room[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // STATE: Stores the label of the currently selected filter range.
  // Using 'All' as the default value to represent no filter.
  const [selectedRangeLabel, setSelectedRangeLabel] = useState<string | 'All'>('All');


  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("https://hms-backend-2k1m.onrender.com/api/rooms");
        if (!res.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data: RawRoom[] = await res.json(); 
        const availableRooms = data.filter((room) => room.isAvailable === true);
        
        const roomsWithStatus: Room[] = availableRooms.map((room) => {
          return {
            ...room,
            id: room._id, 
            status: "Available", 
            name: `Room ${room.roomNumber}`,
            description: `Type: ${room.type} • Capacity: ${room.capacity}`,
            image: `/room-${room.roomNumber}.jpg`, 
          };
        });

        // Store the complete, mapped list
        setAllRooms(roomsWithStatus);
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

    fetchRooms();
  }, []);

  
  // LOGIC: Filter the rooms based on the selected price range
  const filteredRooms = useMemo(() => {
    // If 'All' is selected, return all rooms
    if (selectedRangeLabel === 'All') {
      return allRooms;
    }

    const activeRange = PRICE_RANGES.find(
      (range) => range.label === selectedRangeLabel
    );

    // Should not happen if dropdown options are correctly set
    if (!activeRange) {
      return allRooms; 
    }

    const { min, max } = activeRange;

    // Filter rooms where price is >= min AND < max
    return allRooms.filter((room) => room.price >= min && room.price < max);
  }, [allRooms, selectedRangeLabel]);


  // Handler for the dropdown change event
  const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRangeLabel(event.target.value);
  };

    if (loading)
  return (
    // Loading Screen: Minimalist and centered with a clear spinner or animation (represented by text here)
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-indigo-500 text-2xl font-light">
      <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4">Loading Profile Data...</p>
    </div>
  );


  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-1 p-10">
        <div className="mb-6 flex items-center gap-3">
          <BedDouble className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Available Rooms</h2>
        </div>
        
        {/* --- PRICE FILTER SECTION (Dropdown) --- */}
       <div className="mb-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Filter className="w-5 h-5 text-blue-600" />
        Price Filter
      </h3>
    </div>
    
    <div className="relative w-full sm:w-72"> {/* Increased width for clarity */}

     <select
  value={selectedRangeLabel}
  onChange={handleDropdownChange}
  // ENHANCED STYLING:
  className="appearance-none block w-full bg-white text-gray-800 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 px-5 py-3 pr-10 rounded-xl leading-tight shadow-sm transition duration-200 ease-in-out cursor-pointer text-base font-medium"
>
  {/* Default 'All Rooms' option */}
  <option value="All" className="text-gray-700">
    All Rooms
  </option>
  
  {/* Price Range Options - NO <optgroup> needed for continuous flow */}
  {PRICE_RANGES.map((range) => (
    <option 
      key={range.label} 
      value={range.label} 
      // Note: The 'py-1' class inside <option> often has no effect 
      // in standard browsers, but we leave it for consistency.
      className="text-gray-700 py-1" 
    >
      {range.label}
    </option>
  ))}
</select>
      
      {/* Custom Arrow Icon (Now a ChevronDown) */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  </div>
        {/* --- END PRICE FILTER SECTION --- */}


       
        {error && <div className="text-red-600">{error}</div>}

        {!loading && filteredRooms.length === 0 && (
          <div className="text-gray-600">
            {selectedRangeLabel !== 'All' 
              ? `No rooms found in the price range: ${selectedRangeLabel}.`
              : "No rooms available right now."
            }
          </div>
        )}

        {/* Display filteredRooms */}
        {!loading && filteredRooms.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} status={room.status}/>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}