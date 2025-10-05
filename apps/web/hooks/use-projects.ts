'use client';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { api, type ProjectDto } from '@/lib/api';

const KEY = 'projects';

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<ProjectDto[]>(KEY, () => api.listProjects(), {
    revalidateOnFocus: false,
  });

  const create = async (title: string) => {
    const optimistic: ProjectDto = { id: `tmp_${Date.now()}`, title };
    await mutate(async (current) => {
      const list = current ?? [];
      try {
        await mutate([...list, optimistic], false);
        const created = await api.createProject(title);
        await mutate((prev) => {
          const p = (prev ?? []).filter((x) => x.id !== optimistic.id);
          return [created, ...p];
        }, false);
        return await api.listProjects();
      } catch (e) {
        await mutate(list, false);
        throw e;
      }
    });
  };

  const update = async (id: string, title: string) => {
    const prev = data ?? [];
    const optimistic = prev.map((p) => p.id === id ? { ...p, title } : p);
    await mutate(optimistic, false);
    try {
      await api.updateProject(id, title);
      return await mutate();
    } catch (e) {
      await mutate(prev, false);
      throw e;
    }
  };

  const remove = async (id: string) => {
    const prev = data ?? [];
    await mutate(prev.filter((p) => p.id !== id), false);
    try {
      await api.deleteProject(id);
    } catch (e) {
      await mutate(prev, false);
      throw e;
    }
  };

  return {
    projects: data ?? [],
    loading: isLoading,
    error,
    create,
    update,
    remove,
    refresh: () => mutate(),
  };
}