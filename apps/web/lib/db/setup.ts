import { exec } from 'node:child_process'
import { promises as fs } from 'node:fs'
import { promisify } from 'node:util'
import readline from 'node:readline'
import crypto from 'node:crypto'
import path from 'node:path'

const execAsync = promisify(exec)

function question(query: string): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	return new Promise((resolve) =>
		rl.question(query, (ans) => {
			rl.close()
			resolve(ans)
		})
	)
}

// Removed Stripe CLI checks; Dodo does not require a CLI

async function getPostgresURL(): Promise<string> {
	console.log('Step 1: Setting up Postgres')
	const dbChoice = await question(
		'Do you want to use a local Postgres instance with Docker (L) or a remote Postgres instance (R)? (L/R): '
	)

	if (dbChoice.toLowerCase() === 'l') {
		console.log('Setting up local Postgres instance with Docker...')
		await setupLocalPostgres()
		return 'postgres://postgres:postgres@localhost:54322/postgres'
	} else {
		console.log(
			'You can find Postgres databases at: https://vercel.com/marketplace?category=databases'
		)
		return await question('Enter your POSTGRES_URL: ')
	}
}

async function setupLocalPostgres() {
	console.log('Checking if Docker is installed...')
	try {
		await execAsync('docker --version')
		console.log('Docker is installed.')
	} catch (error) {
		console.error(
			'Docker is not installed. Please install Docker and try again.'
		)
		console.log('To install Docker, visit: https://docs.docker.com/get-docker/')
		process.exit(1)
	}

	console.log('Creating docker-compose.yml file...')
	const dockerComposeContent = `
services:
  postgres:
    image: postgres:16.4-alpine
    container_name: next_saas_starter_postgres
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "54322:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
`

	await fs.writeFile(
		path.join(process.cwd(), 'docker-compose.yml'),
		dockerComposeContent
	)
	console.log('docker-compose.yml file created.')

	console.log('Starting Docker container with `docker compose up -d`...')
	try {
		await execAsync('docker compose up -d')
		console.log('Docker container started successfully.')
	} catch (error) {
		console.error(
			'Failed to start Docker container. Please check your Docker installation and try again.'
		)
		process.exit(1)
	}
}

async function getDodoEnv(): Promise<{
	DODO_BASE_PLAN_URL: string
	DODO_PLUS_PLAN_URL: string
	DODO_WEBHOOK_SECRET: string
	DODO_PAYMENTS_API_KEY?: string
}> {
	console.log('Step 2: Dodo Payments configuration')
	const DODO_BASE_PLAN_URL = await question(
		'Enter DODO_BASE_PLAN_URL (hosted checkout for Base): '
	)
	const DODO_PLUS_PLAN_URL = await question(
		'Enter DODO_PLUS_PLAN_URL (hosted checkout for Plus): '
	)
	const DODO_WEBHOOK_SECRET = await question('Enter DODO_WEBHOOK_SECRET: ')
	const DODO_PAYMENTS_API_KEY = await question(
		'Enter DODO_PAYMENTS_API_KEY (optional, press Enter to skip): '
	)
	return {
		DODO_BASE_PLAN_URL,
		DODO_PLUS_PLAN_URL,
		DODO_WEBHOOK_SECRET,
		DODO_PAYMENTS_API_KEY,
	}
}

function generateAuthSecret(): string {
	console.log('Step 3: Generating AUTH_SECRET...')
	return crypto.randomBytes(32).toString('hex')
}

async function writeEnvFile(envVars: Record<string, string>) {
	console.log('Step 4: Writing environment variables to .env')
	const envContent = Object.entries(envVars)
		.map(([key, value]) => `${key}=${value}`)
		.join('\n')

	await fs.writeFile(path.join(process.cwd(), '.env'), envContent)
	console.log('.env file created with the necessary variables.')
}

async function main() {
	const POSTGRES_URL = await getPostgresURL()
	const {
		DODO_BASE_PLAN_URL,
		DODO_PLUS_PLAN_URL,
		DODO_WEBHOOK_SECRET,
		DODO_PAYMENTS_API_KEY,
	} = await getDodoEnv()
	const BASE_URL = 'http://localhost:3000'
	const AUTH_SECRET = generateAuthSecret()

	await writeEnvFile({
		POSTGRES_URL,
		DODO_BASE_PLAN_URL,
		DODO_PLUS_PLAN_URL,
		DODO_WEBHOOK_SECRET,
		...(DODO_PAYMENTS_API_KEY ? { DODO_PAYMENTS_API_KEY } : {}),
		BASE_URL,
		AUTH_SECRET,
	})

	console.log('🎉 Setup completed successfully!')
}

main().catch(console.error)
