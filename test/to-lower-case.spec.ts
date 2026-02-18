import { ToLowerCase } from '@/helpers/decorators/to-lower-case';
import { plainToInstance } from 'class-transformer';

describe('ToLowerCase', () => {
  it('lowercases assigned string values', () => {
    class Sample {
      @ToLowerCase()
      value!: string;
    }

    const sample = plainToInstance(Sample, { value: 'AbC' });

    expect(sample.value).toBe('abc');
  });

  it('passes through non-string values', () => {
    class Sample {
      @ToLowerCase()
      value: unknown;
    }

    const sample = plainToInstance(Sample, { value: 123 });

    expect(sample.value).toBe(123);
  });
});
