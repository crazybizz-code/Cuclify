import type { StoreConfig } from '@/types';

export const navbar: StoreConfig['navbar'] = {
    links: [
      { id: 'new', label: 'New Arrivals', href: '/new' },
      { id: 'collections', label: 'Collections', href: '/collections' },
      { id: 'bestsellers', label: 'Best Sellers', href: '/bestsellers' },
      { id: 'sale', label: 'Sale', href: '/sale' },
    ],
    showSearch: true,
    searchPlaceholder: 'Search...',
    showCart: true,
    showAuth: true,
    ctaButton: {
      label: 'Shop Now',
      href: '/shop',
    },
    announcement: {
      text: 'Free shipping on orders over $100',
      link: {
        label: 'Learn more',
        href: '/shipping',
      },
    },
  };

