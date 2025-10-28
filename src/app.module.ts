import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, staticConfig } from '@/config';
import { RequestModule } from '@/stores/request';
import { V1Api } from '@/apis/v1';
import { HealthApi } from '@/apis/health';
import { ClientInfoInterceptor } from './client-info.interceptor';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp,
    }),
    ScheduleModule.forRoot(),
    ConfigModule,
    RequestModule,
    HealthApi,
    V1Api,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR, // It is not global because of request scope
      useClass: ClientInfoInterceptor,
    },
  ],
})
export class AppModule {}
