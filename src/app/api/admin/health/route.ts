import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Health-check endpoint — visit /api/admin/health to verify all env vars
 * and Supabase connectivity are working on Vercel.
 * Returns a JSON report (safe — no secrets are exposed).
 */
export async function GET() {
  const checks: Record<string, boolean | string> = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_ACCESS_CODE: !!process.env.ADMIN_ACCESS_CODE,
    ADMIN_SESSION_SECRET: !!process.env.ADMIN_SESSION_SECRET,
  };

  // Test Supabase connection
  try {
    const supabase = createAdminClient();
    if (supabase) {
      const { error } = await supabase.from('leaderboards').select('id').limit(1);
      checks.supabase_connection = error ? `ERROR: ${error.message}` : 'OK';
    } else {
      checks.supabase_connection = 'SKIPPED (missing env vars)';
    }
  } catch (e: unknown) {
    checks.supabase_connection = `EXCEPTION: ${e instanceof Error ? e.message : String(e)}`;
  }

  const allGood =
    checks.NEXT_PUBLIC_SUPABASE_URL === true &&
    checks.NEXT_PUBLIC_SUPABASE_ANON_KEY === true &&
    checks.SUPABASE_SERVICE_ROLE_KEY === true &&
    checks.ADMIN_ACCESS_CODE === true &&
    checks.ADMIN_SESSION_SECRET === true &&
    checks.supabase_connection === 'OK';

  return NextResponse.json({ ok: allGood, checks }, { status: allGood ? 200 : 500 });
}
