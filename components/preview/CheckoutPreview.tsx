'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckoutView } from '@/components/CheckoutView';
import { useStoreConfig } from '@/contexts/store-config-context';

export function CheckoutPreview() {
  const { config } = useStoreConfig();

  return (
    <>
      <Navbar brand={config.brand} config={config.navigation.navbar} />
      <main>
        <CheckoutView config={config.pages.checkout} commerce={config.commerce} />
      </main>
      <Footer config={config.footer} />
    </>
  );
}
