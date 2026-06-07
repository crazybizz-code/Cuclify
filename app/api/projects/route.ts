import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/supabase-auth';
import { createProjectRow, listProjects } from '@/lib/project-repo';
import { getAccessTokenFromCookieHeader } from '@/lib/request-auth';
import { storeConfig } from '@/config/store-config';
import { blankStoreConfig } from '@/config/blank-store-config';

const createBodySchema = z.object({
  name: z.string().min(1).max(120),
});

export async function GET(request: Request) {
  try {
    const accessToken = getAccessTokenFromCookieHeader(request.headers.get('cookie'));
    if (!accessToken) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await listProjects(accessToken);
    return NextResponse.json({ ok: true, projects });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to load projects' },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const accessToken = getAccessTokenFromCookieHeader(request.headers.get('cookie'));
    if (!accessToken) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = createBodySchema.parse(await request.json());
    const user = await getCurrentUser(accessToken);
    const project = await createProjectRow(
      accessToken,
      user.id,
      body.name,
      blankStoreConfig
    );

    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to create project' },
      { status: 400 }
    );
  }
}
