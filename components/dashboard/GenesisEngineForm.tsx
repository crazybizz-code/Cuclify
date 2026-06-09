'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/i18n-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Search, 
  Palette, 
  Type, 
  Layout, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenesisData {
  analysis: {
    industry: string;
    audience: string;
    style: string;
  };
  brand: {
    name: string;
    tagline: string;
  };
  theme: {
    colors: {
      light: {
        primary: string;
        accent: string;
      };
    };
    typography: {
      fontSans: string;
      fontSerif: string;
    };
  };
}

const STEPS = [
  { id: 'dna', label: 'Understanding your business...' },
  { id: 'brand', label: 'Creating your brand...' },
  { id: 'design', label: 'Designing your store...' },
  { id: 'categories', label: 'Generating categories...' },
  { id: 'products', label: 'Generating products...' },
  { id: 'copy', label: 'Writing copy...' },
  { id: 'final', label: 'Finalizing experience...' },
] as const;

export function GenesisEngineForm() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [genesisData, setGenesisData] = useState<GenesisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Auto-advance logic for revealing generated data
  useEffect(() => {
    if (genesisData && currentStepIndex < STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [genesisData, currentStepIndex]);

  // Handle final redirection
  useEffect(() => {
    if (currentStepIndex === STEPS.length - 1 && projectId) {
      const timer = setTimeout(() => {
        router.push(`/studio/${projectId}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, projectId, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setCurrentStepIndex(0); // Start with Step 1
    setError(null);
    setGenesisData(null);

    try {
      const response = await fetch('/api/ai/genesis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || t('common.error'));
      }

      setGenesisData(payload.genesis);
      setProjectId(payload.project.id);
      // Logic in useEffect will handle the step transitions
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : t('common.error');
      console.error('[Genesis] Client error:', message);
      setError(message);
      setIsGenerating(false);
      // Do NOT reset currentStepIndex — keep the UI where it was so
      // the error banner is visible in the loading view.
      // setCurrentStepIndex(-1) was the bug: it hid the error branch.
    }
  }

  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="space-y-8">
      {!isGenerating ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="prompt">
              {t('genesis.promptLabel')}
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('genesis.promptPlaceholder')}
              className="min-h-[160px] resize-none text-lg p-4 focus-visible:ring-primary/20 transition-all border-border/40"
              disabled={isGenerating}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold shadow-xl hover:shadow-primary/10 transition-all gap-2"
            disabled={!prompt.trim()}
          >
            <Sparkles className="h-5 w-5" />
            {t('genesis.generateButton')}
          </Button>
        </form>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Progress Indicator */}
          <div className="flex justify-between items-center px-2">
            {STEPS.map((step, index) => (
              <div 
                key={step.id} 
                className={cn(
                  "h-1.5 flex-1 mx-1 rounded-full transition-all duration-1000",
                  index <= currentStepIndex ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-muted"
                )} 
              />
            ))}
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              {currentStepIndex === STEPS.length - 1 ? "Creation Complete" : STEPS[currentStepIndex].label}
            </h3>
            <p className="text-muted-foreground animate-pulse">
              {currentStepIndex === 0 && "Analyzing requirements & Store DNA..."}
              {currentStepIndex === 1 && "Identity & Brand Voice established."}
              {currentStepIndex === 2 && "Visual color palette & typography chosen."}
              {currentStepIndex === 3 && "Product categories generated."}
              {currentStepIndex === 4 && "Catalog products and prices populated."}
              {currentStepIndex === 5 && "Reviews and FAQs written in Store language."}
              {currentStepIndex === 6 && "Redirecting to your new studio..."}
            </p>
          </div>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden min-h-[340px]">
            <CardContent className="p-8 space-y-8">
              
              {/* Step 0: Analysis */}
              <div className={cn(
                "space-y-4 transition-all duration-700",
                currentStepIndex >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute"
              )}>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
                  <Search className="h-4 w-4" />
                  Insight Detected
                </div>
                {genesisData ? (
                  <div className="grid grid-cols-3 gap-4 animate-in zoom-in-95 duration-500">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Industry</p>
                      <p className="font-medium">{genesisData.analysis.industry}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Audience</p>
                      <p className="font-medium">{genesisData.analysis.audience}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Style</p>
                      <p className="font-medium">{genesisData.analysis.style}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
                    <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
                    <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
                  </div>
                )}
              </div>

              {/* Step 1: Brand */}
              <div className={cn(
                "space-y-4 transition-all duration-700",
                currentStepIndex >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute"
              )}>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 border-t border-border/40 pt-6">
                  <Sparkles className="h-4 w-4" />
                  Brand Identity
                </div>
                {genesisData && currentStepIndex >= 1 && (
                  <div className="animate-in slide-in-from-left-4 duration-500">
                    <h4 className="text-3xl font-serif italic text-primary">{genesisData.brand.name}</h4>
                    <p className="text-muted-foreground">{genesisData.brand.tagline}</p>
                  </div>
                )}
              </div>

              {/* Step 2: Visuals */}
              <div className={cn(
                "space-y-4 transition-all duration-700",
                currentStepIndex >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute"
              )}>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 border-t border-border/40 pt-6">
                  <Palette className="h-4 w-4" />
                  Visual DNA
                </div>
                {genesisData && currentStepIndex >= 2 && (
                  <div className="flex items-center gap-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex gap-2">
                      <div 
                        className="h-10 w-10 rounded-full border border-border/20 shadow-inner" 
                        style={{ backgroundColor: genesisData.theme.colors.light.primary }}
                      />
                      <div 
                        className="h-10 w-10 rounded-full border border-border/20 shadow-inner" 
                        style={{ backgroundColor: genesisData.theme.colors.light.accent }}
                      />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/40">
                      <Type className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{genesisData.theme.typography.fontSerif}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Categories */}
              <div className={cn(
                "space-y-4 transition-all duration-700",
                currentStepIndex >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute"
              )}>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 border-t border-border/40 pt-6">
                  <Layout className="h-4 w-4" />
                  E-commerce Categories
                </div>
                {currentStepIndex >= 3 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in duration-500">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    4 product categories initialized
                  </div>
                )}
              </div>

              {/* Step 4: Products */}
              <div className={cn(
                "space-y-4 transition-all duration-700",
                currentStepIndex >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute"
              )}>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 border-t border-border/40 pt-6">
                  <Sparkles className="h-4 w-4" />
                  Product Catalog
                </div>
                {currentStepIndex >= 4 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in duration-500">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    6 bespoke products added to store
                  </div>
                )}
              </div>

              {/* Step 5: Copywriting */}
              <div className={cn(
                "space-y-4 transition-all duration-700",
                currentStepIndex >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute"
              )}>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 border-t border-border/40 pt-6">
                  <Type className="h-4 w-4 text-muted-foreground" />
                  Store Copy & FAQs
                </div>
                {currentStepIndex >= 5 && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-1000">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      3 Testimonials completed
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      5 E-commerce FAQs written
                    </div>
                  </div>
                )}
              </div>

              {/* Final Success Animation */}
              {currentStepIndex === 6 && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                  <div className="relative h-24 w-24 mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                    <div className="relative h-24 w-24 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40">
                      <Trophy className="h-12 w-12 text-primary-foreground animate-in zoom-in-50 duration-700" />
                    </div>
                  </div>
                  <h4 className="text-3xl font-bold tracking-tight mb-2">Success!</h4>
                  <p className="text-muted-foreground text-center max-w-xs">
                    Your premium store is ready. Let's start building the future of {genesisData?.analysis.industry.toLowerCase()}.
                  </p>
                  <Button variant="link" className="mt-4 gap-1 text-primary group" asChild>
                    <span>
                      Take me to Studio
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>

        {error && (
          <p className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center gap-2 animate-in bounce-in duration-300">
            <span className="font-bold">Error:</span> {error}
          </p>
        )}
      </div>
    )}

    {/* Error shown outside isGenerating branch so it appears when form resets */}
    {!isGenerating && error && (
      <p className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center gap-2 animate-in bounce-in duration-300">
        <span className="font-bold">Error:</span> {error}
      </p>
    )}
  </div>
  );
}
