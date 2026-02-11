# Prisma Migrations & Seeding

This project uses Prisma ORM (PostgreSQL) to manage schema migrations and initial data seeding.

Prerequisites:
- Ensure `DATABASE_URL` is set in your environment (e.g. `.env.local`).
- Install dependencies before running migrations/seeds:

```bash
npm install
```

Initialize and run the first migration (run locally):

```bash
# create migration and apply to your local dev database
npx prisma migrate dev --name init_schema
```

Notes on migrations:
- Migration files will be created under `prisma/migrations/`.
- Use `npx prisma migrate status` to inspect applied migrations.
- To reset a local database (destroys data):

```bash
# wipes local DB, reapplies migrations, and runs seeds
npx prisma migrate reset --force
```

Seeding:
- The project contains an idempotent seed script at `prisma/seed.ts` which uses `upsert` to avoid duplicates.
- The `package.json` contains a Prisma seed config which runs the TypeScript file using `ts-node`:

- Run the seed via Prisma:

```bash
npx prisma db seed
```

- Or directly with ts-node (if you prefer):

```bash
npx ts-node --transpile-only prisma/seed.ts
```

Sample seed output:

```
Seeding complete: upserted 2 users
```

Sample migration output (abbreviated):

```
Prisma schema loaded from prisma/schema.prisma
Applying migration `20260101_init_schema` to the database
✔ Migrate applied successfully
```

Rollback & safety:
- Migrations are source-controlled in `prisma/migrations/`. To roll back locally, use `prisma migrate reset`.
- NEVER run `migrate reset` or destructive operations against production without backups and clear approvals.
- For production schema changes, prefer:
  - Create migrations locally and review in a PR
  - Apply them from CI/CD to a staging environment first
  - Use run-time checks and feature flags to roll out schema-using code

Protecting production data (short reflection):
- Keep separate environments: local, staging, production with independent databases.
- Use automated daily backups and periodic snapshot retention for production databases.
- Test migrations against a recent production snapshot in a staging environment before applying to production.
- Use migration review PRs and limited, audited release steps for making schema changes in production.

Local convenience (optional):
- Add npm script `"prisma:seed": "npx prisma db seed"` if you want a shortcut.

//command for seeing all users
docker exec -i s63-0126-app-fullstacks-with-nextjs-collabledger-db-1 psql -U user -d collabledger -c "SELECT id, email, name, \"createdAt\", \"updatedAt\" FROM \"User\";"