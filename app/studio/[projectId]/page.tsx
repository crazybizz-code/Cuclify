import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StoreConfigProvider } from '@/contexts/store-config-context';
import { blankStoreConfig } from '@/config/blank-store-config';
import { loadStoreConfig } from '@/lib/load-store-config';
import { StoreMutationStudio } from '@/components/store-studio/StoreMutationStudio';
import { getProjectById, normalizeProjectRow } from '@/lib/project-repo';
import { requireServerSession } from '@/lib/server-session';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  const { accessToken } = await requireServerSession();
  const { projectId } = await params;
  const project = await getProjectById(accessToken, projectId);

  return {
    title: project ? `${project.name} - Store Studio` : 'Store Studio',
    description: 'Project-based store editing workspace.',
  };
}

export default async function StudioProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { accessToken } = await requireServerSession();
  const { projectId } = await params;
  const project = await getProjectById(accessToken, projectId);

  if (!project) {
    notFound();
  }

  const normalizedProject = normalizeProjectRow(project);

  return (
    <StoreConfigProvider
      initialConfig={blankStoreConfig as any}
      projectId={normalizedProject.id}
      initialProjectSnapshot={normalizedProject.store_config}
    >
      <StoreMutationStudio
        projectName={normalizedProject.name}
        projectStatus={normalizedProject.status}
      />
    </StoreConfigProvider>
  );
}
