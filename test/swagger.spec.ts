import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { setupSwagger, SWAGGER_URL } from '@/swagger';

describe('setupSwagger', () => {
  it('creates and mounts swagger document', async () => {
    const app = {} as INestApplication;
    const document = { openapi: '3.0.0' };

    const createDocumentSpy = jest
      .spyOn(SwaggerModule, 'createDocument')
      .mockReturnValue(document as never);
    const setupSpy = jest.spyOn(SwaggerModule, 'setup').mockImplementation();

    await setupSwagger(app);

    expect(createDocumentSpy).toHaveBeenCalledWith(
      app,
      expect.objectContaining({
        info: expect.objectContaining({ title: 'Backend API', version: '0.0.1' }),
      }),
    );
    expect(setupSpy).toHaveBeenCalledWith(SWAGGER_URL, app, document);

    createDocumentSpy.mockRestore();
    setupSpy.mockRestore();
  });
});
