import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BookingsController } from './bookings.controller'
import { BookingsService } from './bookings.service'
import { Booking } from './entities/booking.entity'
import { BookingsQueueController } from './bookings.queue.controller'
import { BookingsGatewayService } from './bookings.gateway.service'
import { MetricsService } from '../../common/observability/metrics.service'
import { BOOKING_SERVICE_CLIENT } from './bookings.constants'
import { BookingsStreamService } from './bookings.stream.service'

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([Booking])],
    controllers: [BookingsController, BookingsQueueController],
    providers: [
        BookingsService,
        MetricsService,
        BookingsGatewayService,
        BookingsStreamService,
        {
            provide: BOOKING_SERVICE_CLIENT,
            useFactory: (configService: ConfigService) =>
                ClientProxyFactory.create({
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            configService.get<string>(
                                'RABBITMQ_URL',
                                'amqp://guest:guest@localhost:5672',
                            ),
                        ],
                        queue: configService.get<string>(
                            'RABBITMQ_BOOKING_QUEUE',
                            'booking_reservations',
                        ),
                        queueOptions: { durable: true },
                    },
                }),
            inject: [ConfigService],
        },
    ],
    exports: [BookingsService],
})
export class BookingsModule {}
