import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

export type AuthUser = { uid: string; userId?: number; teamId?: number }
declare global { namespace Express { interface Request { auth?: AuthUser } } }

export const auth: RequestHandler = async (req, _res, next) => {
    const hdr = req.headers.authorization
    if (!hdr?.startsWith('Bearer ')) return next()
    const token = hdr.slice('Bearer '.length)
    try {
        const decoded = jwt.decode(token) as any
        req.auth = { uid: decoded?.sub }
    } catch {}
    return next()
}