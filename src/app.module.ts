import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, staticConfig } from '@/config';
import { HealthApi } from './apis/health';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: staticConfig.logLevel,
      },
    }),
    ConfigModule,
    HealthApi,
  ],
})
export class AppModule {}
