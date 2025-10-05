import { Router } from 'express'
import { z } from 'zod'
import { db, schema } from '../db'
import { eq, and, ilike } from 'drizzle-orm'

export const actors = Router()

const GetActorsQuery = z.object({
  gender: z.enum(['male', 'female']).optional(),
  ageRange: z.string().optional(),
  tags: z.string().optional(), // comma-separated tags
  search: z.string().optional()
})

// GET /api/actors - Fetch all actors with optional filters
actors.get('/', async (req, res, next) => {
  console.log('[Actors API] GET /api/actors - Request received')
  console.log('[Actors API] Query params:', req.query)
  
  try {
    const query = GetActorsQuery.parse(req.query)
    console.log('[Actors API] Parsed query:', query)
    
    let whereConditions = []
    
    // Filter by gender
    if (query.gender) {
      whereConditions.push(eq(schema.actorModels.gender, query.gender))
    }
    
    // Filter by age range
    if (query.ageRange) {
      whereConditions.push(eq(schema.actorModels.ageRange, query.ageRange))
    }
    
    // Search in display name
    if (query.search) {
      whereConditions.push(ilike(schema.actorModels.displayName, `%${query.search}%`))
    }
    
    // TODO: Filter by tags (requires array operations)
    
    console.log('[Actors API] Executing database query...')
    const actors = await db
      .select({
        id: schema.actorModels.id,
        key: schema.actorModels.key,
        displayName: schema.actorModels.displayName,
        imageUrl: schema.actorModels.imageUrl,
        voiceProvider: schema.actorModels.voiceProvider,
        voiceId: schema.actorModels.voiceId,
        ageRange: schema.actorModels.ageRange,
        gender: schema.actorModels.gender,
        tags: schema.actorModels.tags,
        createdAt: schema.actorModels.createdAt
      })
      .from(schema.actorModels)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(schema.actorModels.displayName)
    
    console.log(`[Actors API] Found ${actors.length} actors`)
    res.json({ actors })
  } catch (err) {
    console.error('[Actors API] Error:', err)
    console.error('[Actors API] Error stack:', err instanceof Error ? err.stack : 'No stack trace')
    next(err)
  }
})

// GET /api/actors/:key - Get single actor by key
actors.get('/:key', async (req, res, next) => {
  try {
    const { key } = req.params
    const [actor] = await db
      .select()
      .from(schema.actorModels)
      .where(eq(schema.actorModels.key, key))
      .limit(1)
    
    if (!actor) {
      return res.status(404).json({ code: 'ACTOR_NOT_FOUND', message: 'Actor not found' })
    }
    
    res.json({ actor })
  } catch (err) {
    next(err)
  }
})