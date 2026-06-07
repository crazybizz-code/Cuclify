import type { BenefitsConfig } from '@/types';
import { cn } from '@/lib/utils';
import { Truck, Shield, RefreshCw, Headphones, Package, Clock, Award, Sparkles } from 'lucide-react';

interface BenefitsProps {
  config: BenefitsConfig;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  truck: Truck,
  shield: Shield,
  refresh: RefreshCw,
  headphones: Headphones,
  package: Package,
  clock: Clock,
  award: Award,
  sparkles: Sparkles,
};

export function Benefits({ config, className }: BenefitsProps) {
  const isHorizontal = config.layout === 'horizontal';

  return (
    <section className={cn('py-16 md:py-24 bg-background', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(config.title || config.subtitle) && (
          <div className="text-center mb-12 lg:mb-16">
            {config.title && (
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
                {config.title}
              </h2>
            )}
            {config.subtitle && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {config.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Benefits */}
        <div
          className={cn(
            isHorizontal
              ? 'flex flex-wrap justify-center gap-8 lg:gap-16'
              : 'grid sm:grid-cols-2 lg:grid-cols-4 gap-8'
          )}
        >
          {config.benefits.map((benefit) => {
            const Icon = iconMap[benefit.icon] || Package;

            return (
              <div
                key={benefit.id}
                className={cn(
                  'flex gap-4',
                  isHorizontal
                    ? 'flex-row items-center'
                    : 'flex-col items-center text-center'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full bg-secondary',
                    isHorizontal ? 'h-12 w-12 shrink-0' : 'h-16 w-16 mb-2'
                  )}
                >
                  <Icon
                    className={cn(
                      'text-foreground',
                      isHorizontal ? 'h-5 w-5' : 'h-7 w-7'
                    )}
                  />
                </div>

                {/* Content */}
                <div className={isHorizontal ? '' : ''}>
                  <h3
                    className={cn(
                      'font-semibold text-foreground',
                      isHorizontal ? 'text-sm' : 'text-lg mb-2'
                    )}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className={cn(
                      'text-muted-foreground',
                      isHorizontal ? 'text-sm' : 'text-sm max-w-xs mx-auto'
                    )}
                  >
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
