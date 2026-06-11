'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Zap,
  Layout,
  Smartphone,
  Globe,
  Loader2,
  Bot,
  User,
  ChevronDown,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Package,
} from 'lucide-react';
import type { ProjectStatus } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

type MessageRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  summary?: string[];
  timestamp: Date;
  status?: 'pending' | 'done' | 'error';
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SUGGESTION_CHIPS = [
  { label: 'Make it premium', icon: Sparkles },
  { label: 'Add testimonials', icon: WandSparkles },
  { label: 'Create dark mode', icon: Zap },
  { label: 'Generate products', icon: ShoppingBag },
  { label: 'Improve conversion', icon: Layout },
] as const;

const PREVIEW_TABS = [
  { value: 'home', label: 'Home', icon: LayoutDashboard },
  { value: 'products', label: 'Products', icon: ShoppingBag },
  { value: 'cart', label: 'Cart', icon: ShoppingCart },
  { value: 'checkout', label: 'Checkout', icon: CreditCard },
  { value: 'product', label: 'Product', icon: Package },
] as const;

type PreviewTab = (typeof PREVIEW_TABS)[number]['value'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function AssistantTypingBubble() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-muted/60 border border-border/40 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex items-end gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser && 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-sm',
          isUser
            ? 'bg-accent text-accent-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Bot className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Bubble */}
      <div className={cn('flex flex-col gap-1.5 max-w-[82%]', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'rounded-br-sm bg-primary text-primary-foreground'
              : 'rounded-bl-sm bg-muted/60 border border-border/40 text-foreground'
          )}
        >
          {message.content}
        </div>

        {/* Mutation summary pills */}
        {message.summary && message.summary.length > 0 && (
          <div className="flex flex-col gap-1 mt-0.5">
            {message.summary.map((entry) => (
              <div
                key={entry}
                className="flex items-start gap-1.5 rounded-xl border border-border/40 bg-background/60 px-2.5 py-1.5 text-[10px] font-medium leading-tight text-muted-foreground"
              >
                <Zap className="h-3 w-3 mt-px text-accent shrink-0" />
                {entry}
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {message.status === 'error' && (
          <p className="text-[10px] text-destructive font-medium px-1">
            Failed to apply — please try again.
          </p>
        )}

        <span className="text-[10px] text-muted-foreground/50 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StoreMutationStudio({
  projectName,
  projectStatus = 'draft',
}: {
  projectName?: string;
  projectStatus?: ProjectStatus;
} = {}) {
  const { config, applyPromptResult, resetStore, mutationError } = useStoreConfig();
  const { t } = useTranslation();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: 'assistant',
      content: `Hi! I'm Cuclify AI. Describe any change you'd like — I'll update your store in real time.`,
      timestamp: new Date(),
      status: 'done',
    },
  ]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePreview, setActivePreview] = useState<PreviewTab>('home');
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const firstProductSlug =
    config.catalog.products.products[0]?.href?.split('/').pop() ?? 'product';

  // ── Auto-scroll ──
  const scrollToBottom = useCallback((smooth = true) => {
    chatEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ── Scroll button visibility ──
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(distFromBottom > 120);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // ── Send prompt ──
  async function handleSend(customPrompt?: string) {
    const text = (customPrompt ?? prompt).trim();
    if (!text || isGenerating) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      status: 'done',
    };

    const pendingMsg: ChatMessage = {
      id: uid(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'pending',
    };

    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    if (!customPrompt) setPrompt('');
    setIsGenerating(true);

    try {
      const plan = await planStoreConfigMutations(text, config);
      applyPromptResult({ prompt: plan.prompt, mutations: plan.mutations });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingMsg.id
            ? {
                ...m,
                content: `Done! I applied ${plan.mutations.length} change${plan.mutations.length !== 1 ? 's' : ''} to your store.`,
                summary: plan.summary,
                status: 'done',
              }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingMsg.id
            ? {
                ...m,
                content: err instanceof Error ? err.message : t('common.error'),
                status: 'error',
              }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  }

  // ── Snapshot badges ──
  const blockOrSectionCount =
    (config.pages.home.blocks?.length ?? 0) > 0
      ? `${config.pages.home.blocks!.length} blocks`
      : `${config.pages.home.sections.length} sections`;
  const snapshotBadges = [
    blockOrSectionCount,
    config.brand.name,
    `v1.0`,
  ];

  return (
    <div className="flex h-screen flex-col bg-[#fafaf9] dark:bg-[#0d0d0b] text-foreground overflow-hidden">

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <header className="shrink-0 sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">

          {/* Left — brand + project */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/20">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Cuclify Studio
                </span>
                <span className="text-muted-foreground/30">/</span>
                <h1 className="text-sm font-bold tracking-tight truncate">
                  {projectName ?? t('studio.title')}
                </h1>
                <Badge
                  variant={projectStatus === 'published' ? 'default' : 'secondary'}
                  className="hidden sm:inline-flex rounded-full px-2 py-px text-[9px] font-bold uppercase tracking-widest"
                >
                  {t(`dashboard.status.${projectStatus}`)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right — actions */}
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-1.5 text-muted-foreground hover:text-foreground h-8 px-3 text-xs font-semibold"
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-1.5 text-muted-foreground hover:text-foreground h-8 px-3 text-xs font-semibold"
            >
              <Globe className="h-3.5 w-3.5" />
              Publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetStore}
              className="h-8 rounded-full px-3 border-border/50 text-xs font-semibold hover:bg-muted/60"
            >
              <RefreshCw className="mr-1.5 h-3 w-3" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Body: left rail + right canvas ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: AI Chat Panel ─────────────────────────────────────────── */}
        <aside className="flex w-[380px] shrink-0 flex-col border-r border-border/50 bg-background/60">

          {/* Panel header */}
          <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <WandSparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm font-bold tracking-tight">Ask Cuclify AI</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Live
              </span>
            </div>
          </div>

          {/* Message thread */}
          <div
            ref={chatContainerRef}
            className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
          >
            {messages.map((msg) =>
              msg.status === 'pending' ? (
                <AssistantTypingBubble key={msg.id} />
              ) : (
                <MessageBubble key={msg.id} message={msg} />
              )
            )}

            {/* Error from context */}
            {mutationError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-3.5 py-2.5 text-xs font-medium text-destructive animate-in fade-in">
                {mutationError}
              </div>
            )}

            <div ref={chatEndRef} />

            {/* Scroll-to-bottom button */}
            {showScrollBtn && (
              <button
                onClick={() => scrollToBottom()}
                className="sticky bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-border/50 bg-background/90 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground shadow-md backdrop-blur hover:text-foreground transition-all"
              >
                <ChevronDown className="h-3.5 w-3.5" />
                Scroll to latest
              </button>
            )}
          </div>

          {/* ── Suggestion chips ── */}
          <div className="border-t border-border/40 px-4 pt-3 pb-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50 mb-2 ml-0.5">
              Suggestions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTION_CHIPS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => handleSend(label)}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-[11px] font-semibold text-foreground/70 transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon className="h-3 w-3 opacity-70" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Input composer ── */}
          <div className="border-t border-border/40 p-4 space-y-3">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe a change to your store…"
                rows={3}
                className="resize-none rounded-xl border-border/50 bg-muted/30 pr-10 py-3 text-sm placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                disabled={isGenerating}
              />
              {/* Send icon overlay */}
              {prompt.trim() && (
                <button
                  onClick={() => handleSend()}
                  disabled={isGenerating}
                  className="absolute right-2.5 bottom-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
                >
                  <SendHorizontal className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {snapshotBadges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-border/40 bg-muted/20 px-2 py-px text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wider"
                  >
                    {b}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground/40 font-mono shrink-0">
                ⌘↵ send
              </span>
            </div>
          </div>
        </aside>

        {/* ── Right: Live Preview Panel ────────────────────────────────────── */}
        <main className="relative flex flex-1 flex-col overflow-hidden bg-[#f5f5f3] dark:bg-[#111110]">

          {/* Canvas toolbar */}
          <div className="flex shrink-0 items-center justify-between border-b border-border/40 bg-background/50 backdrop-blur-sm px-5 py-2.5 gap-4">
            <div className="flex items-center gap-2.5">
              <Eye className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span className="text-xs font-bold text-muted-foreground/80 tracking-tight">
                Live Canvas
              </span>
              <div className="h-3.5 w-px bg-border" />
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                Real-time sync
              </span>
            </div>

            {/* Preview tabs */}
            <Tabs
              value={activePreview}
              onValueChange={(v) => setActivePreview(v as PreviewTab)}
              className="w-auto"
            >
              <TabsList className="h-8 gap-0.5 bg-muted/40 border border-border/40 p-0.5 rounded-lg">
                {PREVIEW_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="h-7 px-3 text-[11px] font-semibold rounded-md gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all duration-150"
                  >
                    <tab.icon className="h-3 w-3 opacity-60" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Canvas frame */}
          <div className="relative flex-1 overflow-y-auto">

            {/* Generating overlay */}
            {isGenerating && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/70 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="flex flex-col items-center gap-5">
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-primary/15 blur-xl animate-pulse" />
                    <Loader2 className="h-9 w-9 animate-spin text-primary relative" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-base font-bold tracking-tight">Applying changes…</p>
                    <p className="text-xs text-muted-foreground animate-pulse">
                      Computing StoreConfig mutations
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rendered preview */}
            <div data-store-preview className="min-h-full bg-background shadow-[inset_0_0_0_1px_oklch(0.91_0.008_80/0.6)] rounded-t-xl mx-4 mt-4 overflow-hidden">
              {activePreview === 'home' && <HomePreview />}
              {activePreview === 'products' && <ProductsPreview />}
              {activePreview === 'cart' && <CartPreview />}
              {activePreview === 'checkout' && <CheckoutPreview />}
              {activePreview === 'product' && <ProductPreview slug={firstProductSlug} />}
            </div>
          </div>

          {/* Canvas footer */}
          <div className="shrink-0 flex justify-center py-2.5 border-t border-border/30">
            <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 font-medium">
              <Sparkles className="h-3 w-3" />
              Cuclify Vercel D-V8 Engine · StoreConfig-driven render
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
