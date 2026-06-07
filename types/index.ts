// Brand Configuration
export interface BrandConfig {
  name: string;
  logo: string;
  logoAlt?: string;
  tagline?: string;
}

// SEO Configuration
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  productNotFoundTitle: string;
  productNotFoundDescription: string;
  openGraph?: {
    title: string;
    description: string;
    type?: 'website';
  };
  twitter?: {
    card: 'summary' | 'summary_large_image';
    title: string;
    description: string;
  };
  icons?: {
    icon: {
      url: string;
      media?: string;
      type?: string;
    }[];
    apple?: string;
  };
  viewport: {
    lightThemeColor: string;
    darkThemeColor: string;
  };
  language: string;
}

// Theme Configuration
export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  card: string;
  cardForeground: string;
}

export interface ThemeTypography {
  fontSans: string;
  fontSerif?: string;
  fontMono?: string;
  headingWeight: string;
  bodyWeight: string;
}

export interface ThemeSpacing {
  sectionPadding: string;
  containerMaxWidth: string;
  gap: string;
}

export interface ThemeConfig {
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: string;
}

// Commerce Configuration
export interface CommerceConfig {
  locale: string;
  currency: string;
  tax: {
    rate: number;
  };
  shipping: {
    freeThreshold: number;
    standardRate: number;
  };
}

// Navigation
export interface NavLink {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface NavbarConfig {
  links: NavLink[];
  showSearch?: boolean;
  showCart?: boolean;
  showAuth?: boolean;
  searchPlaceholder: string;
  ctaButton?: {
    label: string;
    href: string;
  };
  announcement?: {
    text: string;
    link?: {
      label: string;
      href: string;
    };
  };
}

// Hero Section
export interface HeroButton {
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
}

export interface HeroConfig {
  badge?: string;
  headline: string;
  subheadline: string;
  buttons: HeroButton[];
  image?: {
    src: string;
    alt: string;
  };
  backgroundImage?: string;
  alignment?: 'left' | 'center' | 'right';
  overlayOpacity?: number;
}

// Categories
export interface Category {
  id: string;
  name: string;
  description?: string;
  image: string;
  href: string;
  productCount?: number;
}

export interface CategoryGridConfig {
  title: string;
  subtitle?: string;
  categories: Category[];
  columns?: number;
}

// Products
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category: string;
  tags?: string[];
  badge?: string;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  href: string;
  variants?: ProductVariant[];
}

export interface FeaturedProductsConfig {
  title: string;
  subtitle?: string;
  products: Product[];
  productCardLabels: ProductCardLabelsConfig;
  viewAllLink?: {
    label: string;
    href: string;
  };
  columns?: number;
}

export interface ProductCardLabelsConfig {
  quickAddLabel: string;
  outOfStockLabel: string;
}

// Benefits
export interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface BenefitsConfig {
  title?: string;
  subtitle?: string;
  benefits: Benefit[];
  layout?: 'grid' | 'horizontal';
}

// Promotional Banner
export interface PromoBannerConfig {
  headline: string;
  subheadline?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  button: {
    label: string;
    href: string;
  };
  countdown?: {
    endDate: string;
    label?: string;
    units: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
  };
}

// Testimonials
export interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    title?: string;
    avatar?: string;
  };
  rating?: number;
  productId?: string;
}

export interface TestimonialsConfig {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  layout?: 'grid' | 'carousel';
}

// FAQ
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQConfig {
  title: string;
  subtitle?: string;
  items: FAQItem[];
  contactLink?: {
    label: string;
    href: string;
  };
}

// Footer
export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'pinterest';
  href: string;
}

export interface FooterConfig {
  brand: BrandConfig;
  linkGroups: FooterLinkGroup[];
  socialLinks: SocialLink[];
  newsletter?: {
    title: string;
    subtitle?: string;
    placeholder: string;
    buttonLabel: string;
    successMessage: string;
  };
  bottomLinks?: NavLink[];
  copyright: string;
  paymentMethods?: string[];
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  quantity: number;
  variant?: {
    id: string;
    name: string;
  };
  href: string;
}

export interface CartConfig {
  title: string;
  metadataDescription: string;
  emptyState: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
  itemCountLabel: {
    singular: string;
    plural: string;
    suffix: string;
  };
  summary: {
    title: string;
    subtotalLabel: string;
    shippingLabel: string;
    shippingValue: string;
    taxLabel: string;
    totalLabel: string;
  };
  checkoutButton: {
    label: string;
    href: string;
  };
  continueShoppingLink: {
    label: string;
    href: string;
  };
}

// Products Page Types
export interface ProductsPageConfig {
  title: string;
  subtitle?: string;
  searchPlaceholder: string;
  sortOptions: {
    id: string;
    label: string;
    value: string;
  }[];
  filterTitle: string;
  categoryFilterLabel: string;
  priceFilterLabel: string;
  priceRanges: {
    id: string;
    label: string;
    min?: number;
    max?: number;
  }[];
  noResultsText: string;
  resultsPerPage: number;
  productCardLabels: ProductCardLabelsConfig;
}

// Product Detail Page Types
export interface ProductDetailConfig {
  addToCartLabel: string;
  buyNowLabel: string;
  outOfStockLabel: string;
  quantityLabel: string;
  variantLabel: string;
  descriptionLabel: string;
  detailsLabel: string;
  shippingLabel: string;
  returnsLabel: string;
  breadcrumbs: {
    homeLabel: string;
    productsLabel: string;
  };
  detailsCopyLabels: {
    categoryLabel: string;
    tagsLabel: string;
    skuLabel: string;
  };
  shippingCopy: {
    standardShipping: string;
    expressShipping: string;
    estimatedDelivery: string;
  };
  reviewCountLabel: string;
  saveLabel: string;
  trustBadges: {
    freeShippingLabel: string;
    easyReturnsLabel: string;
    securePaymentLabel: string;
  };
  relatedProductsTitle: string;
  relatedProductsSubtitle?: string;
  productCardLabels: ProductCardLabelsConfig;
}

// Checkout Types
export interface CheckoutStep {
  id: string;
  title: string;
  description?: string;
}

export interface CheckoutConfig {
  title: string;
  metadataDescription: string;
  steps: CheckoutStep[];
  emptyState: {
    title: string;
    description: string;
    continueShoppingLabel: string;
    continueShoppingHref: string;
  };
  customerInfo: {
    title: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
  };
  shippingInfo: {
    title: string;
    firstNameLabel: string;
    firstNamePlaceholder: string;
    lastNameLabel: string;
    lastNamePlaceholder: string;
    addressLabel: string;
    addressPlaceholder: string;
    apartmentLabel: string;
    apartmentPlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    stateLabel: string;
    statePlaceholder: string;
    zipLabel: string;
    zipPlaceholder: string;
    countryLabel: string;
    countryPlaceholder: string;
  };
  paymentInfo: {
    title: string;
    cardNumberLabel: string;
    cardNumberPlaceholder: string;
    expiryLabel: string;
    expiryPlaceholder: string;
    cvvLabel: string;
    cvvPlaceholder: string;
    nameOnCardLabel: string;
    nameOnCardPlaceholder: string;
  };
  orderSummary: {
    title: string;
    subtotalLabel: string;
    shippingLabel: string;
    taxLabel: string;
    totalLabel: string;
    freeShippingLabel: string;
  };
  labels: {
    secure: string;
    back: string;
    continue: string;
  };
  placeOrderButton: string;
  successState: {
    title: string;
    description: string;
    orderNumberLabel: string;
    continueShoppingLabel: string;
    continueShoppingHref: string;
  };
}

export interface NavigationConfig {
  navbar: NavbarConfig;
}

export interface CatalogConfig {
  categories: CategoryGridConfig;
  products: FeaturedProductsConfig;
}

export interface HomePageConfig {
  hero: HeroConfig;
  benefits: BenefitsConfig;
  promo: PromoBannerConfig;
  testimonials: TestimonialsConfig;
  faq: FAQConfig;
  sections: HomeSectionConfig[];
}

export type HomeSectionType =
  | 'hero'
  | 'categoryGrid'
  | 'featuredProducts'
  | 'benefits'
  | 'promoBanner'
  | 'testimonials'
  | 'faq';

export interface HomeSectionConfig {
  id?: string;
  type: HomeSectionType;
}

export interface PagesConfig {
  home: HomePageConfig;
  products: ProductsPageConfig;
  productDetail: ProductDetailConfig;
  cart: CartConfig;
  checkout: CheckoutConfig;
}

// Complete Store Configuration
export interface StoreConfig {
  brand: BrandConfig;
  seo: SEOConfig;
  theme: ThemeConfig;
  navigation: NavigationConfig;
  commerce: CommerceConfig;
  catalog: CatalogConfig;
  pages: PagesConfig;
  navbar: NavbarConfig;
  hero: HeroConfig;
  categories: CategoryGridConfig;
  products: FeaturedProductsConfig;
  benefits: BenefitsConfig;
  promo: PromoBannerConfig;
  testimonials: TestimonialsConfig;
  faq: FAQConfig;
  footer: FooterConfig;
  // Page-specific configs
  productsPage: ProductsPageConfig;
  productDetail: ProductDetailConfig;
  cart: CartConfig;
  checkout: CheckoutConfig;
}

export type StoreConfigPathSegment = string | number;

export interface StoreConfigSetMutation {
  op: 'set';
  path: StoreConfigPathSegment[];
  value: unknown;
}

export interface StoreConfigMergeMutation {
  op: 'merge';
  path: StoreConfigPathSegment[];
  value: Record<string, unknown>;
}

export type StoreConfigMutation = StoreConfigSetMutation | StoreConfigMergeMutation;

export interface StoreConfigMutationBatch {
  prompt?: string;
  mutations: StoreConfigMutation[];
}

export type ProjectStatus = 'draft' | 'published';

export interface ProjectMutationRecord {
  prompt: string;
  mutations: StoreConfigMutation[];
  appliedAt: string;
}

export interface ProjectStoreSnapshot {
  config: import('@/config/store-config.schema').StoreConfigInput;
  mutationHistory: ProjectMutationRecord[];
  savedAt: string;
}

export interface ProjectSummary {
  id: string;
  user_id: string;
  name: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  store_config: ProjectStoreSnapshot | import('@/config/store-config.schema').StoreConfigInput;
}
