'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useActors, Actor } from '@/hooks/use-actors'
import { getMyTeamId, createTeamLook } from '@/hooks/use-team-looks'
import { Search, Sparkles } from 'lucide-react'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated?: (lookId: string) => void
}

const PRESETS: Array<{ key: string; label: string; prompt: string }> = [
  { key: 'headshot', label: 'Corporate Headshot', prompt: 'clean studio lighting, neutral background, professional attire, sharp focus' },
  { key: 'outdoor', label: 'Outdoor Casual', prompt: 'natural sunlight, shallow depth of field, casual outfit, candid vibe' },
  { key: 'glam', label: 'Studio Glam', prompt: 'beauty lighting, soft glow, editorial styling, high contrast' },
  { key: 'moody', label: 'Dark & Moody', prompt: 'low-key lighting, cinematic shadows, muted colors' },
  { key: 'airy', label: 'Bright & Airy', prompt: 'high-key lighting, soft tones, pastel palette' },
]

export function CreateCustomActorSheet({ open, onOpenChange, onCreated }: Props) {
  const { actors, isLoading } = useActors()
  const [teamId, setTeamId] = useState<number | undefined>()
  const [search, setSearch] = useState('')
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const id = await getMyTeamId()
        if (mounted) setTeamId(id)
      } catch {
        // ignore
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Recommended autopick: prefer 'pro', else first
  useEffect(() => {
    if (!isLoading && actors.length && !selectedActor) {
      const pro = actors.find(a => a.tags?.includes('pro'))
      setSelectedActor(pro || actors[0])
    }
  }, [isLoading, actors, selectedActor])

  const filtered = useMemo(() => {
    if (!search.trim()) return actors.slice(0, 20)
    const q = search.toLowerCase()
    return actors.filter(a =>
      a.displayName.toLowerCase().includes(q) ||
      a.gender?.toLowerCase().includes(q) ||
      a.ageRange?.toLowerCase().includes(q) ||
      a.tags?.some(t => t.toLowerCase().includes(q))
    ).slice(0, 30)
  }, [actors, search])

  const effectivePrompt = useMemo(() => {
    const presetText = PRESETS.find(p => p.key === activePreset)?.prompt ?? ''
    if (!prompt.trim()) return presetText
    if (!presetText) return prompt.trim()
    return `${presetText}, ${prompt.trim()}`
  }, [activePreset, prompt])

  const canSubmit = Boolean(teamId && selectedActor && effectivePrompt && !submitting)

  const onClose = () => {
    onOpenChange(false)
    // keep state so users can reopen and iterate
  }

  const handleSubmit = async () => {
    if (!teamId) return
    const base = selectedActor || actors[0]
    if (!base) return
    setSubmitting(true)
    try {
      const { lookId } = await createTeamLook(teamId, {
        actorKey: base.key,
        prompt: effectivePrompt,
        strength: 0.65,
      })
      onCreated?.(lookId)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
        <div className="flex h-full flex-col">
          <div className="p-5 border-b">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Create custom actor
              </SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 gap-6">
            <section className="space-y-3">
              <div className="text-sm font-medium">Style presets</div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(p => (
                  <Button
                    key={p.key}
                    size="sm"
                    variant={activePreset === p.key ? 'default' : 'outline'}
                    onClick={() => setActivePreset(activePreset === p.key ? null : p.key)}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
              {effectivePrompt && (
                <div className="text-xs text-gray-500">
                  Using: <Badge variant="secondary">{effectivePrompt.slice(0, 120)}{effectivePrompt.length > 120 ? '…' : ''}</Badge>
                </div>
              )}
            </section>

            <section className="space-y-2">
              <div className="text-sm font-medium">Describe the look</div>
              <Textarea
                rows={3}
                placeholder="Describe the look… e.g., clean studio light, denim jacket, soft smile"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    if (canSubmit) handleSubmit()
                  }
                }}
              />
              <div className="text-xs text-gray-500">Press ⌘⏎ to generate</div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Base actor</div>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-8"
                    placeholder="Search base actors"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1">
                {(isLoading ? Array.from({ length: 8 }) : filtered).map((a, idx) => (
                  <Card
                    key={isLoading ? idx : (a as Actor).id}
                    className={`min-w-[112px] cursor-pointer transition-all ${
                      !isLoading && selectedActor?.id === (a as Actor).id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      if (isLoading) return
                      setSelectedActor(a as Actor)
                    }}
                  >
                    <CardContent className="p-2">
                      <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden mb-1">
                        {isLoading ? (
                          <div className="w-full h-full animate-pulse bg-gray-200" />
                        ) : (
                          <img
                            src={(a as Actor).imageUrl}
                            alt={(a as Actor).displayName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="text-[11px] text-center truncate">
                        {isLoading ? 'Loading…' : (a as Actor).displayName}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

          </div>

          <div className="border-t p-4 flex items-center gap-3">
            {selectedActor && (
              <div className="flex items-center gap-3">
                <img
                  src={selectedActor.imageUrl}
                  alt={selectedActor.displayName}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div className="text-sm">
                  <div className="font-medium">{selectedActor.displayName}</div>
                  <div className="text-xs text-gray-500">
                    {selectedActor.gender}{selectedActor.gender && selectedActor.ageRange ? ' • ' : ''}{selectedActor.ageRange}
                  </div>
                </div>
              </div>
            )}
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button disabled={!canSubmit} onClick={handleSubmit}>
                {submitting ? 'Generating…' : 'Generate'}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}