import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import { cfg } from '../config'

console.log('[DB] Connecting to PostgreSQL...')
console.log('[DB] Database URL:', cfg.postgresUrl?.replace(/:[^:@]*@/, ':***@')) // Log URL with password hidden

export const client = postgres(cfg.postgresUrl)
export const db = drizzle(client, { schema })
export { schema }

console.log('[DB] Database connection initialized')