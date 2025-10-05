'use client';

import { useState } from 'react';
import { Plus, Folder, Calendar, Copy, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ActorSelector } from '@/components/actor-selector';

export default function ProjectsDashboard() {
  const [textContent, setTextContent] = useState(
    "Okay, so I've been seeing this Kylie Cosmetics face moisturizer everywhere, and I finally caved and got it. You guys, I am obsessed. It has shea butter and sodium hyaluronate, which is basically hyaluronic acid, and my skin has never felt this soft. Like, 94% of people said it softened their skin after just one use, and I totally get why. I use it morning and night - just two to three pumps under my makeup. No greasiness, no heaviness, just pure hydration. If they're out, sorry not sorry."
  );
  const [selectedFeature, setSelectedFeature] = useState('talking-actors');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [selectedActor, setSelectedActor] = useState<string | undefined>();

  // Mock data for now to test rendering
  const projects = [
    {
      id: '1',
      title: 'KYLIE COSMETICS',
      createdAt: '2024-01-15T10:00:00Z',
      videoCount: 3
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6 min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KYLIE COSMETIC</h1>
          <p className="text-gray-600 mb-8">Generate winning assets with talking actors, reactions and more.</p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
          <Button 
            variant={selectedFeature === 'talking-actors' ? 'default' : 'outline'}
            onClick={() => setSelectedFeature('talking-actors')}
            className="gap-2 relative"
          >
            🎭 Talking Actors
            <Badge variant="secondary" className="ml-2 bg-black text-white text-xs px-2 py-0.5">NEW</Badge>
          </Button>
          <Button 
            variant={selectedFeature === 'text-to-speech' ? 'default' : 'outline'}
            onClick={() => setSelectedFeature('text-to-speech')}
            className="gap-2"
          >
            🔊 Text to Speech
          </Button>
          <Button 
            variant={selectedFeature === 'speech-to-speech' ? 'default' : 'outline'}
            onClick={() => setSelectedFeature('speech-to-speech')}
            className="gap-2"
          >
            🎤 Speech to Speech
          </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter your script here..."
                className="min-h-[300px] p-4 text-sm leading-relaxed resize-none border border-gray-200 rounded-lg"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {textContent.length} / 1500
                </span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">Voice and Setting</label>
                <div className="text-sm text-gray-500">Young female, 20s voice • Beach, outdoor setting</div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 mb-2">Select Actor</label>
                <ActorSelector 
                  selectedActorKey={selectedActor}
                  onActorSelect={(actorKey, isCustom) => {
                    setSelectedActor(actorKey)
                    console.log('Selected actor:', actorKey, 'Is custom:', isCustom)
                  }}
                />
              </div>
              <Button 
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3"
                disabled={!selectedActor}
              >
                Generate Video
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
              <Copy className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-center mb-6">
              Your generated video will appear here
            </p>
            <Button className="gap-2" disabled>
              <Download className="h-4 w-4" />
              Download
            </Button>
            
            <div className="mt-8 w-full">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>generating</span>
                <span>completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-600 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {showCreateForm && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter project title..."
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') console.log('Create project:', newProjectTitle);
                  if (e.key === 'Escape') setShowCreateForm(false);
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={() => console.log('Create project:', newProjectTitle)}>
                  Create Project
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewProjectTitle('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}