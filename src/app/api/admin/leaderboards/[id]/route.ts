import { NextRequest, NextResponse } from 'next/server';
import { 
  getLeaderboardById, 
  updateLeaderboard, 
  deleteLeaderboard, 
  getParticipants, 
  getRounds, 
  getScores 
} from '@/lib/data/store';
import { requireAdmin } from '@/lib/utils/requireAdmin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const leaderboard = await getLeaderboardById(id);
    if (!leaderboard) {
      return NextResponse.json({ success: false, error: 'Leaderboard not found' }, { status: 404 });
    }

    const [participants, rounds, scores] = await Promise.all([
      getParticipants(id),
      getRounds(id),
      getScores(id),
    ]);

    return NextResponse.json({
      success: true,
      leaderboard,
      participants,
      rounds,
      scores,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch leaderboard data' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateLeaderboard(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update leaderboard' }, { status: 404 });
    }
    return NextResponse.json({ success: true, leaderboard: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update leaderboard' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const deleted = await deleteLeaderboard(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete leaderboard' }, { status: 500 });
  }
}
