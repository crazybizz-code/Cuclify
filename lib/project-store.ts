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

export function createProjectStoreSnapshot(
  config: StoreConfigInput,
  mutationHistory: ProjectMutationRecord[] = []
): ProjectStoreSnapshot {
  return {
    config: StoreConfigSchema.parse(config),
    mutationHistory,
    savedAt: new Date().toISOString(),
  };
}

export function normalizeProjectStoreSnapshot(
  value: unknown,
  fallbackConfig: StoreConfigInput
): ProjectStoreSnapshot {
  if (value && typeof value === 'object' && 'config' in value) {
    return ProjectStoreSnapshotSchema.parse(value);
  }

  return createProjectStoreSnapshot(
    StoreConfigSchema.parse(value ?? fallbackConfig),
    []
  );
}

export function extractProjectConfig(snapshot: ProjectStoreSnapshot): StoreConfigInput {
  return snapshot.config;
}
