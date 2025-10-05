import {
	pgTable,
	serial,
	varchar,
	text,
	timestamp,
	integer,
	uuid,
	jsonb,
	pgEnum,
	bigint,
	real,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// UGC enums
export const videoStatusEnum = pgEnum('video_status', [
	'queued',
	'generating',
	'completed',
	'failed',
])

export const jobStatusEnum = pgEnum('job_status', [
	'queued',
	'running',
	'completed',
	'failed',
])

export const sourceTypeEnum = pgEnum('source_type', ['text', 'audio'])

export const jobStepEnum = pgEnum('job_step', [
	'init',
	'image_edit',
	'tts',
	'lip_sync',
	'finalize',
])

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }),
	email: varchar('email', { length: 255 }).notNull().unique(),
	passwordHash: text('password_hash'),
	supabaseUid: uuid('supabase_uid').unique(),
	role: varchar('role', { length: 20 }).notNull().default('member'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
	deletedAt: timestamp('deleted_at'),
})

export const teams = pgTable('teams', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
	dodoCustomerId: text('dodo_customer_id').unique(),
	dodoSubscriptionId: text('dodo_subscription_id').unique(),
	dodoProductId: text('dodo_product_id'),
	planName: varchar('plan_name', { length: 50 }),
	subscriptionStatus: varchar('subscription_status', { length: 20 }),
})

export const teamMembers = pgTable('team_members', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	teamId: integer('team_id')
		.notNull()
		.references(() => teams.id),
	role: varchar('role', { length: 50 }).notNull(),
	joinedAt: timestamp('joined_at').notNull().defaultNow(),
})

export const activityLogs = pgTable('activity_logs', {
	id: serial('id').primaryKey(),
	teamId: integer('team_id')
		.notNull()
		.references(() => teams.id),
	userId: integer('user_id').references(() => users.id),
	action: text('action').notNull(),
	timestamp: timestamp('timestamp').notNull().defaultNow(),
	ipAddress: varchar('ip_address', { length: 45 }),
})

export const invitations = pgTable('invitations', {
	id: serial('id').primaryKey(),
	teamId: integer('team_id')
		.notNull()
		.references(() => teams.id),
	email: varchar('email', { length: 255 }).notNull(),
	role: varchar('role', { length: 50 }).notNull(),
	invitedBy: integer('invited_by')
		.notNull()
		.references(() => users.id),
	invitedAt: timestamp('invited_at').notNull().defaultNow(),
	status: varchar('status', { length: 20 }).notNull().default('pending'),
})

// Projects (scoped to team; owned by a user)
export const projects = pgTable('project', {
	id: uuid('id').primaryKey().defaultRandom(),
	teamId: integer('team_id')
		.notNull()
		.references(() => teams.id, { onDelete: 'cascade' }),
	ownerId: integer('owner_id')
		.notNull()
		.references(() => users.id),
	title: text('title').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Actor catalog (global)
export const actorModels = pgTable('actor_model', {
	id: uuid('id').primaryKey().defaultRandom(),
	key: text('key').notNull().unique(),
	displayName: text('display_name').notNull(),
	imageUrl: text('image_url').notNull(),
	voiceProvider: text('voice_provider').notNull().default('fal.ai'),
	voiceId: text('voice_id').notNull(),
	ageRange: text('age_range'),
	gender: text('gender'),
	tags: text('tags').array().notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Image variants (project-scoped outputs of nano-bana)
export const actorImageVariants = pgTable('actor_image_variant', {
	id: uuid('id').primaryKey().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	actorId: uuid('actor_id')
		.notNull()
		.references(() => actorModels.id, { onDelete: 'cascade' }),
	prompt: text('prompt').notNull(),
	seed: bigint('seed', { mode: 'number' }),
	strength: real('strength'),
	outputImageUrl: text('output_image_url').notNull(),
	meta: jsonb('meta').notNull().default({}),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Video assets (one per generation)
export const videoAssets = pgTable('video_asset', {
	id: uuid('id').primaryKey().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	actorId: uuid('actor_id')
		.notNull()
		.references(() => actorModels.id),
	imageVariantId: uuid('image_variant_id').references(
		() => actorImageVariants.id,
	),
	sourceType: sourceTypeEnum('source_type').notNull(),
	sourceText: text('source_text'),
	sourceAudioUrl: text('source_audio_url'),
	videoUrl: text('video_url'),
	durationSeconds: integer('duration_seconds'),
	status: videoStatusEnum('status').notNull(),
	error: text('error'),
	meta: jsonb('meta').notNull().default({}),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Pipeline jobs
export const generationJobs = pgTable('generation_job', {
	id: uuid('id').primaryKey().defaultRandom(),
	videoId: uuid('video_id')
		.notNull()
		.references(() => videoAssets.id, { onDelete: 'cascade' }),
	step: jobStepEnum('step').notNull(),
	status: jobStatusEnum('status').notNull(),
	provider: text('provider'),
	request: jsonb('request'),
	response: jsonb('response'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const teamsRelations = relations(teams, ({ many }) => ({
	teamMembers: many(teamMembers),
	activityLogs: many(activityLogs),
	invitations: many(invitations),
	projects: many(projects),
}))

export const usersRelations = relations(users, ({ many }) => ({
	teamMembers: many(teamMembers),
	invitationsSent: many(invitations),
}))

export const invitationsRelations = relations(invitations, ({ one }) => ({
	team: one(teams, {
		fields: [invitations.teamId],
		references: [teams.id],
	}),
	invitedBy: one(users, {
		fields: [invitations.invitedBy],
		references: [users.id],
	}),
}))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
	user: one(users, {
		fields: [teamMembers.userId],
		references: [users.id],
	}),
	team: one(teams, {
		fields: [teamMembers.teamId],
		references: [teams.id],
	}),
}))

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
	team: one(teams, {
		fields: [activityLogs.teamId],
		references: [teams.id],
	}),
	user: one(users, {
		fields: [activityLogs.userId],
		references: [users.id],
	}),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
	team: one(teams, { fields: [projects.teamId], references: [teams.id] }),
	owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
	imageVariants: many(actorImageVariants),
	videos: many(videoAssets),
}))

export const actorModelsRelations = relations(actorModels, ({ many }) => ({
	variants: many(actorImageVariants),
	videos: many(videoAssets),
}))

export const actorImageVariantsRelations = relations(
	actorImageVariants,
	({ one }) => ({
		project: one(projects, {
			fields: [actorImageVariants.projectId],
			references: [projects.id],
		}),
		actor: one(actorModels, {
			fields: [actorImageVariants.actorId],
			references: [actorModels.id],
		}),
	}),
)

export const videoAssetsRelations = relations(videoAssets, ({ one, many }) => ({
	project: one(projects, {
		fields: [videoAssets.projectId],
		references: [projects.id],
	}),
	actor: one(actorModels, {
		fields: [videoAssets.actorId],
		references: [actorModels.id],
	}),
	imageVariant: one(actorImageVariants, {
		fields: [videoAssets.imageVariantId],
		references: [actorImageVariants.id],
	}),
	jobs: many(generationJobs),
}))

// Team-scoped custom actor looks
export const teamActorLooks = pgTable('team_actor_look', {
	id: uuid('id').primaryKey().defaultRandom(),
	teamId: integer('team_id')
		.notNull()
		.references(() => teams.id, { onDelete: 'cascade' }),
	actorId: uuid('actor_id')
		.notNull()
		.references(() => actorModels.id, { onDelete: 'cascade' }),
	prompt: text('prompt').notNull(),
	seed: bigint('seed', { mode: 'number' }),
	strength: real('strength'),
	outputImageUrl: text('output_image_url').notNull(),
	meta: jsonb('meta').notNull().default({}),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const generationJobsRelations = relations(
	generationJobs,
	({ one }) => ({
		video: one(videoAssets, {
			fields: [generationJobs.videoId],
			references: [videoAssets.id],
		}),
	}),
)

export const teamActorLooksRelations = relations(teamActorLooks, ({ one }) => ({
	team: one(teams, {
		fields: [teamActorLooks.teamId],
		references: [teams.id],
	}),
	actor: one(actorModels, {
		fields: [teamActorLooks.actorId],
		references: [actorModels.id],
	}),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Team = typeof teams.$inferSelect
export type NewTeam = typeof teams.$inferInsert
export type TeamMember = typeof teamMembers.$inferSelect
export type NewTeamMember = typeof teamMembers.$inferInsert
export type ActivityLog = typeof activityLogs.$inferSelect
export type NewActivityLog = typeof activityLogs.$inferInsert
export type Invitation = typeof invitations.$inferSelect
export type NewInvitation = typeof invitations.$inferInsert
export type TeamDataWithMembers = Team & {
	teamMembers: (TeamMember & {
		user: Pick<User, 'id' | 'name' | 'email'>
	})[]
}

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ActorModel = typeof actorModels.$inferSelect
export type NewActorModel = typeof actorModels.$inferInsert
export type ActorImageVariant = typeof actorImageVariants.$inferSelect
export type NewActorImageVariant = typeof actorImageVariants.$inferInsert
export type VideoAsset = typeof videoAssets.$inferSelect
export type NewVideoAsset = typeof videoAssets.$inferInsert
export type GenerationJob = typeof generationJobs.$inferSelect
export type NewGenerationJob = typeof generationJobs.$inferInsert
export type TeamActorLook = typeof teamActorLooks.$inferSelect
export type NewTeamActorLook = typeof teamActorLooks.$inferInsert

export enum ActivityType {
	SIGN_UP = 'SIGN_UP',
	SIGN_IN = 'SIGN_IN',
	SIGN_OUT = 'SIGN_OUT',
	UPDATE_PASSWORD = 'UPDATE_PASSWORD',
	DELETE_ACCOUNT = 'DELETE_ACCOUNT',
	UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
	CREATE_TEAM = 'CREATE_TEAM',
	REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
	INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
	ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}
