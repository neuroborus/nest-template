import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@/config';
import { HealthApi } from '@/apis/health';
import { V1Api } from '@/apis/v1';
import { pinoHttp } from './pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp,
    }),
    ConfigModule,
    HealthApi,
    V1Api,
  ],
})
export class AppModule {}
