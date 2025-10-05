import 'dotenv/config'
import type { Config } from 'drizzle-kit'

function getDbUrl(): string {
  const urls = [process.env.POSTGRES_URL, process.env.SUPABASE_DB_URL, process.env.DATABASE_URL]
  const url = urls.find(Boolean)
  
  if (!url) {
    throw new Error('POSTGRES_URL (or SUPABASE_DB_URL/DATABASE_URL) is not set')
  }
  
  // Enforce sslmode=require for Supabase if not present
  const needsSSL = /supabase\.co/.test(url) && !/\bsslmode=/.test(url)
  return needsSSL ? (url + (url.includes('?') ? '&' : '?') + 'sslmode=require') : url
}

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDbUrl(),
  },
} satisfies Config
