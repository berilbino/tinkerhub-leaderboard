import React from 'react';
import { notFound } from 'next/navigation';
import { 
  getLeaderboardById, 
  getLeaderboardBySlug, 
  getParticipants, 
  getRounds, 
  getScores 
} from '@/lib/data/store';
import { LeaderboardDetailClient } from './LeaderboardDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLeaderboardDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  let leaderboard = await getLeaderboardById(id);
  if (!leaderboard) {
    leaderboard = await getLeaderboardBySlug(id);
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
