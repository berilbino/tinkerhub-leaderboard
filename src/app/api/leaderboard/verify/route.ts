import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboardBySlug, validateAccessCode, getLeaderboardViewData } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const { slug, code } = await req.json();
    if (!slug || !code) {
      return NextResponse.json({ success: false, error: 'Slug and access code are required' }, { status: 400 });
    }

    const leaderboard = await getLeaderboardBySlug(slug);
    if (!leaderboard) {
      return NextResponse.json({ success: false, error: 'Leaderboard not found' }, { status: 404 });
    }

    // Normal Participant Access Code check
    const participant = await validateAccessCode(leaderboard.id, code);
    if (!participant) {
      return NextResponse.json({ 
        success: false, 
        error: "That code doesn't look right. Check it and try again." 
      }, { status: 401 });
    }

    const viewData = await getLeaderboardViewData(leaderboard.id, 'overall', participant.id);

    const response = NextResponse.json({ 
      success: true, 
      participant: { id: participant.id, name: participant.name },
      viewData 
    });

    // Set secure cookie for participant session
    response.cookies.set(`th_participant_${leaderboard.id}`, participant.id, {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
