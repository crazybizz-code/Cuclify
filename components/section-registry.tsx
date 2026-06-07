import type { ReactNode } from 'react';
import type {
  BenefitsConfig,
  CategoryGridConfig,
  FAQConfig,
  FeaturedProductsConfig,
  HeroConfig,
  HomeSectionType,
  PromoBannerConfig,
  TestimonialsConfig,
} from '@/types';
import { Hero } from '@/components/Hero';
import { CategoryGrid } from '@/components/CategoryGrid';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Benefits } from '@/components/Benefits';
import { PromoBanner } from '@/components/PromoBanner';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';

export interface HomeSectionContext {
  locale: string;
  hero: HeroConfig;
  categories: CategoryGridConfig;
  products: FeaturedProductsConfig;
  benefits: BenefitsConfig;
  promo: PromoBannerConfig;
  testimonials: TestimonialsConfig;
  faq: FAQConfig;
}

export type HomeSectionRegistry = Record<
  HomeSectionType,
  (context: HomeSectionContext) => ReactNode
>;

export const homeSectionRegistry: HomeSectionRegistry = {
  hero: (context) => <Hero config={context.hero} />,
  categoryGrid: (context) => <CategoryGrid config={context.categories} />,
  featuredProducts: (context) => (
    <FeaturedProducts config={context.products} locale={context.locale} />
  ),
  benefits: (context) => <Benefits config={context.benefits} />,
  promoBanner: (context) => <PromoBanner config={context.promo} />,
  testimonials: (context) => <Testimonials config={context.testimonials} />,
  faq: (context) => <FAQ config={context.faq} />,
};
