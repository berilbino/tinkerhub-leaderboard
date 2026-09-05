import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { 
  getLeaderboardById, 
  getLeaderboardBySlug, 
  getParticipants, 
  getRounds, 
  getScores 
} from '@/lib/data/store';
import { isValidAdminSession } from '@/lib/utils/adminSession';
import { LeaderboardDetailClient } from './LeaderboardDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLeaderboardDetailPage({ params }: PageProps) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get('th_admin_session')?.value;

  // If session secret is not configured or session is invalid, redirect to login
  if (!sessionValue || !isValidAdminSession(sessionValue)) {
    redirect('/admin/login');
  }

  const { id } = await params;

  // Try slug first, then UUID — supports both URL formats
  let leaderboard = await getLeaderboardBySlug(id);
  if (!leaderboard) {
    leaderboard = await getLeaderboardById(id);
  }

  // If leaderboard not found (e.g. deleted), go back to admin dashboard
  if (!leaderboard) {
    redirect('/admin');
  }

  const [participants, rounds, scores] = await Promise.all([
    getParticipants(leaderboard.id),
    getRounds(leaderboard.id),
    getScores(leaderboard.id),
  ]);

  return (
    <LeaderboardDetailClient
      initialLeaderboard={leaderboard}
      initialParticipants={participants}
      initialRounds={rounds}
      initialScores={scores}
    />
  );
}
