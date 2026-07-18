# Project instructions

NestJS API template using MongoDB/Mongoose persistence and Twilio Verify SMS phone authentication.

## When adding entities, schemas, or properties

Use the document generators (`npm run generate:resource:document` and `npm run add:property:to-document`) for ordinary resources. For identity or authentication changes, review the domain model, Mongoose schema/indexes, mapper, repository port, and tests together.
