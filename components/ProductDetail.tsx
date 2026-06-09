'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product, ProductDetailConfig } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/contexts/cart-context';
import {
  Star,
  Heart,
  Minus,
  Plus,
  Truck,
  RefreshCw,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ProductDetailProps {
  config: ProductDetailConfig;
  locale: string;
  product: Product;
  relatedProducts: Product[];
  className?: string;
}

export function ProductDetail({
  config,
  locale,
  product,
  relatedProducts,
  className,
}: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.id ?? ''
  );

  const handleAddToCart = () => {
    const variant = product.variants?.find((v) => v.id === selectedVariant);
    addItem(
      product,
      quantity,
      variant ? { id: variant.id, name: variant.name } : undefined
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const nextImage = () =>
    setSelectedImageIndex((i) => (i + 1) % product.images.length);
  const prevImage = () =>
    setSelectedImageIndex(
      (i) => (i - 1 + product.images.length) % product.images.length
    );

  const currentVariant = product.variants?.find((v) => v.id === selectedVariant);
  const displayPrice = currentVariant?.price ?? product.price;
  const displayComparePrice =
    currentVariant?.compareAtPrice ?? product.compareAtPrice;
  const isInStock = currentVariant?.inStock ?? product.inStock;

  return (
    <div className={cn('py-8 md:py-12', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                {config.breadcrumbs.homeLabel}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/products"
                className="hover:text-foreground transition-colors"
              >
                {config.breadcrumbs.productsLabel}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm font-medium px-3 py-1.5 rounded-md">
                  {product.badge}
                </span>
              )}
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      'relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors',
                      selectedImageIndex === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-border'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < Math.floor(product.rating!)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-muted text-muted'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount} {config.reviewCountLabel})
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold">
                {formatPrice(displayPrice, product.currency, locale)}
              </span>
              {displayComparePrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(displayComparePrice, product.currency, locale)}
                </span>
              )}
              {displayComparePrice && (
                <span className="text-sm font-medium text-accent">
                  {config.saveLabel}{' '}
                  {Math.round(
                    ((displayComparePrice - displayPrice) / displayComparePrice) *
                      100
                  )}
                  %
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  {config.variantLabel}
                </Label>
                <RadioGroup
                  value={selectedVariant}
                  onValueChange={setSelectedVariant}
                  className="flex flex-wrap gap-2"
                >
                  {product.variants.map((variant) => (
                    <div key={variant.id}>
                      <RadioGroupItem
                        value={variant.id}
                        id={variant.id}
                        className="peer sr-only"
                        disabled={!variant.inStock}
                      />
                      <Label
                        htmlFor={variant.id}
                        className={cn(
                          'flex items-center justify-center px-4 py-2 rounded-md border cursor-pointer transition-colors',
                          'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5',
                          'hover:border-primary/50',
                          !variant.inStock && 'opacity-50 cursor-not-allowed line-through'
                        )}
                      >
                        {variant.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Quantity */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                {config.quantityLabel}
              </Label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={decrementQuantity}
                    className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {isInStock ? (
                <>
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                  >
                    {config.addToCartLabel}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={handleBuyNow}
                  >
                    {config.buyNowLabel}
                  </Button>
                </>
              ) : (
                <Button size="lg" className="flex-1" disabled>
                  {config.outOfStockLabel}
                </Button>
              )}
              <Button size="lg" variant="outline" className="w-12 px-0">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {config.trustBadges.freeShippingLabel}
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {config.trustBadges.easyReturnsLabel}
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {config.trustBadges.securePaymentLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              {config.descriptionLabel}
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              {config.detailsLabel}
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              {config.shippingLabel}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-6">
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              {product.description}
            </p>
          </TabsContent>
          <TabsContent value="details" className="pt-6">
            <ul className="space-y-2 text-muted-foreground max-w-3xl">
              <li>
                {config.detailsCopyLabels.categoryLabel}: {product.category}
              </li>
              {product.tags && product.tags.length > 0 && (
                <li>
                  {config.detailsCopyLabels.tagsLabel}: {product.tags.join(', ')}
                </li>
              )}
              <li>
                {config.detailsCopyLabels.skuLabel}: {product.id.toUpperCase()}
              </li>
            </ul>
          </TabsContent>
          <TabsContent value="shipping" className="pt-6">
            <div className="space-y-4 text-muted-foreground max-w-3xl">
              <p>{config.shippingCopy.standardShipping}</p>
              <p>{config.shippingCopy.expressShipping}</p>
              <p>{config.shippingCopy.estimatedDelivery}</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
                {config.relatedProductsTitle}
              </h2>
              {config.relatedProductsSubtitle && (
                <p className="text-muted-foreground">
                  {config.relatedProductsSubtitle}
                </p>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  locale={locale}
                  labels={config.productCardLabels}
                  onAddToCart={(p) => addItem(p)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
