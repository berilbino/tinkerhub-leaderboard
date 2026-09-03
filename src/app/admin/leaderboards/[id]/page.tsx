import React from 'react';
import { notFound, redirect } from 'next/navigation';
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
  if (!isValidAdminSession(cookieStore.get('th_admin_session')?.value)) {
    redirect('/admin/login');
  }

  const { id } = await params;
  
  // Use the stable public slug first. Existing UUID-based admin links remain
  // supported as a fallback.
  let leaderboard = await getLeaderboardBySlug(id);
  if (!leaderboard) {
    leaderboard = await getLeaderboardById(id);
  }

  if (!leaderboard) {
    notFound();
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
