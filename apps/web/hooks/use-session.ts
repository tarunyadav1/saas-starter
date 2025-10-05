'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { User, Team } from '@/lib/db/schema';

export function useSession(options?: { suspense?: boolean }) {
  const suspense = options?.suspense ?? true;

  const {
    data: user,
    isLoading: userLoading,
    mutate: mutateUser,
  } = useSWR<User | null>('/api/user', null, { suspense });

  const {
    data: team,
    isLoading: teamLoading,
    mutate: mutateTeam,
  } = useSWR<Team | null>('/api/team', null, { suspense });

  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    await Promise.all([mutateUser(null, false), mutateTeam(null, false)]);
    router.push('/sign-in');
  };

  return {
    user,
    team,
    loading: userLoading || teamLoading,
    signOut,
    refresh: async () => {
      await Promise.all([mutateUser(), mutateTeam()]);
    },
  };
}