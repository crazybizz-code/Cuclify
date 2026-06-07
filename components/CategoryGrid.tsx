import Link from 'next/link';
import Image from 'next/image';
import type { CategoryGridConfig } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  config: CategoryGridConfig;
  className?: string;
}

export function CategoryGrid({ config, className }: CategoryGridProps) {
  const columnClasses: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={cn('py-16 md:py-24 bg-background', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            {config.title}
          </h2>
          {config.subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.subtitle}
            </p>
          )}
        </div>

        {/* Grid */}
        <div
          className={cn(
            'grid gap-6',
            columnClasses[config.columns ?? 4]
          )}
        >
          {config.categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted"
            >
              {/* Image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-white/80 text-sm mb-2">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-white/90 text-sm font-medium opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <span>Shop now</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Product count badge */}
              {category.productCount !== undefined && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full">
                  {category.productCount} items
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
