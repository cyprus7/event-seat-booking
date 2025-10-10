import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { Transport } from '@nestjs/microservices'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { setupObservability } from './observability/otel'
import { Logger } from '@nestjs/common'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'
import type { Request } from 'express'

async function bootstrap() {
    await setupObservability()
    const app = await NestFactory.create(AppModule)

    // Global prefix
    app.setGlobalPrefix('api')

    // Enable CORS
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    )

    // Register global exception filter to log HTTP errors (including ValidationPipe errors)
    app.useGlobalFilters(new AllExceptionsFilter())

    // Use Nest Logger for application logs and add a simple request logger middleware
    app.useLogger(new Logger())
    const httpLogger = new Logger('HTTP')
    app.use((req: Request & { body?: Record<string, unknown> }, _res, next) => {
        // Log method and url; include body when present to help debug validation errors
        try {
            const body = req.body
            if (body && Object.keys(body).length) {
                httpLogger.log(`${req.method} ${req.url} - body: ${JSON.stringify(body)}`)
            } else {
                httpLogger.log(`${req.method} ${req.url}`)
            }
        } catch {
            httpLogger.log(`${req.method} ${req.url}`)
        }
        next()
    })

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('Event Seat Booking API')
        .setDescription('API for event seat booking system')
        .setVersion('1.0')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)

    const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'
    const bookingQueue = process.env.RABBITMQ_BOOKING_QUEUE || 'booking_reservations'
    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [rabbitMqUrl],
            queue: bookingQueue,
            queueOptions: {
                durable: true,
            },
        },
    })

    await app.startAllMicroservices()

    const port = process.env.PORT || 3001
    await app.listen(port)
    console.log(`Application is running on: http://localhost:${port}`)
}
bootstrap()
