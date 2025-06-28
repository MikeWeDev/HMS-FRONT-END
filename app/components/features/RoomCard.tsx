type RoomCardProps = {
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
};

export default function RoomCard({
  roomNumber,
  type,
  price,
  capacity,
  amenities,
}: RoomCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-2">
      <h2 className="text-xl font-semibold">
        Room {roomNumber} • {type.toUpperCase()}
      </h2>
      <p className="text-gray-700">Capacity: {capacity} person(s)</p>
      <p className="text-gray-700">Price: ${price} / night</p>
      <div className="text-sm text-gray-600">
        Amenities: {amenities.join(", ")}
      </div>
    </div>
  );
}
