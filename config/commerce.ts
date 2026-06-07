import type { StoreConfig } from '@/types';

export const commerce: StoreConfig['commerce'] = {
  locale: 'en-US',
  currency: 'USD',
  tax: {
    rate: 0.08,
  },
  shipping: {
    freeThreshold: 100,
    standardRate: 9.99,
  },
};
