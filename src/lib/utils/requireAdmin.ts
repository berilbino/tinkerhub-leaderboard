import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminSession } from './adminSession';

/**
 * Guards server-side mutation endpoints. The cookie is only issued after a
 * successful admin-code verification and is HttpOnly, so it cannot be forged
 * by browser JavaScript.
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  if (isValidAdminSession(request.cookies.get('th_admin_session')?.value)) {
    return null;
  }
  return NextResponse.json({ success: false, error: 'Admin authentication required' }, { status: 401 });
}
