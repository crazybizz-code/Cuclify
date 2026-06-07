import Link from 'next/link';
import Image from 'next/image';
import type { HeroConfig } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  config: HeroConfig;
  className?: string;
}

export function Hero({ config, className }: HeroProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <section
      className={cn(
        'relative min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-secondary',
        className
      )}
    >
      {/* Background Image */}
      {config.backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={config.backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0 bg-background"
            style={{ opacity: config.overlayOpacity ?? 0.6 }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div
            className={cn(
              'flex flex-col gap-6',
              alignmentClasses[config.alignment ?? 'left']
            )}
          >
            {/* Badge */}
            {config.badge && (
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium tracking-wide w-fit">
                {config.badge}
              </span>
            )}

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-balance leading-[1.1]">
              {config.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl text-pretty leading-relaxed">
              {config.subheadline}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              {config.buttons.map((button, index) => (
                <Button
                  key={index}
                  asChild
                  variant={button.variant === 'primary' ? 'default' : button.variant === 'secondary' ? 'secondary' : 'outline'}
                  size="lg"
                  className={cn(
                    'h-12 px-8 text-base',
                    button.variant === 'primary' && 'shadow-lg'
                  )}
                >
                  <Link href={button.href}>
                    {button.label}
                    {button.variant === 'primary' && (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Image */}
          {config.image && (
            <div className="relative aspect-[4/3] lg:aspect-square">
              <div className="absolute inset-0 bg-muted rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={config.image.src}
                  alt={config.image.alt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
