import 'server-only'

import { redirect } from 'next/navigation'
import { Team, User } from '@/lib/db/schema'

const PLAN_TO_DODO_URL: Record<string, string | undefined> = {
	base: process.env.DODO_BASE_PLAN_URL,
	plus: process.env.DODO_PLUS_PLAN_URL,
}

const DODO_PORTAL_URL = process.env.DODO_PORTAL_URL || null

// Optional override; defaults to public Dodo API base
const DODO_API_BASE =
	process.env.DODO_API_BASE || 'https://api.dodopayments.com'

export async function createCheckoutRedirect({
	team,
	planKey,
	user,
}: {
	team: Team | null
	planKey: 'base' | 'plus'
	user: User | null
}) {
	if (!team || !user) {
		redirect(`/sign-up?redirect=checkout&plan=${planKey}`)
	}

	const dodoCheckoutUrl = PLAN_TO_DODO_URL[planKey]
	if (!dodoCheckoutUrl) {
		throw new Error(`Missing Dodo checkout URL for plan: ${planKey}`)
	}

	const params = new URLSearchParams({
		reference: `${team.id}`,
		email: user.email ?? '',
		success_url: `${process.env.BASE_URL}/dashboard`,
		cancel_url: `${process.env.BASE_URL}/pricing`,
	})

	const urlHasQuery = dodoCheckoutUrl.includes('?')
	const joiner = urlHasQuery ? '&' : '?'
	const finalUrl = `${dodoCheckoutUrl}${joiner}${params.toString()}`

	redirect(finalUrl)
}

export async function createCustomerPortalUrl(team: Team) {
	if (DODO_PORTAL_URL && (team as any).dodoCustomerId) {
		const url = new URL(DODO_PORTAL_URL)
		url.searchParams.set('customer', (team as any).dodoCustomerId as string)
		url.searchParams.set('return_url', `${process.env.BASE_URL}/dashboard`)
		return url.toString()
	}

	return '/pricing'
}

export type DodoSubscriptionProduct = {
	id: string
	name: string
	description?: string | null
	unitAmount: number
	currency: string
	interval: string
	trialDays?: number | null
}

export async function listDodoSubscriptionProducts(): Promise<
	DodoSubscriptionProduct[]
> {
	const fallback: DodoSubscriptionProduct[] = [
		{
			id: 'base',
			name: 'Base',
			description: null,
			unitAmount: 800,
			currency: 'usd',
			interval: 'month',
			trialDays: 7,
		},
		{
			id: 'plus',
			name: 'Plus',
			description: null,
			unitAmount: 1200,
			currency: 'usd',
			interval: 'month',
			trialDays: 7,
		},
	]

	const apiKey = process.env.DODO_PAYMENTS_API_KEY
	if (!apiKey) {
		console.log('No DODO_PAYMENTS_API_KEY found, using fallback')
		return fallback
	}

	// Using fallback data until correct API endpoint is provided by Dodo Payments
	return fallback

	/* COMMENTED OUT UNTIL CORRECT API ENDPOINT IS FOUND
	try {
		const url = `${DODO_API_BASE}/products?type=subscription`
		console.log('Fetching Dodo products from:', url)
		
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		})

		console.log('Dodo API response status:', res.status)
		if (!res.ok) {
			console.log('Dodo API error, using fallback')
			return fallback
		}

		const json: any = await res.json()
		console.log('Dodo API response:', JSON.stringify(json, null, 2))

		const items: any[] = Array.isArray(json)
			? json
			: Array.isArray(json?.items)
			? json.items
			: Array.isArray(json?.data)
			? json.data
			: []

		const toNumber = (v: any, d: number) => {
			const n = typeof v === 'number' ? v : Number(v)
			return Number.isFinite(n) ? n : d
		}

		return items.map((p: any): DodoSubscriptionProduct => {
			const price = p.price || p.default_price || p.prices?.[0] || {}
			const currency = price.currency || p.currency || 'usd'
			const interval =
				price.interval || price.recurring?.interval || p.interval || 'month'
			const trial =
				price.trial_days || price.trial_period_days || p.trial_days || null
			const amount = price.unit_amount || price.amount || p.amount || 0

			return {
				id: String(p.id || p.product_id || p.slug || p.code || 'unknown'),
				name: String(p.name || p.title || 'Plan'),
				description: p.description ?? null,
				unitAmount: toNumber(amount, 0),
				currency: String(currency).toLowerCase(),
				interval: String(interval),
				trialDays: trial != null ? toNumber(trial, null as any) : null,
			}
		})
	} catch (error) {
		console.error('Error fetching Dodo products:', error)
		return fallback
	}
	*/
}

export async function createDynamicCheckoutLink({
	team,
	user,
	productId,
	quantity = 1,
}: {
	team: Team | null
	user: User | null
	productId: string
	quantity?: number
}) {
	const apiKey = process.env.DODO_PAYMENTS_API_KEY
	if (!team || !user) {
		redirect(`/sign-up?redirect=checkout&product=${productId}`)
	}
	if (!apiKey) {
		throw new Error('DODO_PAYMENTS_API_KEY is not configured')
	}

	const payload = {
		billing: undefined,
		customer: { customer_id: String(user!.id), email: user!.email },
		product_id: productId,
		payment_link: true,
		return_url: `${process.env.BASE_URL}/dashboard`,
		quantity,
		reference: String(team!.id),
		metadata: { team_id: String(team!.id) },
	}

	const res = await fetch(`${DODO_API_BASE}/subscriptions`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	})

	if (!res.ok) {
		const body = await res.text()
		throw new Error(
			`Failed to create Dodo subscription link: ${res.status} ${body}`
		)
	}

	const json: any = await res.json()
	const link = json?.payment_link
	if (!link) {
		throw new Error('Dodo API did not return a payment_link')
	}

	redirect(link)
}