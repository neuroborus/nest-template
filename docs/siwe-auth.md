# SIWE Authentication (EIP-4361)

This project uses Sign-In with Ethereum (SIWE, EIP-4361) for wallet authentication.

## Endpoints

### `POST /v1/auth/siwe/nonce`
Request body:
```json
{}
```

Response:
```json
{
  "nonce": "n-0S8QX8v2jQL3J4",
  "expiresAt": "2026-02-18T10:05:00.000Z"
}
```

### `POST /v1/auth/siwe/verify`
Request body:
```json
{
  "message": "<full SIWE EIP-4361 message>",
  "signature": "0x..."
}
```

Response:
```json
{
  "accessToken": "...",
  "accessExpireMs": 900000
}
```

`refreshToken` is returned via `httpOnly` cookie.

## Required Environment Variables

- `SIWE_DOMAIN`
- `SIWE_URI`
- `SIWE_ALLOWED_CHAIN_IDS`
- `SIWE_NONCE_TTL_MS`
- `SIWE_ISSUED_AT_TTL_MS`
- `SIWE_CLOCK_SKEW_MS`

## Security Properties

- Nonce is random, persisted, and has TTL (`expiresAt`).
- Nonce is one-time use with atomic consume (`usedAt`, `usedByAddress`).
- SIWE message must match configured domain and URI.
- Signature is verified against the SIWE payload.
- Replay attacks are blocked by nonce state checks + atomic consume.

## Legacy Endpoints

- `POST /v1/auth/nonce`
- `POST /v1/auth/login`

These are deprecated and return `410 Gone`.
