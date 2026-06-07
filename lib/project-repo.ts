import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase-config';
import { createProjectStoreSnapshot, normalizeProjectStoreSnapshot } from '@/lib/project-store';
import { blankStoreConfig } from '@/config/blank-store-config';
import type {
  ProjectStatus,
  ProjectSummary,
  ProjectStoreSnapshot,
} from '@/types';
import type { StoreConfigInput } from '@/config/store-config.schema';

async function supabaseProjectsRequest<T>(path: string, accessToken: string, init?: RequestInit) {
  const response = await fetch(`${getSupabaseUrl()}${path}`, {
    ...init,
    headers: {
      apikey: getSupabaseAnonKey(),
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      payload?.message ??
      payload?.msg ??
      payload?.details ??
      'Supabase project request failed';
    throw new Error(message);
  }

  return payload as T;
}

export async function listProjects(accessToken: string): Promise<ProjectSummary[]> {
  return supabaseProjectsRequest<ProjectSummary[]>(
    '/rest/v1/projects?select=*&order=updated_at.desc',
    accessToken
  );
}

export async function getProjectById(
  accessToken: string,
  projectId: string
): Promise<ProjectSummary | null> {
  const payload = await supabaseProjectsRequest<ProjectSummary[]>(
    `/rest/v1/projects?id=eq.${encodeURIComponent(projectId)}&select=*`,
    accessToken
  );

  return payload[0] ?? null;
}

export async function createProjectRow(
  accessToken: string,
  userId: string,
  name: string,
  initialConfig: StoreConfigInput
): Promise<ProjectSummary> {
  const payload = await supabaseProjectsRequest<ProjectSummary[]>(
    '/rest/v1/projects?select=*',
    accessToken,
    {
      method: 'POST',
      headers: {
        Prefer: 'return=representation',
      },
      body: JSON.stringify([
        {
          user_id: userId,
          name,
          status: 'draft' satisfies ProjectStatus,
          store_config: createProjectStoreSnapshot(initialConfig, []),
        },
      ]),
    }
  );

  return payload[0] as ProjectSummary;
}

export async function updateProjectStoreConfig(
  accessToken: string,
  projectId: string,
  snapshot: ProjectStoreSnapshot,
  status?: ProjectStatus
): Promise<ProjectSummary> {
  const payload = await supabaseProjectsRequest<ProjectSummary[]>(
    `/rest/v1/projects?id=eq.${encodeURIComponent(projectId)}&select=*`,
    accessToken,
    {
      method: 'PATCH',
      headers: {
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        store_config: snapshot,
        ...(status ? { status } : {}),
      }),
    }
  );

  return payload[0] as ProjectSummary;
}

export async function deleteProjectRow(
  accessToken: string,
  projectId: string
): Promise<void> {
  await supabaseProjectsRequest<void>(
    `/rest/v1/projects?id=eq.${encodeURIComponent(projectId)}`,
    accessToken,
    {
      method: 'DELETE',
    }
  );
}

export function normalizeProjectRow(
  project: ProjectSummary
): ProjectSummary & { store_config: ProjectStoreSnapshot } {
  return {
    ...project,
    store_config: normalizeProjectStoreSnapshot(project.store_config, blankStoreConfig),
  };
}
