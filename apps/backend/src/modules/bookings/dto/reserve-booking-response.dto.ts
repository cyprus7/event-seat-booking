import { ApiProperty } from '@nestjs/swagger'

export class ReserveBookingResponseDto {
    @ApiProperty({ description: 'Booking identifier' })
    bookingId: number

    @ApiProperty({ description: 'Event identifier' })
    eventId: number

    @ApiProperty({ description: 'User identifier' })
    userId: string

    @ApiProperty({ description: 'Total seats for the event' })
    totalSeats: number

    @ApiProperty({ description: 'Remaining seats after the reservation' })
    seatsRemaining: number

    @ApiProperty({ description: 'Indicates whether a new booking record was created' })
    wasCreated: boolean
}
