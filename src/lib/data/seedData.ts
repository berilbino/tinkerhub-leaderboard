// ============================================================================
// SEED DATA — Clean slate for production use.
// Admins create all leaderboards and add participants manually via the UI.
// No predefined participants or scores — the database starts empty.
// ============================================================================

import type { Leaderboard, Participant, Round, Score } from '@/types/leaderboard';

// No predefined leaderboards — admins create them via the dashboard
export const INITIAL_LEADERBOARDS: Leaderboard[] = [];

// No predefined participants — admins add participants manually
export const INITIAL_PARTICIPANTS: Participant[] = [];

// No predefined rounds/weeks — admins create them per leaderboard
export const INITIAL_ROUNDS: Round[] = [];

// No predefined scores — entered by admins week by week
export const INITIAL_SCORES: Score[] = [];
