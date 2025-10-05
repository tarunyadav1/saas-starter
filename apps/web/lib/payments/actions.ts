'use server'

import { redirect } from 'next/navigation'
import {
	createCheckoutRedirect,
	createCustomerPortalUrl,
	createDynamicCheckoutLink,
} from './dodo'
import { withTeam } from '@/lib/auth/helpers'
import { getUser } from '@/lib/db/queries'

export const checkoutAction = withTeam(async (formData, team) => {
	const user = await getUser()

	// Dynamic product checkout via Dodo API if productId is posted
	const productId = (formData.get('productId') as string) || ''
	if (productId) {
		await createDynamicCheckoutLink({ team, user, productId })
		return
	}

	// Fallback to hosted links keyed by planKey
	const planKey = (formData.get('planKey') as string) || 'base'
	await createCheckoutRedirect({ team: team, planKey: planKey as any, user })
})

export const customerPortalAction = withTeam(async (_, team) => {
	// Use the new customer portal route with the adaptor
	const url = new URL('/customer-portal', process.env.BASE_URL)
	url.searchParams.set('customer_id', String((team as any).dodoCustomerId ?? ''))
	redirect(url.toString())
})
