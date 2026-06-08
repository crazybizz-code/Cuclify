'use client';

import type { HomeSectionConfig } from '@/types';
import {
  homeSectionRegistry,
  type HomeSectionContext,
} from '@/components/section-registry';
import type { StoreBlock } from '@/config/store-config.schema';
import { Hero } from '@/components/Hero';
import { CategoryGrid } from '@/components/CategoryGrid';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Benefits } from '@/components/Benefits';
import { PromoBanner } from '@/components/PromoBanner';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';

interface SectionRendererProps {
  blocks?: StoreBlock[];
  sections: HomeSectionConfig[];
  context: HomeSectionContext;
}

export function SectionRenderer({ blocks, sections, context }: SectionRendererProps) {
  if (blocks && blocks.length > 0) {
    return (
      <>
        {blocks.map((block) => {
          const key = block.id;

          const wrapperStyle: React.CSSProperties = {};
          let containerClassName = '';

          if (block.style) {
            if (block.style.background) {
              wrapperStyle.backgroundColor = block.style.background;
            }
            if (block.style.textColor) {
              wrapperStyle.color = block.style.textColor;
            }
            if (block.style.padding) {
              if (
                block.style.padding.includes(' ') ||
                block.style.padding.includes('px') ||
                block.style.padding.includes('rem') ||
                block.style.padding.includes('%')
              ) {
                wrapperStyle.padding = block.style.padding;
              } else {
                containerClassName = `${containerClassName} ${block.style.padding}`.trim();
              }
            }
            if (block.style.layout) {
              if (block.style.layout === 'contained') {
                containerClassName = `${containerClassName} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.trim();
              } else if (block.style.layout === 'narrow') {
                containerClassName = `${containerClassName} max-w-3xl mx-auto px-4 sm:px-6`.trim();
              } else if (block.style.layout === 'full-width') {
                containerClassName = `${containerClassName} w-full`.trim();
              }
            }
          }

          let element: React.ReactNode = null;
          switch (block.blockType) {
            case 'hero':
              element = <Hero config={block.data} />;
              break;
            case 'categoryGrid':
              element = <CategoryGrid config={block.data} />;
              break;
            case 'featuredProducts':
              element = <FeaturedProducts config={block.data} locale={context.locale} />;
              break;
            case 'benefits':
              element = <Benefits config={block.data} />;
              break;
            case 'promoBanner':
              element = <PromoBanner config={block.data} />;
              break;
            case 'testimonials':
              element = <Testimonials config={block.data} />;
              break;
            case 'faq':
              element = <FAQ config={block.data} />;
              break;
            default:
              break;
          }

          return (
            <div key={key} style={wrapperStyle} className={containerClassName || undefined}>
              {element}
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      {sections.map((section, index) => {
        const renderSection = homeSectionRegistry[section.type];
        const key = section.id ?? `${section.type}-${index}`;

        return <div key={key}>{renderSection(context)}</div>;
      })}
    </>
  );
}

