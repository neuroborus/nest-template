import { hash } from '@/helpers/security/hash';

describe('hash', () => {
  it('returns deterministic sha256 hex digest', () => {
    expect(hash('hello')).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
  });
});
