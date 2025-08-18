// types/index.ts
export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  // ... other fields from your schema
}

export interface User {
  _id: string;
  name: string;
  email: string;
  // ... other fields
}

export interface Booking {
  _id: string;
  user?: string | User; // Can be an ObjectId string or a populated User object
  room: string | Room;
  name: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: 'pending' | 'Available' | 'Booked' | 'Checked-In' | 'Checked-Out';
  // ... other fields
}