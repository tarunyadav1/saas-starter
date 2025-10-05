import type { RequestHandler } from 'express'
import { redis } from '../utils/redis'

const LIMIT = 2

export const guardGenerationConcurrency: RequestHandler = async (req, res, next) => {
    try {
        const identifier = req.auth?.uid || req.ip || 'anonymous'
        const key = `genlim:${identifier}`
        const active = Number((await redis.get(key)) || 0)
        
        if (active >= LIMIT) {
            return res.status(429).json({ code: 'CONCURRENCY_LIMIT', message: 'Too many active generations' })
        }
        
        await redis.incr(key)
        res.on('finish', async () => { 
            try {
                await redis.decr(key)
            } catch (err) {
                console.error('Error decrementing concurrency:', err)
            }
        })
        
        return next()
    } catch (err) {
        console.error('Concurrency guard error:', err)
        return next() // Continue on Redis error
    }
}