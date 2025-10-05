'use client'

import useSWR from 'swr'
import { supabase } from '@/lib/supabase/client'

export type TeamLook = {
	id: string
	teamId: number
	actorId: string
	prompt: string
	seed?: number
	strength?: number
	outputImageUrl: string
	meta: any
	createdAt: string
	actorDisplayName?: string
	actorKey?: string
	actorImageUrl?: string
}

type LooksResp = { looks: TeamLook[] }
type TeamResp = { team: { id: number } }

async function withAuth(url: string, init?: RequestInit) {
	const { data } = await supabase.auth.getSession()
	const token = data.session?.access_token
	return fetch(url, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(init?.headers || {}),
		},
	})
}

async function fetchJSON<T>(url: string): Promise<T> {
	const res = await withAuth(url)
	if (!res.ok) throw new Error(`HTTP ${res.status}`)
	return res.json()
}

export async function getMyTeamId(): Promise<number> {
	const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
	const data = await fetchJSON<TeamResp>(`${base}/api/me/team`)
	return data.team.id
}

export function useTeamLooks(teamId?: number) {
	const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
	const url = typeof teamId === 'number' ? `${base}/api/teams/${teamId}/custom-actors` : null
	const { data, error, isLoading, mutate } = useSWR<LooksResp>(
		url,
		(u: string) => fetchJSON<LooksResp>(u)
	)
	return { looks: data?.looks ?? [], isLoading, error, mutate }
}

export async function createTeamLook(
	teamId: number,
	body: { actorKey: string; prompt: string; seed?: number; strength?: number }
) {
	const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
	const res = await withAuth(`${base}/api/teams/${teamId}/custom-actors`, {
		method: 'POST',
		body: JSON.stringify(body),
	})
	if (!res.ok) throw new Error(`HTTP ${res.status}`)
	return res.json() as Promise<{ lookId: string }>
}

export async function deleteTeamLook(teamId: number, lookId: string) {
	const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
	const res = await withAuth(`${base}/api/teams/${teamId}/custom-actors/${lookId}`, {
		method: 'DELETE',
	})
	if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`)
}