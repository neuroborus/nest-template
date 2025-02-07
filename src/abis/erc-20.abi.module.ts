import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configuration } from './configurator.erc-20.abi';

export const AbiModule = NestConfigModule.forRoot({
  load: [configuration],
  ignoreEnvFile: true, // We have manual control over it
  isGlobal: true,
});
