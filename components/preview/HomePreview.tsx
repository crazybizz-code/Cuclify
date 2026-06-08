'use client';

import { Navbar } from '@/components/Navbar';
import { SectionRenderer } from '@/components/SectionRenderer';
import { Footer } from '@/components/Footer';
import { useStoreConfig } from '@/contexts/store-config-context';

export function HomePreview() {
  const { config } = useStoreConfig();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar brand={config.brand} config={config.navigation.navbar} />

      <main className="flex-1">
        <SectionRenderer
          blocks={config.pages.home.blocks}
          sections={config.pages.home.sections}
          context={{
            locale: config.commerce.locale,
            hero: config.pages.home.hero,
            categories: config.catalog.categories,
            products: config.catalog.products,
            benefits: config.pages.home.benefits,
            promo: config.pages.home.promo,
            testimonials: config.pages.home.testimonials,
            faq: config.pages.home.faq,
          }}
        />
      </main>

      <Footer config={config.footer} />
    </div>
  );
}
