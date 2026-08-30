import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboardBySlug, getLeaderboardViewData } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const roundId = searchParams.get('roundId') || 'overall';
    const participantId = searchParams.get('participantId') || null;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const leaderboard = await getLeaderboardBySlug(slug);
    if (!leaderboard) {
      return NextResponse.json({ success: false, error: 'Leaderboard not found' }, { status: 404 });
    }

    const viewData = await getLeaderboardViewData(leaderboard.id, roundId, participantId);
    return NextResponse.json({ success: true, viewData });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
