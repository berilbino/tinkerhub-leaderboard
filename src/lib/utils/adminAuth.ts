// Admin Access Code Verification
// The admin access code MUST be set via the ADMIN_ACCESS_CODE environment variable.
// No hardcoded fallback codes exist — this ensures security.

export function isValidAdminAccessCode(code: string): boolean {
  if (!code) return false;
  const normalized = code.trim().toUpperCase();

  const envCode = (process.env.ADMIN_ACCESS_CODE || '').trim().toUpperCase();

  if (!envCode) {
    // Env var not set — deny all access to be safe
    console.error('[AdminAuth] ADMIN_ACCESS_CODE env var is not set. Admin login is disabled.');
    return false;
  }

  return normalized === envCode;
}
