import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseSession } from '@/lib/supabase-auth';

export const AUTH_COOKIE_NAMES = {
  accessToken: 'convora-access-token',
  refreshToken: 'convora-refresh-token',
  expiresAt: 'convora-expires-at',
  userId: 'convora-user-id',
  userEmail: 'convora-user-email',
} as const;

export function setAuthCookies(response: NextResponse, session: SupabaseSession) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };

  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, session.access_token, {
    ...cookieOptions,
    maxAge: session.expires_in,
  });
  response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, session.refresh_token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set(AUTH_COOKIE_NAMES.expiresAt, String(session.expires_at), {
    ...cookieOptions,
    maxAge: session.expires_in,
  });
  response.cookies.set(AUTH_COOKIE_NAMES.userId, session.user.id, {
    ...cookieOptions,
    maxAge: session.expires_in,
  });
  if (session.user.email) {
    response.cookies.set(AUTH_COOKIE_NAMES.userEmail, session.user.email, {
      ...cookieOptions,
      maxAge: session.expires_in,
    });
  }
}

export function clearAuthCookies(response: NextResponse) {
  for (const name of Object.values(AUTH_COOKIE_NAMES)) {
    response.cookies.set(name, '', {
      path: '/',
      maxAge: 0,
    });
  }
}

export function getAuthCookieSnapshot(request: NextRequest) {
  return {
    accessToken: request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value ?? null,
    refreshToken: request.cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value ?? null,
    expiresAt: request.cookies.get(AUTH_COOKIE_NAMES.expiresAt)?.value ?? null,
    userId: request.cookies.get(AUTH_COOKIE_NAMES.userId)?.value ?? null,
    userEmail: request.cookies.get(AUTH_COOKIE_NAMES.userEmail)?.value ?? null,
  };
}

