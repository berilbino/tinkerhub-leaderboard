import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminAccessCode } from '@/lib/utils/adminAuth';
import { adminSessionMaxAge, createAdminSession } from '@/lib/utils/adminSession';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ success: false, error: 'Admin access code is required' }, { status: 400 });
    }

    if (!isValidAdminAccessCode(code)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid admin access code. Check the code and try again.' 
      }, { status: 401 });
    }

    const session = createAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Admin session is not configured. Set ADMIN_SESSION_SECRET.' }, { status: 500 });
    }

    const response = NextResponse.json({ 
      success: true, 
      admin: { email: 'admin@tinkerhub.org', role: 'admin' } 
    });

    // Set secure admin session cookie
    response.cookies.set('th_admin_session', session, {
      httpOnly: true,
      path: '/',
      maxAge: adminSessionMaxAge,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
