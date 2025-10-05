import type { RequestHandler } from 'express'
import { redis } from '../utils/redis'

export const idempotency: RequestHandler = async (req, res, next) => {
    if (req.method !== 'POST') return next()
    const key = req.header('Idempotency-Key')
    if (!key) return next()
    
    try {
        const cacheKey = `idem:${key}`
        const existing = await redis.get(cacheKey)
        if (existing) {
            return res.status(200).set('Idempotent-Replay', 'true').send(existing)
        }
        
        const originalSend = res.send.bind(res)
        res.send = (body: any) => {
            const bodyStr = typeof body === 'string' ? body : JSON.stringify(body)
            void redis.setex(cacheKey, 600, bodyStr) // 10 minutes
            return originalSend(body)
        }
        
        return next()
    } catch (err) {
        console.error('Idempotency error:', err)
        return next() // Continue on Redis error
    }
}