'use client';

import useSWR from 'swr';
import { api, type ProjectDto } from '@/lib/api';

export function useProject(projectId: string) {
  const { data, error, isLoading, mutate } = useSWR<ProjectDto>(
    projectId ? `project-${projectId}` : null, 
    () => api.getProject(projectId),
    {
      revalidateOnFocus: false,
    }
  );

  const update = async (id: string, title: string) => {
    if (!data) return;
    
    const optimistic = { ...data, title };
    await mutate(optimistic, false);
    
    try {
      const updated = await api.updateProject(data.id, title);
      await mutate(updated, false);
      return updated;
    } catch (e) {
      await mutate(data, false);
      throw e;
    }
  };

  return {
    project: data,
    loading: isLoading,
    error,
    update,
    refresh: () => mutate(),
  };
}