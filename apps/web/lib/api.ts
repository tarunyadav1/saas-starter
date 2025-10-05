'use client';

import { supabase } from '@/lib/supabase/client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL as string; // e.g. http://localhost:3001

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type ProjectDto = { id: string; title: string; createdAt?: string };

export const api = {
  async getProject(id: string): Promise<ProjectDto> {
    const headers = await authHeader();
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      headers,
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`getProject failed: ${res.status}`);
    return await res.json();
  },

  async listProjects(): Promise<ProjectDto[]> {
    const headers = await authHeader();
    const res = await fetch(`${API_BASE}/api/projects`, {
      headers,
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`listProjects failed: ${res.status}`);
    const json = await res.json();
    return json.items ?? [];
  },

  async createProject(title: string): Promise<ProjectDto> {
    const headers = { ...(await authHeader()), 'Content-Type': 'application/json' };
    const res = await fetch(`${API_BASE}/api/projects`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error(`createProject failed: ${res.status}`);
    return await res.json();
    },

  async updateProject(id: string, title: string): Promise<ProjectDto> {
    const headers = { ...(await authHeader()), 'Content-Type': 'application/json' };
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error(`updateProject failed: ${res.status}`);
    return await res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const headers = await authHeader();
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });
    if (!res.ok && res.status !== 204) throw new Error(`deleteProject failed: ${res.status}`);
  },

  async ttsElevenV3(params: {
    text: string
    voice?: string
    stability?: number
    similarity_boost?: number
    style?: number
    speed?: number
    timestamps?: boolean
    previous_text?: string
    next_text?: string
    actorKey?: string
  }): Promise<{ audioUrl: string; timestamps?: Array<{ text: string; start: number; end: number }> }> {
    const headers = { ...(await authHeader()), 'Content-Type': 'application/json' };
    const res = await fetch(`${API_BASE}/api/tts/elevenlabs-v3`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`ttsElevenV3 failed: ${res.status}`);
    return await res.json();
  },
};