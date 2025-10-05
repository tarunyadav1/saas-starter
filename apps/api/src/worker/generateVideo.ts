import { Queue, Worker, QueueEvents } from 'bullmq'
import { cfg } from '../config'
import { db, schema } from '../db'
import { nanoBana, ttsFal } from '../integrations/fal'
import { createInfiniteTalk, getPrediction } from '../integrations/wavespeed'
import { uploadFromUrl, publicUrl } from '../integrations/storage'
import { emitJobEvent } from '../routes/sse'
import { sql } from 'drizzle-orm'

// For BullMQ, we need to create a Redis connection compatible with its requirements
// Since Upstash doesn't support all Redis commands that BullMQ needs,
// let's create a simple in-memory queue for now and document this limitation
let jobQueue: any[] = []
let jobId = 1

const createMockQueue = () => ({
    add: async (name: string, data: any) => {
        const job = { id: String(jobId++), data, name, progress: 0, state: 'waiting' }
        jobQueue.push(job)
        // Process job asynchronously
        setImmediate(() => processJob(job))
        return job
    },
    getJob: async (id: string) => jobQueue.find(j => j.id === id)
})

async function processJob(job: any) {
    job.state = 'active'
    try {
        await generateVideoWorker(job)
        job.state = 'completed'
    } catch (err) {
        job.state = 'failed'
        job.failedReason = (err as Error).message
    }
}
export const queue = createMockQueue()

function progress(videoId: string, step: string, status: string, extra?: any) {
    emitJobEvent(videoId, { step, status, ...extra })
}

async function generateVideoWorker(job: any) {
    const id = String(job.id)
    const data = job.data as any
    progress(id, 'init', 'running')

    let imageUrl = data.imageVariantId
        ? (await db.select().from(schema.actorImageVariants).where(sql`${schema.actorImageVariants.id} = ${data.imageVariantId}`).limit(1))[0]?.outputImageUrl
        : null
    
    if (!imageUrl && data.imageEditPrompt) {
        progress(id, 'image_edit', 'running', { prompt: data.imageEditPrompt })
        const actor = (await db.select().from(schema.actorModels).where(sql`${schema.actorModels.key} = ${data.actorKey}`).limit(1))[0]
        const out = await nanoBana(cfg.falKey, { image_url: actor.imageUrl, prompt: data.imageEditPrompt })
        imageUrl = out.output_image_url
        progress(id, 'image_edit', 'completed')
    }
    
    if (!imageUrl) {
        const actor = (await db.select().from(schema.actorModels).where(sql`${schema.actorModels.key} = ${data.actorKey}`).limit(1))[0]
        imageUrl = actor.imageUrl
    }

    let audioUrl: string
    if (data.kind === 'text') {
        progress(id, 'tts', 'running')
        const actor = (await db.select().from(schema.actorModels).where(sql`${schema.actorModels.key} = ${data.actorKey}`).limit(1))[0]
        const tts = await ttsFal(cfg.falKey, { text: data.script, voice_id: actor.voiceId, format: 'mp3', sample_rate: 44100 })
        const key = `ugc-audio/${data.projectId}/${id}.mp3`
        await uploadFromUrl('ugc-audio', key, tts.audio_url)
        audioUrl = publicUrl('ugc-audio', key)
        progress(id, 'tts', 'completed')
    } else {
        audioUrl = publicUrl('ugc-audio', data.audioUploadId)
    }

    progress(id, 'lip_sync', 'running')
    const pred = await createInfiniteTalk(cfg.wavespeedKey, { audio_url: audioUrl, image_url: imageUrl, fps: 25 })
    const start = Date.now(), deadline = start + 10 * 60 * 1000
    let videoRemote: string | undefined
    
    for (;;) {
        const p = await getPrediction(cfg.wavespeedKey, pred.id)
        if (p.status === 'succeeded') { videoRemote = p.output?.video_url; break }
        if (p.status === 'failed' || p.status === 'canceled') throw new Error(p.error || 'WAVESPEED_FAILED')
        if (Date.now() > deadline) throw new Error('WAVESPEED_TIMEOUT')
        await new Promise(r => setTimeout(r, 3000))
    }
    
    const vkey = `ugc-video/${data.projectId}/${id}.mp4`
    await uploadFromUrl('ugc-video', vkey, videoRemote!)
    const publicVideo = publicUrl('ugc-video', vkey)
    progress(id, 'lip_sync', 'completed')

    const actor = (await db.select().from(schema.actorModels).where(sql`${schema.actorModels.key} = ${data.actorKey}`).limit(1))[0]
    await db.insert(schema.videoAssets).values({
        id: id,
        projectId: data.projectId,
        actorId: actor.id,
        sourceType: data.kind === 'text' ? 'text' : 'audio',
        sourceText: data.kind === 'text' ? data.script : null,
        sourceAudioUrl: audioUrl,
        videoUrl: publicVideo,
        status: 'completed',
        meta: { wavespeed: { predictionId: pred.id } },
    })
    
    progress(id, 'finalize', 'completed', { videoUrl: publicVideo })
}