# zwiioServer

A MongoDB-first NestJS REST API starter for the
[`zwiio`](https://github.com/zwiio/zwiio)
frontend. It implements phone-number sign-in with Twilio Verify SMS, JWT
access tokens, refresh-token sessions, Swagger docs, Docker, tests, and CI.

This repository is customized from the MIT-licensed
[`brocoders/nestjs-boilerplate`](https://github.com/brocoders/nestjs-boilerplate).

## Core Stack

- NestJS 11 with TypeScript and Swagger/OpenAPI.
- MongoDB with Mongoose and document repository adapters.
- Twilio Verify SMS OTP for phone registration and login.
- Request/verification rate limiting with `@nestjs/throttler`.
- JWT access tokens with persisted refresh sessions.
- Validation with `class-validator` and serialization with
  `class-transformer`.
- Jest, ESLint, Docker Compose, Husky, commitlint, and GitHub Actions.

PostgreSQL, TypeORM, and social-auth providers are intentionally not included.

## Use This Template

Select **Use this template** on GitHub, or create a repository with GitHub CLI:

```bash
gh repo create my-api --template zwiio/zwiioServer --private --clone
cd my-api
nvm use
npm install
cp .env.development.example .env.development.local
```

The project targets Node 22 through `.nvmrc`.

## Local Setup

1. Create a [Twilio Verify Service](https://www.twilio.com/docs/verify/api).
2. Copy `.env.development.example` to `.env.development.local` and supply the
   three development `TWILIO_*` values.
3. Replace all `AUTH_*_SECRET` example values with long random secrets.
4. Start MongoDB and MailDev:

```bash
docker compose -f docker-compose.document.yaml --env-file .env.development.local up -d mongo mongo-express maildev
npm run seed:run:document
npm run start:dev
```

The local API uses `http://localhost:3008` by default so a Next.js application
can run on `http://localhost:3000`. Swagger is available at
`http://localhost:3008/docs`.

## Environment Variables

Configuration is selected by `NODE_ENV` and loaded in this order:

```text
.env.<environment>.local
.env.<environment>
.env.local
.env
```

Use `.env.development.local` for real local Twilio and MongoDB values. It is
ignored by git, while [.env.development.example](.env.development.example)
documents the required variables.

For production, set values in your deployment provider's secret environment
settings whenever possible. For a self-managed host, start from
[.env.production.example](.env.production.example) as
`.env.production.local`; it is also ignored by git. `npm run start:prod`
selects production configuration automatically.

## Phone Login Flow

The frontend submits an E.164 phone number, for example `+260971234567`.
Twilio creates and checks the OTP; this API never stores the verification code.
Requests are throttled per client to limit accidental or abusive sends.

```http
POST /api/v1/auth/phone/request-otp
Content-Type: application/json

{ "phoneNumber": "+260971234567" }
```

The request is accepted with status `202`. After the user enters the SMS code:

```http
POST /api/v1/auth/phone/verify-otp
Content-Type: application/json

{ "phoneNumber": "+260971234567", "code": "123456" }
```

An approved OTP creates the user on first login or updates verification on an
existing user, then returns:

```json
{
  "token": "access-token",
  "refreshToken": "refresh-token",
  "tokenExpires": 1710000000000,
  "user": {
    "phoneNumber": "+260971234567"
  }
}
```

Use `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout`, and
`GET /api/v1/auth/me` for session lifecycle and authenticated profile access.
Email/password endpoints inherited from the starter remain available as an
optional secondary path.

## Project Shape

```text
src/
  auth/       phone OTP, JWT and refresh-session authentication
  config/     application configuration types
  database/   MongoDB configuration and seeds
  files/      local and S3 file adapters
  roles/      authorization roles
  session/    persisted refresh sessions
  users/      user domain, DTOs and Mongoose persistence
```

User phone numbers are uniquely indexed in MongoDB. Email and phone indexes use
partial uniqueness so phone-only accounts can safely keep `email` as `null`.

## Scripts

```bash
npm run lint
npm run type-check
npm test -- --runInBand
npm run build
npm run seed:run:document
npm run start:dev
npm run start:prod
npm run test:e2e:document:docker
```

See [docs/auth.md](docs/auth.md), [docs/database.md](docs/database.md), and
[docs/architecture.md](docs/architecture.md) for implementation guidance.

## License

MIT. The upstream Brocoders copyright notice is retained in [LICENSE](LICENSE).
