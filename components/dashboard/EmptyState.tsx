'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/i18n-context';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Rocket, Palette, Layout } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="mt-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <Card className="border-border/40 bg-card/50 backdrop-blur-xl overflow-hidden rounded-[3rem] shadow-2xl shadow-primary/5">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
            <div className="p-10 md:p-16 space-y-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                <Sparkles className="h-3 w-3" />
                Genesis Engine v1.0
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                  {t('dashboard.noProjects')}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('dashboard.noProjectsDesc')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-14 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 group">
                  <Link href="/dashboard/new">
                    {t('dashboard.createProject')}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="bg-primary/5 p-10 md:p-16 border-l border-border/40 flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-2xl bg-background shadow-lg flex items-center justify-center shrink-0 border border-border/40">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Instant Brand Identity</h4>
                    <p className="text-sm text-muted-foreground">AI generates colors, logos, and taglines tailored to your vision.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-2xl bg-background shadow-lg flex items-center justify-center shrink-0 border border-border/40">
                    <Layout className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Full Homepage Copy</h4>
                    <p className="text-sm text-muted-foreground">From hero headlines to FAQs, your content is ready from day one.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-2xl bg-background shadow-lg flex items-center justify-center shrink-0 border border-border/40">
                    <Palette className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Real-time Customization</h4>
                    <p className="text-sm text-muted-foreground">Edit everything in plain language using the high-performance Studio.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-center mt-8 text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] opacity-50">
        Trusted by 0+ creators worldwide · Secured with Supabase
      </p>
    </div>
  );
}
