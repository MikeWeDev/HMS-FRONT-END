import GuestLayout from "@/components/layout/GuestLayout";
import BookingForm from "@/components/features/BookingForm";

const getRoom = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${id}`, {
    cache: "no-store",
  });
  return res.json();
};

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  const token = ""; // You can read it from cookies or context later

  return (
    <GuestLayout>
      <h1 className="text-2xl font-bold mb-2">Room {room.roomNumber}</h1>
      <p>Type: {room.type}</p>
      <p>Capacity: {room.capacity}</p>
      <p>Price per night: ${room.price}</p>
      <p>Amenities: {room.amenities.join(", ")}</p>

      <div className="mt-6">
        <BookingForm roomId={room._id} price={room.price} token={token} />
      </div>
    </GuestLayout>
  );
}
