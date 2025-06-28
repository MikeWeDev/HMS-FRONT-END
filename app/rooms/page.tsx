import GuestLayout from "@/components/layout/GuestLayout";
import RoomCard from "@/components/features/RoomCard";

type Room = {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
};

export default async function RoomsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <GuestLayout>
        <p className="text-red-600">Failed to load rooms.</p>
      </GuestLayout>
    );
  }

  const rooms: Room[] = await res.json();

  return (
    <GuestLayout>
      <h1 className="text-2xl font-bold mb-4">Available Rooms</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room._id} {...room} />
        ))}
      </div>
    </GuestLayout>
  );
}
