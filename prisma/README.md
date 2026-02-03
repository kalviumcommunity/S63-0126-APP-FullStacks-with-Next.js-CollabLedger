Prisma folder conventions and best practices

Files you should have committed
- `prisma/schema.prisma` — canonical Prisma schema (commit this)
- `prisma/migrations/` — generated migration directories (commit these SQL files; they document schema history)
- `prisma/seed.ts` — the idempotent seed script (commit this)
- `.env.example` — template with `DATABASE_URL` placeholder (commit this)

Local-only files (do NOT commit)
- `.env.local` — local secrets and actual `DATABASE_URL`

Recommendations
- Always run `npx prisma migrate dev` locally to generate migrations, then commit the new migration folder.
- Prefer `npx prisma migrate deploy` in CI when applying migrations to non-development environments.
- Verify migrations on staging using a recent snapshot before applying to production.
- Keep seeds idempotent (use `upsert` or checks) so they are safe to run multiple times.

Quick commands

```bash
# generate Prisma client
npx prisma generate

# create & apply migration locally
npx prisma migrate dev --name init_schema

# apply migrations in CI (non-interactive)
npx prisma migrate deploy

# reset local DB and run seed (destructive)
npx prisma migrate reset --force

# run seed explicitly
npx prisma db seed
```
