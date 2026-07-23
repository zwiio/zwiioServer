# Introduction

This API template pairs naturally with
[`zwiio`](https://github.com/zwiio/zwiio).
It favors a simple mobile-friendly login experience: enter a phone number,
receive a Twilio Verify SMS code, submit the code, and receive application JWT
tokens.

## Features

- MongoDB and Mongoose persistence only.
- Twilio Verify SMS OTP login with E.164 phone-number validation.
- JWT access tokens and rotating refresh-token sessions.
- Optional inherited email/password login and transactional mail.
- Admin and user roles.
- Internationalization, local or Amazon S3 uploads, and Swagger docs.
- Unit tests, Docker end-to-end support, and GitHub Actions.

The project is derived from the MIT-licensed Brocoders NestJS Boilerplate and
keeps its hexagonal repository pattern while selecting MongoDB as the sole
database implementation.

---

Previous: [Main](readme.md)

Next: [Installing and Running](installing-and-running.md)
