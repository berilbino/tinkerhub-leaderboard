import { Participant, Round, Score, RankedParticipant, LeaderboardViewData, Leaderboard } from '@/types/leaderboard';

/**
 * Dense ranking calculator:
 * - Participants with equal points get the same rank (e.g. multiple 1s, multiple 4s, multiple 5s).
 * - Next distinct score receives the consecutive rank (no skipped ranks).
 */
export function calculateRankings(
  leaderboard: Leaderboard,
  participants: Participant[],
  rounds: Round[],
  scores: Score[],
  selectedRoundId: string = 'overall',
  currentParticipantId?: string | null
): LeaderboardViewData {
  const publishedRounds = rounds.filter((r) => r.published).sort((a, b) => a.round_order - b.round_order);
  
  // Build a lookup map of scores: participant_id -> { round_id -> score }
  const scoreMap = new Map<string, Record<string, number>>();
  for (const s of scores) {
    if (!scoreMap.has(s.participant_id)) {
      scoreMap.set(s.participant_id, {});
    }
    scoreMap.get(s.participant_id)![s.round_id] = Number(s.score);
  }

  // Calculate points for each participant based on round selection
  const rankedList: RankedParticipant[] = participants.map((p) => {
    const pScores = scoreMap.get(p.id) || {};
    let totalPoints = 0;

    if (selectedRoundId === 'overall') {
      // Sum all published rounds
      for (const r of publishedRounds) {
        totalPoints += pScores[r.id] || 0;
      }
    } else {
      // Specific round
      totalPoints = pScores[selectedRoundId] || 0;
    }

    return {
      id: p.id,
      name: p.name,
      totalPoints,
      rank: 1, // Will be calculated next
      isCurrentUser: currentParticipantId === p.id,
      roundScores: pScores,
    };
  });

  // Sort descending by totalPoints. Secondary sort by name for consistency
  rankedList.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    return a.name.localeCompare(b.name);
  });

  // Assign Dense Ranks: equal points = same rank; next distinct score = next rank
  let currentRank = 0;
  let lastPoints: number | null = null;
  for (let i = 0; i < rankedList.length; i++) {
    if (lastPoints === null || rankedList[i].totalPoints < lastPoints) {
      currentRank++;
      lastPoints = rankedList[i].totalPoints;
    }
    rankedList[i].rank = currentRank;
  }

  const top3 = rankedList.slice(0, 3);
  const top15 = rankedList.slice(0, 15);
  
  const currentParticipant = currentParticipantId
    ? rankedList.find((p) => p.id === currentParticipantId) || null
    : null;

  const currentParticipantRank = currentParticipant ? currentParticipant.rank : null;
  const currentParticipantPoints = currentParticipant ? currentParticipant.totalPoints : null;
  
  // Participant is in top 15 if their index is < 15
  const currentParticipantIndex = currentParticipant
    ? rankedList.findIndex((p) => p.id === currentParticipant.id)
    : -1;
  const isCurrentInTop15 = currentParticipantIndex >= 0 && currentParticipantIndex < 15;

  return {
    leaderboard,
    rounds,
    publishedRounds,
    selectedRoundId,
    top3,
    top15,
    allRanked: rankedList,
    currentParticipant,
    currentParticipantRank,
    currentParticipantPoints,
    isCurrentInTop15,
    totalParticipants: participants.length,
  };
}
