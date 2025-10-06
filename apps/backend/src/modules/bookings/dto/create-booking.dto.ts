import { ApiProperty } from '@nestjs/swagger';
import { BookingIdentifiersDto } from './booking-identifiers.dto';

export class CreateBookingDto extends BookingIdentifiersDto {
  @ApiProperty({ description: 'Event identifier' })
  declare eventId: number;

  @ApiProperty({ description: 'User identifier' })
  declare userId: string;
}
