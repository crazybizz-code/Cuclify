import Link from 'next/link';
import type { FAQConfig } from '@/types';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight } from 'lucide-react';

interface FAQProps {
  config: FAQConfig;
  className?: string;
}

export function FAQ({ config, className }: FAQProps) {
  return (
    <section className={cn('py-16 md:py-24 bg-background', className)}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            {config.title}
          </h2>
          {config.subtitle && (
            <p className="text-lg text-muted-foreground">
              {config.subtitle}
            </p>
          )}
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {config.items.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className={cn(
                'border-b border-border',
                index === 0 && 'border-t'
              )}
            >
              <AccordionTrigger className="text-left text-base font-medium py-5 hover:no-underline hover:text-foreground/80">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact Link */}
        {config.contactLink && (
          <div className="mt-10 text-center">
            <Link
              href={config.contactLink.href}
              className="inline-flex items-center gap-2 text-foreground font-medium hover:text-muted-foreground transition-colors group"
            >
              {config.contactLink.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
