'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/i18n-context';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from './EmptyState';
import type { ProjectSummary } from '@/types';
import { toast } from 'sonner';

export function DashboardContent({ projects: initialProjects }: { projects: ProjectSummary[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);

  async function handleDeleteProject(id: string) {
    if (!confirm(t('dashboard.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  }

  if (projects.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="mt-12 animate-in fade-in duration-700">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onDelete={handleDeleteProject}
          />
        ))}
      </div>
    </section>
  );
}
