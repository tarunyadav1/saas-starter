### Integration plan: fal.ai (TTS + image edit) and WaveSpeed InfiniteTalk (lip‑sync)

- Backend-only integrations; all calls originate from `apps/api` Express server [[memory:8357912]].
- Concrete modules, routes, and worker orchestration below.
- Include curl examples, strict request/response shapes, and retry policy.

### Env/config

Add to `apps/api/.env`:

```bash
# Providers
FAL_API_KEY=...
WAVESPEED_API_KEY=...

# Storage (Supabase)
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# DB / Queue
POSTGRES_URL=...
REDIS_URL=redis://localhost:6379

# URLs
PUBLIC_STORAGE_BASE=https://<your-supabase-project>.supabase.co/storage/v1/object/public
WEBHOOK_SECRET_WAVESPEED=whsec_...
```

Minimal config helper (optional):

```ts
// apps/api/src/config.ts
export const cfg = {
	falKey: process.env.FAL_API_KEY!,
	wavespeedKey: process.env.WAVESPEED_API_KEY!,
	supabaseUrl: process.env.SUPABASE_URL!,
	supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE_KEY!,
	redisUrl: process.env.REDIS_URL!,
	storageBase: process.env.PUBLIC_STORAGE_BASE!,
	wavespeedWebhookSecret: process.env.WEBHOOK_SECRET_WAVESPEED!,
}
```

### HTTP clients

```ts
// apps/api/src/integrations/fal.ts
import fetch from 'node-fetch'

const FAL_BASE = 'https://fal.run' // verify exact host in docs.fal.ai

type TtsInput = {
	text: string
	voice_id: string
	format?: 'mp3'
	sample_rate?: number
}
type TtsOutput = { audio_url: string; duration?: number }

type NanoBanaInput = {
	image_url: string
	prompt: string
	seed?: number
	strength?: number
}
type NanoBanaOutput = { output_image_url: string }

const withAuth = (key: string) => ({
	headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
})

export async function falTtsText(
	key: string,
	input: TtsInput,
	{ timeoutMs = 30000 } = {}
): Promise<TtsOutput> {
	const controller = new AbortController()
	const id = setTimeout(() => controller.abort(), timeoutMs)
	try {
		// NOTE: Confirm exact model path from docs. Example uses a generic "tts" pipeline name.
		const res = await fetch(`${FAL_BASE}/v1/pipelines/fal-ai/tts`, {
			method: 'POST',
			...withAuth(key),
			body: JSON.stringify({ input }),
			signal: controller.signal as any,
		})
		if (!res.ok) throw new Error(`fal.tts ${res.status} ${await res.text()}`)
		return (await res.json()) as TtsOutput
	} finally {
		clearTimeout(id)
	}
}

export async function falNanoBanaEdit(
	key: string,
	input: NanoBanaInput,
	{ timeoutMs = 60000 } = {}
): Promise<NanoBanaOutput> {
	const controller = new AbortController()
	const id = setTimeout(() => controller.abort(), timeoutMs)
	try {
		// NOTE: Confirm exact model name for nano-bana in fal docs.
		const res = await fetch(
			`${FAL_BASE}/v1/pipelines/fal-ai/nano-bana-image-edit`,
			{
				method: 'POST',
				...withAuth(key),
				body: JSON.stringify({ input }),
				signal: controller.signal as any,
			}
		)
		if (!res.ok)
			throw new Error(`fal.nano-bana ${res.status} ${await res.text()}`)
		return (await res.json()) as NanoBanaOutput
	} finally {
		clearTimeout(id)
	}
}
```

```ts
// apps/api/src/integrations/wavespeed.ts
import crypto from 'crypto'
import fetch from 'node-fetch'

const WAVESPEED_BASE = 'https://api.wavespeed.ai' // verify from docs

export type InfiniteTalkInput = {
	audio_url: string
	image_url: string
	fps?: number
	seed?: number
}

export type Prediction = {
	id: string
	status: 'queued' | 'processing' | 'succeeded' | 'failed' | 'canceled'
	output?: { video_url?: string; thumb_url?: string; duration?: number }
	error?: string
}

const withAuth = (key: string) => ({
	headers: {
		Authorization: `Bearer ${key}`,
		'Content-Type': 'application/json',
	},
})

export async function createInfiniteTalk(
	key: string,
	input: InfiniteTalkInput
): Promise<{ id: string; status: string }> {
	// Model path from docs index is "Infinitetalk"
	const res = await fetch(`${WAVESPEED_BASE}/v1/predictions/Infinitetalk`, {
		method: 'POST',
		...withAuth(key),
		body: JSON.stringify(input),
	})
	if (!res.ok)
		throw new Error(`wavespeed.create ${res.status} ${await res.text()}`)
	return (await res.json()) as any
}

export async function getPrediction(
	key: string,
	id: string
): Promise<Prediction> {
	const res = await fetch(`${WAVESPEED_BASE}/v1/predictions/${id}`, {
		method: 'GET',
		...withAuth(key),
	})
	if (!res.ok)
		throw new Error(`wavespeed.get ${res.status} ${await res.text()}`)
	return (await res.json()) as Prediction
}

// Optional webhook verification if docs provide HMAC secret
export function verifyWaveSpeedSignature(
	rawBody: string,
	signature: string,
	secret: string
) {
	const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
	return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))
}
```

### Storage helpers (Supabase Storage)

```ts
// apps/api/src/integrations/storage.ts
import { createClient } from '@supabase/supabase-js'
import { Readable } from 'stream'

export function supabaseAdmin() {
	const url = process.env.SUPABASE_URL!
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
	return createClient(url, key, { auth: { persistSession: false } })
}

export async function uploadFromUrl(
	bucket: string,
	path: string,
	remoteUrl: string
) {
	const sb = supabaseAdmin()
	const res = await fetch(remoteUrl)
	if (!res.ok) throw new Error(`download ${remoteUrl} failed ${res.status}`)
	const buf = Buffer.from(await res.arrayBuffer())
	const { data, error } = await sb.storage.from(bucket).upload(path, buf, {
		upsert: true,
		contentType: res.headers.get('content-type') ?? 'application/octet-stream',
	})
	if (error) throw error
	return data
}

export async function uploadBuffer(
	bucket: string,
	path: string,
	buf: Buffer,
	contentType: string
) {
	const sb = supabaseAdmin()
	const { data, error } = await sb.storage.from(bucket).upload(path, buf, {
		upsert: true,
		contentType,
	})
	if (error) throw error
	return data
}

export function publicUrl(bucket: string, path: string) {
	const base = process.env.PUBLIC_STORAGE_BASE!
	return `${base}/${bucket}/${encodeURIComponent(path)}`
}
```

### Validation schemas (strict)

```ts
// apps/api/src/validation.ts
import { z } from 'zod'

export const CreateImageVariant = z.object({
	actorKey: z.string().min(1),
	prompt: z.string().min(1).max(200),
	seed: z.number().int().optional(),
	strength: z.number().min(0).max(1).optional(),
})

export const CreateVideoFromText = z.object({
	actorKey: z.string().min(1),
	script: z.string().min(1).max(1500),
	imageVariantId: z.string().uuid().optional(),
	imageEditPrompt: z.string().max(200).optional(),
})

export const CreateVideoFromAudio = z.object({
	actorKey: z.string().min(1),
	audioUploadId: z.string().min(1), // storage key or upload token
	imageVariantId: z.string().uuid().optional(),
	imageEditPrompt: z.string().max(200).optional(),
})
```

### Express routes (REST, backend-only)

```ts
// apps/api/src/routes/projects.ts
import { Router } from 'express'
import { db } from '../../db' // your drizzle wrapper
import {
	projects,
	actorModels,
	actorImageVariants,
	videoAssets,
} from '../../db/schema'
import { eq, and } from 'drizzle-orm'
import {
	CreateImageVariant,
	CreateVideoFromText,
	CreateVideoFromAudio,
} from '../validation'
import { falNanoBanaEdit, falTtsText } from '../integrations/fal'
import { createInfiniteTalk } from '../integrations/wavespeed'
import { uploadFromUrl, publicUrl } from '../integrations/storage'
import { v4 as uuidv4 } from 'uuid'

export const router = Router({ mergeParams: true })

// POST /api/projects
router.post('/', async (req, res) => {
	const { teamId, ownerId, title } = req.body // assume auth middleware populates teamId/ownerId
	const [row] = await db
		.insert(projects)
		.values({ id: crypto.randomUUID(), teamId, ownerId, title })
		.returning()
	res.status(201).json({ id: row.id, title: row.title })
})

// GET /api/projects/:projectId/image-variants?actorKey=...
router.get('/:projectId/image-variants', async (req, res) => {
	const actorKey = String(req.query.actorKey || '')
	const items = await db.execute(
		/* sql */ `
    select aiv.* from actor_image_variant aiv
    join actor_model am on am.id = aiv.actor_id
    where aiv.project_id = ${req.params.projectId}::uuid
      ${actorKey ? `and am.key = ${actorKey}` : ''};
  ` as any
	)
	res.json({ items: items.rows })
})

// POST /api/projects/:projectId/image-variants
router.post('/:projectId/image-variants', async (req, res) => {
	const body = CreateImageVariant.parse(req.body)
	const [actor] = await db
		.select()
		.from(actorModels)
		.where(eq(actorModels.key, body.actorKey))
		.limit(1)
	if (!actor) return res.status(400).json({ code: 'ACTOR_NOT_FOUND' })

	const out = await falNanoBanaEdit(process.env.FAL_API_KEY!, {
		image_url: actor.imageUrl,
		prompt: body.prompt,
		seed: body.seed,
		strength: body.strength,
	})

	const variantId = uuidv4()
	await db.insert(actorImageVariants).values({
		id: variantId,
		projectId: req.params.projectId as any,
		actorId: actor.id,
		prompt: body.prompt,
		seed: body.seed as any,
		strength: body.strength as any,
		outputImageUrl: out.output_image_url,
		meta: { fal: out },
	})
	res.status(201).json({ imageVariantId: variantId })
})

// POST /api/projects/:projectId/videos (text)
router.post('/:projectId/videos:text', async (req, res) => {
	const body = CreateVideoFromText.parse(req.body)
	const [actor] = await db
		.select()
		.from(actorModels)
		.where(eq(actorModels.key, body.actorKey))
		.limit(1)
	if (!actor) return res.status(400).json({ code: 'ACTOR_NOT_FOUND' })

	// enqueue job (see worker) – return queued token
	const job = await req.app.locals.queue.add('generate-video', {
		kind: 'text',
		projectId: req.params.projectId,
		actor,
		script: body.script,
		imageVariantId: body.imageVariantId ?? null,
		imageEditPrompt: body.imageEditPrompt ?? null,
	})
	res.status(202).json({ jobId: job.id, status: 'queued' })
})

// POST /api/projects/:projectId/videos:audio
router.post('/:projectId/videos:audio', async (req, res) => {
	const body = CreateVideoFromAudio.parse(req.body)
	const [actor] = await db
		.select()
		.from(actorModels)
		.where(eq(actorModels.key, body.actorKey))
		.limit(1)
	if (!actor) return res.status(400).json({ code: 'ACTOR_NOT_FOUND' })

	const job = await req.app.locals.queue.add('generate-video', {
		kind: 'audio',
		projectId: req.params.projectId,
		actor,
		audioUploadId: body.audioUploadId,
		imageVariantId: body.imageVariantId ?? null,
		imageEditPrompt: body.imageEditPrompt ?? null,
	})
	res.status(202).json({ jobId: job.id, status: 'queued' })
})
```

Register routes:

```ts
// apps/api/src/index.ts (add)
import { router as projectRoutes } from './routes/projects'
app.use('/api/projects', projectRoutes)
```

### Worker orchestration (BullMQ)

```ts
// apps/api/src/worker/generateVideo.ts
import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq'
import IORedis from 'ioredis'
import { db } from '../db'
import { videoAssets, actorImageVariants } from '../db/schema'
import { falNanoBanaEdit, falTtsText } from '../integrations/fal'
import { createInfiniteTalk, getPrediction } from '../integrations/wavespeed'
import { uploadFromUrl, publicUrl } from '../integrations/storage'

const connection = new IORedis(process.env.REDIS_URL!)

export const queue = new Queue('generate-video', { connection })
export const events = new QueueEvents('generate-video', { connection })

type JobData =
	| {
			kind: 'text'
			projectId: string
			actor: any
			script: string
			imageVariantId: string | null
			imageEditPrompt: string | null
	  }
	| {
			kind: 'audio'
			projectId: string
			actor: any
			audioUploadId: string
			imageVariantId: string | null
			imageEditPrompt: string | null
	  }

new Worker<JobData>(
	'generate-video',
	async (job) => {
		const { kind, projectId, actor } = job.data

		// 1) Ensure image variant
		let imageUrl: string
		if (job.data.imageVariantId) {
			const [aiv] = (await db
				.select()
				.from(actorImageVariants)
				.where((actorImageVariants as any).id.eq(job.data.imageVariantId))
				.limit(1)) as any
			if (!aiv) throw new Error('IMAGE_VARIANT_NOT_FOUND')
			imageUrl = aiv.outputImageUrl
		} else if (job.data.imageEditPrompt) {
			const out = await falNanoBanaEdit(process.env.FAL_API_KEY!, {
				image_url: actor.imageUrl,
				prompt: job.data.imageEditPrompt,
			})
			// optionally persist a new variant
			imageUrl = out.output_image_url
		} else {
			imageUrl = actor.imageUrl
		}

		// 2) TTS or audio passthrough
		let audioUrl: string
		if (kind === 'text') {
			const tts = await falTtsText(process.env.FAL_API_KEY!, {
				text: job.data.script,
				voice_id: actor.voiceId,
				format: 'mp3',
				sample_rate: 44100,
			})
			// Upload to storage
			const key = `ugc-audio/${projectId}/${job.id}.mp3`
			await uploadFromUrl('ugc-audio', key, tts.audio_url)
			audioUrl = publicUrl('ugc-audio', key)
		} else {
			// Assume client already uploaded to 'ugc-audio' bucket and passed storage key
			audioUrl = publicUrl('ugc-audio', job.data.audioUploadId)
		}

		// 3) Wavespeed InfiniteTalk
		const pred = await createInfiniteTalk(process.env.WAVESPEED_API_KEY!, {
			audio_url: audioUrl,
			image_url: imageUrl,
			fps: 25,
		})

		// 4) Poll result (2–5s backoff up to 10 min)
		let outUrl: string | undefined
		const started = Date.now()
		const deadline = started + 10 * 60 * 1000
		while (Date.now() < deadline) {
			const status = await getPrediction(
				process.env.WAVESPEED_API_KEY!,
				pred.id
			)
			if (status.status === 'succeeded') {
				outUrl = status.output?.video_url
				break
			}
			if (status.status === 'failed' || status.status === 'canceled') {
				throw new Error(status.error || 'WAVESPEED_FAILED')
			}
			await new Promise((r) => setTimeout(r, 3000))
		}
		if (!outUrl) throw new Error('WAVESPEED_TIMEOUT')

		// 5) Upload video to storage
		const videoKey = `ugc-video/${projectId}/${job.id}.mp4`
		await uploadFromUrl('ugc-video', videoKey, outUrl)
		const publicVideo = publicUrl('ugc-video', videoKey)

		// 6) Persist video_asset
		await db.insert(videoAssets).values({
			id: job.id as any,
			projectId: projectId as any,
			actorId: actor.id,
			sourceType: kind === 'text' ? ('text' as any) : ('audio' as any),
			sourceText: kind === 'text' ? (job.data as any).script : null,
			sourceAudioUrl: audioUrl,
			videoUrl: publicVideo,
			status: 'completed' as any,
			meta: { wavespeed: { predictionId: pred.id } },
		})
	},
	{ connection, concurrency: 2 }
)
```

Wire the queue into the app:

```ts
// apps/api/src/index.ts (bootstrap queue)
import { queue } from './worker/generateVideo'
app.locals.queue = queue
```

### Retry/backoff policy

- fal.ai: 2 retries on 429/5xx with jittered backoff (500ms, 1500ms). Abort at 30s for TTS, 60s for image edit.
- WaveSpeed: polling every 3s; hard timeout 10 minutes. If webhook available, switch to webhook-first with single confirmation poll.

Minimal fetch wrapper with retry:

```ts
// apps/api/src/utils/retryFetch.ts
export async function retryFetch(
	input: RequestInfo,
	init: RequestInit,
	retries = 2,
	baseDelay = 500
) {
	for (let attempt = 0; ; attempt++) {
		const res = await fetch(input, init)
		if (res.ok) return res
		if (res.status >= 500 || res.status === 429) {
			if (attempt < retries) {
				const jitter = Math.random() * 200
				await new Promise((r) =>
					setTimeout(r, baseDelay * (attempt + 1) + jitter)
				)
				continue
			}
		}
		throw new Error(`${res.status} ${await res.text()}`)
	}
}
```

Use it inside `fal.ts`/`wavespeed.ts` in place of direct `fetch`.

### Request/response shapes (API surface for frontend)

- POST `/api/projects/:projectId/image-variants`
  - Body: `{ actorKey, prompt, seed?, strength? }`
  - 201: `{ imageVariantId }`
- GET `/api/projects/:projectId/image-variants?actorKey=...`
  - 200: `{ items: ImageVariant[] }`
- POST `/api/projects/:projectId/videos:text`
  - Body: `{ actorKey, script, imageVariantId?, imageEditPrompt? }`
  - 202: `{ jobId, status: 'queued' }`
- POST `/api/projects/:projectId/videos:audio`
  - Body: `{ actorKey, audioUploadId, imageVariantId?, imageEditPrompt? }`
  - 202: `{ jobId, status: 'queued' }`

DB writes are done by the worker, not the request thread.

### Webhooks (optional, WaveSpeed)

If WaveSpeed provides webhooks:

- Set endpoint `POST /api/webhooks/wavespeed`.
- Read raw body, verify `X-Wavespeed-Signature` against `WEBHOOK_SECRET_WAVESPEED`.
- Update `generation_job` and `video_asset` on status changes; once `succeeded`, pull `video_url`, upload to storage, finalize.

```ts
// apps/api/src/routes/webhooks.ts
import { Router } from 'express'
import { verifyWaveSpeedSignature } from '../integrations/wavespeed'

export const webhooks = Router()

webhooks.post(
	'/wavespeed',
	express.raw({ type: 'application/json' }),
	async (req, res) => {
		const sig = req.header('X-Wavespeed-Signature') || ''
		const ok = verifyWaveSpeedSignature(
			req.body.toString(),
			sig,
			process.env.WAVESPEED_WEBHOOK_SECRET!
		)
		if (!ok) return res.status(400).send('invalid signature')

		const evt = JSON.parse(req.body.toString())
		// evt: { id, status, output?, error? }
		// TODO: upsert generation_job, update video_asset
		res.status(200).send('ok')
	}
)
```

### cURL examples

Create image variant:

```bash
curl -X POST "http://localhost:3001/api/projects/PROJECT_ID/image-variants" \
  -H "Content-Type: application/json" \
  -d '{"actorKey":"ava_base_01","prompt":"in a bathroom, warm lighting","strength":0.6}'
```

Generate from text:

```bash
curl -X POST "http://localhost:3001/api/projects/PROJECT_ID/videos:text" \
  -H "Content-Type: application/json" \
  -d '{"actorKey":"ava_base_01","script":"Okay, so I\'ve been seeing this...","imageEditPrompt":"beach at golden hour"}'
```

Generate from audio (already uploaded to `ugc-audio/PROJECT_ID/foo.mp3`):

```bash
curl -X POST "http://localhost:3001/api/projects/PROJECT_ID/videos:audio" \
  -H "Content-Type: application/json" \
  -d '{"actorKey":"ava_base_01","audioUploadId":"ugc-audio/PROJECT_ID/foo.mp3"}'
```

### Open items to confirm (flagged)

- fal.ai exact model IDs/paths for TTS and “nano‑bana” image edit; update `fal.ts` endpoints accordingly.
- WaveSpeed Infinitetalk creation endpoint and response schema (IDs/fields) from docs; confirm webhook availability + signature scheme.
- If we move from polling to webhooks, add idempotency on uploads and job status updates.

- **What you got**
  - Integrations: `fal.ts`, `wavespeed.ts`, `storage.ts`.
  - Strict validation via `zod`.
  - Express routes for projects/image-variants/video jobs [[memory:8357912]].
  - Worker pipeline for image edit → TTS (or audio) → InfiniteTalk → final upload.

References:

- fal.ai model APIs: `https://docs.fal.ai/model-apis`
- WaveSpeed docs and Infinitetalk model: `https://wavespeed.ai/docs/docs`
