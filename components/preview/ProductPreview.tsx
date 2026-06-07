'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductDetail } from '@/components/ProductDetail';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStoreConfig } from '@/contexts/store-config-context';

export function ProductPreview({ slug }: { slug: string }) {
  const { config } = useStoreConfig();
  const product = config.catalog.products.products.find(
    (item) => item.href.split('/').pop() === slug
  );

  const relatedProducts = product
    ? config.catalog.products.products.filter(
        (item) => item.category === product.category && item.id !== product.id
      )
    : [];

  return (
    <>
      <Navbar brand={config.brand} config={config.navigation.navbar} />
      <main>
        {product ? (
          <ProductDetail
            config={config.pages.productDetail}
            locale={config.commerce.locale}
            product={product}
            relatedProducts={relatedProducts}
          />
        ) : (
          <div className="py-16 md:py-24">
            <div className="max-w-md mx-auto px-4 text-center">
              <Card className="border shadow-sm">
                <CardContent className="p-8">
                  <h1 className="text-2xl font-semibold mb-2">
                    {config.seo.productNotFoundTitle}
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    {config.seo.productNotFoundDescription}
                  </p>
                  <Button asChild>
                    <Link href={config.pages.cart.continueShoppingLink.href}>
                      {config.pages.cart.continueShoppingLink.label}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer config={config.footer} />
    </>
  );
}
