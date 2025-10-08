import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    MessageEvent,
    Param,
    ParseIntPipe,
    Post,
    Sse,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { BookingsService } from './bookings.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { ReserveBookingDto } from './dto/reserve-booking.dto'
import { BookingsGatewayService } from './bookings.gateway.service'
import { ReserveBookingResponseDto } from './dto/reserve-booking-response.dto'
import { BookingsStreamService } from './bookings.stream.service'
import { Observable } from 'rxjs'

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
    constructor(
        private readonly bookingsService: BookingsService,
        private readonly bookingsGatewayService: BookingsGatewayService,
        private readonly bookingsStreamService: BookingsStreamService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Create a new booking' })
    @ApiResponse({
        status: 200,
        type: ReserveBookingResponseDto,
        description: 'Booking created successfully or existing booking returned',
    })
    create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingsGatewayService.reserve(createBookingDto)
    }

    @Post('reserve')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reserve a seat for an event' })
    @ApiResponse({
        status: 200,
        type: ReserveBookingResponseDto,
        description: 'Reservation processed via booking service',
    })
    reserve(@Body() reserveBookingDto: ReserveBookingDto) {
        return this.bookingsGatewayService.reserve(reserveBookingDto)
    }

    @Get()
    @ApiOperation({ summary: 'Get all bookings' })
    @ApiResponse({ status: 200, description: 'Return all bookings' })
    findAll() {
        return this.bookingsService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get booking by ID' })
    @ApiResponse({ status: 200, description: 'Return booking by ID' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bookingsService.findOne(id)
    }

    @Get('event/:eventId')
    @ApiOperation({ summary: 'Get bookings by event ID' })
    @ApiResponse({ status: 200, description: 'Return bookings for event' })
    findByEvent(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.bookingsService.findByEvent(eventId)
    }

    @Get('attendees')
    @ApiOperation({ summary: 'Get attendees grouped by event' })
    @ApiResponse({ status: 200, description: 'Return attendees grouped by event' })
    findAttendees() {
        return this.bookingsService.getEventAttendees()
    }

    @Sse('attendees/stream')
    @ApiOperation({ summary: 'Stream attendees grouped by event' })
    attendeesStream(): Observable<MessageEvent> {
        return this.bookingsStreamService.stream
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete booking' })
    @ApiResponse({ status: 204, description: 'Booking deleted successfully' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.bookingsService.remove(id)
    }
}
