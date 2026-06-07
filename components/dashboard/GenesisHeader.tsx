'use client';

import { useTranslation } from '@/contexts/i18n-context';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function GenesisHeader() {
  const { t } = useTranslation();

  return (
    <CardHeader>
      <div className="flex items-center justify-between gap-4">
        <CardTitle>{t('genesis.title')}</CardTitle>
        <LanguageSwitcher />
      </div>
      <CardDescription>{t('genesis.description')}</CardDescription>
    </CardHeader>
  );
}
