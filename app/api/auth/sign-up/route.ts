import { NextResponse } from 'next/server';
import { z } from 'zod';
import { signUpWithPassword } from '@/lib/supabase-auth';
import { setAuthCookies } from '@/lib/auth-session';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const session = await signUpWithPassword(body.email, body.password);
    const response = NextResponse.json({
      ok: true,
      user: session.user,
      needsConfirmation: !session.access_token || !session.refresh_token,
    });

    if (session.access_token && session.refresh_token) {
      setAuthCookies(response, session);
    }
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      },
      { status: 400 }
    );
  }
}
