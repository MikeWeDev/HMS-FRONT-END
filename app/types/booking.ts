import { Room } from './room';
export interface Booking {
  _id: string;
  room: Room;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}
