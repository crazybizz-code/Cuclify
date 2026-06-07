import type { Metadata } from 'next';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { listProjects } from '@/lib/project-repo';
import { requireServerSession } from '@/lib/server-session';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your Convora projects.',
};

export default async function DashboardPage() {
  const { accessToken, user } = await requireServerSession();
  const projects = await listProjects(accessToken);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader userEmail={user.email ?? user.id} />
        <DashboardContent projects={projects} />
      </div>
    </main>
  );
}
