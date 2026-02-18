# Nest Template

# Project Description

This project is a template for a NestJS application with JWT authentication via Sign-In with Ethereum (SIWE, EIP-4361).  
The server generates a one-time nonce, the client signs a full SIWE message, and the backend verifies message + signature before creating a session.  
An authorized client must additionally send a header:

- `authorization` — with the `accessToken` as Bearer received from the backend

The `refreshToken` is stored in an `httpOnly` cookie.

In the [test folder](test), there is a Postman collection (a JSON file) for testing the authentication flow.  
The collection already includes scripts for automatically filling environment variables when receiving the tokens and handling cookies.  
SIWE endpoints and payloads are documented in [`docs/siwe-auth.md`](docs/siwe-auth.md).


## Quickstart
1. Create `.env` file and fill with the "REQUIRED" variables from `.env.xmpl`
2. `npm ci`
3. `npm run prisma:deploy` (The database should exist and be running)
4. `npm run start`

## Environment
Required variables are defined in `.env.xmpl`.

Prisma/runtime-critical:
- `DATABASE_URL` (required for Prisma client and Prisma CLI)

## Prisma 7 Notes
This project is configured for Prisma 7.

- Prisma config is in `prisma.config.ts`.
- `prisma/schema.prisma` does not contain datasource URL.
- Runtime Prisma client uses `@prisma/adapter-pg` (`PrismaPg`) instead of deprecated `datasourceUrl`.

### Prisma Commands
- Generate client: `npx prisma generate`
- Apply existing migrations: `npm run prisma:deploy`
- Create a new migration in dev: `npm run prisma:create`
- Reset DB and re-apply migrations: `npm run prisma:reset`

## Verification Pipeline
Project verification commands:
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test -- --runInBand`
- `npm run test:cov -- --runInBand`
- `npm run test:e2e -- --runInBand`

## Security / npm audit
Current known audit status:
- `npm audit --omit=dev`: moderate advisories only, no high/critical.
- `npm audit`: may show additional moderate advisories from dev-tooling dependencies.

Important:
- Do not run `npm audit fix --force` here for automatic Prisma-chain remediation, because it downgrades Prisma to `6.19.2` (breaking the Prisma 7 upgrade).
- Current Prisma-related advisories are transitive/tooling-side and documented in:
  - `docs/upgrade-report.md`
  - `docs/prism-crosscheck.md`

## Suggested Project Layers
<b> As long as the application is small, there's no need to add extra layers.</b></br>
<b> However, if necessary, it is recommended to choose from the list below. </b>

These layers are designed to maintain structure as it scales and organized by levels.  
* By convention, higher-level layers must not be imported into lower-level ones.  
* Additionally, layers on the same level should not import each other.

\*  Exists by default

└── <b> *[apis/](src/apis/README.md) </b> - <i> contain controllers, dtos </i>  
└── <b> features/ </b> - <i> contain specific feature logic </i>  
└── <b> *[services/](src/services/README.md) </b> - <i> contain general processing logic </i>  
└── <b> stores/ </b> - <i> Repository pattern implementation - api for stores (e.g. DB) </i>  
└── <b> contracts/, drivers/ </b> - <i> interfaces for external systems </i>  
└── <b> helpers/, *[config/](src/config/README.md), *[entities/](src/entities/README.md) </b> - <i> the lowest level or independent layers </i>

## Healthcheck
`/health`
```
OK
```

## Swagger
`/swagger`
