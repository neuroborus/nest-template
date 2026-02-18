import { randomAuthNonce, randomId } from '@/helpers/random';

describe('random helpers', () => {
  it('returns UUID for id and EIP-4361 nonce for auth challenge', () => {
    const id = randomId();
    const nonce = randomAuthNonce();

    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(nonce).toMatch(/^[A-Za-z0-9]{8,}$/);
  });
});
