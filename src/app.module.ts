import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, staticConfig } from '@/config';
import { HealthApi } from './apis/health';
import { V1Api } from './apis/v1';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: staticConfig.logLevel,
      },
    }),
    ConfigModule,
    HealthApi,
    V1Api,
  ],
})
export class AppModule {}
