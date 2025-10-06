import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventsModule } from './modules/events/events.module'
import { BookingsModule } from './modules/bookings/bookings.module'
import { UsersModule } from './modules/users/users.module'
import { DatabaseConfig } from './config/database.config'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            useClass: DatabaseConfig,
        }),
        EventsModule,
        BookingsModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
