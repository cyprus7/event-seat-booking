export interface BookingAttendeeDto {
    userId: string
    bookedAt: string
}

export interface EventAttendeesDto {
    eventId: number
    eventName: string
    attendees: BookingAttendeeDto[]
}
