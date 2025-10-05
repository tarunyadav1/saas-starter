import { retryFetch } from '../utils/retryFetch'
import { fal } from '@fal-ai/client'

const FAL_BASE = 'https://fal.run'
const auth = (k: string) => ({ headers: { Authorization: `Key ${k}`, 'Content-Type': 'application/json' } })

export async function ttsFal(apiKey: string, p: { text: string; voice_id: string; format?: 'mp3'; sample_rate?: number }) {
    const res = await retryFetch(`${FAL_BASE}/v1/pipelines/fal-ai/tts`, { method: 'POST', ...auth(apiKey), body: JSON.stringify({ input: p }) }, 2, 500)
    return (await res.json()) as { audio_url: string; duration?: number }
}

export async function nanoBana(apiKey: string, p: { image_urls: string[]; prompt: string; seed?: number; strength?: number }) {
    // Set the API key for fal client
    fal.config({ credentials: apiKey })
    
    // Clean up image URLs (remove line breaks and whitespace)
    const cleanImageUrls = p.image_urls.map(url => url.replace(/\s/g, ''))
    
    // Use the official fal client with correct parameters
    const result = await fal.subscribe('fal-ai/nano-banana/edit', {
        input: {
            image_urls: cleanImageUrls,
            prompt: p.prompt,
            // Note: nano-banana doesn't use seed/strength, these are for other models
            ...(p.seed && { seed: p.seed }),
            ...(p.strength && { strength: p.strength })
        }
    }) as { data: { images: Array<{ url: string }> } }
    
    return { images: result.data.images }
}

export async function ttsElevenLabsV3(
    apiKey: string,
    input: {
        text: string
        voice?: string
        stability?: number
        similarity_boost?: number
        style?: number
        speed?: number
        timestamps?: boolean
        previous_text?: string
        next_text?: string
    }
) {
    fal.config({ credentials: apiKey })
    const result = await fal.subscribe('fal-ai/elevenlabs/tts/eleven-v3', {
        input,
        logs: false,
    })
    // Result format: { audio: { url }, timestamps? }
    const audioUrl = (result as any)?.audio?.url
    const timestamps = (result as any)?.timestamps
    if (!audioUrl) throw new Error('FAL_TTS_NO_AUDIO_URL')
    return { audioUrl, timestamps }
}