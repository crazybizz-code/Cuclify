import type { StoreConfig } from '@/types';

export const footer: StoreConfig['footer'] = {
    brand: {
      name: 'Lumière',
      logo: '/logo.svg',
      tagline: 'Curated elegance for modern living',
    },
    linkGroups: [
      {
        title: 'Shop',
        links: [
          { id: 'new-arrivals', label: 'New Arrivals', href: '/new' },
          { id: 'bestsellers', label: 'Best Sellers', href: '/bestsellers' },
          { id: 'collections', label: 'Collections', href: '/collections' },
          { id: 'sale', label: 'Sale', href: '/sale' },
        ],
      },
      {
        title: 'Company',
        links: [
          { id: 'about', label: 'About Us', href: '/about' },
          { id: 'careers', label: 'Careers', href: '/careers' },
          { id: 'press', label: 'Press', href: '/press' },
          { id: 'sustainability', label: 'Sustainability', href: '/sustainability' },
        ],
      },
      {
        title: 'Support',
        links: [
          { id: 'contact', label: 'Contact Us', href: '/contact' },
          { id: 'faq', label: 'FAQ', href: '/faq' },
          { id: 'shipping', label: 'Shipping Info', href: '/shipping' },
          { id: 'returns', label: 'Returns', href: '/returns' },
        ],
      },
    ],
    socialLinks: [
      { id: 'instagram', platform: 'instagram', href: 'https://instagram.com' },
      { id: 'facebook', platform: 'facebook', href: 'https://facebook.com' },
      { id: 'twitter', platform: 'twitter', href: 'https://twitter.com' },
      { id: 'pinterest', platform: 'pinterest', href: 'https://pinterest.com' },
    ],
    newsletter: {
      title: 'Stay Updated',
      subtitle: 'Subscribe for exclusive offers and new arrivals',
      placeholder: 'Enter your email',
      buttonLabel: 'Subscribe',
      successMessage: 'Thank you for subscribing!',
    },
    bottomLinks: [
      { id: 'privacy', label: 'Privacy Policy', href: '/privacy' },
      { id: 'terms', label: 'Terms of Service', href: '/terms' },
      { id: 'cookies', label: 'Cookie Settings', href: '/cookies' },
    ],
    copyright: '© 2024 Lumière. All rights reserved.',
    paymentMethods: ['visa', 'mastercard', 'amex', 'paypal', 'applepay'],
  };

