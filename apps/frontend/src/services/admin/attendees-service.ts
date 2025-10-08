const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

export interface AdminAttendee {
    userId: string
    bookedAt: string
}

export interface AdminEventAttendees {
    eventId: number
    eventName: string
    attendees: AdminAttendee[]
}

export async function fetchEventAttendees(): Promise<AdminEventAttendees[]> {
    const response = await fetch(`${API_URL}/bookings/attendees`, { cache: 'no-store' })

    if (!response.ok) {
        throw new Error('Failed to load attendees')
    }

    return (await response.json()) as AdminEventAttendees[]
}

export function subscribeToEventAttendees(
    onMessage: (payload: AdminEventAttendees[]) => void,
): () => void {
    const eventSource = new EventSource(`${API_URL}/bookings/attendees/stream`)

    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data) as AdminEventAttendees[]
            onMessage(data)
        } catch (error) {
            console.error('Failed to parse attendees event', error)
        }
    }

    eventSource.onerror = (error) => {
        console.error('Attendees stream error', error)
    }

    return () => {
        eventSource.close()
    }
}
