export interface Event {
    id: number
    name: string
    description: string
    eventDate: Date
    venue: string
    totalSeats: number
    bookedSeats: number
    createdAt: Date
    updatedAt: Date
}

export interface Booking {
    id: number
    eventId: number
    userId: string
    createdAt: Date
}

export interface User {
    id: string
    email: string
    name: string
    role: UserRole
    createdAt: Date
    updatedAt: Date
}

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}
