import { NextResponse } from 'next/server';
import { z } from 'zod';
import { signInWithPassword } from '@/lib/supabase-auth';
import { setAuthCookies } from '@/lib/auth-session';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const session = await signInWithPassword(body.email, body.password);
    const response = NextResponse.json({
      ok: true,
      user: session.user,
    });

    setAuthCookies(response, session);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      },
      { status: 400 }
    );
  }
}

