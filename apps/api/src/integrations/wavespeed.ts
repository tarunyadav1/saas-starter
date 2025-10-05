import { retryFetch } from '../utils/retryFetch'

const BASE = 'https://api.wavespeed.ai'
const auth = (k: string) => ({ headers: { Authorization: `Bearer ${k}`, 'Content-Type': 'application/json' } })

export async function createInfiniteTalk(apiKey: string, p: { audio_url: string; image_url: string; fps?: number; seed?: number }) {
    const res = await retryFetch(`${BASE}/v1/predictions/Infinitetalk`, { method: 'POST', ...auth(apiKey), body: JSON.stringify(p) }, 2, 500)
    return (await res.json()) as { id: string; status: string }
}

export async function getPrediction(apiKey: string, id: string) {
    const res = await retryFetch(`${BASE}/v1/predictions/${id}`, { method: 'GET', ...auth(apiKey) }, 1, 300)
    return (await res.json()) as { id: string; status: string; output?: { video_url?: string; thumb_url?: string; duration?: number }; error?: string }
}