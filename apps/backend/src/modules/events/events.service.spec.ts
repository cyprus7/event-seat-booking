import { Test, TestingModule } from '@nestjs/testing'
import { EventsService } from './events.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Event } from './entities/event.entity'
import { Booking } from '../bookings/entities/booking.entity'

describe('EventsService', () => {
    let service: EventsService

    const mockEventsRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    }

    const mockBookingsRepository = {
        find: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: getRepositoryToken(Event),
                    useValue: mockEventsRepository,
                },
                {
                    provide: getRepositoryToken(Booking),
                    useValue: mockBookingsRepository,
                },
            ],
        }).compile()

        service = module.get<EventsService>(EventsService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('findAll', () => {
        it('should return an array of events', async () => {
            const events = [{ id: 1, name: 'Test Event' }]
            mockEventsRepository.find.mockResolvedValue(events)

            const result = await service.findAll()
            expect(result).toEqual(events)
            expect(mockEventsRepository.find).toHaveBeenCalled()
        })
    })
})
