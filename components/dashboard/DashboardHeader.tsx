'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/i18n-context';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Plus, LayoutGrid } from 'lucide-react';

export function DashboardHeader({ userEmail }: { userEmail: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between py-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
          <LayoutGrid className="h-3.5 w-3.5" />
          Convora Workspace
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          {t('dashboard.title')}
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          {t('auth.signedInAs')} <span className="text-foreground">{userEmail}</span>
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block" />
        <Button asChild className="rounded-2xl font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all gap-2">
          <Link href="/dashboard/new">
            <Plus className="h-4 w-4" />
            {t('dashboard.createProject')}
          </Link>
        </Button>
        <SignOutButton />
      </div>
    </div>
  );
}
