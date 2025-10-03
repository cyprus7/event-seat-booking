export interface Event {
  id: string;
  name: string;
  description: string;
  eventDate: Date;
  venue: string;
  totalSeats: number;
  bookedSeats: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  eventId: string;
  customerName: string;
  customerEmail: string;
  numberOfSeats: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
