const API = 'http://localhost:5000/api';
const token = () => localStorage.getItem('token');

export const registerUser = async (data: any) => {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (result.token) localStorage.setItem('token', result.token);
  else throw new Error('Failed to register');
};

export const loginUser = async (data: any) => {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (result.token) localStorage.setItem('token', result.token);
  else throw new Error('Failed to login');
};

export const getRooms = async () => {
  const res = await fetch(`${API}/rooms`);
  return res.json();
};

export const getRoomById = async (id: string) => {
  const res = await fetch(`${API}/rooms/${id}`);
  return res.json();
};

export const createBooking = async (data: any) => {
  const res = await fetch(`${API}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getMyBookings = async () => {
  const res = await fetch(`${API}/bookings`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.json();
};
