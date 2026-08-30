export type LeaderboardStatus = 'active' | 'completed' | 'draft';

export type IllustrationKey = 
  | 'cassette' 
  | 'gameboy' 
  | 'camera' 
  | 'trophy' 
  | 'model3d'
  | 'graphicdesign'
  | 'motion'
  | 'video'
  | 'uiux'
  | 'aidesign'
  | 'animation'
  | 'webdesign'
  | 'coding'
  | 'backend'
  | 'frontend'
  | 'rocket' 
  | 'computer' 
  | 'pencil';

export interface Leaderboard {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  illustration_key: IllustrationKey;
  status: LeaderboardStatus;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  leaderboard_id: string;
  name: string;
  access_code_hash: string;
  access_code_hint: string | null;
  created_at: string;
}

export interface Round {
  id: string;
  leaderboard_id: string;
  name: string;
  round_order: number;
  max_score: number | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Score {
  id: string;
  participant_id: string;
  round_id: string;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface RankedParticipant {
  id: string;
  name: string;
  totalPoints: number;
  rank: number;
  isCurrentUser?: boolean;
  roundScores: Record<string, number>; // roundId -> score
}

export interface LeaderboardViewData {
  leaderboard: Leaderboard;
  rounds: Round[];
  publishedRounds: Round[];
  selectedRoundId: string; // 'overall' or specific roundId
  top3: RankedParticipant[];
  top15: RankedParticipant[];
  allRanked: RankedParticipant[];
  currentParticipant: RankedParticipant | null;
  currentParticipantRank: number | null;
  currentParticipantPoints: number | null;
  isCurrentInTop15: boolean;
  totalParticipants: number;
}
