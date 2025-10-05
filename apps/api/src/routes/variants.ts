import { Router } from 'express'
import { z } from 'zod'
import { db, schema } from '../db'
import { eq } from 'drizzle-orm'
import { nanoBana } from '../integrations/fal'

interface ProjectParams {
    projectId: string
}

export const variants = Router({ mergeParams: true })

const CreateVariant = z.object({ actorKey: z.string(), prompt: z.string().max(200), seed: z.number().int().optional(), strength: z.number().min(0).max(1).optional() })

// GET /api/projects/:projectId/variants - Get all custom actors for a project
variants.get('/', async (req: any, res, next) => {
    try {
        const variants = await db
            .select({
                id: schema.actorImageVariants.id,
                prompt: schema.actorImageVariants.prompt,
                outputImageUrl: schema.actorImageVariants.outputImageUrl,
                createdAt: schema.actorImageVariants.createdAt,
                actor: {
                    id: schema.actorModels.id,
                    key: schema.actorModels.key,
                    displayName: schema.actorModels.displayName,
                    imageUrl: schema.actorModels.imageUrl
                }
            })
            .from(schema.actorImageVariants)
            .leftJoin(schema.actorModels, eq(schema.actorImageVariants.actorId, schema.actorModels.id))
            .where(eq(schema.actorImageVariants.projectId, req.params.projectId))
            .orderBy(schema.actorImageVariants.createdAt)
        
        res.json({ variants })
    } catch (err) {
        next(err)
    }
})

variants.post('/', async (req: any, res, next) => {
    try {
        const { actorKey, prompt, seed, strength } = CreateVariant.parse(req.body)
        const [actor] = await db.select().from(schema.actorModels).where(eq(schema.actorModels.key, actorKey)).limit(1)
        if (!actor) return res.status(400).json({ code: 'ACTOR_NOT_FOUND' })
        const out = await nanoBana(process.env.FAL_API_KEY!, { image_urls: [actor.imageUrl], prompt, seed, strength })
        const [row] = await db.insert(schema.actorImageVariants).values({
            projectId: req.params.projectId,
            actorId: actor.id,
            prompt,
            seed: seed,
            strength: strength,
            outputImageUrl: out.images[0].url,
            meta: { fal: out },
        }).returning({ id: schema.actorImageVariants.id })
        res.status(201).json({ imageVariantId: row.id })
    } catch (err) {
        next(err)
    }
})