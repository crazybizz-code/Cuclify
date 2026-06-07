import { z } from 'zod';
import { StoreConfigSchema, type StoreConfigInput } from '@/config/store-config.schema';
import type {
  StoreConfigMergeMutation,
  StoreConfigMutation,
  StoreConfigMutationBatch,
  StoreConfigPathSegment,
  StoreConfigSetMutation,
} from '@/types';

const mutationPathSegmentSchema = z.union([z.string(), z.number().int()]);

const mutationSetSchema = z.object({
  op: z.literal('set'),
  path: z.array(mutationPathSegmentSchema).min(1),
  value: z.unknown(),
});

const mutationMergeSchema = z.object({
  op: z.literal('merge'),
  path: z.array(mutationPathSegmentSchema).min(1),
  value: z.record(z.string(), z.unknown()),
});

export const StoreConfigMutationSchema = z.discriminatedUnion('op', [
  mutationSetSchema,
  mutationMergeSchema,
]);

export const StoreConfigMutationBatchSchema = z.object({
  prompt: z.string().optional(),
  mutations: z.array(StoreConfigMutationSchema).min(1),
});

function cloneConfig(config: StoreConfigInput): StoreConfigInput {
  if (typeof structuredClone === 'function') {
    return structuredClone(config);
  }

  return JSON.parse(JSON.stringify(config)) as StoreConfigInput;
}

function getParentContainer(
  root: Record<string, unknown> | unknown[],
  path: StoreConfigPathSegment[]
) {
  if (path.length === 0) {
    return { container: root, key: undefined as StoreConfigPathSegment | undefined };
  }

  let container: Record<string, unknown> | unknown[] = root;

  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index];

    if (Array.isArray(container)) {
      const next = container[segment as number];
      if (next === undefined || next === null) {
        throw new Error(`Cannot resolve array path segment ${String(segment)}`);
      }
      container = next as Record<string, unknown> | unknown[];
      continue;
    }

    if (!(segment in container)) {
      throw new Error(`Cannot resolve object path segment ${String(segment)}`);
    }

    container = container[segment as keyof typeof container] as
      | Record<string, unknown>
      | unknown[];
  }

  return { container, key: path[path.length - 1] };
}

function setAtPath(
  root: Record<string, unknown> | unknown[],
  path: StoreConfigPathSegment[],
  value: unknown
) {
  if (path.length === 0) {
    throw new Error('Mutation path cannot be empty');
  }

  const { container, key } = getParentContainer(root, path);

  if (key === undefined) {
    throw new Error('Mutation path cannot be empty');
  }

  if (Array.isArray(container)) {
    container[key as number] = value;
    return;
  }

  (container as Record<string, unknown>)[key as string] = value;
}

function mergeAtPath(
  root: Record<string, unknown> | unknown[],
  path: StoreConfigPathSegment[],
  value: Record<string, unknown>
) {
  if (path.length === 0) {
    throw new Error('Mutation path cannot be empty');
  }

  const { container, key } = getParentContainer(root, path);

  if (key === undefined) {
    throw new Error('Mutation path cannot be empty');
  }

  if (Array.isArray(container)) {
    const current = container[key as number];
    if (current === undefined || current === null || Array.isArray(current)) {
      container[key as number] = { ...value };
      return;
    }

    container[key as number] = {
      ...(current as Record<string, unknown>),
      ...value,
    };
    return;
  }

  const current = (container as Record<string, unknown>)[key as string];
  if (current === undefined || current === null || Array.isArray(current)) {
    (container as Record<string, unknown>)[key as string] = { ...value };
    return;
  }

  (container as Record<string, unknown>)[key as string] = {
    ...(current as Record<string, unknown>),
    ...value,
  };
}

export function validateStoreConfigMutations(
  mutations: unknown
): StoreConfigMutation[] {
  return StoreConfigMutationSchema.array().parse(mutations) as StoreConfigMutation[];
}

export function validateStoreConfigMutationBatch(
  batch: unknown
): StoreConfigMutationBatch {
  return StoreConfigMutationBatchSchema.parse(batch) as StoreConfigMutationBatch;
}

export function applyStoreConfigMutations(
  baseConfig: StoreConfigInput,
  mutations: StoreConfigMutation[]
): StoreConfigInput {
  const nextConfig = cloneConfig(baseConfig);

  for (const mutation of mutations) {
    if (mutation.op === 'set') {
      setAtPath(nextConfig as Record<string, unknown>, mutation.path, mutation.value);
      continue;
    }

    mergeAtPath(
      nextConfig as Record<string, unknown>,
      mutation.path,
      mutation.value
    );
  }

  return StoreConfigSchema.parse(nextConfig);
}

export function applyStoreConfigMutationBatch(
  baseConfig: StoreConfigInput,
  batch: unknown
): StoreConfigInput {
  const parsed = validateStoreConfigMutationBatch(batch);
  return applyStoreConfigMutations(baseConfig, parsed.mutations);
}

export function describeStoreConfigMutation(mutation: StoreConfigMutation) {
  return `${mutation.op} ${mutation.path.join('.')}`;
}

export type {
  StoreConfigMergeMutation,
  StoreConfigMutation,
  StoreConfigMutationBatch,
  StoreConfigSetMutation,
};
