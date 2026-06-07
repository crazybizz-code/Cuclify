'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FooterConfig } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  CreditCard,
} from 'lucide-react';

interface FooterProps {
  config: FooterConfig;
  className?: string;
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  pinterest: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.4.04-3.44l1.4-5.98s-.35-.72-.35-1.78c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.76 1.51 1.68 0 1.02-.65 2.54-.99 3.96-.28 1.18.59 2.15 1.76 2.15 2.11 0 3.73-2.23 3.73-5.44 0-2.84-2.05-4.83-4.96-4.83-3.38 0-5.37 2.54-5.37 5.16 0 1.02.4 2.12.89 2.72.1.12.11.22.08.34l-.33 1.36c-.05.22-.18.27-.4.16-1.49-.7-2.43-2.87-2.43-4.62 0-3.76 2.74-7.22 7.88-7.22 4.14 0 7.36 2.95 7.36 6.9 0 4.1-2.6 7.42-6.2 7.42-1.2 0-2.35-.63-2.74-1.37l-.74 2.84c-.27 1.04-1 2.35-1.49 3.14A12 12 0 1 0 12 0z" />
    </svg>
  ),
};

const paymentIcons: Record<string, () => React.ReactNode> = {
  visa: () => (
    <div className="h-6 w-10 bg-muted rounded flex items-center justify-center text-[10px] font-bold">
      VISA
    </div>
  ),
  mastercard: () => (
    <div className="h-6 w-10 bg-muted rounded flex items-center justify-center text-[10px] font-bold">
      MC
    </div>
  ),
  amex: () => (
    <div className="h-6 w-10 bg-muted rounded flex items-center justify-center text-[10px] font-bold">
      AMEX
    </div>
  ),
  paypal: () => (
    <div className="h-6 w-10 bg-muted rounded flex items-center justify-center text-[10px] font-bold">
      PP
    </div>
  ),
  applepay: () => (
    <div className="h-6 w-10 bg-muted rounded flex items-center justify-center">
      <CreditCard className="h-3 w-3" />
    </div>
  ),
};

export function Footer({ config, className }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <footer className={cn('bg-secondary pt-16 pb-8', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block text-2xl font-semibold tracking-tight mb-4">
              {config.brand.name}
            </Link>
            {config.brand.tagline && (
              <p className="text-muted-foreground mb-6 max-w-xs">
                {config.brand.tagline}
              </p>
            )}

            {/* Newsletter */}
            {config.newsletter && (
              <div className="max-w-sm">
                <h4 className="font-semibold mb-2">{config.newsletter.title}</h4>
                {config.newsletter.subtitle && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {config.newsletter.subtitle}
                  </p>
                )}
                {isSubscribed ? (
                  <p className="text-sm text-green-600 font-medium">
                    {config.newsletter.successMessage}
                  </p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder={config.newsletter.placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background"
                    />
                    <Button type="submit" size="icon" className="shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Link Groups */}
          {config.linkGroups.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <h4 className="font-semibold mb-4">{group.title}</h4>
              <nav className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    target={link.isExternal ? '_blank' : undefined}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {config.socialLinks.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label={social.platform}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Payment Methods */}
            {config.paymentMethods && (
              <div className="flex items-center gap-2">
                {config.paymentMethods.map((method) => {
                  const PaymentIcon = paymentIcons[method];
                  return PaymentIcon ? <PaymentIcon key={method} /> : null;
                })}
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
            <p className="text-sm text-muted-foreground">{config.copyright}</p>

            {config.bottomLinks && (
              <nav className="flex flex-wrap items-center gap-4 text-sm">
                {config.bottomLinks.map((link, index) => (
                  <span key={link.id} className="flex items-center gap-4">
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                    {index < config.bottomLinks!.length - 1 && (
                      <span className="text-muted-foreground/50">·</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
