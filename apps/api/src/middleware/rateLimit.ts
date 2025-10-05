import type { RequestHandler } from 'express'
import { redis } from '../utils/redis'

export const rateLimit: RequestHandler = async (req, res, next) => {
    // Skip rate limiting in development if Redis is not configured
    if (process.env.NODE_ENV === 'development' && (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN)) {
        return next()
    }
    
    try {
        const identifier = req.auth?.uid || req.ip || 'anonymous'
        const key = `rate_limit:${identifier}`
        const current = await redis.incr(key)
        if (current === 1) {
            await redis.expire(key, 60) // 60 seconds window
        }
        if (current > 60) { // 60 requests per minute
            return res.status(429).json({ code: 'RATE_LIMITED', message: 'Too many requests' })
        }
        return next()
    } catch (err) {
        console.error('Rate limit error:', err)
        return next() // Continue on Redis error
    }
}