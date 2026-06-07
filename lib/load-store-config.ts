import type { StoreConfig } from '@/types';
import {
  StoreConfigSchema,
  type StoreConfigInput,
  type ValidatedStoreConfig,
} from '@/config/store-config.schema';

export function validateStoreConfig(config: unknown): ValidatedStoreConfig {
  return StoreConfigSchema.parse(config);
}

export function loadStoreConfig(config: StoreConfigInput): StoreConfig {
  const validated = validateStoreConfig(config);

  return {
    ...validated,
    navbar: validated.navigation.navbar,
    categories: validated.catalog.categories,
    products: validated.catalog.products,
    hero: validated.pages.home.hero,
    benefits: validated.pages.home.benefits,
    promo: validated.pages.home.promo,
    testimonials: validated.pages.home.testimonials,
    faq: validated.pages.home.faq,
    productsPage: validated.pages.products,
    productDetail: validated.pages.productDetail,
    cart: validated.pages.cart,
    checkout: validated.pages.checkout,
  };
}
