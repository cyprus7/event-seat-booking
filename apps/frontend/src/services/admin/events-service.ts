type AdminEventResponse = {
    id: number
    name: string
    description: string
    eventDate: string
    venue: string
    totalSeats: number
    bookedSeats: number
}

export interface AdminEvent extends AdminEventResponse {
    availableSeats: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

export async function fetchAdminEvents(): Promise<AdminEvent[]> {
    const response = await fetch(`${API_URL}/events`, {
        cache: 'no-store',
    } as any)

    if (!response.ok) {
        throw new Error('Failed to load events')
    }

    const events = (await response.json()) as AdminEventResponse[]
    return events.map((event) => ({
        ...event,
        availableSeats: Math.max(event.totalSeats - event.bookedSeats, 0),
    }))
}

export interface CreateAdminEventPayload {
    name: string
    description: string
    eventDate: string
    venue: string
    totalSeats: number
}

export async function createAdminEvent(payload: CreateAdminEventPayload): Promise<void> {
    const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Failed to create event')
    }
}
