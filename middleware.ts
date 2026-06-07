import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAMES, clearAuthCookies, setAuthCookies } from '@/lib/auth-session';
import { refreshSession } from '@/lib/supabase-auth';

const PROTECTED_PREFIXES = ['/dashboard', '/studio'];
const AUTH_PREFIXES = ['/login'];
const PROTECTED_API_PREFIXES = ['/api/projects'];

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/webhooks')
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value ?? null;
  const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value ?? null;
  const expiresAtRaw = request.cookies.get(AUTH_COOKIE_NAMES.expiresAt)?.value ?? null;
  const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : 0;
  const now = Math.floor(Date.now() / 1000);

  if (!refreshToken) {
    if (isProtectedApi) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (!accessToken) {
    try {
      const session = await refreshSession(refreshToken);
      const response = NextResponse.next();
      setAuthCookies(response, session);
      return response;
    } catch {
      if (isProtectedApi) {
        const response = NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
        clearAuthCookies(response);
        return response;
      }

      const response = NextResponse.redirect(new URL('/login', request.url));
      clearAuthCookies(response);
      return response;
    }
  }

  if (isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (expiresAt && expiresAt - 60 < now) {
    try {
      const session = await refreshSession(refreshToken);
      const response = NextResponse.next();
      setAuthCookies(response, session);
      return response;
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url));
      clearAuthCookies(response);
      return response;
    }
  }

  if (isProtected || isProtectedApi) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/studio/:path*',
    '/login',
    '/api/auth/:path*',
    '/api/projects/:path*',
  ],
};
