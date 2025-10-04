import { IsString, IsNotEmpty, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ description: 'Event name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Event description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Event date and time' })
  @Type(() => Date)
  @IsDate()
  eventDate: Date;

  @ApiProperty({ description: 'Event venue' })
  @IsString()
  @IsNotEmpty()
  venue: string;

  @ApiProperty({ description: 'Total number of seats', minimum: 1 })
  @IsNumber()
  @Min(1)
  totalSeats: number;
}
