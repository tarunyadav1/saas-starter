'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Play, Mic, Type, Filter, Upload, ChevronDown, Users, Search, ArrowUp, Volume2, Download, RotateCcw, X, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ActorSelectionModal } from '@/components/actor-selection-modal';
import { Actor } from '@/hooks/use-actors';
import { ProjectHeader } from '@/components/project-header';
import { useProject } from '@/hooks/use-project';
import { ElevenV3Controls } from '@/components/tts/ElevenV3Controls';
import Link from 'next/link';

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { project, loading: projectLoading, error: projectError, update } = useProject(projectId);
  
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [sourceType, setSourceType] = useState<'text' | 'audio'>('text');
  const [script, setScript] = useState('Still watching Netflix on your tiny phone screen?\n\nProject it BIG anywhere with this pocket-sized projector!\n\nIt\'s wireless, HD, and fits in your palm.\n\nYour wall = your cinema now\n\nDon\'t miss out — it\'s going viral for a reason!');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isActorModalOpen, setIsActorModalOpen] = useState(false);
  const [audioSamples, setAudioSamples] = useState<{actorId: string, audioUrl: string | null, isPlaying: boolean}[]>([]);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [selectedMultipleActors, setSelectedMultipleActors] = useState<Actor[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Show loading state
  if (projectLoading) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <div className="flex-none mb-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (projectError || !project) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <div className="flex-none mb-6">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-2xl font-bold tracking-tight text-red-600">Project Not Found</h1>
            <p className="text-muted-foreground mt-1">The project you're looking for doesn't exist or you don't have access to it.</p>
          </div>
        </div>
      </div>
    );
  }

  const videos = [
    {
      id: '1',
      videoUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=600&fit=crop&crop=center',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=600&fit=crop&crop=center',
      status: 'completed' as const,
      sourceType: 'text' as const,
      sourceText: 'Still watching Netflix on your tiny phone screen?\n\nProject it BIG anywhere with this pocket-sized projector!\n\nIt\'s wireless, HD, and fits in your palm.\n\nYour wall = your cinema now\n\nDon\'t miss out — it\'s going viral for a reason!',
      actorKey: 'helen_base_01',
      actorName: 'Kennedy',
      model: 'Text to Speech',
      durationSeconds: 16,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2', 
      videoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=600&fit=crop&crop=center',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=600&fit=crop&crop=center',
      status: 'completed' as const,
      sourceType: 'text' as const,
      sourceText: 'Still watching Netflix on your tiny phone screen?\n\nProject it BIG anywhere with this pocket-sized projector!\n\nIt\'s wireless, HD, and fits in your palm.\n\nYour wall = your cinema now\n\nDon\'t miss out — it\'s going viral for a reason!',
      actorKey: 'lauren_base_01', 
      actorName: 'Morgan',
      model: 'Text to Speech',
      durationSeconds: 16,
      createdAt: '2024-01-14T15:30:00Z'
    }
  ];

  const handleActorSelect = (actor: Actor) => {
    setSelectedActor(actor);
    // Add to multiple actors if not already selected
    if (!selectedMultipleActors.find(a => a.id === actor.id)) {
      setSelectedMultipleActors([...selectedMultipleActors, actor]);
    }
  };

  const removeSelectedActor = (actorId: string) => {
    setSelectedMultipleActors(selectedMultipleActors.filter(a => a.id !== actorId));
    if (selectedActor?.id === actorId) {
      setSelectedActor(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex-none">
        <div className="max-w-7xl mx-auto px-6">
          <ProjectHeader project={project} onUpdate={update} />
        </div>
      </div>

      {/* Video Grid Area - Scrollable */}
      <div className="flex-1 overflow-auto px-6 pb-40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {videos.map((video) => (
              <div 
                key={video.id} 
                className="relative cursor-pointer rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                onClick={() => {
                  setSelectedVideo(video);
                  setIsVideoModalOpen(true);
                }}
              >
                <img
                  src={video.thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-full aspect-[3/4] object-cover"
                />
                {/* Loading indicator in center for generating videos */}
                {video.status !== 'completed' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
                
                {/* Play button overlay */}
                {video.status === 'completed' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-black border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="flex h-[90vh]">
              {/* Video Player Section */}
              <div className="flex-1 flex items-center justify-center bg-black p-8">
                <div className="relative max-w-2xl w-full">
                  <img
                    src={selectedVideo.videoUrl}
                    alt="Video preview"
                    className="w-full rounded-lg"
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-4 text-white">
                      <button 
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="w-8 h-8 flex items-center justify-center"
                      >
                        {isVideoPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </button>
                      
                      <div className="flex-1 flex items-center gap-2 text-sm">
                        <span>0:00</span>
                        <div className="flex-1 h-1 bg-white/30 rounded-full">
                          <div className="h-full w-1/4 bg-white rounded-full"></div>
                        </div>
                        <span>0:{selectedVideo.durationSeconds?.toString().padStart(2, '0')}</span>
                      </div>
                      
                      <button className="w-8 h-8 flex items-center justify-center">
                        <Volume2 className="h-5 w-5" />
                      </button>
                      
                      <button className="w-8 h-8 flex items-center justify-center">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3m-3-7h3m-3-7h3m13 7h-3m-3-7h3"/>
                        </svg>
                      </button>
                      
                      <button className="w-8 h-8 flex items-center justify-center">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Sidebar - Video Details */}
              <div className="w-80 bg-gray-900 text-white p-6 flex flex-col">
                {/* Header Buttons */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                      <RotateCcw className="h-4 w-4" />
                      Remix
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                  <button 
                    onClick={() => setIsVideoModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Video Details */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      </div>
                      <span className="text-sm">Model</span>
                    </div>
                    <p className="text-white">{selectedVideo.model}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Actor</span>
                    </div>
                    <p className="text-white">{selectedVideo.actorName}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Type className="w-4 h-4" />
                      <span className="text-sm">Script</span>
                    </div>
                    <p className="text-white text-sm leading-relaxed whitespace-pre-line">
                      {selectedVideo.sourceText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fixed Bottom Input Area */}
      <div className="fixed bottom-0 right-0 bg-background z-50" style={{ left: 'var(--sidebar-width, 16rem)' }}>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg border shadow-sm">
            {/* Header Row */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-sm font-normal"
                onClick={() => setIsActorModalOpen(true)}
              >
                🎭 Talking Actors
                <ChevronDown className="h-4 w-4" />
              </Button>

              <div className="text-sm text-gray-400">
                {script.length} / 1500
              </div>
            </div>

            {/* Script Input */}
            <div className="px-6 pb-4">
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter your script here..."
                maxLength={1500}
                rows={6}
                className="resize-none border-0 p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Selected Actors Display */}
            {selectedMultipleActors.length > 0 && (
              <div className="px-6 pb-4">
                <div className="flex flex-wrap gap-2">
                  {selectedMultipleActors.map((actor) => (
                    <div key={actor.id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                      <img
                        src={actor.imageUrl}
                        alt={actor.displayName}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.displayName)}&background=f3f4f6&color=6b7280&size=64`;
                        }}
                      />
                      <span className="text-sm font-medium">{actor.displayName}</span>
                      <button
                        onClick={() => removeSelectedActor(actor.id)}
                        className="text-gray-400 hover:text-gray-600 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TTS Controls */}
            {selectedActor && (
              <div className="px-6 pb-4 border-t pt-4">
                <h3 className="text-base font-medium mb-3">Generate Audio (ElevenLabs V3)</h3>
                <ElevenV3Controls
                  actorKey={selectedActor.key}
                  defaultVoice={selectedActor.voiceId || undefined}
                  defaultText={script}
                  onReady={(url) => {
                    console.log('Audio ready:', url);
                  }}
                />
              </div>
            )}

            {/* Bottom Row */}
            <div className="flex items-center justify-between px-6 pb-6">
              <div className="flex items-center gap-3">
                <Select value={sourceType} onValueChange={(value) => setSourceType(value as 'text' | 'audio')}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text to Speech</SelectItem>
                    <SelectItem value="audio">Speech to Speech</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {selectedMultipleActors.map((actor) => (
                      <img
                        key={actor.id}
                        src={actor.imageUrl}
                        alt={actor.displayName}
                        className="w-6 h-6 rounded-full border-2 border-white object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.displayName)}&background=f3f4f6&color=6b7280&size=48`;
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{selectedMultipleActors.length} Actors</span>
                </div>
              </div>

              <button
                onClick={() => console.log('Generate video')}
                disabled={!script.trim()}
                className="w-12 h-12 rounded-full bg-black hover:bg-gray-800 disabled:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <ArrowUp className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actor Selection Modal */}
      <ActorSelectionModal
        isOpen={isActorModalOpen}
        onClose={() => setIsActorModalOpen(false)}
        selectedActor={selectedActor}
        onSelect={handleActorSelect}
      />
    </div>
  );
}