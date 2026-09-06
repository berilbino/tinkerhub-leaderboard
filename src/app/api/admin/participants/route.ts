import { NextRequest, NextResponse } from 'next/server';
import { addParticipant, addParticipantsBulk, updateParticipant, deleteParticipant } from '@/lib/data/store';
import { requireAdmin } from '@/lib/utils/requireAdmin';

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const { leaderboardId, name, names } = body;

    if (!leaderboardId) {
      return NextResponse.json({ success: false, error: 'leaderboardId is required' }, { status: 400 });
    }

    // Bulk mode
    if (Array.isArray(names)) {
      const result = await addParticipantsBulk(leaderboardId, names);
      return NextResponse.json({ success: true, ...result });
    }

    // Single participant mode
    if (!name) {
      return NextResponse.json({ success: false, error: 'name or names array is required' }, { status: 400 });
    }

    const result = await addParticipant(leaderboardId, name);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to add participant';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ success: false, error: 'id and name are required' }, { status: 400 });
    }

    const updated = await updateParticipant(id, name);
    return NextResponse.json({ success: Boolean(updated), participant: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update participant' }, { status: 500 });
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

    const deleted = await deleteParticipant(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete participant' }, { status: 500 });
  }
}
