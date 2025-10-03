export interface CreateEventDto {
  name: string;
  description: string;
  eventDate: Date;
  venue: string;
  totalSeats: number;
}

export interface UpdateEventDto {
  name?: string;
  description?: string;
  eventDate?: Date;
  venue?: string;
  totalSeats?: number;
}

export interface CreateBookingDto {
  eventId: string;
  customerName: string;
  customerEmail: string;
  numberOfSeats: number;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}
