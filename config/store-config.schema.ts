import { z } from 'zod';

const navLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  isExternal: z.boolean().optional(),
});

const brandSchema = z.object({
  name: z.string(),
  logo: z.string(),
  logoAlt: z.string().optional(),
  tagline: z.string().optional(),
  story: z.string().optional(),
  voice: z.string().optional(),
});

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  productNotFoundTitle: z.string(),
  productNotFoundDescription: z.string(),
  openGraph: z
    .object({
      title: z.string(),
      description: z.string(),
      type: z.literal('website').optional(),
    })
    .optional(),
  twitter: z
    .object({
      card: z.enum(['summary', 'summary_large_image']),
      title: z.string(),
      description: z.string(),
    })
    .optional(),
  icons: z
    .object({
      icon: z.array(
        z.object({
          url: z.string(),
          media: z.string().optional(),
          type: z.string().optional(),
        })
      ),
      apple: z.string().optional(),
    })
    .optional(),
  viewport: z.object({
    lightThemeColor: z.string(),
    darkThemeColor: z.string(),
  }),
  language: z.string(),
});

const themeColorsSchema = z.object({
  primary: z.string(),
  primaryForeground: z.string(),
  secondary: z.string(),
  secondaryForeground: z.string(),
  background: z.string(),
  foreground: z.string(),
  muted: z.string(),
  mutedForeground: z.string(),
  accent: z.string(),
  accentForeground: z.string(),
  border: z.string(),
  card: z.string(),
  cardForeground: z.string(),
});

const themeSchema = z.object({
  colors: z.object({
    light: themeColorsSchema,
    dark: themeColorsSchema,
  }),
  typography: z.object({
    fontSans: z.string(),
    fontSerif: z.string().optional(),
    fontMono: z.string().optional(),
    headingWeight: z.string(),
    bodyWeight: z.string(),
  }),
  spacing: z.object({
    sectionPadding: z.string(),
    containerMaxWidth: z.string(),
    gap: z.string(),
  }),
  borderRadius: z.string(),
});

const navbarSchema = z.object({
  links: z.array(navLinkSchema),
  showSearch: z.boolean().optional(),
  searchPlaceholder: z.string(),
  showCart: z.boolean().optional(),
  showAuth: z.boolean().optional(),
  ctaButton: z
    .object({
      label: z.string(),
      href: z.string(),
    })
    .optional(),
  announcement: z
    .object({
      text: z.string(),
      link: z
        .object({
          label: z.string(),
          href: z.string(),
        })
        .optional(),
    })
    .optional(),
});

const commerceSchema = z.object({
  locale: z.string(),
  currency: z.string(),
  tax: z.object({
    rate: z.number().min(0),
  }),
  shipping: z.object({
    freeThreshold: z.number().min(0),
    standardRate: z.number().min(0),
  }),
});

const heroSchema = z.object({
  badge: z.string().optional(),
  headline: z.string(),
  subheadline: z.string(),
  buttons: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
      variant: z.enum(['primary', 'secondary', 'outline']),
    })
  ),
  image: z
    .object({
      src: z.string(),
      alt: z.string(),
    })
    .optional(),
  backgroundImage: z.string().optional(),
  alignment: z.enum(['left', 'center', 'right']).optional(),
  overlayOpacity: z.number().min(0).max(1).optional(),
});

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  image: z.string(),
  href: z.string(),
  productCount: z.number().optional(),
});

const categoriesSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  categories: z.array(categorySchema),
  columns: z.number().optional(),
});

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  compareAtPrice: z.number().optional(),
  currency: z.string(),
  images: z.array(z.string()).min(1),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  badge: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  inStock: z.boolean(),
  href: z.string(),
  variants: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        compareAtPrice: z.number().optional(),
        inStock: z.boolean(),
      })
    )
    .optional(),
});

const productsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  productCardLabels: z.object({
    quickAddLabel: z.string(),
    outOfStockLabel: z.string(),
  }),
  products: z.array(productSchema),
  viewAllLink: z
    .object({
      label: z.string(),
      href: z.string(),
    })
    .optional(),
  columns: z.number().optional(),
});

const benefitsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  benefits: z.array(
    z.object({
      id: z.string(),
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
  layout: z.enum(['grid', 'horizontal']).optional(),
});

const promoSchema = z.object({
  headline: z.string(),
  subheadline: z.string().optional(),
  backgroundImage: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  button: z.object({
    label: z.string(),
    href: z.string(),
  }),
  countdown: z
    .object({
      endDate: z.string(),
      label: z.string().optional(),
      units: z.object({
        days: z.string(),
        hours: z.string(),
        minutes: z.string(),
        seconds: z.string(),
      }),
    })
    .optional(),
});

const testimonialsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  testimonials: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      author: z.object({
        name: z.string(),
        title: z.string().optional(),
        avatar: z.string().optional(),
      }),
      rating: z.number().optional(),
      productId: z.string().optional(),
    })
  ),
  layout: z.enum(['grid', 'carousel']).optional(),
});

const faqSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      answer: z.string(),
    })
  ),
  contactLink: z
    .object({
      label: z.string(),
      href: z.string(),
    })
    .optional(),
});

export const blockStyleSchema = z.object({
  background: z.string().optional(),
  textColor: z.string().optional(),
  padding: z.string().optional(),
  layout: z.enum(['full-width', 'contained', 'narrow']).optional(),
});

export const storeBlockSchema = z.discriminatedUnion('blockType', [
  z.object({ blockType: z.literal('hero'),             id: z.string(), data: heroSchema,          style: blockStyleSchema.optional() }),
  z.object({ blockType: z.literal('categoryGrid'),     id: z.string(), data: categoriesSchema,    style: blockStyleSchema.optional() }),
  z.object({ blockType: z.literal('featuredProducts'), id: z.string(), data: productsSchema,      style: blockStyleSchema.optional() }),
  z.object({ blockType: z.literal('benefits'),         id: z.string(), data: benefitsSchema,      style: blockStyleSchema.optional() }),
  z.object({ blockType: z.literal('promoBanner'),      id: z.string(), data: promoSchema,         style: blockStyleSchema.optional() }),
  z.object({ blockType: z.literal('testimonials'),     id: z.string(), data: testimonialsSchema,  style: blockStyleSchema.optional() }),
  z.object({ blockType: z.literal('faq'),              id: z.string(), data: faqSchema,           style: blockStyleSchema.optional() }),
]);

export type StoreBlock = z.infer<typeof storeBlockSchema>;
export type BlockStyle = z.infer<typeof blockStyleSchema>;

const homeSectionSchema = z.object({
  id: z.string().optional(),
  type: z.enum([
    'hero',
    'categoryGrid',
    'featuredProducts',
    'benefits',
    'promoBanner',
    'testimonials',
    'faq',
  ]),
});

const footerSchema = z.object({
  brand: brandSchema,
  linkGroups: z.array(
    z.object({
      title: z.string(),
      links: z.array(navLinkSchema),
    })
  ),
  socialLinks: z.array(
    z.object({
      id: z.string(),
      platform: z.enum([
        'facebook',
        'twitter',
        'instagram',
        'linkedin',
        'youtube',
        'tiktok',
        'pinterest',
      ]),
      href: z.string(),
    })
  ),
  newsletter: z
    .object({
      title: z.string(),
      subtitle: z.string().optional(),
      placeholder: z.string(),
      buttonLabel: z.string(),
      successMessage: z.string(),
    })
    .optional(),
  bottomLinks: z.array(navLinkSchema).optional(),
  copyright: z.string(),
  paymentMethods: z.array(z.string()).optional(),
});

const productsPageSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  searchPlaceholder: z.string(),
  sortOptions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      value: z.string(),
    })
  ),
  filterTitle: z.string(),
  categoryFilterLabel: z.string(),
  priceFilterLabel: z.string(),
  priceRanges: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      min: z.number().optional(),
      max: z.number().optional(),
    })
  ),
  noResultsText: z.string(),
  resultsPerPage: z.number(),
  productCardLabels: z.object({
    quickAddLabel: z.string(),
    outOfStockLabel: z.string(),
  }),
});

const productDetailSchema = z.object({
  addToCartLabel: z.string(),
  buyNowLabel: z.string(),
  outOfStockLabel: z.string(),
  quantityLabel: z.string(),
  variantLabel: z.string(),
  descriptionLabel: z.string(),
  detailsLabel: z.string(),
  shippingLabel: z.string(),
  returnsLabel: z.string(),
  breadcrumbs: z.object({
    homeLabel: z.string(),
    productsLabel: z.string(),
  }),
  detailsCopyLabels: z.object({
    categoryLabel: z.string(),
    tagsLabel: z.string(),
    skuLabel: z.string(),
  }),
  shippingCopy: z.object({
    standardShipping: z.string(),
    expressShipping: z.string(),
    estimatedDelivery: z.string(),
  }),
  reviewCountLabel: z.string(),
  saveLabel: z.string(),
  trustBadges: z.object({
    freeShippingLabel: z.string(),
    easyReturnsLabel: z.string(),
    securePaymentLabel: z.string(),
  }),
  relatedProductsTitle: z.string(),
  relatedProductsSubtitle: z.string().optional(),
  productCardLabels: z.object({
    quickAddLabel: z.string(),
    outOfStockLabel: z.string(),
  }),
});

const cartSchema = z.object({
  title: z.string(),
  metadataDescription: z.string(),
  emptyState: z.object({
    title: z.string(),
    description: z.string(),
    buttonLabel: z.string(),
    buttonHref: z.string(),
  }),
  itemCountLabel: z.object({
    singular: z.string(),
    plural: z.string(),
    suffix: z.string(),
  }),
  summary: z.object({
    title: z.string(),
    subtotalLabel: z.string(),
    shippingLabel: z.string(),
    shippingValue: z.string(),
    taxLabel: z.string(),
    totalLabel: z.string(),
  }),
  checkoutButton: z.object({
    label: z.string(),
    href: z.string(),
  }),
  continueShoppingLink: z.object({
    label: z.string(),
    href: z.string(),
  }),
});

const checkoutSchema = z.object({
  title: z.string(),
  metadataDescription: z.string(),
  steps: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
    })
  ),
  emptyState: z.object({
    title: z.string(),
    description: z.string(),
    continueShoppingLabel: z.string(),
    continueShoppingHref: z.string(),
  }),
  customerInfo: z.object({
    title: z.string(),
    emailLabel: z.string(),
    emailPlaceholder: z.string(),
    phoneLabel: z.string(),
    phonePlaceholder: z.string(),
  }),
  shippingInfo: z.object({
    title: z.string(),
    firstNameLabel: z.string(),
    firstNamePlaceholder: z.string(),
    lastNameLabel: z.string(),
    lastNamePlaceholder: z.string(),
    addressLabel: z.string(),
    addressPlaceholder: z.string(),
    apartmentLabel: z.string(),
    apartmentPlaceholder: z.string(),
    cityLabel: z.string(),
    cityPlaceholder: z.string(),
    stateLabel: z.string(),
    statePlaceholder: z.string(),
    zipLabel: z.string(),
    zipPlaceholder: z.string(),
    countryLabel: z.string(),
    countryPlaceholder: z.string(),
  }),
  paymentInfo: z.object({
    title: z.string(),
    cardNumberLabel: z.string(),
    cardNumberPlaceholder: z.string(),
    expiryLabel: z.string(),
    expiryPlaceholder: z.string(),
    cvvLabel: z.string(),
    cvvPlaceholder: z.string(),
    nameOnCardLabel: z.string(),
    nameOnCardPlaceholder: z.string(),
  }),
  orderSummary: z.object({
    title: z.string(),
    subtotalLabel: z.string(),
    shippingLabel: z.string(),
    taxLabel: z.string(),
    totalLabel: z.string(),
    freeShippingLabel: z.string(),
  }),
  labels: z.object({
    secure: z.string(),
    back: z.string(),
    continue: z.string(),
  }),
  placeOrderButton: z.string(),
  successState: z.object({
    title: z.string(),
    description: z.string(),
    orderNumberLabel: z.string(),
    continueShoppingLabel: z.string(),
    continueShoppingHref: z.string(),
  }),
});

export const storeDNASchema = z.object({
  businessType: z.string(),
  industryTemplate: z.enum([
    'electronics',
    'fashion',
    'beauty',
    'furniture',
    'food',
    'sports',
    'books',
    'generic',
  ]),
  market: z.string(),
  audience: z.string(),
  tone: z.string(),
  style: z.string(),
  currency: z.string(),
  language: z.string(),
});

export const StoreConfigSchema = z.object({
  brand: brandSchema,
  seo: seoSchema,
  theme: themeSchema,
  dna: storeDNASchema.optional(),
  genesisVersion: z.string().optional(),
  navigation: z.object({
    navbar: navbarSchema,
  }),
  commerce: commerceSchema,
  catalog: z.object({
    categories: categoriesSchema,
    products: productsSchema,
  }),
  pages: z.object({
    home: z.object({
      hero: heroSchema,
      benefits: benefitsSchema,
      promo: promoSchema,
      testimonials: testimonialsSchema,
      faq: faqSchema,
      sections: z.array(homeSectionSchema).min(1),
      blocks: z.array(storeBlockSchema).optional(),
    }),
    products: productsPageSchema,
    productDetail: productDetailSchema,
    cart: cartSchema,
    checkout: checkoutSchema,
  }),
  footer: footerSchema,
});

export type StoreConfigInput = z.input<typeof StoreConfigSchema>;
export type ValidatedStoreConfig = z.infer<typeof StoreConfigSchema>;
