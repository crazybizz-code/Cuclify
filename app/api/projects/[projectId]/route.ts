import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/supabase-auth';
import {
  getProjectById,
  normalizeProjectRow,
  updateProjectStoreConfig,
  deleteProjectRow,
} from '@/lib/project-repo';
import { normalizeProjectStoreSnapshot } from '@/lib/project-store';
import { getAccessTokenFromCookieHeader } from '@/lib/request-auth';
import { blankStoreConfig } from '@/config/blank-store-config';
import type { ProjectStatus } from '@/types';

const updateBodySchema = z.object({
  storeConfig: z.unknown(),
  status: z.enum(['draft', 'published']).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const accessToken = getAccessTokenFromCookieHeader(request.headers.get('cookie'));
    if (!accessToken) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await params;
    const project = await getProjectById(accessToken, projectId);

    if (!project) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, project: normalizeProjectRow(project) });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to load project' },
      { status: 400 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const accessToken = getAccessTokenFromCookieHeader(request.headers.get('cookie'));
    if (!accessToken) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await params;
    const body = updateBodySchema.parse(await request.json());
    const user = await getCurrentUser(accessToken);
    const snapshot = normalizeProjectStoreSnapshot(body.storeConfig, blankStoreConfig);

    const current = await getProjectById(accessToken, projectId);
    if (!current || current.user_id !== user.id) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }

    const project = await updateProjectStoreConfig(
      accessToken,
      projectId,
      snapshot,
      body.status as ProjectStatus | undefined
    );

    return NextResponse.json({ ok: true, project: normalizeProjectRow(project) });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to update project' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const accessToken = getAccessTokenFromCookieHeader(request.headers.get('cookie'));
    if (!accessToken) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await params;
    const user = await getCurrentUser(accessToken);
    const current = await getProjectById(accessToken, projectId);

    if (!current || current.user_id !== user.id) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }

    await deleteProjectRow(accessToken, projectId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to delete project' },
      { status: 400 }
    );
  }
}
