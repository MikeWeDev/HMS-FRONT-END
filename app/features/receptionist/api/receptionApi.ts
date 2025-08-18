const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export interface CheckIn {
  id: string;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
}

export async function getCheckIns(): Promise<CheckIn[]> {
  const res = await fetch(`${baseUrl}/api/reception/checkins`);
  if (!res.ok) throw new Error('Failed to fetch check-ins');
  return res.json();
}
