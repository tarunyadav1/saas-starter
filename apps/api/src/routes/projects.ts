import { Router } from 'express'
import { db, schema } from '../db'
import { and, desc, eq } from 'drizzle-orm'

export const projects = Router()

// Get a single project by ID for current user's team
projects.get('/:projectId', async (req: any, res, next) => {
    try {
        if (!req.auth?.uid) return res.status(401).json({ code: 'UNAUTHORIZED' })
        const projectId = req.params.projectId as string

        const [user] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.supabaseUid, req.auth.uid))
            .limit(1)

        if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

        const [tm] = await db
            .select({ teamId: schema.teamMembers.teamId })
            .from(schema.teamMembers)
            .where(eq(schema.teamMembers.userId, user.id))
            .limit(1)

        if (!tm) return res.status(404).json({ code: 'TEAM_NOT_FOUND' })

        const [project] = await db
            .select()
            .from(schema.projects)
            .where(and(
                eq(schema.projects.id, projectId as any),
                eq(schema.projects.teamId, tm.teamId)
            ))
            .limit(1)

        if (!project) return res.status(404).json({ code: 'NOT_FOUND' })

        return res.json(project)
    } catch (err) {
        next(err)
    }
})

// List projects for current user's team
projects.get('/', async (req: any, res, next) => {
    try {
        if (!req.auth?.uid) return res.status(401).json({ code: 'UNAUTHORIZED' })

        const [user] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.supabaseUid, req.auth.uid))
            .limit(1)

        if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

        const [tm] = await db
            .select({ teamId: schema.teamMembers.teamId })
            .from(schema.teamMembers)
            .where(eq(schema.teamMembers.userId, user.id))
            .limit(1)

        if (!tm) return res.status(404).json({ code: 'TEAM_NOT_FOUND' })

        const items = await db
            .select()
            .from(schema.projects)
            .where(eq(schema.projects.teamId, tm.teamId))
            .orderBy(desc(schema.projects.createdAt))

        return res.json({ items })
    } catch (err) {
        next(err)
    }
})

// Create a project for current user's team
projects.post('/', async (req: any, res, next) => {
    try {
        if (!req.auth?.uid) return res.status(401).json({ code: 'UNAUTHORIZED' })
        const title: string = (req.body?.title || '').toString().trim()
        if (!title) return res.status(400).json({ code: 'INVALID_TITLE' })
        
        // Prevent title from being a UUID (safety check)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (uuidRegex.test(title)) return res.status(400).json({ code: 'INVALID_TITLE', message: 'Title cannot be a UUID' })

        const [user] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.supabaseUid, req.auth.uid))
            .limit(1)

        if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

        const [tm] = await db
            .select({ teamId: schema.teamMembers.teamId })
            .from(schema.teamMembers)
            .where(eq(schema.teamMembers.userId, user.id))
            .limit(1)

        if (!tm) return res.status(404).json({ code: 'TEAM_NOT_FOUND' })

        const [row] = await db
            .insert(schema.projects)
            .values({ teamId: tm.teamId, ownerId: user.id, title })
            .returning()

        res.status(201).json({ id: row.id, title: row.title, createdAt: row.createdAt })
    } catch (err) {
        next(err)
    }
})

// Update a project in current user's team
projects.put('/:projectId', async (req: any, res, next) => {
    try {
        if (!req.auth?.uid) return res.status(401).json({ code: 'UNAUTHORIZED' })
        const projectId = req.params.projectId as string
        const title: string = (req.body?.title || '').toString().trim()
        if (!title) return res.status(400).json({ code: 'INVALID_TITLE' })

        const [user] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.supabaseUid, req.auth.uid))
            .limit(1)

        if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

        const [tm] = await db
            .select({ teamId: schema.teamMembers.teamId })
            .from(schema.teamMembers)
            .where(eq(schema.teamMembers.userId, user.id))
            .limit(1)

        if (!tm) return res.status(404).json({ code: 'TEAM_NOT_FOUND' })

        const [project] = await db
            .select()
            .from(schema.projects)
            .where(eq(schema.projects.id, projectId as any))
            .limit(1)

        if (!project) return res.status(404).json({ code: 'NOT_FOUND' })
        if (project.teamId !== tm.teamId) return res.status(403).json({ code: 'FORBIDDEN' })

        const [updated] = await db
            .update(schema.projects)
            .set({ title })
            .where(eq(schema.projects.id, projectId as any))
            .returning()

        return res.json({ id: updated.id, title: updated.title, createdAt: updated.createdAt })
    } catch (err) {
        next(err)
    }
})

// Delete a project in current user's team
projects.delete('/:projectId', async (req: any, res, next) => {
    try {
        if (!req.auth?.uid) return res.status(401).json({ code: 'UNAUTHORIZED' })
        const projectId = req.params.projectId as string

        const [user] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.supabaseUid, req.auth.uid))
            .limit(1)

        if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' })

        const [tm] = await db
            .select({ teamId: schema.teamMembers.teamId })
            .from(schema.teamMembers)
            .where(eq(schema.teamMembers.userId, user.id))
            .limit(1)

        if (!tm) return res.status(404).json({ code: 'TEAM_NOT_FOUND' })

        const [project] = await db
            .select()
            .from(schema.projects)
            .where(eq(schema.projects.id, projectId as any))
            .limit(1)

        if (!project) return res.status(404).json({ code: 'NOT_FOUND' })
        if (project.teamId !== tm.teamId) return res.status(403).json({ code: 'FORBIDDEN' })

        await db.delete(schema.projects).where(eq(schema.projects.id, projectId as any))
        return res.status(204).end()
    } catch (err) {
        next(err)
    }
})

