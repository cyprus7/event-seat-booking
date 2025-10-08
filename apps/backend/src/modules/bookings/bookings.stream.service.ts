import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ReplaySubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { BookingsService } from './bookings.service'
import { EventAttendeesDto } from './dto/event-attendees.dto'

@Injectable()
export class BookingsStreamService implements OnModuleInit {
    private readonly logger = new Logger(BookingsStreamService.name)
    private readonly attendees$ = new ReplaySubject<EventAttendeesDto[]>(1)

    constructor(private readonly bookingsService: BookingsService) {}

    async onModuleInit(): Promise<void> {
        await this.broadcastAttendees()
    }

    get stream() {
        return this.attendees$.pipe(map((data) => ({ data })))
    }

    async broadcastAttendees(): Promise<void> {
        try {
            const attendees = await this.bookingsService.getEventAttendees()
            this.attendees$.next(attendees)
        } catch (error) {
            this.logger.error(
                'Failed to broadcast attendees',
                error instanceof Error ? error.stack : undefined,
                error instanceof Error ? error.message : String(error),
            )
        }
    }
}
