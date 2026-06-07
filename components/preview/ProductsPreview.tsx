'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductsGrid } from '@/components/ProductsGrid';
import { useStoreConfig } from '@/contexts/store-config-context';

export function ProductsPreview() {
  const { config } = useStoreConfig();

  return (
    <>
      <Navbar brand={config.brand} config={config.navigation.navbar} />
      <main>
        <ProductsGrid
          config={config.pages.products}
          locale={config.commerce.locale}
          products={config.catalog.products.products}
          categories={config.catalog.categories.categories}
        />
      </main>
      <Footer config={config.footer} />
    </>
  );
}
