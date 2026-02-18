import { Transform } from 'class-transformer';

export function ToLowerCase(): PropertyDecorator {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  );
}
