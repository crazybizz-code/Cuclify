'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CheckoutConfig, CommerceConfig } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/cart-context';
import { Check, CreditCard, Lock } from 'lucide-react';

interface CheckoutViewProps {
  config: CheckoutConfig;
  commerce: CommerceConfig;
  className?: string;
}

export function CheckoutView({ config, commerce, className }: CheckoutViewProps) {
  const { items, subtotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Estimate shipping and tax
  const shipping =
    subtotal > commerce.shipping.freeThreshold ? 0 : commerce.shipping.standardRate;
  const tax = subtotal * commerce.tax.rate;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    // Generate a random order number
    const orderId = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setOrderNumber(orderId);
    setIsComplete(true);
    clearCart();
  };

  const nextStep = () => {
    if (currentStep < config.steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  // Success State
  if (isComplete) {
    return (
      <div className={cn('py-16 md:py-24', className)}>
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">
            {config.successState.title}
          </h1>
          <p className="text-muted-foreground mb-4">
            {config.successState.description}
          </p>
          <p className="text-lg font-medium mb-8">
            {config.successState.orderNumberLabel}: {orderNumber}
          </p>
          <Button asChild>
            <Link href={config.successState.continueShoppingHref}>
              {config.successState.continueShoppingLabel}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0 && !isComplete) {
    return (
      <div className={cn('py-16 md:py-24', className)}>
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold mb-2">
            {config.emptyState.title}
          </h1>
          <p className="text-muted-foreground mb-6">
            {config.emptyState.description}
          </p>
          <Button asChild>
            <Link href={config.emptyState.continueShoppingHref}>{config.emptyState.continueShoppingLabel}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-8 md:py-12', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {config.title}
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl">
            {config.steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex items-center justify-center h-8 w-8 rounded-full border-2 text-sm font-medium transition-colors',
                    index <= currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted text-muted-foreground'
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'ml-2 text-sm font-medium hidden sm:block',
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
                {index < config.steps.length - 1 && (
                  <div
                    className={cn(
                      'w-12 sm:w-24 h-0.5 mx-2 sm:mx-4',
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Step 0: Customer Information */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">
                      {config.customerInfo.title}
                    </h2>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="email">{config.customerInfo.emailLabel}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={config.customerInfo.emailPlaceholder}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{config.customerInfo.phoneLabel}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={config.customerInfo.phonePlaceholder}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">
                      {config.shippingInfo.title}
                    </h2>
                    <div className="grid gap-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">
                            {config.shippingInfo.firstNameLabel}
                          </Label>
                          <Input
                            id="firstName"
                            placeholder={config.shippingInfo.firstNamePlaceholder}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">
                            {config.shippingInfo.lastNameLabel}
                          </Label>
                          <Input
                            id="lastName"
                            placeholder={config.shippingInfo.lastNamePlaceholder}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">
                          {config.shippingInfo.addressLabel}
                        </Label>
                        <Input
                          id="address"
                          placeholder={config.shippingInfo.addressPlaceholder}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="apartment">
                          {config.shippingInfo.apartmentLabel}
                        </Label>
                        <Input
                          id="apartment"
                          placeholder={config.shippingInfo.apartmentPlaceholder}
                          className="mt-1.5"
                        />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">{config.shippingInfo.cityLabel}</Label>
                          <Input
                            id="city"
                            placeholder={config.shippingInfo.cityPlaceholder}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">
                            {config.shippingInfo.stateLabel}
                          </Label>
                          <Input
                            id="state"
                            placeholder={config.shippingInfo.statePlaceholder}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zip">{config.shippingInfo.zipLabel}</Label>
                          <Input
                            id="zip"
                            placeholder={config.shippingInfo.zipPlaceholder}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="country">
                          {config.shippingInfo.countryLabel}
                        </Label>
                        <Input
                          id="country"
                          placeholder={config.shippingInfo.countryPlaceholder}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                        {config.paymentInfo.title}
                      </h2>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Lock className="h-3.5 w-3.5" />
                        {config.labels.secure}
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="cardNumber">
                          {config.paymentInfo.cardNumberLabel}
                        </Label>
                        <div className="relative mt-1.5">
                          <Input
                            id="cardNumber"
                            placeholder={config.paymentInfo.cardNumberPlaceholder}
                            className="pl-10"
                          />
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">
                            {config.paymentInfo.expiryLabel}
                          </Label>
                          <Input
                            id="expiry"
                            placeholder={config.paymentInfo.expiryPlaceholder}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">{config.paymentInfo.cvvLabel}</Label>
                          <Input
                            id="cvv"
                            placeholder={config.paymentInfo.cvvPlaceholder}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="nameOnCard">
                          {config.paymentInfo.nameOnCardLabel}
                        </Label>
                        <Input
                          id="nameOnCard"
                          placeholder={config.paymentInfo.nameOnCardPlaceholder}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    {config.labels.back}
                  </Button>
                  {currentStep < config.steps.length - 1 ? (
                    <Button onClick={nextStep}>{config.labels.continue}</Button>
                  ) : (
                    <Button onClick={handlePlaceOrder}>
                      {config.placeOrderButton}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle>{config.orderSummary.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.name}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">
                            {item.variant.name}
                          </p>
                        )}
                        <p className="text-sm font-medium mt-1">
                          {formatPrice(item.price * item.quantity, commerce.currency, commerce.locale)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {config.orderSummary.subtotalLabel}
                    </span>
                    <span>{formatPrice(subtotal, commerce.currency, commerce.locale)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {config.orderSummary.shippingLabel}
                    </span>
                    <span>
                      {shipping === 0
                        ? config.orderSummary.freeShippingLabel
                        : formatPrice(shipping, commerce.currency, commerce.locale)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {config.orderSummary.taxLabel}
                    </span>
                    <span>{formatPrice(tax, commerce.currency, commerce.locale)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg">
                  <span className="font-semibold">
                    {config.orderSummary.totalLabel}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(total, commerce.currency, commerce.locale)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
