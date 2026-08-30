import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboards, createLeaderboard } from '@/lib/data/store';
import { requireAdmin } from '@/lib/utils/requireAdmin';

export async function GET(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const leaderboards = await getLeaderboards();
    return NextResponse.json({ success: true, leaderboards });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch leaderboards' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const { title, subtitle, slug, illustration_key } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'Title and slug are required' }, { status: 400 });
    }

    const leaderboard = await createLeaderboard({
      title,
      subtitle,
      slug,
      illustration_key,
    });

    return NextResponse.json({ success: true, leaderboard });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create leaderboard' }, { status: 500 });
  }
}
