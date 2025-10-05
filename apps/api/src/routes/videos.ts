import { Router } from 'express'
import { z } from 'zod'

export const videos = Router({ mergeParams: true })

const CreateText = z.object({ actorKey: z.string(), script: z.string().max(1500), imageVariantId: z.string().uuid().optional(), imageEditPrompt: z.string().max(200).optional() })
const CreateAudio = z.object({ actorKey: z.string(), audioUploadId: z.string(), imageVariantId: z.string().uuid().optional(), imageEditPrompt: z.string().max(200).optional() })

videos.post('/text', async (req: any, res, next) => {
    try {
        const body = CreateText.parse(req.body)
        const { queue } = await import('../worker/generateVideo.js')
        const job = await queue.add('generate-video', { kind: 'text', projectId: req.params.projectId!, ...body })
        res.status(202).json({ jobId: job.id, status: 'queued' })
    } catch (err) {
        next(err)
    }
})

videos.post('/audio', async (req: any, res, next) => {
    try {
        const body = CreateAudio.parse(req.body)
        const { queue } = await import('../worker/generateVideo.js')
        const job = await queue.add('generate-video', { kind: 'audio', projectId: req.params.projectId!, ...body })
        res.status(202).json({ jobId: job.id, status: 'queued' })
    } catch (err) {
        next(err)
    }
})