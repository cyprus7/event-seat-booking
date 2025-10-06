import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { withOtelSpan } from '../../common/observability/tracing';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return withOtelSpan(
      'EventsService.create',
      async () => {
        const event = this.eventsRepository.create(createEventDto);
        return await this.eventsRepository.save(event);
      },
      {
        name: createEventDto.name,
        totalSeats: createEventDto.totalSeats,
        venue: createEventDto.venue,
      },
    );
  }

  async findAll(): Promise<Event[]> {
    return withOtelSpan('EventsService.findAll', () => this.eventsRepository.find());
  }

  async findOne(id: number): Promise<Event> {
    return withOtelSpan(
      'EventsService.findOne',
      async () => {
        const event = await this.eventsRepository.findOne({ where: { id } });
        if (!event) {
          throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
      },
      { eventId: id },
    );
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    return withOtelSpan(
      'EventsService.update',
      async () => {
        const event = await this.findOne(id);
        Object.assign(event, updateEventDto);
        return await this.eventsRepository.save(event);
      },
      { eventId: id },
    );
  }

  async remove(id: number): Promise<void> {
    await withOtelSpan(
      'EventsService.remove',
      async () => {
        const event = await this.findOne(id);
        await this.eventsRepository.remove(event);
      },
      { eventId: id },
    );
  }
}
