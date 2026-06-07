import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAMES } from '@/lib/auth-session';
import { getCurrentUser } from '@/lib/supabase-auth';

export async function requireServerSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.accessToken)?.value ?? null;

  if (!accessToken) {
    redirect('/login');
  }

  const user = await getCurrentUser(accessToken);

  return {
    accessToken,
    user,
  };
}

