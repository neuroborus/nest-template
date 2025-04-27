import { ApiProperty } from '@nestjs/swagger';
import { staticConfig } from '@/config';
import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { NODE_ENV } from '@/entities/node-env';

export function HideInProd(hideInEnvs = [NODE_ENV.PROD]) {
  return applyDecorators(
    Transform(({ value }) => {
      return hideInEnvs.includes(staticConfig.nodeEnv) ? undefined : value;
    }),
    (target: any, propertyKey: string | symbol) => {
      const existingMeta: any =
        Reflect.getMetadata('swagger/apiModelProperties', target.constructor) ??
        {};

      const existingOptions = existingMeta[propertyKey] ?? {};

      const hiddenNote = `(Hidden when NODE_ENV is one of: ${hideInEnvs.join(', ')})`;

      const description = existingOptions.description
        ? `${existingOptions.description} ${hiddenNote}`
        : hiddenNote;

      ApiProperty({
        ...existingOptions,
        description,
      })(target, propertyKey);
    },
  );
}
