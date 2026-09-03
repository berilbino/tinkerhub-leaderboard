import { createClient } from '@supabase/supabase-js';

/**
 * Server-only database client. It is never imported by browser code and uses
 * the service-role key, which bypasses RLS without exposing that key publicly.
 */
export async function createServerSupabaseClient() {
  return createAdminClient();
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
