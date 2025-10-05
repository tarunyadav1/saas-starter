import { Router } from 'express'
import { z } from 'zod'
import { auth } from '../middleware/auth'
import { rateLimit } from '../middleware/rateLimit'
import { ttsElevenLabsV3 } from '../integrations/fal'
import { cfg } from '../config'
import { db, schema } from '../db'
import { eq } from 'drizzle-orm'

export const tts = Router()

const ElevenV3Schema = z.object({
  text: z.string().min(1),
  voice: z.string().optional(),
  stability: z.number().min(0).max(1).optional(),
  similarity_boost: z.number().min(0).max(1).optional(),
  style: z.number().min(0).max(1).optional(),
  speed: z.number().min(0.7).max(1.2).optional(),
  timestamps: z.boolean().optional(),
  previous_text: z.string().optional(),
  next_text: z.string().optional(),
  actorKey: z.string().optional(),
})

tts.post('/elevenlabs-v3', auth, rateLimit, async (req, res, next) => {
  try {
    const validatedInput = ElevenV3Schema.parse(req.body)
    const {
      text,
      voice,
      stability,
      similarity_boost,
      style,
      speed,
      timestamps,
      previous_text,
      next_text,
      actorKey,
    } = validatedInput

    let resolvedVoice = voice
    if (!resolvedVoice && actorKey) {
      const [actor] = await db
        .select()
        .from(schema.actorModels)
        .where(eq(schema.actorModels.key, actorKey))
        .limit(1)
      resolvedVoice = actor?.voiceId || undefined
    }

    const { audioUrl, timestamps: ts } = await ttsElevenLabsV3(cfg.falKey, {
      text,
      voice: resolvedVoice,
      stability,
      similarity_boost,
      style,
      speed,
      timestamps,
      previous_text,
      next_text,
    })

    res.json({ audioUrl, timestamps: ts })
  } catch (err) {
    next(err)
  }
})