import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { setupSwagger } from '@/swagger';
import { staticConfig } from '@/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
    rawBody: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(cookieParser());
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await setupSwagger(app);
  await app.listen(staticConfig.port);
}
bootstrap();
