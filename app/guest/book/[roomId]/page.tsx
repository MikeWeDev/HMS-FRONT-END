import { notFound } from "next/navigation";
import { getRooms, Room } from "../../../features/guest/api/guestApi";
import BookingForm from "../../../features/guest/components/BookingForm";

type Props = {
  params: {
    roomId: string;
  };
};

export default async function BookingPage({ params }: Props) {
  const { roomId } = params;

  const rooms: Room[] = await getRooms();

  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    notFound();
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Book Room: {room.name}</h1>

      <img
        src={room.image}
        alt={room.name}
        className="rounded-xl w-full max-h-96 object-cover mb-6"
      />

      <p className="mb-2">{room.description}</p>
      <p className="mb-2">
        <strong>Price:</strong> ${room.price} per night
      </p>
      <p className="mb-6">
        <strong>Capacity:</strong> {room.capacity} people
      </p>

      {/* Render client booking form */}
<BookingForm maxGuests={room.capacity} roomId={room.id} />
    </main>
  );
}
