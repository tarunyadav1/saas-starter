import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import { cfg } from './config'
import { auth } from './middleware/auth'
import { rateLimit } from './middleware/rateLimit'
import { idempotency } from './middleware/idempotency'
import { guardGenerationConcurrency } from './middleware/concurrency'
import { contentGuard } from './middleware/contentGuard'
import { errors } from './middleware/error'
import { projects } from './routes/projects'
import { videos } from './routes/videos'
import { jobs } from './routes/jobs'
import { sse } from './routes/sse'
import { webhooks } from './routes/webhooks'
import { actors } from './routes/actors'
import { me } from './routes/me'
import { teamLooks } from './routes/teamLooks'
import { tts } from './routes/tts'

const app = express()
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))
app.use(compression())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// Public routes (no auth required)
app.use('/api/actors', actors)

// Protected routes
app.use(auth, rateLimit, idempotency, contentGuard)
app.use('/api/me', me)
app.use('/api/teams/:teamId/custom-actors', teamLooks)
app.use('/api/tts', tts)
// Removed project-based variants in favor of team-based system
app.use('/api/projects/:projectId/videos', guardGenerationConcurrency, videos)
app.use('/api/projects', projects)
app.use('/api/jobs', jobs)
app.use('/api/webhooks', webhooks)
app.use('/api', sse)

app.use(errors)
app.listen(cfg.port, () => console.log(`api on :${cfg.port}`))