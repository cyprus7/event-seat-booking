import { IsString, IsEmail, IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'Event ID' })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ description: 'Customer name' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ description: 'Customer email' })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({ description: 'Number of seats to book', minimum: 1 })
  @IsNumber()
  @Min(1)
  numberOfSeats: number;
}
