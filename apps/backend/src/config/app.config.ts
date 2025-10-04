import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT', 3001);
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  }

  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST', 'localhost');
  }

  get redisPort(): number {
    return this.configService.get<number>('REDIS_PORT', 6379);
  }

  get rabbitMqUrl(): string {
    return this.configService.get<string>('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672');
  }
}
