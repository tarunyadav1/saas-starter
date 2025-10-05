'use client';

import { useEffect } from 'react';
import { ensureTeamForUser } from '@/app/(login)/actions';
import { mutate } from 'swr';

export function TeamOnboarding() {
  useEffect(() => {
    let mounted = true;

    async function handleTeamOnboarding() {
      try {
        await ensureTeamForUser();
        if (mounted) {
          // Refresh user and team data
          mutate('/api/user');
          mutate('/api/team');
        }
      } catch (error) {
        console.error('Error ensuring team for user:', error);
      }
    }

    handleTeamOnboarding();

    return () => {
      mounted = false;
    };
  }, []);

  return null; // This component renders nothing, it just runs the effect
}