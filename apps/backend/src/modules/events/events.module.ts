import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventsController } from './events.controller'
import { EventsService } from './events.service'
import { Event } from './entities/event.entity'
import { Booking } from '../bookings/entities/booking.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Event, Booking])],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule {}
