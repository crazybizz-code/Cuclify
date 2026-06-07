'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/i18n-context';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  const router = useRouter();
  const { t } = useTranslation();

  async function handleSignOut() {
    await fetch('/api/auth/sign-out', {
      method: 'POST',
    });
    router.replace('/login');
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      {t('auth.signOut')}
    </Button>
  );
}

