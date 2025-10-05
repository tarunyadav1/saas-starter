export async function retryFetch(input: string | URL, init: RequestInit, retries = 2, baseDelay = 500) {
    for (let attempt = 0; ; attempt++) {
        const res = await fetch(input, init as any)
        if (res.ok) return res
        if ((res.status >= 500 || res.status === 429) && attempt < retries) {
            const jitter = Math.random() * 200
            await new Promise(r => setTimeout(r, baseDelay * (attempt + 1) + jitter))
            continue
        }
        throw new Error(`HTTP ${res.status} ${await res.text()}`)
    }
}