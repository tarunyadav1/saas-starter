import { desc, and, eq, isNull } from 'drizzle-orm'
import { db } from './drizzle'
import { activityLogs, teamMembers, teams, users } from './schema'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getUser() {
	const supabase = await createSupabaseServerClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) return null

	// Check if we have a local user with this Supabase UID
	const existing = await db
		.select()
		.from(users)
		.where(and(eq(users.supabaseUid, user.id as any), isNull(users.deletedAt)))
		.limit(1)

	if (existing.length > 0) return existing[0]

	// First login: create local user row
	const [created] = await db
		.insert(users)
		.values({
			email: user.email ?? '',
			name:
				(user.user_metadata as any)?.full_name ??
				user.email?.split('@')[0] ??
				null,
			role: 'owner', // Default role for new users
			supabaseUid: user.id as any,
		})
		.returning()

	return created ?? null
}

export async function getTeamByDodoCustomerId(customerId: string) {
	const result = await db
		.select()
		.from(teams)
		.where(eq(teams.dodoCustomerId as any, customerId))
		.limit(1)

	return result.length > 0 ? result[0] : null
}

export async function updateTeamSubscription(
	teamId: number,
	subscriptionData: {
		dodoSubscriptionId: string | null
		dodoProductId: string | null
		planName: string | null
		subscriptionStatus: string
	}
) {
	await db
		.update(teams)
		.set({
			...subscriptionData,
			updatedAt: new Date(),
		})
		.where(eq(teams.id, teamId))
}

export async function getUserWithTeam(userId: number) {
	const result = await db
		.select({
			user: users,
			teamId: teamMembers.teamId,
		})
		.from(users)
		.leftJoin(teamMembers, eq(users.id, teamMembers.userId))
		.where(eq(users.id, userId))
		.limit(1)

	return result[0]
}

export async function getActivityLogs() {
	const user = await getUser()
	if (!user) {
		throw new Error('User not authenticated')
	}

	return await db
		.select({
			id: activityLogs.id,
			action: activityLogs.action,
			timestamp: activityLogs.timestamp,
			ipAddress: activityLogs.ipAddress,
			userName: users.name,
		})
		.from(activityLogs)
		.leftJoin(users, eq(activityLogs.userId, users.id))
		.where(eq(activityLogs.userId, user.id))
		.orderBy(desc(activityLogs.timestamp))
		.limit(10)
}

export async function getTeamForUser() {
	const user = await getUser()
	if (!user) {
		return null
	}

	const result = await db.query.teamMembers.findFirst({
		where: eq(teamMembers.userId, user.id),
		with: {
			team: {
				with: {
					teamMembers: {
						with: {
							user: {
								columns: {
									id: true,
									name: true,
									email: true,
								},
							},
						},
					},
				},
			},
		},
	})

	return result?.team || null
}
