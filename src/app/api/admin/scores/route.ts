import { NextRequest, NextResponse } from 'next/server';
import { saveScores } from '@/lib/data/store';
import { requireAdmin } from '@/lib/utils/requireAdmin';

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { scores } = await req.json();
    if (!Array.isArray(scores)) {
      return NextResponse.json({ success: false, error: 'Scores array is required' }, { status: 400 });
    }

    const success = await saveScores(scores);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save scores' }, { status: 500 });
  }
}
