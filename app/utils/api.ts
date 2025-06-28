export async function fetchRooms() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`);
  if (!res.ok) throw new Error("Failed to load rooms");
  return res.json();
}
