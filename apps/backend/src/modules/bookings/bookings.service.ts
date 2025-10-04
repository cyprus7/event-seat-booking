import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const booking = this.bookingsRepository.create(createBookingDto);
    return await this.bookingsRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingsRepository.find({ relations: ['event'] });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['event'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async findByEvent(eventId: string): Promise<Booking[]> {
    return await this.bookingsRepository.find({
      where: { eventId },
      relations: ['event'],
    });
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingsRepository.remove(booking);
  }
}
