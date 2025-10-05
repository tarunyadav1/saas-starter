'use client'

import { useEffect } from 'react'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function SessionProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const { mutate } = useSWRConfig()
	const router = useRouter()

	useEffect(() => {
		const { data: subscription } = supabase.auth.onAuthStateChange(
			async (event) => {
				await Promise.all([mutate('/api/user'), mutate('/api/team')])
			}
		)
		return () => {
			subscription.subscription.unsubscribe()
		}
	}, [mutate, router])

	return <>{children}</>
}
