import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { WinstonOptions } from '@/winston';
import { setupSwagger } from '@/swagger';
import { staticConfig } from '@/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
    rawBody: true,
    logger: WinstonModule.createLogger(WinstonOptions),
  });
  await setupSwagger(app);
  await app.listen(staticConfig.port);
}
bootstrap();
