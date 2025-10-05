'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  actorKey?: string
  defaultVoice?: string
  defaultText?: string
  onReady?: (audioUrl: string) => void
}

function Slider({ 
  value, 
  min, 
  max, 
  step, 
  onValueChange, 
  label 
}: {
  value: number
  min: number
  max: number
  step: number
  onValueChange: (value: number) => void
  label: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label} {value.toFixed(2)}</Label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #04AA6D;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #04AA6D;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}

export function ElevenV3Controls({ actorKey, defaultVoice, defaultText = '', onReady }: Props) {
  const [text, setText] = useState(defaultText)
  const [voice, setVoice] = useState<string | undefined>(defaultVoice)
  const [stability, setStability] = useState(0.5)
  const [similarity, setSimilarity] = useState(0.75)
  const [style, setStyle] = useState(0.0)
  const [speed, setSpeed] = useState(1.0)
  const [timestamps, setTimestamps] = useState(false)

  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canGenerate = text.trim().length > 0 && !loading

  async function generate() {
    try {
      setLoading(true)
      setError(null)
      const out = await api.ttsElevenV3({
        text,
        voice,
        stability,
        similarity_boost: similarity,
        style,
        speed,
        timestamps,
        actorKey,
      })
      setAudioUrl(out.audioUrl)
      onReady?.(out.audioUrl)
    } catch (e: any) {
      setError(e?.message || 'Failed to generate audio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Script</Label>
        <textarea
          className="w-full rounded-md border border-gray-300 p-3 text-sm min-h-[120px] resize-vertical"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your script…"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Voice (optional)</Label>
          <Input 
            value={voice || ''} 
            onChange={(e) => setVoice(e.target.value || undefined)} 
            placeholder="e.g. Rachel, Aria or voice ID"
            disabled={loading}
          />
          <div className="text-xs text-gray-600">Defaults to the selected actor's voice if left blank.</div>
        </div>

        <div className="flex items-center gap-2">
          <input 
            id="timestamps" 
            type="checkbox" 
            checked={timestamps} 
            onChange={(e) => setTimestamps(e.target.checked)}
            disabled={loading}
          />
          <Label htmlFor="timestamps">Return timestamps</Label>
        </div>

        <Slider
          value={speed}
          min={0.7}
          max={1.2}
          step={0.01}
          onValueChange={setSpeed}
          label="Speed"
        />

        <Slider
          value={stability}
          min={0}
          max={1}
          step={0.01}
          onValueChange={setStability}
          label="Stability"
        />

        <Slider
          value={similarity}
          min={0}
          max={1}
          step={0.01}
          onValueChange={setSimilarity}
          label="Similarity Boost"
        />

        <Slider
          value={style}
          min={0}
          max={1}
          step={0.01}
          onValueChange={setStyle}
          label="Style"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={generate} disabled={!canGenerate}>
          {loading ? 'Generating…' : audioUrl ? 'Regenerate' : 'Generate audio'}
        </Button>
        {audioUrl && (
          <a 
            className="text-sm text-blue-600 underline hover:no-underline" 
            href={audioUrl} 
            target="_blank" 
            rel="noreferrer"
          >
            Open raw file
          </a>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {audioUrl && (
        <div className="rounded-md border p-4 bg-gray-50">
          <Label className="block mb-2">Generated Audio</Label>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  )
}