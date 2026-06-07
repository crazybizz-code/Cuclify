'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/contexts/i18n-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

type Mode = 'sign-in' | 'sign-up';

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = useMemo(() => searchParams.get('next') ?? '/dashboard', [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? t('auth.authFailed'));
      }

      if (payload.needsConfirmation) {
        setError(t('auth.confirmEmail'));
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('auth.authFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full border-border/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>{t('auth.welcome')}</CardTitle>
          <LanguageSwitcher />
        </div>
        <CardDescription>{t('auth.welcomeDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="sign-in" className="flex-1">
              {t('auth.signIn')}
            </TabsTrigger>
            <TabsTrigger value="sign-up" className="flex-1">
              {t('auth.signUp')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              {t('auth.email')}
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              {t('auth.password')}
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              required
            />
          </div>

          {error && (
            <p className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('auth.pleaseWait') : mode === 'sign-in' ? t('auth.signIn') : t('auth.createAccount')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
