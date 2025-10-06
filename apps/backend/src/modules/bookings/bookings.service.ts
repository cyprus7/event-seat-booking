import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository, QueryFailedError } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingIdentifiersDto } from './dto/booking-identifiers.dto';
import { ReserveBookingResponseDto } from './dto/reserve-booking-response.dto';
import { MetricsService } from '../../common/observability/metrics.service';
import { withOtelSpan } from '../../common/observability/tracing';

interface ReservationRow {
  booking_id: number;
  event_id: number;
  user_id: string;
  seats_remaining: number;
  total_seats: number;
  was_created: boolean;
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    private readonly metricsService: MetricsService,
  ) {}

  async reserveSeat(dto: BookingIdentifiersDto): Promise<ReserveBookingResponseDto> {
    return withOtelSpan('BookingsService.reserveSeat', async () => {
      const attributes = { eventId: dto.eventId, userId: dto.userId };
      const start = process.hrtime.bigint();
      this.metricsService.recordBookingRequest(attributes);
      try {
        const rows = (await this.bookingsRepository.query(
          'SELECT * FROM reserve_event_seat($1, $2);',
          [dto.eventId, dto.userId],
        )) as ReservationRow[];
        const result = rows?.[0];
        if (!result) {
          throw new RpcException({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Reservation did not return a result',
          });
        }

        const mapped: ReserveBookingResponseDto = {
          bookingId: Number(result.booking_id),
          eventId: Number(result.event_id),
          userId: result.user_id,
          seatsRemaining: Number(result.seats_remaining),
          totalSeats: Number(result.total_seats),
          wasCreated: Boolean(result.was_created),
        };

        const total = mapped.totalSeats;
        const remaining = mapped.seatsRemaining;
        const saturation = total === 0 ? 0 : (total - remaining) / total;
        this.metricsService.recordBookingSaturation(saturation, attributes);

        return mapped;
      } catch (error) {
        this.metricsService.recordBookingError(attributes);
        if (error instanceof QueryFailedError) {
          const driverError = (error as QueryFailedError).driverError as { message?: string } | undefined;
          const message = driverError?.message ?? error.message;
          if (message.includes('EVENT_NOT_FOUND')) {
            throw new RpcException({
              statusCode: HttpStatus.NOT_FOUND,
              message: 'Event not found',
            });
          }
          if (message.includes('NO_SEATS_AVAILABLE')) {
            throw new RpcException({
              statusCode: HttpStatus.CONFLICT,
              message: 'No seats available for the selected event',
            });
          }
        }
        if (error instanceof RpcException) {
          throw error;
        }
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Unable to reserve a seat',
        });
      } finally {
        const duration = Number(process.hrtime.bigint() - start) / 1_000_000;
        this.metricsService.recordBookingLatency(duration, attributes);
      }
    }, { eventId: dto.eventId, userId: dto.userId });
  }

  async create(createBookingDto: BookingIdentifiersDto): Promise<ReserveBookingResponseDto> {
    return this.reserveSeat(createBookingDto);
  }

  async findAll(): Promise<Booking[]> {
    return withOtelSpan('BookingsService.findAll', () =>
      this.bookingsRepository.find({ relations: ['event'] }),
    );
  }

  async findOne(id: number): Promise<Booking> {
    return withOtelSpan(
      'BookingsService.findOne',
      async () => {
        const booking = await this.bookingsRepository.findOne({
          where: { id },
          relations: ['event'],
        });
        if (!booking) {
          throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
      },
      { bookingId: id },
    );
  }

  async findByEvent(eventId: number): Promise<Booking[]> {
    return withOtelSpan(
      'BookingsService.findByEvent',
      () =>
        this.bookingsRepository.find({
          where: { eventId },
          relations: ['event'],
        }),
      { eventId },
    );
  }

  async remove(id: number): Promise<void> {
    await withOtelSpan(
      'BookingsService.remove',
      async () => {
        const booking = await this.findOne(id);
        await this.bookingsRepository.remove(booking);
      },
      { bookingId: id },
    );
  }
}
