import { randomAuthNonce, randomId } from '@/helpers/random';

describe('random helpers', () => {
  it('returns UUIDs for identifiers and auth nonces', () => {
    const id = randomId();
    const nonce = randomAuthNonce();

    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(nonce).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
