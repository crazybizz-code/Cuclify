import Image from 'next/image';
import type { TestimonialsConfig } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  config: TestimonialsConfig;
  className?: string;
}

export function Testimonials({ config, className }: TestimonialsProps) {
  return (
    <section className={cn('py-16 md:py-24 bg-secondary/30', className)}>
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

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-0 bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="p-6 lg:p-8">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-muted-foreground/30 mb-4" />

                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < testimonial.rating!
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-muted text-muted'
                        )}
                      />
                    ))}
                  </div>
                )}

                {/* Content */}
                <blockquote className="text-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {testimonial.author.avatar ? (
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={testimonial.author.avatar}
                        alt={testimonial.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-semibold text-muted-foreground">
                        {testimonial.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.author.name}
                    </p>
                    {testimonial.author.title && (
                      <p className="text-sm text-muted-foreground">
                        {testimonial.author.title}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
