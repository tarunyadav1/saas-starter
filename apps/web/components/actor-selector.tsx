'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Sparkles, User } from 'lucide-react'
import { useActors } from '@/hooks/use-actors'
import { useTeamLooks, getMyTeamId } from '@/hooks/use-team-looks'
import { CreateCustomActorSheet } from '@/components/create-custom-actor-sheet'

interface ActorSelectorProps {
  selectedActorKey?: string
  onActorSelect: (actorKey: string, isCustom?: boolean) => void
}

export function ActorSelector({ selectedActorKey, onActorSelect }: ActorSelectorProps) {
  const { actors, isLoading: actorsLoading } = useActors()
  
  // Team-based custom actors
  const [teamId, setTeamId] = useState<number | undefined>()
  const { looks, isLoading: looksLoading, mutate } = useTeamLooks(teamId)
  
  const [activeTab, setActiveTab] = useState<'base' | 'custom'>('base')
  const [openCreate, setOpenCreate] = useState(false)

  // Get team ID on mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const id = await getMyTeamId()
        if (mounted) setTeamId(id)
      } catch (error) {
        console.error('Failed to get team ID:', error)
      }
    })()
    return () => { mounted = false }
  }, [])


  if (actorsLoading) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600">Loading actors...</div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-24 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant={activeTab === 'base' ? 'default' : 'outline'}
          onClick={() => setActiveTab('base')}
          className="gap-2"
        >
          <User className="h-4 w-4" />
          Base Actors
        </Button>
        <Button
          variant={activeTab === 'custom' ? 'default' : 'outline'}
          onClick={() => setActiveTab('custom')}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Custom Actors
          {looks.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {looks.length}
            </Badge>
          )}
        </Button>
      </div>

      {activeTab === 'base' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {actors.map((actor) => (
              <Card
                key={actor.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedActorKey === actor.key && !selectedActorKey?.includes('custom-')
                    ? 'ring-2 ring-blue-500'
                    : ''
                }`}
                onClick={() => onActorSelect(actor.key, false)}
              >
                <CardContent className="p-3">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    <img
                      src={actor.imageUrl}
                      alt={actor.displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
                      }}
                    />
                  </div>
                  <div className="text-xs font-medium text-center truncate">
                    {actor.displayName}
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {actor.gender} • {actor.ageRange}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" className="w-full gap-2" onClick={() => setOpenCreate(true)}>
            <Plus className="h-4 w-4" />
            Create Custom Actor
          </Button>
          <CreateCustomActorSheet
            open={openCreate}
            onOpenChange={setOpenCreate}
            onCreated={async () => {
              await mutate()
              setActiveTab('custom')
            }}
          />
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-4">
          {looksLoading ? (
            <div className="text-sm text-gray-600">Loading custom actors...</div>
          ) : looks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No custom actors yet</div>
              <div className="text-xs mt-1">
                Create one from the Base Actors tab
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {looks.map((look) => (
                <Card
                  key={look.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedActorKey === `custom-${look.id}`
                      ? 'ring-2 ring-purple-500'
                      : ''
                  }`}
                  onClick={() => onActorSelect(`custom-${look.id}`, true)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                      <img
                        src={look.outputImageUrl}
                        alt={look.prompt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
                        }}
                      />
                    </div>
                    <div className="text-xs font-medium text-center truncate">
                      Custom: {look.actorDisplayName}
                    </div>
                    <div className="text-xs text-gray-500 text-center truncate">
                      {look.prompt}
                    </div>
                    <Badge variant="outline" className="w-full mt-1 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Custom
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}