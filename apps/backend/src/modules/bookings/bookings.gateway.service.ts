import { Inject, Injectable, HttpException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BOOKING_RESERVE_PATTERN, BOOKING_SERVICE_CLIENT } from './bookings.constants';
import { BookingIdentifiersDto } from './dto/booking-identifiers.dto';
import { ReserveBookingResponseDto } from './dto/reserve-booking-response.dto';

@Injectable()
export class BookingsGatewayService {
  constructor(
    @Inject(BOOKING_SERVICE_CLIENT)
    private readonly client: ClientProxy,
  ) {}

  async reserve(dto: BookingIdentifiersDto): Promise<ReserveBookingResponseDto> {
    try {
      return await lastValueFrom(
        this.client.send<ReserveBookingResponseDto, BookingIdentifiersDto>(
          BOOKING_RESERVE_PATTERN,
          dto,
        ),
      );
    } catch (error) {
      if (error instanceof RpcException) {
        const rpcError = error.getError();
        if (typeof rpcError === 'object' && rpcError && 'statusCode' in rpcError) {
          const { statusCode, message } = rpcError as { statusCode: number; message: string };
          throw new HttpException(message, statusCode);
        }
        throw new HttpException(String(rpcError), 500);
      }
      throw error;
    }
  }
}
