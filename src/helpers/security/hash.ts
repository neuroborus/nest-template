import { createHash } from 'crypto';

export const hash = (target: string) =>
  createHash('sha256').update(target).digest('hex');
