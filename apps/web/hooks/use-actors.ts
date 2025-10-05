import useSWR from 'swr'

export interface Actor {
  id: string
  key: string
  displayName: string
  imageUrl: string
  voiceProvider: string
  voiceId: string
  ageRange: string | null
  gender: string | null
  tags: string[]
  createdAt: string
}

interface ActorsResponse {
  actors: Actor[]
}

interface UseActorsOptions {
  gender?: 'male' | 'female'
  ageRange?: string
  tags?: string
  search?: string
}

const fetcher = async (url: string) => {
  console.log('Fetching from:', url)
  const res = await fetch(url)
  console.log('Response status:', res.status)
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  const data = await res.json()
  console.log('Response data:', data)
  return data
}

export function useActors(options: UseActorsOptions = {}) {
  const params = new URLSearchParams()
  
  if (options.gender) params.append('gender', options.gender)
  if (options.ageRange) params.append('ageRange', options.ageRange)
  if (options.tags) params.append('tags', options.tags)
  if (options.search) params.append('search', options.search)
  
  const queryString = params.toString()
  const url = queryString 
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/actors?${queryString}`
    : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/actors`
  
  const { data, error, isLoading, mutate } = useSWR<ActorsResponse>(url, fetcher)
  
  return {
    actors: data?.actors || [],
    isLoading,
    error,
    mutate
  }
}

export function useActor(key: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/actors/${key}`
  const { data, error, isLoading } = useSWR<{ actor: Actor }>(url, fetcher)
  
  return {
    actor: data?.actor,
    isLoading,
    error
  }
}