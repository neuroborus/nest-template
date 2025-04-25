import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.getOrThrow<string>('auth.accessSecret'),
        signOptions: {
          expiresIn: Math.floor(
            config.getOrThrow<number>('auth.accessTokenTtlMs') / 1000,
          ),
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtDriverModule {}
