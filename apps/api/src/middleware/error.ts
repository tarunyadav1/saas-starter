import type { ErrorRequestHandler } from 'express'

export const errors: ErrorRequestHandler = (err, _req, res, _next) => {
    const status = (err as any).status || 500
    const code = (err as any).code || 'INTERNAL'
    const message = err.message || 'Internal error'
    res.status(status).json({ code, message })
}