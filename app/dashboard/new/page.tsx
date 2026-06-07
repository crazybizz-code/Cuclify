import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { GenesisEngineForm } from '@/components/dashboard/GenesisEngineForm';
import { GenesisHeader } from '@/components/dashboard/GenesisHeader';

export const metadata: Metadata = {
  title: 'Create Project',
  description: 'Create a new Convora project with AI.',
};

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="mx-auto w-full max-w-lg">
        <Card className="border-border/60 shadow-sm">
          <GenesisHeader />
          <CardContent>
            <GenesisEngineForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
