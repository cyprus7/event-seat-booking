import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { Transport } from '@nestjs/microservices'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { setupObservability } from './observability/otel'

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
