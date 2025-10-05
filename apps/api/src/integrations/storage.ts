import { createClient } from '@supabase/supabase-js'
import { cfg } from '../config'

function supabase() { return createClient(cfg.supabaseUrl, cfg.supabaseServiceRole, { auth: { persistSession: false } }) }

export async function uploadFromUrl(bucket: string, path: string, remoteUrl: string) {
    const r = await fetch(remoteUrl)
    if (!r.ok) throw new Error(`download_failed ${r.status}`)
    const buf = Buffer.from(await r.arrayBuffer())
    const { error } = await supabase().storage.from(bucket).upload(path, buf, { upsert: true, contentType: r.headers.get('content-type') || 'application/octet-stream' })
    if (error) throw error
}

export const publicUrl = (bucket: string, path: string) => `${cfg.publicStorageBase}/storage/v1/object/public/${bucket}/${path}`