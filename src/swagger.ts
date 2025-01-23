import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const SWAGGER_URL = '/swagger';

export async function setupSwagger(app: INestApplication): Promise<void> {
  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('Provides API.')
    .setVersion('0.0.1')
    .addTag('backend')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_URL, app, document);
}
