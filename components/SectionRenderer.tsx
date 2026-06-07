'use client';

import type { HomeSectionConfig } from '@/types';
import {
  homeSectionRegistry,
  type HomeSectionContext,
} from '@/components/section-registry';

interface SectionRendererProps {
  sections: HomeSectionConfig[];
  context: HomeSectionContext;
}

export function SectionRenderer({ sections, context }: SectionRendererProps) {
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
