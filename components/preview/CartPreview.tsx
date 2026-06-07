'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartView } from '@/components/CartView';
import { useStoreConfig } from '@/contexts/store-config-context';

export function CartPreview() {
  const { config } = useStoreConfig();

  return (
    <>
      <Navbar brand={config.brand} config={config.navigation.navbar} />
      <main>
        <CartView config={config.pages.cart} commerce={config.commerce} />
      </main>
      <Footer config={config.footer} />
    </>
  );
}
