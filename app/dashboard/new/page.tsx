import type { Metadata } from 'next';
import { GenesisEngineForm } from '@/components/dashboard/GenesisEngineForm';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const metadata: Metadata = {
  title: 'Create Project',
  description: 'Create a new Convora project with AI.',
};

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Workspace Header */}
      <header className="h-16 border-b border-border/40 px-6 flex items-center justify-between shrink-0 bg-card/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <span className="font-serif italic font-extrabold text-xl text-primary">Cuclify</span>
          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">Genesis Engine v2.5</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Workspace Content Area */}
      <div className="flex-1 flex flex-col relative min-h-0 overflow-hidden">
        <GenesisEngineForm />
      </div>
    </main>
  );
}
