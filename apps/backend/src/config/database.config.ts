import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    private parsePostgresUrl(urlStr: string | undefined) {
        if (!urlStr) return null
        try {
            const url = new URL(urlStr)
            return {
                host: url.hostname,
                port: url.port ? Number(url.port) : 5432,
                username: url.username ? decodeURIComponent(url.username) : 'postgres',
                password: url.password ? decodeURIComponent(url.password) : 'postgres',
                database: url.pathname ? url.pathname.replace(/^\//, '') : 'event_booking',
            }
        } catch {
            return null
        }
    }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const postgresUrl = this.configService.get<string>('POSTGRES_URL')
        const parsed = this.parsePostgresUrl(postgresUrl)

        const host = parsed?.host ?? this.configService.get<string>('DB_HOST', 'localhost')
        const port = parsed?.port ?? this.configService.get<number>('DB_PORT', 5432)
        const username =
            parsed?.username ?? this.configService.get<string>('DB_USERNAME', 'postgres')
        const password =
            parsed?.password ?? this.configService.get<string>('DB_PASSWORD', 'postgres')
        const database =
            parsed?.database ?? this.configService.get<string>('DB_NAME', 'event_booking')

        return {
            type: 'postgres',
            host,
            port,
            username,
            password,
            database,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: this.configService.get<boolean>('DB_SYNC', false),
            logging: this.configService.get<boolean>('DB_LOGGING', false),
            migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
            migrationsRun: true,
        }
    }
}
