import { NextResponse } from 'next/server';
import { signOut } from '@/lib/supabase-auth';
import { clearAuthCookies, getAuthCookieSnapshot } from '@/lib/auth-session';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') ?? '';
    const accessToken = cookieHeader
      .split(';')
      .map((pair) => pair.trim())
      .find((pair) => pair.startsWith('convora-access-token='))
      ?.split('=')[1];

    if (accessToken) {
      await signOut(accessToken);
    }

    const response = NextResponse.json({ ok: true });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      },
      { status: 400 }
    );
    clearAuthCookies(response);
    return response;
  }
}

