import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@/config';
import { HealthApi } from '@/apis/health';
import { pinoHttp } from './pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp,
    }),
    ConfigModule,
    HealthApi,
  ],
})
export class AppModule {}
