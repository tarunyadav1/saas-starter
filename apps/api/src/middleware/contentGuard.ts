import type { RequestHandler } from 'express'

const banned = [/child/i, /terror/i]

export const contentGuard: RequestHandler = (req, res, next) => {
    const s = JSON.stringify(req.body || {})
    if (banned.some(rx => rx.test(s))) return res.status(400).json({ code: 'CONTENT_BLOCKED', message: 'Prompt not allowed' })
    return next()
}