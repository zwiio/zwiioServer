# Command Line Interface

This template is already specialized to MongoDB and Mongoose. Its generators
create document-persistence resources only.

## Generate a Resource

```bash
npm run generate:resource:document -- --name Category
```

This creates a domain model, DTOs, service/controller, repository port,
Mongoose schema, mapper, adapter, and module wiring.

## Add a Property

```bash
npm run add:property:to-document
```

Review the generated DTO validation and MongoDB indexes before committing
identity or lookup fields.

---

Previous: [Architecture](architecture.md)

Next: [Database](database.md)
