import { AUTH_COOKIE_NAMES } from '@/lib/auth-session';

export function getAccessTokenFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return null;
  }

  const entry = cookieHeader
    .split(';')
    .map((pair) => pair.trim())
    .find((pair) => pair.startsWith(`${AUTH_COOKIE_NAMES.accessToken}=`));

  if (!entry) {
    return null;
  }

  return decodeURIComponent(entry.slice(AUTH_COOKIE_NAMES.accessToken.length + 1));
}

export function getRefreshTokenFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return null;
  }

  const entry = cookieHeader
    .split(';')
    .map((pair) => pair.trim())
    .find((pair) => pair.startsWith(`${AUTH_COOKIE_NAMES.refreshToken}=`));

  if (!entry) {
    return null;
  }

  return decodeURIComponent(entry.slice(AUTH_COOKIE_NAMES.refreshToken.length + 1));
}

