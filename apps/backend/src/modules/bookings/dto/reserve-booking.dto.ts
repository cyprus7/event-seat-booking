import { ApiProperty } from '@nestjs/swagger'
import { BookingIdentifiersDto } from './booking-identifiers.dto'

export class ReserveBookingDto extends BookingIdentifiersDto {
    @ApiProperty({ description: 'Event identifier', minimum: 1 })
    eventId: number

    @ApiProperty({ description: 'User identifier' })
    userId: string
}
