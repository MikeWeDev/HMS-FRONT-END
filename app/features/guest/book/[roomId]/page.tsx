import BookingForm from "../../../../components/BookingForm";

type Props = {
  params: {
    roomId: string;
  };
};

export default async function BookingPage({ params }: Props) {
  const { roomId } = await params;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {/* No room info available here, so just a title with roomId */}
      <h1 className="text-3xl font-bold mb-4">Book Room: {roomId}</h1>

      {/* BookingForm only receives roomId */}
      <BookingForm roomId={roomId} />
    </main>
  );
}
