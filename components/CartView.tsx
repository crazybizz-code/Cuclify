'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CartConfig, CommerceConfig } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/cart-context';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface CartViewProps {
  config: CartConfig;
  commerce: CommerceConfig;
  className?: string;
}

export function CartView({ config, commerce, className }: CartViewProps) {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className={cn('py-16 md:py-24', className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md mx-auto">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">
              {config.emptyState.title}
            </h1>
            <p className="text-muted-foreground mb-6">
              {config.emptyState.description}
            </p>
            <Button asChild>
              <Link href={config.emptyState.buttonHref}>
                {config.emptyState.buttonLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Estimate tax from store commerce settings
  const estimatedTax = subtotal * commerce.tax.rate;
  const total = subtotal + estimatedTax;

  return (
    <div className={cn('py-8 md:py-12', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
            {config.title}
          </h1>
          <p className="text-muted-foreground">
            {itemCount}{' '}
            {itemCount === 1 ? config.itemCountLabel.singular : config.itemCountLabel.plural}{' '}
            {config.itemCountLabel.suffix}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link
                      href={item.href}
                      className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-muted"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div>
                          <Link
                            href={item.href}
                            className="font-medium hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">
                              {item.variant.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold">
                            {formatPrice(item.price * item.quantity, item.currency, commerce.locale)}
                          </p>
                          {item.compareAtPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              {formatPrice(
                                item.compareAtPrice * item.quantity,
                                item.currency,
                                commerce.locale
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity and Remove */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Button variant="outline" asChild>
                <Link href={config.continueShoppingLink.href}>
                  {config.continueShoppingLink.label}
                </Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle>{config.summary.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {config.summary.subtotalLabel}
                  </span>
                  <span className="font-medium">{formatPrice(subtotal, commerce.currency, commerce.locale)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {config.summary.shippingLabel}
                  </span>
                  <span className="text-sm">{config.summary.shippingValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {config.summary.taxLabel}
                  </span>
                  <span className="font-medium">{formatPrice(estimatedTax, commerce.currency, commerce.locale)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">{config.summary.totalLabel}</span>
                  <span className="font-semibold">{formatPrice(total, commerce.currency, commerce.locale)}</span>
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link href={config.checkoutButton.href}>
                    {config.checkoutButton.label}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
