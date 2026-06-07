'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useStoreConfig } from '@/contexts/store-config-context';
import { useTranslation } from '@/contexts/i18n-context';
import { planStoreConfigMutations } from '@/lib/store-mutation-planner';
import { HomePreview } from '@/components/preview/HomePreview';
import { ProductsPreview } from '@/components/preview/ProductsPreview';
import { CartPreview } from '@/components/preview/CartPreview';
import { CheckoutPreview } from '@/components/preview/CheckoutPreview';
import { ProductPreview } from '@/components/preview/ProductPreview';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { 
  RefreshCw, 
  SendHorizontal, 
  WandSparkles, 
  Sparkles, 
  Eye, 
  History,
  Zap,
  Layout,
  Smartphone,
  Globe
} from 'lucide-react';
import type { ProjectStatus } from '@/types';

export function StoreMutationStudio({
  projectName,
  projectStatus = 'draft',
}: {
  projectName?: string;
  projectStatus?: ProjectStatus;
} = {}) {
  const { config, applyPromptResult, resetStore, mutationError, lastPrompt } =
    useStoreConfig();
  const { t } = useTranslation();

  const PREVIEW_TABS = [
    { value: 'home', label: t('studio.preview.home'), icon: Layout },
    { value: 'products', label: t('studio.preview.products'), icon: Sparkles },
    { value: 'cart', label: t('studio.preview.cart'), icon: Zap },
    { value: 'checkout', label: t('studio.preview.checkout'), icon: WandSparkles },
    { value: 'product', label: t('studio.preview.product'), icon: Eye },
  ] as const;

  const SUGGESTIONS = [
    { key: 'premium', icon: Sparkles },
    { key: 'testimonials', icon: WandSparkles },
    { key: 'darkMode', icon: Zap },
    { key: 'products', icon: Layout },
    { key: 'conversion', icon: Zap },
  ] as const;

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePreview, setActivePreview] =
    useState<(typeof PREVIEW_TABS)[number]['value']>('home');
  const [localError, setLocalError] = useState<string | null>(null);
  const [lastMutationSummary, setLastMutationSummary] = useState<string[]>([]);

  const firstProductSlug =
    config.catalog.products.products[0]?.href.split('/').pop() ?? 'product';

  async function handleApplyPrompt(customPrompt?: string) {
    const promptToUse = customPrompt || prompt;
    if (!promptToUse.trim() || isGenerating) return;

    try {
      setIsGenerating(true);
      setLocalError(null);
      const plan = await planStoreConfigMutations(promptToUse, config);
      applyPromptResult({
        prompt: plan.prompt,
        mutations: plan.mutations,
      });
      setLastMutationSummary(plan.summary);
      if (!customPrompt) setPrompt(''); // Clear only if used from textarea
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : t('common.error'));
      setLastMutationSummary([]);
    } finally {
      setIsGenerating(false);
    }
  }

  const statusMessage = localError ?? mutationError;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-foreground">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto max-w-[1800px] px-4 py-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight">
                    {projectName || t('studio.title')}
                  </h1>
                  <Badge variant={projectStatus === 'published' ? 'default' : 'secondary'} className="rounded-full px-2 py-0 text-[10px] font-bold uppercase tracking-wider">
                    {t(`dashboard.status.${projectStatus}`)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {t('studio.subtitle')} · {t('studio.description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="h-8 w-[1px] bg-border mx-1" />
              <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-muted-foreground hover:text-foreground">
                <Smartphone className="h-4 w-4" />
                <span className="text-xs font-semibold">Mobile</span>
              </Button>
              <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-muted-foreground hover:text-foreground">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-semibold">Publish</span>
              </Button>
              <Button variant="outline" size="sm" onClick={resetStore} className="rounded-full px-4 border-primary/20 hover:bg-primary/5">
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                <span className="text-xs font-bold">{t('studio.resetStore')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1800px] gap-8 px-4 py-8 md:px-6 lg:grid-cols-[440px_minmax(0,1fr)] lg:px-8">
        {/* Ask Cuclify AI Panel */}
        <aside className="space-y-6">
          <Card className="border-border/40 bg-card shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-primary/10">
            <CardHeader className="bg-primary/5 pb-8 pt-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <WandSparkles className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">{t('studio.askAI')}</CardTitle>
              </div>
              <CardDescription className="text-sm font-medium leading-relaxed">
                {t('studio.askAIDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6 -mt-4">
              <div className="relative group">
                <Textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder={t('studio.promptPlaceholder')}
                  className="min-h-32 resize-none rounded-2xl border-border/40 bg-muted/30 p-4 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/60"
                  disabled={isGenerating}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] text-muted-foreground font-mono bg-background/50 px-1.5 py-0.5 rounded border border-border/40">⌘ + ↵</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion.key}
                      onClick={() => handleApplyPrompt(t(`studio.suggestions.${suggestion.key}`))}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95 disabled:opacity-50"
                    >
                      <suggestion.icon className="h-3 w-3" />
                      {t(`studio.suggestions.${suggestion.key}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button 
                  onClick={() => handleApplyPrompt()} 
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-1 h-12 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('studio.applying')}
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="mr-2 h-4 w-4" />
                      {t('studio.applyPrompt')}
                    </>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setPrompt('')} 
                  disabled={isGenerating}
                  className="h-12 w-12 rounded-2xl border border-border/40 text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              {statusMessage && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs font-medium text-destructive">
                    {statusMessage}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/40 backdrop-blur shadow-sm rounded-3xl overflow-hidden border-dashed">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                {t('studio.lastMutation')}
              </CardTitle>
              <CardDescription className="text-xs italic truncate">
                {lastPrompt ?? t('studio.noMutation')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              {lastMutationSummary.length > 0 ? (
                <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-hide pr-1">
                  {lastMutationSummary.map((entry) => (
                    <div key={entry} className="flex items-start gap-2 rounded-xl border border-border/40 bg-muted/20 px-3 py-2 text-[11px] font-medium leading-tight text-muted-foreground/80">
                      <Zap className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                      {entry}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground/60 italic px-2">
                  {t('studio.mutationEmpty')}
                </p>
              )}

              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-2">Snapshot Status</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border/60 text-muted-foreground/80 bg-muted/10 font-mono">
                    {config.pages.home.sections.length} SECTIONS
                  </Badge>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border/60 text-muted-foreground/80 bg-muted/10 font-mono uppercase">
                    {config.theme.colors.light.primary}
                  </Badge>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border/60 text-muted-foreground/80 bg-muted/10 font-mono uppercase">
                    v1.0.0
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Live Preview Panel */}
        <main className="space-y-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold tracking-tight text-muted-foreground/80 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Live Canvas
                </h2>
                <div className="h-4 w-[1px] bg-border" />
                <span className="text-[10px] font-bold text-primary animate-pulse flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  REAL-TIME SYNC
                </span>
              </div>
              
              <Tabs
                value={activePreview}
                onValueChange={(value) => setActivePreview(value as typeof activePreview)}
                className="w-auto"
              >
                <TabsList className="h-10 p-1 bg-muted/40 border border-border/40 rounded-xl">
                  {PREVIEW_TABS.map((tab) => (
                    <TabsTrigger 
                      key={tab.value} 
                      value={tab.value} 
                      className="px-4 py-1.5 text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all duration-200"
                    >
                      <tab.icon className="h-3.5 w-3.5 mr-2 opacity-70" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <Card className="rounded-[2.5rem] border border-border/40 bg-background shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-500 relative ring-8 ring-muted/10">
              {isGenerating && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/60 backdrop-blur-md animate-in fade-in duration-500">
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative h-20 w-24 flex items-center justify-center">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                      <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-lg font-bold tracking-tight">{t('studio.applying')}</p>
                      <p className="text-xs text-muted-foreground font-medium animate-pulse">Computing StoreConfig mutations...</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="min-h-[800px] bg-muted/5">
                {activePreview === 'home' && <HomePreview />}
                {activePreview === 'products' && <ProductsPreview />}
                {activePreview === 'cart' && <CartPreview />}
                {activePreview === 'checkout' && <CheckoutPreview />}
                {activePreview === 'product' && <ProductPreview slug={firstProductSlug} />}
              </div>
            </Card>
            
            <div className="flex justify-center pt-2">
              <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-2 bg-muted/30 px-4 py-1.5 rounded-full border border-border/40">
                <Sparkles className="h-3 w-3 text-primary/60" />
                Rendered with Cuclify Vercel D-V8 Engine · Last sync just now
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
