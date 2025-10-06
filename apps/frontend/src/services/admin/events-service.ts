import 'server-only'

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
        next: { revalidate: 15 },
    })

    if (!response.ok) {
        throw new Error('Failed to load events')
    }

    const events = (await response.json()) as AdminEventResponse[]
    return events.map((event) => ({
        ...event,
        availableSeats: Math.max(event.totalSeats - event.bookedSeats, 0),
    }))
}
