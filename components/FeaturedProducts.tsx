'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { FeaturedProductsConfig } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, Heart } from 'lucide-react';

interface FeaturedProductsProps {
  config: FeaturedProductsConfig;
  locale: string;
  className?: string;
}

export function FeaturedProducts({ config, locale, className }: FeaturedProductsProps) {
  const columnClasses: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={cn('py-16 md:py-24 bg-secondary/30', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 lg:mb-16">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
              {config.title}
            </h2>
            {config.subtitle && (
              <p className="text-lg text-muted-foreground">
                {config.subtitle}
              </p>
            )}
          </div>
          {config.viewAllLink && (
            <Button variant="outline" asChild className="w-fit">
              <Link href={config.viewAllLink.href}>
                {config.viewAllLink.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Products Grid */}
        <div
          className={cn(
            'grid gap-6',
            columnClasses[config.columns ?? 4]
          )}
        >
          {config.products.map((product) => (
            <Card
              key={product.id}
              className="group border-0 bg-card shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={product.href} className="block">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-2.5 py-1 rounded-md">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-white"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-4 w-4" />
                  </button>

                  {/* Quick Add */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <Button
                      className="w-full shadow-lg"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to cart logic
                      }}
                    >
                      {config.productCardLabels.quickAddLabel}
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Category */}
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {product.category}
                  </p>

                  {/* Name */}
                  <h3 className="font-medium text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="text-sm text-foreground font-medium">
                        {product.rating}
                      </span>
                      {product.reviewCount && (
                        <span className="text-sm text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      {formatPrice(product.price, product.currency, locale)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice, product.currency, locale)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  {!product.inStock && (
                    <p className="text-sm text-destructive mt-2">
                      {config.productCardLabels.outOfStockLabel}
                    </p>
                  )}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
