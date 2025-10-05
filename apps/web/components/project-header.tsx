'use client';

import { useState } from 'react';
import { Edit2, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditProjectDialog } from '@/components/edit-project-dialog';
import { DeleteProjectDialog } from '@/components/delete-project-dialog';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface ProjectHeaderProps {
  project: {
    id: string;
    title: string;
    createdAt?: string;
  };
  onUpdate: (id: string, title: string) => Promise<void>;
}

export function ProjectHeader({ project, onUpdate }: ProjectHeaderProps) {
  const router = useRouter();
  
  const handleDelete = async (id: string) => {
    try {
      await api.deleteProject(id);
      // Navigate back to dashboard after successful delete
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="flex items-start justify-between mb-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
          <EditProjectDialog 
            project={project} 
            onEditProject={onUpdate}
          >
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit2 className="h-4 w-4" />
            </Button>
          </EditProjectDialog>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Team Project</span>
          </div>
        </div>
        
        <p className="text-muted-foreground">
          Generate winning assets with talking actors, reactions and more.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <DeleteProjectDialog 
          project={project} 
          onDeleteProject={handleDelete}
        >
          <Button variant="outline" size="sm">
            Delete Project
          </Button>
        </DeleteProjectDialog>
      </div>
    </div>
  );
}