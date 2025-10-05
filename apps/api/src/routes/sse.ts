import { Router } from 'express'

export const sse = Router()

const clients = new Map<string, Set<any>>()

sse.get('/projects/:projectId/videos/:videoId/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()
    const key = req.params.videoId
    if (!clients.has(key)) clients.set(key, new Set())
    clients.get(key)!.add(res)
    req.on('close', () => { clients.get(key)?.delete(res) })
})

export function emitJobEvent(videoId: string, evt: any) {
    const conns = clients.get(videoId)
    if (!conns) return
    for (const res of conns) res.write(`data: ${JSON.stringify(evt)}\n\n`)
}