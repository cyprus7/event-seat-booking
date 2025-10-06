export interface CreateEventDto {
    name: string
    description: string
    eventDate: Date
    venue: string
    totalSeats: number
}

export interface UpdateEventDto {
    name?: string
    description?: string
    eventDate?: Date
    venue?: string
    totalSeats?: number
}

export interface CreateBookingDto {
    eventId: number
    userId: string
}

export interface CreateUserDto {
    email: string
    name: string
    password: string
}
