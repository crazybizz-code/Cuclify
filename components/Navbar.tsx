'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import type { BrandConfig, NavbarConfig } from '@/types';
import { useTranslation } from '@/contexts/i18n-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/cart-context';

interface NavbarProps {
  brand: BrandConfig;
  config: NavbarConfig;
  className?: string;
}

export function Navbar({ brand, config, className }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount } = useCart();
  const { t } = useTranslation();

  return (
    <header className={cn('sticky top-0 z-50 w-full', className)}>
      {/* Announcement Bar */}
      {config.announcement && (
        <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm">
          <span>{config.announcement.text}</span>
          {config.announcement.link && (
            <Link
              href={config.announcement.link.href}
              className="ml-2 underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {config.announcement.link.label}
            </Link>
          )}
        </div>
      )}

      {/* Main Navbar */}
      <nav className="bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={t('nav.openMenu')}>
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                  <div className="flex flex-col gap-6 mt-8">
                    <Link href="/" className="text-xl font-semibold tracking-tight">
                      {brand.name}
                    </Link>
                    <nav className="flex flex-col gap-4">
                      {config.links.map((link) => (
                        <Link
                          key={link.id}
                          href={link.href}
                          className="text-lg text-foreground hover:text-muted-foreground transition-colors"
                          target={link.isExternal ? '_blank' : undefined}
                          rel={link.isExternal ? 'noopener noreferrer' : undefined}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                    {config.ctaButton && (
                      <Button asChild className="mt-4">
                        <Link href={config.ctaButton.href}>{config.ctaButton.label}</Link>
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl lg:text-2xl font-semibold tracking-tight"
            >
              {brand.name}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {config.links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {config.showSearch && (
                <div className="relative">
                  {isSearchOpen ? (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-background border border-border rounded-lg p-1 shadow-lg">
                      <input
                        type="search"
                        placeholder={config.searchPlaceholder}
                        className="w-48 sm:w-64 px-3 py-1.5 text-sm bg-transparent outline-none"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t('nav.searchLabel')}
                      onClick={() => setIsSearchOpen(true)}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Auth */}
              {config.showAuth && (
                <Button variant="ghost" size="icon" aria-label={t('nav.account')} className="hidden sm:flex">
                  <User className="h-5 w-5" />
                </Button>
              )}

              {/* Cart */}
              {config.showCart && (
                <Button variant="ghost" size="icon" aria-label={t('nav.cart')} className="relative" asChild>
                  <Link href="/cart">
                    <ShoppingBag className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                      {itemCount}
                    </span>
                  </Link>
                </Button>
              )}

              {/* CTA Button */}
              {config.ctaButton && (
                <Button asChild className="hidden lg:inline-flex ml-2">
                  <Link href={config.ctaButton.href}>{config.ctaButton.label}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
