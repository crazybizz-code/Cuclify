import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Sign in to Convora',
  description: 'Access your Convora projects.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="h-[400px] w-full rounded-xl border bg-card text-card-foreground shadow" />}>
          <AuthForm />
        </Suspense>
      </div>
    </main>
  );
}

