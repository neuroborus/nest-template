import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { setupSwagger } from '@/swagger';
import { staticConfig } from '@/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
    rawBody: true,
  });
  app.useLogger(app.get(Logger));
  await setupSwagger(app);
  await app.listen(staticConfig.port);
}
bootstrap();
