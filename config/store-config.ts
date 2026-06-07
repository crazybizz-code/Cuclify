import { brand } from '@/config/brand';
import { seo } from '@/config/seo';
import { theme } from '@/config/theme';
import { navbar } from '@/config/navigation';
import { commerce } from '@/config/commerce';
import { categories, products } from '@/config/catalog';
import {
  benefits,
  cart,
  checkout,
  faq,
  hero,
  homeSections,
  productDetail,
  productsPage,
  promo,
  testimonials,
} from '@/config/pages';
import { footer } from '@/config/footer';
import { loadStoreConfig } from '@/lib/load-store-config';

export const storeConfig = loadStoreConfig({
  brand,
  seo,
  theme,
  navigation: {
    navbar,
  },
  commerce,
  catalog: {
    categories,
    products,
  },
  pages: {
    home: {
      hero,
      benefits,
      promo,
      testimonials,
      faq,
      sections: homeSections,
    },
    products: productsPage,
    productDetail,
    cart,
    checkout,
  },
  footer,
});
