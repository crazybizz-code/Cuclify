import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase-config';

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: {
    id: string;
    email?: string | null;
  };
}

export interface SupabaseUser {
  id: string;
  email?: string | null;
}

async function supabaseRequest(path: string, init: RequestInit) {
  const response = await fetch(`${getSupabaseUrl()}${path}`, {
    ...init,
    headers: {
      apikey: getSupabaseAnonKey(),
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      payload?.msg ??
      payload?.error_description ??
      payload?.message ??
      'Supabase request failed';
    throw new Error(message);
  }

  return payload;
}

export async function signInWithPassword(email: string, password: string) {
  const payload = await supabaseRequest('/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return normalizeSession(payload);
}

export async function signUpWithPassword(email: string, password: string) {
  const payload = await supabaseRequest('/auth/v1/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return normalizeSession(payload);
}

export async function refreshSession(refreshToken: string) {
  const payload = await supabaseRequest('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  return normalizeSession(payload);
}

export async function getCurrentUser(accessToken: string): Promise<SupabaseUser> {
  const payload = await supabaseRequest('/auth/v1/user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    id: payload.id,
    email: payload.email,
  };
}

export async function signOut(accessToken: string) {
  await supabaseRequest('/auth/v1/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scope: 'global' }),
  });
}

function normalizeSession(payload: any): SupabaseSession {
  if (!payload) {
    throw new Error('Empty Supabase auth response');
  }

  return {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    expires_in: payload.expires_in,
    expires_at:
      payload.expires_at ??
      Math.floor(Date.now() / 1000) + Number(payload.expires_in ?? 3600),
    token_type: payload.token_type ?? 'bearer',
    user: {
      id: payload.user?.id ?? payload.user?.sub ?? '',
      email: payload.user?.email ?? null,
    },
  };
}

