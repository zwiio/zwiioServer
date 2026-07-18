# Database

This template uses MongoDB with Mongoose. Its domain services depend on
repository ports, while document adapters under `infrastructure/persistence`
provide the MongoDB implementation.

## Configuration

The development example uses:

```dotenv
DATABASE_TYPE=mongodb
DATABASE_PORT=27017
DATABASE_USERNAME=root
DATABASE_PASSWORD=secret
DATABASE_NAME=phone_auth_api
DATABASE_URL=mongodb://localhost:27017
```

When the API runs inside `docker-compose.document.yaml`, use
`DATABASE_URL=mongodb://mongo:27017` as shown in `env-example-document`.

## User Identity Indexes

`src/users/infrastructure/persistence/document/entities/user.schema.ts`
defines partial unique indexes on `email` and `phoneNumber`. A phone-auth user
can therefore have a null email, while duplicate verified phone numbers remain
blocked at the database layer.

When applying this template to an existing MongoDB database that already has
the upstream `email_1` unique index, reconcile or recreate that index before
creating multiple phone-only users.

## Seeds

```bash
npm run seed:run:document
```

## Generating Document Resources

```bash
npm run generate:resource:document -- --name Post
npm run add:property:to-document
```

Create targeted indexes for fields used in filters, sorting, or uniqueness.

---

Previous: [Command Line Interface](cli.md)

Next: [Auth](auth.md)
