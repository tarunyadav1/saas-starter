import dotenv from 'dotenv'
import { join } from 'path'

// Load .env file from the api directory
const envPath = join(__dirname, '../.env')
console.log('[Config] Loading .env from:', envPath)
dotenv.config({ path: envPath })

console.log('[Config] Environment variables check:')
console.log('[Config] NODE_ENV:', process.env.NODE_ENV)
console.log('[Config] PORT:', process.env.PORT)
console.log('[Config] POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET (length: ' + process.env.POSTGRES_URL.length + ')' : 'NOT SET')
console.log('[Config] FAL_API_KEY:', process.env.FAL_API_KEY ? 'SET' : 'NOT SET')
console.log('[Config] SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET')

export const cfg = {
    falKey: process.env.FAL_API_KEY || '',
    wavespeedKey: process.env.WAVESPEED_API_KEY || '',
    postgresUrl: process.env.POSTGRES_URL!,
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL || '',
    upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    publicStorageBase: process.env.PUBLIC_STORAGE_BASE || '',
    wavespeedWebhookSecret: process.env.WEBHOOK_SECRET_WAVESPEED || '',
    port: Number(process.env.PORT || 3001),
    env: process.env.NODE_ENV || 'development',
}

console.log('[Config] Final config postgresUrl:', cfg.postgresUrl ? 'SET (length: ' + cfg.postgresUrl.length + ')' : 'NOT SET')