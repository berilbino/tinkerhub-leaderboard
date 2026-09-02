import { Leaderboard, Participant, Round, Score, LeaderboardViewData } from '@/types/leaderboard';
import { INITIAL_LEADERBOARDS, INITIAL_PARTICIPANTS, INITIAL_ROUNDS, INITIAL_SCORES } from './seedData';
import { calculateRankings } from '../utils/ranking';
import { generateAccessCode, hashAccessCode, normalizeAccessCode } from '../utils/accessCode';
import { createServerSupabaseClient, createAdminClient } from '../supabase/server';

// In-Memory store for development / local demo fallback
class LocalStore {
  private leaderboards: Leaderboard[] = [...INITIAL_LEADERBOARDS];
  private participants: Participant[] = [...INITIAL_PARTICIPANTS];
  private rounds: Round[] = [...INITIAL_ROUNDS];
  private scores: Score[] = [...INITIAL_SCORES];

  getLeaderboards(): Leaderboard[] {
    return [...this.leaderboards].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getLeaderboardById(id: string): Leaderboard | null {
    return this.leaderboards.find((l) => l.id === id) || null;
  }

  getLeaderboardBySlug(slug: string): Leaderboard | null {
    return this.leaderboards.find((l) => l.slug === slug) || null;
  }

  createLeaderboard(data: { title: string; subtitle?: string | null; slug: string; illustration_key?: string }): Leaderboard {
    const newLeaderboard: Leaderboard = {
      id: crypto.randomUUID(),
      title: data.title,
      subtitle: data.subtitle || null,
      slug: data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'),
      illustration_key: (data.illustration_key as any) || 'cassette',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.leaderboards.unshift(newLeaderboard);
    return newLeaderboard;
  }

  updateLeaderboard(id: string, data: Partial<Leaderboard>): Leaderboard | null {
    const index = this.leaderboards.findIndex((l) => l.id === id);
    if (index === -1) return null;
    this.leaderboards[index] = {
      ...this.leaderboards[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.leaderboards[index];
  }

  deleteLeaderboard(id: string): boolean {
    const initialLen = this.leaderboards.length;
    this.leaderboards = this.leaderboards.filter((l) => l.id !== id);
    this.participants = this.participants.filter((p) => p.leaderboard_id !== id);
    this.rounds = this.rounds.filter((r) => r.leaderboard_id !== id);
    return this.leaderboards.length < initialLen;
  }

  getParticipants(leaderboardId: string): Participant[] {
    return this.participants
      .filter((p) => p.leaderboard_id === leaderboardId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async addParticipant(leaderboardId: string, name: string): Promise<{ participant: Participant; accessCode: string }> {
    const accessCode = generateAccessCode('TH', 5);
    const access_code_hash = await hashAccessCode(accessCode);
    
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      leaderboard_id: leaderboardId,
      name: name.trim(),
      access_code_hash,
      access_code_hint: accessCode, // stored for admin copy convenience in demo
      created_at: new Date().toISOString(),
    };
    this.participants.push(newParticipant);
    return { participant: newParticipant, accessCode };
  }

  updateParticipant(id: string, name: string): Participant | null {
    const p = this.participants.find((item) => item.id === id);
    if (!p) return null;
    p.name = name.trim();
    return p;
  }

  deleteParticipant(id: string): boolean {
    const initialLen = this.participants.length;
    this.participants = this.participants.filter((p) => p.id !== id);
    this.scores = this.scores.filter((s) => s.participant_id !== id);
    return this.participants.length < initialLen;
  }

  getRounds(leaderboardId: string): Round[] {
    return this.rounds
      .filter((r) => r.leaderboard_id === leaderboardId)
      .sort((a, b) => a.round_order - b.round_order);
  }

  addRound(leaderboardId: string, name: string, maxScore?: number | null): Round {
    const existing = this.getRounds(leaderboardId);
    const newRound: Round = {
      id: crypto.randomUUID(),
      leaderboard_id: leaderboardId,
      name: name.trim(),
      round_order: existing.length + 1,
      max_score: maxScore ?? 20,
      published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.rounds.push(newRound);
    return newRound;
  }

  updateRound(id: string, data: Partial<Round>): Round | null {
    const index = this.rounds.findIndex((r) => r.id === id);
    if (index === -1) return null;
    this.rounds[index] = {
      ...this.rounds[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.rounds[index];
  }

  deleteRound(id: string): boolean {
    const initialLen = this.rounds.length;
    this.rounds = this.rounds.filter((r) => r.id !== id);
    this.scores = this.scores.filter((s) => s.round_id !== id);
    return this.rounds.length < initialLen;
  }

  getScores(leaderboardId: string): Score[] {
    const roundIds = new Set(this.getRounds(leaderboardId).map((r) => r.id));
    return this.scores.filter((s) => roundIds.has(s.round_id));
  }

  saveScores(scoreUpdates: { participant_id: string; round_id: string; score: number }[]): boolean {
    for (const update of scoreUpdates) {
      const existingIndex = this.scores.findIndex(
        (s) => s.participant_id === update.participant_id && s.round_id === update.round_id
      );
      if (existingIndex !== -1) {
        this.scores[existingIndex].score = Number(update.score);
        this.scores[existingIndex].updated_at = new Date().toISOString();
      } else {
        this.scores.push({
          id: crypto.randomUUID(),
          participant_id: update.participant_id,
          round_id: update.round_id,
          score: Number(update.score),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }
    return true;
  }

  async validateAccessCode(leaderboardId: string, rawCode: string): Promise<Participant | null> {
    const normalized = normalizeAccessCode(rawCode);
    const hash = await hashAccessCode(normalized);
    const participant = this.participants.find(
      (p) => p.leaderboard_id === leaderboardId && (p.access_code_hash === hash || (p.access_code_hint && normalizeAccessCode(p.access_code_hint) === normalized))
    );
    return participant || null;
  }
}

// Global Singleton for local mock store
declare global {
  var __localStoreInstance: LocalStore | undefined;
}

const localStore: LocalStore = global.__localStoreInstance || new LocalStore();
if (process.env.NODE_ENV !== 'production') {
  global.__localStoreInstance = localStore;
}

function hasSupabaseConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Public API
export async function getLeaderboards(): Promise<Leaderboard[]> {
  if (!hasSupabaseConfig()) {
    return localStore.getLeaderboards();
  }
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error('Supabase is configured but the server client could not be created');
  const { data, error } = await supabase.from('leaderboards').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  if (!data) return [];
  return data as Leaderboard[];
}

export async function getLeaderboardBySlug(slug: string): Promise<Leaderboard | null> {
  if (!hasSupabaseConfig()) {
    return localStore.getLeaderboardBySlug(slug);
  }
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error('Supabase is configured but the server client could not be created');
  const { data, error } = await supabase.from('leaderboards').select('*').eq('slug', slug).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Leaderboard) || null;
}

export async function getLeaderboardById(id: string): Promise<Leaderboard | null> {
  if (!hasSupabaseConfig()) {
    return localStore.getLeaderboardById(id);
  }
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error('Supabase is configured but the server client could not be created');
  const { data, error } = await supabase.from('leaderboards').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Leaderboard) || null;
}

export async function createLeaderboard(data: { title: string; subtitle?: string | null; slug: string; illustration_key?: string }): Promise<Leaderboard> {
  if (!hasSupabaseConfig()) {
    return localStore.createLeaderboard(data);
  }
  const supabase = createAdminClient();
  if (!supabase) throw new Error('Supabase service-role credentials are not configured');
  const { data: created, error } = await supabase.from('leaderboards').insert({
    title: data.title,
    subtitle: data.subtitle || null,
    slug: data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'),
    illustration_key: data.illustration_key || 'cassette',
    status: 'active',
  }).select().single();
  if (error || !created) throw new Error(error?.message || 'Failed to create leaderboard');
  return created as Leaderboard;
}

export async function updateLeaderboard(id: string, data: Partial<Leaderboard>): Promise<Leaderboard | null> {
  if (!hasSupabaseConfig()) {
    return localStore.updateLeaderboard(id, data);
  }
  const supabase = createAdminClient();
  if (!supabase) throw new Error('Supabase service-role credentials are not configured');
  const { data: updated, error } = await supabase.from('leaderboards').update(data).eq('id', id).select().single();
  if (error || !updated) throw new Error(error?.message || 'Failed to update leaderboard');
  return updated as Leaderboard;
}

export async function deleteLeaderboard(id: string): Promise<boolean> {
  if (!hasSupabaseConfig()) {
    return localStore.deleteLeaderboard(id);
  }
  const supabase = createAdminClient();
  if (!supabase) throw new Error('Supabase service-role credentials are not configured');
  const { error } = await supabase.from('leaderboards').delete().eq('id', id);
  return !error;
}

export async function getParticipants(leaderboardId: string): Promise<Participant[]> {
  if (!hasSupabaseConfig()) {
    return localStore.getParticipants(leaderboardId);
  }
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error('Supabase is configured but the server client could not be created');
  const { data, error } = await supabase.from('participants').select('*').eq('leaderboard_id', leaderboardId).order('name');
  if (error) throw new Error(error.message);
  return (data as Participant[]) || [];
}

export async function addParticipant(leaderboardId: string, name: string): Promise<{ participant: Participant; accessCode: string }> {
  const leaderboard = await getLeaderboardById(leaderboardId);
  if (!leaderboard) throw new Error('Leaderboard not found');
  const prefix = leaderboard.slug.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase() || 'TH';
  const accessCode = generateAccessCode(prefix, 5);
  const access_code_hash = await hashAccessCode(accessCode);

  if (!hasSupabaseConfig()) {
    return localStore.addParticipant(leaderboardId, name);
  }
  const supabase = createAdminClient();
  if (!supabase) throw new Error('Supabase service-role credentials are not configured');
  const { data, error } = await supabase.from('participants').insert({
    leaderboard_id: leaderboardId,
    name: name.trim(),
    access_code_hash,
    access_code_hint: accessCode,
  }).select().single();
  if (error || !data) throw new Error(error?.message || 'Failed to add participant');
  return { participant: data as Participant, accessCode };
}

export async function updateParticipant(id: string, name: string): Promise<Participant | null> {
  if (!hasSupabaseConfig()) {
    return localStore.updateParticipant(id, name);
  }
  const supabase = createAdminClient();
  if (!supabase) throw new Error('Supabase service-role credentials are not configured');
  const { data, error } = await supabase.from('participants').update({ name: name.trim() }).eq('id', id).select().single();
  if (error || !data) throw new Error(error?.message || 'Failed to update participant');
  return data as Participant;
}

export async function deleteParticipant(id: string): Promise<boolean> {
  if (!hasSupabaseConfig()) {
    return localStore.deleteParticipant(id);
  }
  const supabase = createAdminClient();
  if (!supabase) throw new Error('Supabase service-role credentials are not configured');
  const { error } = await supabase.from('participants').delete().eq('id', id);
  return !error;
}

export async function getRounds(leaderboardId: string): Promise<Round[]> {
  if (!hasSupabaseConfig()) {
    return localStore.getRounds(leaderboardId);
  }
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error('Supabase is configured but the server client could not be created');
  const { data, error } = await supabase.from('rounds').select('*').eq('leaderboard_id', leaderboardId).order('round_order');
  if (error) throw new Error(error.message);
  return (data as Round[]) || [];
}

export async function addRound(leaderboardId: string, name: string, maxScore?: number | null): Promise<Round> {
  if (!hasSupabaseConfig()) {
    return localStore.addRound(leaderboardId, name, maxScore);
  }
  const supabase = createAdminClient();
  if (!supabase) throw new Error('Supabase service-role credentials are not configured');
  const existing = await getRounds(leaderboardId);
  const { data, error } = await supabase.from('rounds').insert({
    leaderboard_id: leaderboardId,
    name: name.trim(),
    round_order: existing.length + 1,
    max_score: maxScore ?? 20,
    published: false,
  }).select().single();
  if (error || !data) throw new Error(error?.message || 'Failed to create round');
  return data as Round;
}

export async function updateRound(id: string, data: Partial<Round>): Promise<Round | null> {
  if (!hasSupabaseConfig()) {
    return localStore.updateRound(id, data);
  }
  const supabase = createAdminClient();
  if (!supabase) throw new Error('Supabase service-role credentials are not configured');
  const { data: updated, error } = await supabase.from('rounds').update(data).eq('id', id).select().single();
  if (error || !updated) throw new Error(error?.message || 'Failed to update round');
  return updated as Round;
}

export async function deleteRound(id: string): Promise<boolean> {
  if (!hasSupabaseConfig()) {
    return localStore.deleteRound(id);
  }
  const supabase = createAdminClient();
  if (!supabase) throw new Error('Supabase service-role credentials are not configured');
  const { error } = await supabase.from('rounds').delete().eq('id', id);
  return !error;
}

export async function getScores(leaderboardId: string): Promise<Score[]> {
  if (!hasSupabaseConfig()) {
    return localStore.getScores(leaderboardId);
  }
  const rounds = await getRounds(leaderboardId);
  const roundIds = rounds.map((r) => r.id);
  if (roundIds.length === 0) return [];
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error('Supabase is configured but the server client could not be created');
  const { data, error } = await supabase.from('scores').select('*').in('round_id', roundIds);
  if (error) throw new Error(error.message);
  return (data as Score[]) || [];
}

export async function saveScores(scoresToSave: { participant_id: string; round_id: string; score: number }[]): Promise<boolean> {
  if (!hasSupabaseConfig()) {
    return localStore.saveScores(scoresToSave);
  }
  const supabase = createAdminClient();
  if (!supabase) throw new Error('Supabase service-role credentials are not configured');
  const { error } = await supabase.from('scores').upsert(
    scoresToSave.map((s) => ({
      participant_id: s.participant_id,
      round_id: s.round_id,
      score: s.score,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: 'participant_id,round_id' }
  );
  return !error;
}

export async function validateAccessCode(leaderboardId: string, rawCode: string): Promise<Participant | null> {
  if (!hasSupabaseConfig()) {
    return localStore.validateAccessCode(leaderboardId, rawCode);
  }
  const normalized = normalizeAccessCode(rawCode);
  const hash = await hashAccessCode(normalized);
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error('Supabase is configured but the server client could not be created');
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('leaderboard_id', leaderboardId)
    .or(`access_code_hash.eq.${hash},access_code_hint.eq.${normalized}`)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return (data as Participant) || null;
}

export async function getLeaderboardViewData(
  slugOrId: string,
  selectedRoundId: string = 'overall',
  currentParticipantId?: string | null
): Promise<LeaderboardViewData | null> {
  let leaderboard: Leaderboard | null = null;
  if (slugOrId.includes('-') && slugOrId.length > 20) {
    leaderboard = await getLeaderboardById(slugOrId);
  }
  if (!leaderboard) {
    leaderboard = await getLeaderboardBySlug(slugOrId);
  }
  if (!leaderboard) return null;

  const [participants, rounds, scores] = await Promise.all([
    getParticipants(leaderboard.id),
    getRounds(leaderboard.id),
    getScores(leaderboard.id),
  ]);

  return calculateRankings(leaderboard, participants, rounds, scores, selectedRoundId, currentParticipantId);
}
