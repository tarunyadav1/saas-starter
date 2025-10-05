import { redirect } from 'next/navigation';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { Team } from '@/lib/db/schema';

type WithTeamAction<T = any> = (formData: FormData, team: Team) => Promise<T>;

export function withTeam<T = any>(action: WithTeamAction<T>) {
  return async (formData: FormData): Promise<T | never> => {
    const user = await getUser();
    if (!user) {
      redirect('/sign-in');
    }

    const team = await getTeamForUser();
    if (!team) {
      redirect('/sign-in');
    }

    return action(formData, team);
  };
}