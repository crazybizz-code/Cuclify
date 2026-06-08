import { z } from 'zod';
import {
  StoreConfigSchema,
  type StoreConfigInput,
} from '@/config/store-config.schema';
import { StoreConfigMutationSchema } from '@/lib/store-config-mutations';
import type {
  ProjectMutationRecord,
  ProjectStoreSnapshot,
  StoreConfigMutation,
} from '@/types';

const projectMutationRecordSchema: z.ZodType<ProjectMutationRecord> = z.object({
  prompt: z.string(),
  mutations: z.array(StoreConfigMutationSchema) as unknown as z.ZodType<
    StoreConfigMutation[]
  >,
  appliedAt: z.string(),
});

export const ProjectStoreSnapshotSchema: z.ZodType<ProjectStoreSnapshot> = z.object({
  config: StoreConfigSchema,
  mutationHistory: z.array(projectMutationRecordSchema),
  savedAt: z.string(),
});

function initializeBlocksFromSections(config: StoreConfigInput): StoreConfigInput {
  if (!config.pages?.home) return config;
  const sections = config.pages.home.sections || [];
  const blocks = sections.map((section) => {
    const type = section.type;
    const id = `${type}-default`;
    let data: any = {};
    switch (type) {
      case 'hero':
        data = config.pages.home.hero;
        break;
      case 'categoryGrid':
        data = config.catalog?.categories;
        break;
      case 'featuredProducts':
        data = config.catalog?.products;
        break;
      case 'benefits':
        data = config.pages.home.benefits;
        break;
      case 'promoBanner':
        data = config.pages.home.promo;
        break;
      case 'testimonials':
        data = config.pages.home.testimonials;
        break;
      case 'faq':
        data = config.pages.home.faq;
        break;
    }
    return { blockType: type, id, data };
  });

  return {
    ...config,
    pages: {
      ...config.pages,
      home: {
        ...config.pages.home,
        blocks,
      },
    },
  };
}

export function createProjectStoreSnapshot(
  config: StoreConfigInput,
  mutationHistory: ProjectMutationRecord[] = []
): ProjectStoreSnapshot {
  let nextConfig = config;
  if (
    nextConfig.pages?.home &&
    (!nextConfig.pages.home.blocks || nextConfig.pages.home.blocks.length === 0)
  ) {
    nextConfig = initializeBlocksFromSections(nextConfig);
  }
  return {
    config: StoreConfigSchema.parse(nextConfig),
    mutationHistory,
    savedAt: new Date().toISOString(),
  };
}

export function normalizeProjectStoreSnapshot(
  value: unknown,
  fallbackConfig: StoreConfigInput
): ProjectStoreSnapshot {
  let snapshot: ProjectStoreSnapshot;
  if (value && typeof value === 'object' && 'config' in value) {
    snapshot = ProjectStoreSnapshotSchema.parse(value);
  } else {
    snapshot = createProjectStoreSnapshot(
      StoreConfigSchema.parse(value ?? fallbackConfig),
      []
    );
  }

  if (
    snapshot.config.pages?.home &&
    (!snapshot.config.pages.home.blocks || snapshot.config.pages.home.blocks.length === 0)
  ) {
    snapshot.config = initializeBlocksFromSections(snapshot.config);
  }

  return snapshot;
}

export function extractProjectConfig(snapshot: ProjectStoreSnapshot): StoreConfigInput {
  return snapshot.config;
}
