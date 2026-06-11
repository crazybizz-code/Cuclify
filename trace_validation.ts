import { StoreConfigSchema } from './config/store-config.schema';
import { blankStoreConfig } from './config/blank-store-config';

// Mocking the AI generated data based on the schemas in route.ts
const dna = {
  businessType: 'Pet Shop',
  industryTemplate: 'generic',
  market: 'Global',
  audience: 'Pet owners',
  tone: 'Friendly',
  style: 'Modern',
  currency: 'USD',
  language: 'en',
};

const brand = {
  name: 'PetWorld',
  logoAlt: 'PetWorld Logo',
  tagline: 'Best for your pets',
  story: 'We love animals.',
  voice: 'Friendly',
};

const stage1 = {
  dna,
  brand,
  theme: {
    colors: {
      light: { primary: '#000', secondary: '#111', accent: '#222' },
      dark: { primary: '#fff', secondary: '#eee', accent: '#ddd' },
    },
    typography: { fontSans: 'Inter', fontSerif: 'Georgia' },
  },
  categories: [
    { id: '1', name: 'Dogs', description: 'Dog supplies', image: '/img.jpg', href: '/dogs' },
    { id: '2', name: 'Cats', description: 'Cat supplies', image: '/img.jpg', href: '/cats' },
    { id: '3', name: 'Birds', description: 'Bird supplies', image: '/img.jpg', href: '/birds' },
    { id: '4', name: 'Fish', description: 'Fish supplies', image: '/img.jpg', href: '/fish' },
  ],
};

const taskA = {
  navbar: {
    links: [
      { id: 'h', label: 'Home', href: '/' },
    ],
    searchPlaceholder: 'Search...',
  },
};

const taskB = {
  products: Array(6).fill(null).map((_, i) => ({
    id: `p${i}`,
    name: `Product ${i}`,
    description: `Desc ${i}`,
    price: 10,
    currency: 'USD',
    images: ['/p.jpg'],
    category: 'Dogs',
    inStock: true,
    href: `/p${i}`,
  })),
};

const taskC = {
  blockOrder: ['hero', 'categoryGrid', 'featuredProducts', 'benefits', 'promoBanner', 'testimonials', 'faq'],
};

const taskD = {
  testimonials: Array(3).fill(null).map((_, i) => ({
    id: `t${i}`,
    content: `Great ${i}`,
    author: { name: `User ${i}`, title: `Title ${i}` },
    rating: 5,
  })),
  faq: Array(5).fill(null).map((_, i) => ({
    id: `f${i}`,
    question: `Q ${i}`,
    answer: `A ${i}`,
  })),
};

const categories = stage1.categories;

const finalConfig = {
  ...blankStoreConfig,
  brand: {
    ...blankStoreConfig.brand,
    name: brand.name,
    logoAlt: brand.logoAlt,
    tagline: brand.tagline,
    story: brand.story,
    voice: brand.voice,
  },
  seo: {
    ...blankStoreConfig.seo,
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.story,
  },
  theme: {
    ...blankStoreConfig.theme,
    colors: {
      light: {
        ...blankStoreConfig.theme.colors.light,
        primary: stage1.theme.colors.light.primary,
        secondary: stage1.theme.colors.light.secondary,
        accent: stage1.theme.colors.light.accent,
      },
      dark: {
        ...blankStoreConfig.theme.colors.dark,
        primary: stage1.theme.colors.dark.primary,
        secondary: stage1.theme.colors.dark.secondary,
        accent: stage1.theme.colors.dark.accent,
      },
    },
    typography: {
      ...blankStoreConfig.theme.typography,
      fontSans: stage1.theme.typography.fontSans,
      fontSerif: stage1.theme.typography.fontSerif,
    },
  },
  dna,
  genesisVersion: 'v2',
  navigation: {
    navbar: {
      ...blankStoreConfig.navigation.navbar,
      links: taskA.navbar.links,
      searchPlaceholder: taskA.navbar.searchPlaceholder,
    },
  },
  commerce: {
    ...blankStoreConfig.commerce,
    currency: dna.currency,
    locale: dna.language === 'uz' ? 'uz-UZ' : 'en-US',
  },
  catalog: {
    categories: {
      ...blankStoreConfig.catalog.categories,
      categories: categories,
    },
    products: {
      ...blankStoreConfig.catalog.products,
      products: taskB.products,
    },
  },
  pages: {
    ...blankStoreConfig.pages, // simplified for test
    home: {
      ...blankStoreConfig.pages.home,
      blocks: undefined,
      hero: {
        ...blankStoreConfig.pages.home.hero,
        headline: brand.tagline,
        subheadline: brand.story,
      },
      benefits: {
        ...blankStoreConfig.pages.home.benefits,
      },
      promo: {
        ...blankStoreConfig.pages.home.promo,
      },
      testimonials: {
        ...blankStoreConfig.pages.home.testimonials,
        testimonials: taskD.testimonials,
      },
      faq: {
        ...blankStoreConfig.pages.home.faq,
        items: taskD.faq,
      },
      sections: taskC.blockOrder.map((type) => ({ type: type as any })),
    },
  },
  footer: {
    ...blankStoreConfig.footer,
    brand: {
      ...blankStoreConfig.footer.brand,
      name: brand.name,
      tagline: brand.tagline,
    },
    copyright: `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`,
  },
};

const validationResult = StoreConfigSchema.safeParse(finalConfig);

if (!validationResult.success) {
  console.log('Validation failed');
  for (const issue of validationResult.error.issues) {
    console.log(JSON.stringify({
      path: issue.path,
      code: issue.code,
      message: issue.message,
      expected: (issue as any).expected,
      received: (issue as any).received,
    }, null, 2));
  }
} else {
  console.log('Validation passed');
}
