const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

export interface UserEvent {
    id: number
    name: string
    description: string
    eventDate: string
    venue: string
    totalSeats: number
    bookedSeats: number
    availableSeats: number
    alreadyBooked: boolean
}

export interface ReserveEventResponse {
    bookingId: number
    eventId: number
    userId: string
    seatsRemaining: number
    totalSeats: number
    wasCreated: boolean
}

export async function fetchEventsForUser(userId: string): Promise<UserEvent[]> {
    const response = await fetch(`${API_URL}/events`, {
        headers: {
            'x-user-id': userId,
        },
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Не удалось загрузить мероприятия')
    }

    return (await response.json()) as UserEvent[]
}

export async function reserveEvent(eventId: number, userId: string): Promise<ReserveEventResponse> {
    const response = await fetch(`${API_URL}/bookings/reserve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId, userId }),
    })

    if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Не удалось забронировать место')
    }

    return (await response.json()) as ReserveEventResponse
}
