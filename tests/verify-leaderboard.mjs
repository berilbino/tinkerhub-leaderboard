// Automated Verification Script for TinkerHub Leaderboard Platform
import { calculateRankings } from '../src/lib/utils/ranking.ts';
import { generateAccessCode, normalizeAccessCode, hashAccessCode } from '../src/lib/utils/accessCode.ts';
import { isValidAdminAccessCode } from '../src/lib/utils/adminAuth.ts';
import { INITIAL_LEADERBOARDS, INITIAL_PARTICIPANTS, INITIAL_ROUNDS, INITIAL_SCORES } from '../src/lib/data/seedData.ts';

async function runTests() {
  console.log('--- 1. Testing Common Admin Access Code ---');
  if (!isValidAdminAccessCode('TINKER-ADMIN-2026')) {
    throw new Error('TINKER-ADMIN-2026 should be valid admin access code');
  }
  if (!isValidAdminAccessCode('ADMIN2026')) {
    throw new Error('ADMIN2026 should be valid admin access code');
  }
  if (isValidAdminAccessCode('WRONG-CODE-123')) {
    throw new Error('WRONG-CODE-123 should be rejected');
  }
  console.log('✓ Common Admin Access Codes verified successfully');

  console.log('\n--- 2. Testing Dense Ranking with Ties (1, 1, 2, 3, 4, 4, 5) ---');
  const tieParticipants = [
    { id: 't1', leaderboard_id: '1', name: 'Beril Bino', access_code_hash: 'a', access_code_hint: 'a', created_at: '' },
    { id: 't2', leaderboard_id: '1', name: 'Rahul Nair', access_code_hash: 'b', access_code_hint: 'b', created_at: '' },
    { id: 't3', leaderboard_id: '1', name: 'Hethal George', access_code_hash: 'c', access_code_hint: 'c', created_at: '' },
    { id: 't4', leaderboard_id: '1', name: 'Fourth Person', access_code_hash: 'd', access_code_hint: 'd', created_at: '' },
    { id: 't5', leaderboard_id: '1', name: 'P K Sethumadhavan', access_code_hash: 'e', access_code_hint: 'e', created_at: '' },
    { id: 't6', leaderboard_id: '1', name: 'Alan P Raju', access_code_hash: 'f', access_code_hint: 'f', created_at: '' },
  ];
  const tieRounds = [{ id: 'tr1', leaderboard_id: '1', name: 'W1', round_order: 1, max_score: 200, published: true, created_at: '', updated_at: '' }];
  const tieScores = [
    { id: 'ts1', participant_id: 't1', round_id: 'tr1', score: 132, created_at: '', updated_at: '' },
    { id: 'ts2', participant_id: 't2', round_id: 'tr1', score: 132, created_at: '', updated_at: '' },
    { id: 'ts3', participant_id: 't3', round_id: 'tr1', score: 128, created_at: '', updated_at: '' },
    { id: 'ts4', participant_id: 't4', round_id: 'tr1', score: 120, created_at: '', updated_at: '' },
    { id: 'ts5', participant_id: 't5', round_id: 'tr1', score: 118, created_at: '', updated_at: '' },
    { id: 'ts6', participant_id: 't6', round_id: 'tr1', score: 118, created_at: '', updated_at: '' },
  ];
  const tieView = calculateRankings(INITIAL_LEADERBOARDS[0], tieParticipants, tieRounds, tieScores, 'overall');
  console.log(`Tied ranks result: ${tieView.allRanked.map((p) => `${p.name}: Rank #${p.rank} (${p.totalPoints}pts)`).join(', ')}`);
  
  if (tieView.allRanked[0].rank !== 1 || tieView.allRanked[1].rank !== 1) {
    throw new Error('Both Beril and Rahul with 132pts should be Rank 1');
  }
  if (tieView.allRanked[2].rank !== 2) {
    throw new Error('Hethal with 128pts should be Rank 2');
  }
  if (tieView.allRanked[3].rank !== 3) {
    throw new Error('Fourth Person with 120pts should be Rank 3');
  }
  if (tieView.allRanked[4].rank !== 4 || tieView.allRanked[5].rank !== 4) {
    throw new Error('P K Sethumadhavan and Alan with 118pts should be Rank 4');
  }
  console.log('✓ Dense ranking without skipped ranks verified!');

  console.log('\n--- 3. Testing Podium & List Split ---');
  const podium = tieView.allRanked.slice(0, 3);
  const list = tieView.allRanked.slice(3, 15);
  console.log(`Podium: ${podium.map((p) => `${p.name} (#${p.rank})`).join(', ')}`);
  console.log(`List starts from 4th person: ${list.map((p) => `${p.name} (#${p.rank})`).join(', ')}`);

  if (list[0].name !== 'Fourth Person' || list.length !== 3) {
    throw new Error('List must start immediately with the 4th person without skipping');
  }
  console.log('✓ List slicing verified successfully!');

  console.log('\n ALL TESTS PASSED SUCCESSFULLY! ');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
