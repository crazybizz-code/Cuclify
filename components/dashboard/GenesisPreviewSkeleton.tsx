'use client';

import { cn } from '@/lib/utils';

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-muted/40 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-muted-foreground/10 before:to-transparent',
        className
      )}
    />
  );
}

export function NavbarSkeleton() {
  return (
    <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between animate-in fade-in duration-500">
      <div className="flex items-center gap-6">
        <Shimmer className="h-6 w-32" />
        <div className="hidden md:flex gap-4">
          <Shimmer className="h-4 w-16" />
          <Shimmer className="h-4 w-20" />
          <Shimmer className="h-4 w-16" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Shimmer className="h-8 w-8 rounded-full" />
        <Shimmer className="h-8 w-8 rounded-full" />
        <Shimmer className="h-8 w-20" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="space-y-6">
        <Shimmer className="h-4 w-24 rounded-full" />
        <div className="space-y-3">
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-10 w-4/5" />
        </div>
        <div className="space-y-2">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-5/6" />
          <Shimmer className="h-4 w-4/5" />
        </div>
        <div className="flex gap-4">
          <Shimmer className="h-12 w-32 rounded-lg" />
          <Shimmer className="h-12 w-32 rounded-lg" />
        </div>
      </div>
      <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border/40">
        <Shimmer className="h-full w-full" />
      </div>
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="px-6 py-12 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2 text-center">
        <Shimmer className="h-8 w-48 mx-auto" />
        <Shimmer className="h-4 w-72 mx-auto" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl border border-border/40 p-4 flex flex-col justify-end space-y-3">
            <Shimmer className="h-full w-full mb-2" />
            <Shimmer className="h-5 w-2/3" />
            <Shimmer className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="px-6 py-12 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2 text-center">
        <Shimmer className="h-8 w-56 mx-auto" />
        <Shimmer className="h-4 w-80 mx-auto" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/40 p-4 space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden">
              <Shimmer className="h-full w-full" />
            </div>
            <div className="space-y-2">
              <Shimmer className="h-5 w-3/4" />
              <Shimmer className="h-4 w-full" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <Shimmer className="h-6 w-16" />
              <Shimmer className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSkeleton() {
  return (
    <div className="px-6 py-12 max-w-6xl mx-auto space-y-8 bg-muted/20 rounded-2xl animate-in fade-in duration-500">
      <div className="space-y-2 text-center">
        <Shimmer className="h-8 w-48 mx-auto" />
        <Shimmer className="h-4 w-64 mx-auto" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Shimmer key={starIndex} className="h-4 w-4 rounded-full" />
              ))}
            </div>
            <div className="space-y-2">
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-5/6" />
              <Shimmer className="h-4 w-4/5" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Shimmer className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Shimmer className="h-4 w-24" />
                <Shimmer className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FaqSkeleton() {
  return (
    <div className="px-6 py-12 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2 text-center">
        <Shimmer className="h-8 w-56 mx-auto" />
        <Shimmer className="h-4 w-72 mx-auto" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-border/40 pb-4 space-y-2">
            <div className="flex justify-between items-center py-2">
              <Shimmer className="h-5 w-4/5" />
              <Shimmer className="h-4 w-4 rounded-full" />
            </div>
            <Shimmer className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FooterSkeleton() {
  return (
    <div className="border-t border-border/40 bg-card px-6 py-12 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Shimmer className="h-6 w-32" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-4/5" />
        </div>
        <div className="space-y-3">
          <Shimmer className="h-5 w-20" />
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          <Shimmer className="h-5 w-24" />
          <Shimmer className="h-4 w-20" />
          <Shimmer className="h-4 w-28" />
        </div>
        <div className="space-y-3">
          <Shimmer className="h-5 w-32" />
          <Shimmer className="h-10 w-full rounded-lg" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto pt-8 border-t border-border/40 flex justify-between items-center">
        <Shimmer className="h-4 w-48" />
        <Shimmer className="h-4 w-32" />
      </div>
    </div>
  );
}
