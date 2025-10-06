import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BookingIdentifiersDto } from './booking-identifiers.dto';

export class ReserveBookingDto extends BookingIdentifiersDto {
  @ApiProperty({ name: 'event_id', description: 'Event identifier', minimum: 1 })
  @Expose({ name: 'event_id' })
  declare eventId: number;

  @ApiProperty({ name: 'user_id', description: 'User identifier' })
  @Expose({ name: 'user_id' })
  declare userId: string;
}
