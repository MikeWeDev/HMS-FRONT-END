// src/features/guest/api/guestApi.ts

export interface Room {
  id: string;
  name: string;
  price: number;
  capacity: number;
  image: string;
  description: string;
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000"; // local dev fallback
}

export async function getRooms(): Promise<Room[]> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/mock/rooms.json`);

  if (!response.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return response.json();
}
