import { db } from './drizzle'
import { users, teams, teamMembers, actorModels } from './schema'

async function seed() {
	const email = 'test@test.com'

	const [user] = await db
		.insert(users)
		.values([
			{
				email: email,
				role: 'owner',
			},
		])
		.returning()

	console.log('Initial user created.')

	const [team] = await db
		.insert(teams)
		.values({
			name: 'Test Team',
		})
		.returning()

	await db.insert(teamMembers).values({
		teamId: team.id,
		userId: user.id,
		role: 'owner',
	})

	// Seed actor models
	const actors = [
		{
			key: 'emma_base_01',
			displayName: 'Emma',
			imageUrl: 'https://your-storage-url.com/actors/emma.jpg',
			voiceProvider: 'fal.ai',
			voiceId: 'voice_emma_001',
			ageRange: '25-35',
			gender: 'female',
			tags: ['professional', 'friendly', 'casual']
		},
		{
			key: 'alex_base_01', 
			displayName: 'Alex',
			imageUrl: 'https://your-storage-url.com/actors/alex.jpg',
			voiceProvider: 'fal.ai',
			voiceId: 'voice_alex_001',
			ageRange: '30-40',
			gender: 'male',
			tags: ['business', 'confident', 'outdoor']
		},
		// Add more actors here...
	]

	await db.insert(actorModels).values(actors)
	console.log(`Inserted ${actors.length} actors`)

	// No Stripe seeding required for Dodo hosted links.
}

seed()
	.catch((error) => {
		console.error('Seed process failed:', error)
		process.exit(1)
	})
	.finally(() => {
		console.log('Seed process finished. Exiting...')
		process.exit(0)
	})
