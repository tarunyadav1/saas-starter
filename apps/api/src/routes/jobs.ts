import { Router } from 'express'

export const jobs = Router()

jobs.get('/:jobId', async (req, res, next) => {
    try {
        const { queue } = await import('../worker/generateVideo.js')
        const job = await queue.getJob(req.params.jobId)
        if (!job) return res.status(404).json({ code: 'JOB_NOT_FOUND' })
        res.json({
            id: job.id,
            state: await job.getState(),
            progress: job.progress,
            data: job.data,
            returnValue: job.returnvalue,
            failedReason: job.failedReason
        })
    } catch (err) {
        next(err)
    }
})