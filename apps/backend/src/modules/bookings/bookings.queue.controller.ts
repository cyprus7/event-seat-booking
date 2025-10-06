import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { BOOKING_RESERVE_PATTERN } from './bookings.constants'
import { BookingsService } from './bookings.service'
import { BookingIdentifiersDto } from './dto/booking-identifiers.dto'
import { ReserveBookingResponseDto } from './dto/reserve-booking-response.dto'

@Controller()
export class BookingsQueueController {
    constructor(private readonly bookingsService: BookingsService) {}

    @MessagePattern(BOOKING_RESERVE_PATTERN)
    reserve(@Payload() payload: BookingIdentifiersDto): Promise<ReserveBookingResponseDto> {
        return this.bookingsService.reserveSeat(payload)
    }
}
