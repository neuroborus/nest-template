import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configuration } from './configuration';

export const ConfigModule = NestConfigModule.forRoot({
  load: [configuration],
  ignoreEnvFile: true, // We have manual control over it
  isGlobal: true,
});
