'use client';

import { useState, useEffect, useRef } from 'react';
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
  HelpCircle,
  ShoppingBag,
  Layers,
  Star,
  ArrowRight,
  RefreshCw,
  Compass,
  DollarSign,
  Globe,
  Check,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavbarSkeleton,
  HeroSkeleton,
  CategoryGridSkeleton,
  ProductGridSkeleton,
  TestimonialsSkeleton,
  FaqSkeleton,
  FooterSkeleton
} from './GenesisPreviewSkeleton';

interface EventDna {
  businessType: string;
  industryTemplate: string;
  market: string;
  audience: string;
  tone: string;
  style: string;
  currency: string;
  language: string;
}

interface EventBrand {
  name: string;
  tagline: string;
  story: string;
  voice: string;
}

interface EventTheme {
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
}

interface EventCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
}

interface EventProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  inStock: boolean;
  href: string;
}

interface EventTestimonial {
  id: string;
  content: string;
  author: {
    name: string;
    title: string;
  };
  rating: number;
}

interface EventFaq {
  id: string;
  question: string;
  answer: string;
}

export function GenesisEngineForm() {
  const router = useRouter();
  const { t } = useTranslation();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Remaining duration state (starts at 12s)
  

  // Generation data gathered via events
  const [dna, setDna] = useState<EventDna | null>(null);
  const [brand, setBrand] = useState<EventBrand | null>(null);
  const [theme, setTheme] = useState<EventTheme | null>(null);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [products, setProducts] = useState<EventProduct[]>([]);
  const [testimonials, setTestimonials] = useState<EventTestimonial[]>([]);
  const [faq, setFaq] = useState<EventFaq[]>([]);
  const [blockOrder, setBlockOrder] = useState<string[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Active status variables
  const [statusStarted, setStatusStarted] = useState(false);
  const [statusDna, setStatusDna] = useState('pending'); // 'pending' | 'running' | 'completed'
  const [statusBrand, setStatusBrand] = useState('pending');
  const [statusCategories, setStatusCategories] = useState('pending');
  const [statusNavbar, setStatusNavbar] = useState('pending');
  const [statusProducts, setStatusProducts] = useState('pending');
  const [statusFaq, setStatusFaq] = useState('pending');
  const [statusLayout, setStatusLayout] = useState('pending');
  const [statusStore, setStatusStore] = useState('pending');

  const abortControllerRef = useRef<AbortController | null>(null);

  

  // Clean up controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  async function startGeneration() {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    

    // Reset data
    setDna(null);
    setBrand(null);
    setTheme(null);
    setCategories([]);
    setProducts([]);
    setTestimonials([]);
    setFaq([]);
    setBlockOrder([]);
    setProjectId(null);

    // Reset status indicators
    setStatusStarted(false);
    setStatusDna('pending');
    setStatusBrand('pending');
    setStatusCategories('pending');
    setStatusNavbar('pending');
    setStatusProducts('pending');
    setStatusFaq('pending');
    setStatusLayout('pending');
    setStatusStore('pending');

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/ai/genesis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to initialize server connection');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        throw new Error('No readable event stream received from server');
      }

      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);

              switch (event.step) {
                case 'started':
                  setStatusStarted(true);
                  setStatusDna('running');
                  break;
                case 'dna_complete':
                  setDna(event.dna);
                  setStatusDna('completed');
                  setStatusBrand('running');
                  break;
                case 'brand_complete':
                  setBrand(event.brand);
                  setTheme(event.theme);
                  setStatusBrand('completed');
                  setStatusCategories('running');
                  break;
                case 'categories_complete':
                  setCategories(event.categories);
                  setStatusCategories('completed');
                  setStatusNavbar('running');
                  setStatusProducts('running');
                  setStatusFaq('running');
                  setStatusLayout('running');
                  break;
                case 'navbar_complete':
                  setStatusNavbar('completed');
                  break;
                case 'products_complete':
                  setProducts(event.products);
                  setStatusProducts('completed');
                  break;
                case 'faq_complete':
                  setTestimonials(event.testimonials);
                  setFaq(event.faq);
                  setStatusFaq('completed');
                  break;
                case 'homepage_layout_complete':
                  setBlockOrder(event.blockOrder);
                  setStatusLayout('completed');
                  break;
                case 'store_complete':
                  setProjectId(event.projectId);
                  setStatusStore('completed');
                  
                  break;
                case 'error':
                  throw new Error(event.message || 'Generation aborted on server');
              }
            } catch (errParse) {
              console.error('[SSE] Event parse error:', errParse, trimmed);
            }
          }
        }
      }
    } catch (caught: any) {
      if (caught.name === 'AbortError') {
        console.log('[Genesis] Generation stream aborted by user request');
        return;
      }
      const message = caught instanceof Error ? caught.message : 'Generation interrupted';
      console.error('[Genesis] Generation error:', message);
      setError(message);
      setIsGenerating(false);
    }
  }

  function handleReset() {
    setError(null);
    setIsGenerating(false);
    setStatusStore('pending');
  }

  // Quick prompt presets
  const presetPrompts = [
    'Premium laptop store in Uzbekistan',
    'Minimalist custom keyboard workshop',
    'Eco-friendly organic coffee brand',
    'Bespoke leather bags and accessories',
  ];

  
  function getMilestoneStatus(id: string): 'pending' | 'active' | 'completed' {
    if (!isGenerating) return 'pending';
    switch (id) {
      case 'dna': return statusDna === 'completed' ? 'completed' : 'active';
      case 'brand': return statusBrand === 'completed' ? 'completed' : (statusBrand === 'running' ? 'active' : 'pending');
      case 'storefront': return (statusNavbar === 'completed' && statusLayout === 'completed') ? 'completed' : ((statusNavbar === 'running' || statusLayout === 'running') ? 'active' : 'pending');
      case 'categories': return statusCategories === 'completed' ? 'completed' : (statusCategories === 'running' ? 'active' : 'pending');
      case 'products': return statusProducts === 'completed' ? 'completed' : (statusProducts === 'running' ? 'active' : 'pending');
      case 'content': return statusFaq === 'completed' ? 'completed' : (statusFaq === 'running' ? 'active' : 'pending');
      case 'finalize': 
        if (statusStore === 'completed') return 'completed';
        const othersDone = statusDna === 'completed' && statusBrand === 'completed' && statusCategories === 'completed' && statusProducts === 'completed' && statusFaq === 'completed' && statusNavbar === 'completed' && statusLayout === 'completed';
        return othersDone ? 'active' : 'pending';
      default: return 'pending';
    }
  }

  const milestones = [
    { id: 'dna', label: 'Understanding business' },
    { id: 'brand', label: 'Creating brand' },
    { id: 'storefront', label: 'Designing storefront' },
    { id: 'categories', label: 'Building categories' },
    { id: 'products', label: 'Creating products' },
    { id: 'content', label: 'Writing content' },
    { id: 'finalize', label: 'Finalizing store' }
  ];

  return (
    <div className="flex-1 flex flex-col w-full min-h-0 relative overflow-hidden">
      {!isGenerating && !error ? (
        // Prompt input stage (centered view)
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/5 overflow-y-auto w-full">
          <div className="w-full max-w-2xl bg-card border border-border/40 p-8 rounded-2xl shadow-xl space-y-6 animate-in fade-in duration-500">
            <div className="space-y-2 text-center pb-4">
              <h2 className="text-2xl font-bold tracking-tight">{t('genesis.title')}</h2>
              <p className="text-sm text-muted-foreground">{t('genesis.description')}</p>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                startGeneration();
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase" htmlFor="prompt">
                  {t('genesis.promptLabel')}
                </label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('genesis.promptPlaceholder')}
                  className="min-h-[160px] resize-none text-lg p-5 focus-visible:ring-primary/20 transition-all border-border/40 bg-card/50 backdrop-blur-sm rounded-xl"
                  required
                />
              </div>

              {/* Prompt presets */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">Suggested Prompts</span>
                <div className="flex flex-wrap gap-2">
                  {presetPrompts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPrompt(preset)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border/60 hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground font-medium"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold shadow-xl hover:shadow-primary/10 hover:scale-[1.01] active:scale-[0.99] transition-all gap-2 rounded-xl"
                disabled={!prompt.trim()}
              >
                <Sparkles className="h-5 w-5 animate-pulse" />
                {t('genesis.generateButton')}
              </Button>
            </form>
          </div>
        </div>
      ) : error ? (
        // Error / Generation Interrupted Stage (centered view)
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/5 overflow-y-auto w-full">
          <div className="max-w-md w-full animate-in zoom-in-95 duration-300">
            <Card className="border-destructive/30 bg-card border shadow-xl rounded-2xl">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center border border-destructive/20 shadow-inner">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">Generation Interrupted</h4>
                  <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
                </div>
                <div className="w-full flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={handleReset}>
                    Cancel
                  </Button>
                  <Button className="flex-1 rounded-xl gap-2" onClick={startGeneration}>
                    <RefreshCw className="h-4 w-4" />
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Split-screen generation UI (Store Birth View - Workspace Layout)
        <div className="flex-1 flex h-[calc(100vh-64px)] w-full overflow-hidden min-h-0">
          
          {/* Left panel: Active AI Thinking Feed */}
          <div className="w-[30%] min-w-[320px] max-w-[420px] h-full flex flex-col border-r border-border/40 bg-card shrink-0 min-h-0 overflow-hidden select-none">
            <div className="p-6 border-b border-border/40 flex justify-between items-center bg-muted/20 shrink-0">
              <div className="flex items-center gap-2">
                <div className={cn("relative h-2 w-2 rounded-full", statusStore === 'completed' ? "bg-green-500" : "bg-primary animate-ping")} />
                <span className="text-xs font-bold uppercase tracking-widest text-foreground">Genesis Engine</span>
              </div>
              <Badge variant="secondary" className="font-mono text-xs px-2.5 py-1">
                {statusStore === 'completed' ? 'Complete' : 'Generating...'}
              </Badge>
            </div>

            <div className="flex-1 overflow-y-auto p-8 min-h-0 relative">
              <div className="absolute left-[47px] top-8 bottom-8 w-px bg-border/40" />
              <div className="space-y-8 relative">
                {milestones.map((m) => {
                  const s = getMilestoneStatus(m.id);
                  return (
                    <div key={m.id} className={cn("flex items-center gap-5 transition-all duration-500", s === 'pending' ? 'opacity-40' : 'opacity-100')}>
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card">
                        {s === 'completed' ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-500 animate-in zoom-in duration-300">
                            <Check className="h-4 w-4" />
                          </div>
                        ) : s === 'active' ? (
                          <div className="relative flex h-6 w-6 items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted" />
                        )}
                      </div>
                      <span className={cn("text-sm transition-colors", s === 'active' ? 'text-primary font-bold shadow-sm' : s === 'completed' ? 'text-foreground font-medium' : 'text-muted-foreground font-medium')}>
                        {m.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel: Progressive Store Birth Canvas */}
          <div className="w-[70%] flex-1 h-full flex flex-col bg-muted/10 relative overflow-hidden min-h-0">
            <div className="bg-muted/30 border-b border-border/40 px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interactive Live Preview</span>
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/60 inline-block" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/60 inline-block" />
                <span className="h-3 w-3 rounded-full bg-green-500/60 inline-block" />
              </div>
            </div>

            {/* Custom Theme Injector dynamically matching generated primary color */}
            {theme && (
              <style dangerouslySetInnerHTML={{
                __html: `
                  .preview-primary-bg { background-color: ${theme.colors.light.primary}; }
                  .preview-primary-text { color: ${theme.colors.light.primary}; }
                  .preview-accent-bg { background-color: ${theme.colors.light.accent}; }
                  .preview-accent-border { border-color: ${theme.colors.light.accent}; }
                  .preview-font-sans { font-family: '${theme.typography.fontSans}', sans-serif; }
                  .preview-font-serif { font-family: '${theme.typography.fontSerif}', serif; }
                `
              }} />
            )}

            {/* Scrollable store canvas container */}
            <div className="flex-1 overflow-y-auto select-none preview-font-sans divide-y divide-border/20 text-foreground transition-all duration-1000">
              
              {/* Navbar Section */}
              <div className="transition-all duration-300 ease-out">
                {statusBrand === 'completed' && brand ? (
                  <div className="bg-card/90 px-6 py-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-6">
                    <span className="font-serif italic font-extrabold text-lg preview-primary-text">{brand.name}</span>
                    <div className="hidden md:flex gap-4 text-xs font-medium text-muted-foreground">
                      <span>Home</span>
                      <span>Categories</span>
                      <span>Products</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    <Button size="sm" className="preview-primary-bg text-primary-foreground text-xs font-medium rounded-lg">
                      Shop
                    </Button>
                  </div>
                </div>
              ) : (
                <NavbarSkeleton />
                )}
              </div>

              {/* Hero Section */}
              <div className="transition-all duration-300 ease-out delay-150">
                {statusBrand === 'completed' && brand ? (
                  <div className="px-6 py-16 grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto animate-in fade-in duration-300 delay-150">
                  <div className="space-y-5">
                    <Badge variant="outline" className="preview-accent-border preview-primary-text uppercase tracking-widest text-[10px]">
                      New Release
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight preview-font-serif leading-tight">
                      {brand.tagline || 'Experience Premium Quality'}
                    </h1>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {brand.story || 'Tailored to suit your lifestyle and match your aesthetic.'}
                    </p>
                    <div className="flex gap-3">
                      <Button className="preview-primary-bg text-primary-foreground font-semibold rounded-lg">
                        Explore Shop
                      </Button>
                      <Button variant="outline" className="rounded-lg">
                        Learn More
                      </Button>
                    </div>
                  </div>
                  <div className="aspect-[4/3] rounded-2xl bg-muted/40 flex items-center justify-center border border-border/40 overflow-hidden">
                    <Compass className="h-16 w-16 text-muted-foreground/30 animate-pulse" />
                  </div>
                </div>
              ) : (
                <HeroSkeleton />
                )}
              </div>

              {/* Category Grid Section */}
              <div className="transition-all duration-300 ease-out">
                {statusCategories === 'completed' && categories.length > 0 ? (
                  <div className="px-6 py-12 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
                    <p className="text-xs text-muted-foreground">Find exactly what you are looking for</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="group border border-border/40 rounded-xl p-4 flex flex-col justify-end aspect-square bg-muted/10 hover:bg-muted/20 transition-all">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <Layers className="h-5 w-5 preview-primary-text" />
                        </div>
                        <h3 className="font-bold text-sm">{cat.name}</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 truncate">{cat.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <CategoryGridSkeleton />
                )}
              </div>

              {/* Product Grid Section */}
              <div className="transition-all duration-300 ease-out">
                {statusProducts === 'completed' && products.length > 0 ? (
                  <div className="px-6 py-12 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
                    <p className="text-xs text-muted-foreground">Handpicked items matching your premium vibe</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((prod) => (
                      <div key={prod.id} className="border border-border/40 rounded-xl p-4 space-y-3 bg-card flex flex-col justify-between hover:shadow-lg transition-all">
                        <div className="aspect-square rounded-lg bg-muted/40 flex items-center justify-center">
                          <ShoppingBag className="h-10 w-10 text-muted-foreground/20" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{prod.category}</span>
                          <h4 className="font-bold text-sm truncate">{prod.name}</h4>
                          <p className="text-[10px] text-muted-foreground truncate">{prod.description}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="font-bold text-sm text-foreground">
                            {prod.price.toLocaleString()} {prod.currency}
                          </span>
                          <Button size="sm" className="h-8 text-xs font-semibold px-3 preview-primary-bg rounded-lg">
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <ProductGridSkeleton />
                )}
              </div>

              {/* Testimonials Section */}
              <div className="transition-all duration-300 ease-out">
                {statusFaq === 'completed' && testimonials.length > 0 ? (
                  <div className="px-6 py-12 max-w-5xl mx-auto space-y-8 bg-muted/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">What Our Customers Say</h2>
                    <p className="text-xs text-muted-foreground">Read real reviews from our global community</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((test) => (
                      <div key={test.id} className="border border-border/40 rounded-xl p-5 bg-card space-y-3">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star key={starIdx} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                        <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                          "{test.content}"
                        </p>
                        <div className="pt-2">
                          <p className="font-bold text-xs">{test.author.name}</p>
                          <p className="text-[9px] text-muted-foreground">{test.author.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <TestimonialsSkeleton />
                )}
              </div>

              {/* FAQ Section */}
              <div className="transition-all duration-300 ease-out delay-150">
                {statusFaq === 'completed' && faq.length > 0 ? (
                  <div className="px-6 py-12 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
                    <p className="text-xs text-muted-foreground">Clear answers to shipping, support and billing</p>
                  </div>
                  <div className="space-y-4">
                    {faq.map((item) => (
                      <div key={item.id} className="border-b border-border/40 pb-4">
                        <h4 className="font-semibold text-xs py-2 flex justify-between items-center text-foreground cursor-pointer">
                          <span>{item.question}</span>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        </h4>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <FaqSkeleton />
                )}
              </div>

              {/* Footer Section */}
              <div className="transition-all duration-300 ease-out">
                {statusBrand === 'completed' && brand ? (
                  <div className="bg-card px-6 py-12 border-t border-border/20 text-xs text-muted-foreground space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-3">
                      <h4 className="font-serif italic font-extrabold text-base preview-primary-text">{brand.name}</h4>
                      <p className="leading-relaxed text-[10px]">{brand.tagline}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="font-semibold text-foreground">Menu</span>
                      <p>Categories</p>
                      <p>Products</p>
                    </div>
                    <div className="space-y-2">
                      <span className="font-semibold text-foreground">Legal</span>
                      <p>Terms of Service</p>
                      <p>Privacy Policy</p>
                    </div>
                    <div className="space-y-2">
                      <span className="font-semibold text-foreground">Newsletter</span>
                      <p className="text-[10px]">Join our premium list</p>
                    </div>
                  </div>
                  <div className="max-w-5xl mx-auto border-t border-border/40 pt-6 flex justify-between text-[10px]">
                    <span>© {new Date().getFullYear()} {brand.name}. All rights reserved.</span>
                  </div>
                </div>
              ) : (
                <FooterSkeleton />
                )}
              </div>

            </div>

            {/* Celebration Screen Overlay */}
            {statusStore === 'completed' && projectId && brand && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-700 z-50">
                <div className="relative h-24 w-24 mb-6">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                  <div className="relative h-24 w-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20">
                    <Check className="h-12 w-12 text-green-500" />
                  </div>
                </div>

                <div className="text-center space-y-2 max-w-md">
                  <h4 className="text-3xl font-extrabold tracking-tight text-green-500">✓ Store Created</h4>
                  <p className="text-4xl font-serif italic text-foreground font-bold pt-2">{brand.name}</p>
                </div>

                {/* Stats list */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8 p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur font-mono text-sm shadow-xl">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>6 Products Created</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>4 Categories Created</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>5 FAQs Created</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>3 Testimonials Created</span>
                  </div>
                </div>

                <Button
                  onClick={() => router.push(`/studio/${projectId}`)}
                  className="mt-10 h-14 px-8 text-lg font-semibold shadow-2xl hover:shadow-primary/20 transition-all gap-2 rounded-xl group bg-primary text-primary-foreground"
                >
                  Open Studio
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
