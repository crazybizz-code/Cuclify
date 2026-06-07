import type { StoreConfig } from '@/types';

export const seo: StoreConfig['seo'] = {
  title: 'Lumière | Premium Lifestyle Store',
  description:
    'Discover curated pieces that blend timeless elegance with contemporary design. Each item thoughtfully selected for the modern lifestyle.',
  keywords: ['ecommerce', 'lifestyle', 'home decor', 'furniture', 'premium'],
  productNotFoundTitle: 'Product Not Found',
  productNotFoundDescription: 'This product is not currently available in the live preview.',
  openGraph: {
    title: 'Lumière | Premium Lifestyle Store',
    description: 'Curated elegance for modern living',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumière | Premium Lifestyle Store',
    description: 'Curated elegance for modern living',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  viewport: {
    lightThemeColor: '#fafaf8',
    darkThemeColor: '#1f1f1d',
  },
  language: 'en',
};
