# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Synthatar is a Next.js SaaS starter monorepo with a web application and API server. The project uses pnpm workspaces to manage multiple packages.

## Architecture

### Monorepo Structure

- `/apps/web` - Next.js 15 web application with App Router
- `/apps/api` - Express.js API server
- `/packages/*` - Shared packages (currently empty)

### Tech Stack

- **Framework**: Next.js 15 (canary) with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth (Google OAuth + Magic Links)
- **Payments**: Stripe (Checkout, Customer Portal, Webhooks)
- **UI**: Radix UI + Tailwind CSS + shadcn/ui components
- **State Management**: SWR for data fetching
- **Validation**: Zod schemas

### Database Schema

- `users` - User accounts with Supabase UID mapping and local profile data
- `teams` - Organizations with Stripe subscription data
- `teamMembers` - Many-to-many relationship with role-based access (owner/member)
- `activityLogs` - Audit trail for user actions
- `invitations` - Team invitation system

## Development Commands

### Monorepo Commands (from root)

```bash
pnpm dev              # Run all apps in parallel
pnpm dev:web          # Run only web app
pnpm dev:api          # Run only API server
pnpm build            # Build all apps
pnpm build:web        # Build only web app
pnpm build:api        # Build only API server
```

### Web App Commands (from /apps/web)

```bash
pnpm dev              # Start Next.js dev server (port 3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm db:setup         # Create .env file and setup database
pnpm db:seed          # Seed database with test user (test@test.com / admin123)
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run database migrations
pnpm db:migrate:prod   # Run migrations against production database
pnpm db:studio        # Open Drizzle Studio for database management
```

### API Commands (from /apps/api)

```bash
pnpm dev              # Start with hot reload using tsx watch
pnpm build            # Compile TypeScript
pnpm start            # Run compiled JavaScript
```

### Stripe Testing

```bash
stripe login          # Authenticate with Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook  # Forward webhooks locally
```

## Key Implementation Details

### Authentication Flow

- Supabase Auth handles Google OAuth and magic link authentication
- Session management via Supabase cookies in middleware
- Protected routes: `/dashboard/*` enforced by middleware
- Local user creation/upsert on first Supabase login via `getUser()`
- Automatic team onboarding for new users

### Stripe Integration

- Checkout flow: `/pricing` → `/api/stripe/checkout` → Stripe → webhook updates database
- Webhook endpoint: `/api/stripe/webhook` handles subscription events
- Customer Portal: Accessible from dashboard for subscription management
- Test card: 4242 4242 4242 4242

### Server Actions Pattern

- Located in `(login)/actions.ts` for auth actions
- Use `withAuth()` wrapper for protected actions
- Use `validatedAction()` for Zod schema validation
- Activity logging via `logActivity()` helper

### UI Components

- Custom components in `/components/ui/*` based on Radix UI primitives
- Use `cn()` utility for className merging (clsx + tailwind-merge)
- Tailwind v4 with PostCSS configuration

### Environment Variables Required

- `POSTGRES_URL` - PostgreSQL connection string (for local/dev)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous public key
- `BASE_URL` - Application URL (http://localhost:3000 for dev)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_PRODUCT_ID_BASIC` - Stripe product ID for basic plan
- `STRIPE_PRODUCT_ID_PRO` - Stripe product ID for pro plan

**Production Environment (.env.production):**
- `POSTGRES_URL` - Production Supabase PostgreSQL URL with `?sslmode=require`
- All other environment variables for production values

## Database Migration Workflow with Supabase

### Migration System Setup

The project uses Drizzle ORM with a properly configured migration system that works with both local and production Supabase databases.

**Key files:**
- `drizzle.config.ts` - Drizzle configuration with env loading and SSL handling
- `lib/db/schema.ts` - Database schema definitions
- `lib/db/migrations/` - Generated migration files

### Migration Commands

```bash
# Local development workflow
pnpm db:generate      # Generate migrations from schema changes
pnpm db:migrate       # Apply migrations to local database

# Production deployment workflow  
pnpm db:migrate:prod  # Apply migrations to production database
```

### Migration Best Practices

1. **Schema Changes**: Always edit `lib/db/schema.ts` first, then generate migrations
2. **RLS Policies**: Add RLS policies directly in migration SQL files after generation
3. **Storage Buckets**: Include Supabase storage bucket creation in migrations using `INSERT INTO storage.buckets`
4. **Indexes**: Add performance indexes in migration files
5. **Production**: Always test migrations locally before applying to production

### Example Migration Workflow

```bash
# 1. Make schema changes in lib/db/schema.ts
# 2. Generate migration
pnpm db:generate

# 3. Edit generated migration file to add:
#    - RLS policies for new tables
#    - Storage bucket creation
#    - Performance indexes
#    - Any custom SQL

# 4. Test locally
pnpm db:migrate

# 5. Deploy to production
pnpm db:migrate:prod
```

### RLS Policy Pattern

When adding new tables, always include RLS policies in the migration:

```sql
-- Enable RLS
ALTER TABLE "table_name" ENABLE ROW LEVEL SECURITY;

-- Team-based access policy
CREATE POLICY "Team members can access table" ON "table_name"
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM team_members tm
        JOIN users u ON u.id = tm.user_id
        WHERE tm.team_id = table_name.team_id
        AND u.supabase_uid = auth.uid()
    )
);
```

## Testing Approach

- No specific test framework configured yet
- Manual testing with Google OAuth or magic links
- Stripe webhook testing via Stripe CLI
- Database testing via migrations and Drizzle Studio

## Important Patterns

### Data Fetching

- Server Components fetch data directly in components
- Client Components use SWR for data fetching and mutations
- API routes return JSON responses with appropriate status codes

### Error Handling

- Form actions return `{ error: string }` for validation errors
- API routes use try/catch with proper error responses
- Database queries wrapped in error handling

### Security Considerations

- All database queries use parameterized statements via Drizzle
- Authentication required for dashboard routes
- RBAC enforced at action level (owner vs member roles)
- Passwords hashed with bcrypt (10 salt rounds)
- Cookies marked as httpOnly, secure, sameSite: 'lax'

### some point to remember

- use the api to create any api for the app don;t use the nextjs api
- don't create unnesscary test file , just use the terminal to test
- don't need comment we don't want them
