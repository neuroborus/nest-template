import { MODULE_METADATA } from '@nestjs/common/constants';
import { LoggerModule } from 'nestjs-pino';
import { HealthApi } from '@/apis/health';
import { AppModule } from '@/app.module';
import { ConfigModule } from '@/config';

describe('AppModule', () => {
  it('wires required modules', () => {
    const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, AppModule);

    expect(imports).toEqual(expect.arrayContaining([ConfigModule, HealthApi]));

    const hasLoggerModule = imports.some(
      (entry: { module?: unknown }) => entry?.module === LoggerModule,
    );
    expect(hasLoggerModule).toBe(true);
  });
});
