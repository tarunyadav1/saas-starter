import { Router } from 'express'
import { db, schema } from '../db'
import { eq } from 'drizzle-orm'

export const me = Router()

// GET /api/me/team - returns a single team for current user
me.get('/team', async (req: any, res, next) => {
	try {
		if (!req.auth?.uid) return res.status(401).json({ code: 'UNAUTHORIZED' })

		const [user] = await db
			.select()
			.from(schema.users)
			.where(eq(schema.users.supabaseUid, req.auth.uid))
			.limit(1)

		if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

		const [tm] = await db
			.select({
				teamId: schema.teamMembers.teamId,
			})
			.from(schema.teamMembers)
			.where(eq(schema.teamMembers.userId, user.id))
			.limit(1)

		if (!tm) return res.status(404).json({ code: 'TEAM_NOT_FOUND' })

		const [team] = await db
			.select()
			.from(schema.teams)
			.where(eq(schema.teams.id, tm.teamId))
			.limit(1)

		if (!team) return res.status(404).json({ code: 'TEAM_NOT_FOUND' })

		res.json({ team })
	} catch (err) {
		next(err)
	}
})