'use server';

import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  users,
  teams,
  teamMembers,
  activityLogs,
  type NewTeam,
  type NewTeamMember,
  type NewActivityLog,
  ActivityType,
  invitations
} from '@/lib/db/schema';
import { redirect } from 'next/navigation';
import { getUser, getUserWithTeam } from '@/lib/db/queries';

async function logActivity(
  teamId: number | null | undefined,
  userId: number,
  type: ActivityType,
  ipAddress?: string
) {
  if (teamId === null || teamId === undefined) {
    return;
  }
  const newActivity: NewActivityLog = {
    teamId,
    userId,
    action: type,
    ipAddress: ipAddress || ''
  };
  await db.insert(activityLogs).values(newActivity);
}

// Helper function to ensure user has a team (for first-time Supabase users)
export async function ensureTeamForUser() {
  const user = await getUser();
  if (!user) return null;

  // Check if user already has a team
  const existing = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, user.id)
  });

  if (existing) return existing.teamId;

  // Create a new team for this user
  const newTeam: NewTeam = {
    name: `${user.email}'s Team`
  };

  const [createdTeam] = await db.insert(teams).values(newTeam).returning();

  if (!createdTeam) {
    throw new Error('Failed to create team');
  }

  // Add user to the team as owner
  const newTeamMember: NewTeamMember = {
    userId: user.id,
    teamId: createdTeam.id,
    role: 'owner'
  };

  await Promise.all([
    db.insert(teamMembers).values(newTeamMember),
    logActivity(createdTeam.id, user.id, ActivityType.CREATE_TEAM)
  ]);

  return createdTeam.id;
}

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address')
});

export async function updateAccount(formData: FormData) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  const result = updateAccountSchema.safeParse({ name, email });
  if (!result.success) {
    return { error: 'Invalid input data' };
  }

  const userWithTeam = await getUserWithTeam(user.id);

  await Promise.all([
    db.update(users).set({ name, email }).where(eq(users.id, user.id)),
    logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_ACCOUNT)
  ]);

  return { name, success: 'Account updated successfully.' };
}

const removeTeamMemberSchema = z.object({
  memberId: z.number()
});

export async function removeTeamMember(prevState: any, formData: FormData) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const memberId = parseInt(formData.get('memberId') as string);
  const result = removeTeamMemberSchema.safeParse({ memberId });
  
  if (!result.success) {
    return { error: 'Invalid member ID' };
  }

  const userWithTeam = await getUserWithTeam(user.id);

  if (!userWithTeam?.teamId) {
    return { error: 'User is not part of a team' };
  }

  await db
    .delete(teamMembers)
    .where(
      and(
        eq(teamMembers.id, memberId),
        eq(teamMembers.teamId, userWithTeam.teamId)
      )
    );

  await logActivity(
    userWithTeam.teamId,
    user.id,
    ActivityType.REMOVE_TEAM_MEMBER
  );

  return { success: 'Team member removed successfully' };
}

const inviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['member', 'owner'])
});

export async function inviteTeamMember(prevState: any, formData: FormData) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const email = formData.get('email') as string;
  const role = formData.get('role') as 'member' | 'owner';

  const result = inviteTeamMemberSchema.safeParse({ email, role });
  if (!result.success) {
    return { error: 'Invalid input data' };
  }

  const userWithTeam = await getUserWithTeam(user.id);

  if (!userWithTeam?.teamId) {
    return { error: 'User is not part of a team' };
  }

  const existingMember = await db
    .select()
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(
      and(eq(users.email, email), eq(teamMembers.teamId, userWithTeam.teamId))
    )
    .limit(1);

  if (existingMember.length > 0) {
    return { error: 'User is already a member of this team' };
  }

  // Check if there's an existing invitation
  const existingInvitation = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.email, email),
        eq(invitations.teamId, userWithTeam.teamId),
        eq(invitations.status, 'pending')
      )
    )
    .limit(1);

  if (existingInvitation.length > 0) {
    return { error: 'An invitation has already been sent to this email' };
  }

  // Create a new invitation
  await db.insert(invitations).values({
    teamId: userWithTeam.teamId,
    email,
    role,
    invitedBy: user.id,
    status: 'pending'
  });

  await logActivity(
    userWithTeam.teamId,
    user.id,
    ActivityType.INVITE_TEAM_MEMBER
  );

  // TODO: Send invitation email and include ?inviteId={id} to sign-up URL
  // await sendInvitationEmail(email, userWithTeam.team.name, role)

  return { success: 'Invitation sent successfully' };
}