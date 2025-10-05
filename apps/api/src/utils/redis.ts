import { Redis } from '@upstash/redis'
import { cfg } from '../config'

// Create a dummy Redis instance if not configured
export const redis = cfg.upstashRedisRestUrl && cfg.upstashRedisRestToken
    ? new Redis({
        url: cfg.upstashRedisRestUrl,
        token: cfg.upstashRedisRestToken,
    })
    : null as any

// Helper for rate limiting
export class UpstashRateLimiter {
    constructor(private key: string, private limit: number, private window: number) {}

    async consume(): Promise<void> {
        const current = await redis.incr(this.key)
        if (current === 1) {
            await redis.expire(this.key, this.window)
        }
        if (current > this.limit) {
            throw new Error('Rate limit exceeded')
        }
    }
}