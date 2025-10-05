import { Router } from 'express'
import { z } from 'zod'
import { db, schema } from '../db'
import { eq, and } from 'drizzle-orm'
import { nanoBana } from '../integrations/fal'
import { uploadFromUrl, publicUrl } from '../integrations/storage'

export const teamLooks = Router({ mergeParams: true })

// Ensure the requester is member of :teamId
async function assertMembership(req: any) {
	if (!req.auth?.uid) return { ok: false, status: 401, code: 'UNAUTHORIZED' as const }

	const [user] = await db
		.select()
		.from(schema.users)
		.where(eq(schema.users.supabaseUid, req.auth.uid))
		.limit(1)

	if (!user) return { ok: false, status: 404, code: 'USER_NOT_FOUND' as const }

	const [m] = await db
		.select({ id: schema.teamMembers.id })
		.from(schema.teamMembers)
		.where(
			and(
				eq(schema.teamMembers.userId, user.id),
				eq(schema.teamMembers.teamId, Number(req.params.teamId)),
			),
		)
		.limit(1)

	if (!m) return { ok: false, status: 403, code: 'FORBIDDEN' as const }

	return { ok: true }
}

const CreateLook = z.object({
	actorKey: z.string(),
	prompt: z.string().max(300),
	seed: z.number().int().optional(),
	strength: z.number().min(0).max(1).optional(),
})

// POST /api/teams/:teamId/custom-actors
teamLooks.post('/', async (req: any, res, next) => {
	try {
		const gate = await assertMembership(req)
		if (!gate.ok) return res.status(gate.status).json({ code: gate.code })

		const { actorKey, prompt, seed, strength } = CreateLook.parse(req.body)

		const [actor] = await db
			.select()
			.from(schema.actorModels)
			.where(eq(schema.actorModels.key, actorKey))
			.limit(1)

		if (!actor) return res.status(400).json({ code: 'ACTOR_NOT_FOUND' })

		const out = await nanoBana(process.env.FAL_API_KEY!, {
			image_urls: [actor.imageUrl],
			prompt,
			seed,
			strength,
		})

		// Upload generated image to Supabase storage
		const imagePath = `team-${req.params.teamId}/${Date.now()}-${Math.random().toString(36).substring(7)}.png`
		console.log('[TeamLooks] Uploading image:', { imagePath, falImageUrl: out.images[0].url })
		await uploadFromUrl('custom-actors', imagePath, out.images[0].url)
		const customImageUrl = publicUrl('custom-actors', imagePath)
		console.log('[TeamLooks] Generated public URL:', customImageUrl)

		const [row] = await db
			.insert(schema.teamActorLooks)
			.values({
				teamId: Number(req.params.teamId),
				actorId: actor.id,
				prompt,
				seed,
				strength,
				outputImageUrl: customImageUrl,
				meta: { fal: out, base: { actorKey }, storagePath: imagePath },
			})
			.returning({ id: schema.teamActorLooks.id })

		res.status(201).json({ lookId: row.id })
	} catch (err) {
		next(err)
	}
})

// GET /api/teams/:teamId/custom-actors
teamLooks.get('/', async (req: any, res, next) => {
	try {
		const gate = await assertMembership(req)
		if (!gate.ok) return res.status(gate.status).json({ code: gate.code })

		const rows = await db
			.select({
				id: schema.teamActorLooks.id,
				teamId: schema.teamActorLooks.teamId,
				actorId: schema.teamActorLooks.actorId,
				prompt: schema.teamActorLooks.prompt,
				seed: schema.teamActorLooks.seed,
				strength: schema.teamActorLooks.strength,
				outputImageUrl: schema.teamActorLooks.outputImageUrl,
				meta: schema.teamActorLooks.meta,
				createdAt: schema.teamActorLooks.createdAt,
				actorDisplayName: schema.actorModels.displayName,
				actorKey: schema.actorModels.key,
				actorImageUrl: schema.actorModels.imageUrl,
			})
			.from(schema.teamActorLooks)
			.where(eq(schema.teamActorLooks.teamId, Number(req.params.teamId)))
			.leftJoin(
				schema.actorModels,
				eq(schema.actorModels.id, schema.teamActorLooks.actorId),
			)

		res.json({ looks: rows })
	} catch (err) {
		next(err)
	}
})

// DELETE /api/teams/:teamId/custom-actors/:lookId
teamLooks.delete('/:lookId', async (req: any, res, next) => {
	try {
		const gate = await assertMembership(req)
		if (!gate.ok) return res.status(gate.status).json({ code: gate.code })

		const { teamId, lookId } = req.params

		const [deleted] = await db
			.delete(schema.teamActorLooks)
			.where(
				and(
					eq(schema.teamActorLooks.id, lookId),
					eq(schema.teamActorLooks.teamId, Number(teamId)),
				),
			)
			.returning({ id: schema.teamActorLooks.id })

		if (!deleted) return res.status(404).json({ code: 'LOOK_NOT_FOUND' })

		res.status(204).end()
	} catch (err) {
		next(err)
	}
})