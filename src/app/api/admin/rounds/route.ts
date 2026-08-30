import { NextRequest, NextResponse } from 'next/server';
import { addRound, updateRound, deleteRound } from '@/lib/data/store';
import { requireAdmin } from '@/lib/utils/requireAdmin';

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { leaderboardId, name, maxScore } = await req.json();
    if (!leaderboardId || !name) {
      return NextResponse.json({ success: false, error: 'leaderboardId and name are required' }, { status: 400 });
    }

    const round = await addRound(leaderboardId, name, maxScore);
    return NextResponse.json({ success: true, round });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create round' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { id, ...data } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const updated = await updateRound(id, data);
    return NextResponse.json({ success: Boolean(updated), round: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update round' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const deleted = await deleteRound(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete round' }, { status: 500 });
  }
}
