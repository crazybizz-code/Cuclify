import { z } from 'zod';
import { StoreConfigSchema, storeBlockSchema, type StoreConfigInput } from '@/config/store-config.schema';
import type {
  StoreConfigMergeMutation,
  StoreConfigMutation,
  StoreConfigMutationBatch,
  StoreConfigPathSegment,
  StoreConfigSetMutation,
  StoreConfigAddBlockMutation,
  StoreConfigRemoveBlockMutation,
  StoreConfigReorderBlocksMutation,
  StoreConfigRegenerateBlockMutation,
} from '@/types';

const mutationPathSegmentSchema = z.union([z.string(), z.number().int()]);

const jsonPrimitiveSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

const jsonValueL1Schema = z.union([
  jsonPrimitiveSchema,
  z.array(jsonPrimitiveSchema),
  z.record(z.string(), jsonPrimitiveSchema),
]);

const jsonValueL2Schema = z.union([
  jsonValueL1Schema,
  z.array(jsonValueL1Schema),
  z.record(z.string(), jsonValueL1Schema),
]);

const jsonValueL3Schema = z.union([
  jsonValueL2Schema,
  z.array(jsonValueL2Schema),
  z.record(z.string(), jsonValueL2Schema),
]);

const mutationSetSchema = z.object({
  op: z.literal('set'),
  path: z.array(mutationPathSegmentSchema).min(1),
  value: jsonValueL3Schema,
});

const mutationMergeSchema = z.object({
  op: z.literal('merge'),
  path: z.array(mutationPathSegmentSchema).min(1),
  value: z.record(z.string(), jsonValueL3Schema),
});

const mutationAddBlockSchema = z.object({
  op: z.literal('add_block'),
  block: storeBlockSchema,
  afterId: z.string().optional(),
});

const mutationRemoveBlockSchema = z.object({
  op: z.literal('remove_block'),
  blockId: z.string(),
});

const mutationReorderBlocksSchema = z.object({
  op: z.literal('reorder_blocks'),
  orderedIds: z.array(z.string()),
});

const mutationRegenerateBlockSchema = z.object({
  op: z.literal('regenerate_block'),
  blockId: z.string(),
  data: z.record(z.string(), jsonValueL3Schema),
});

export const StoreConfigMutationSchema = z.discriminatedUnion('op', [
  mutationSetSchema,
  mutationMergeSchema,
  mutationAddBlockSchema,
  mutationRemoveBlockSchema,
  mutationReorderBlocksSchema,
  mutationRegenerateBlockSchema,
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

  console.log('[Mutations] applyStoreConfigMutations start');
  const beforeBlocks = nextConfig.pages?.home?.blocks;
  console.log('[Mutations] Block order BEFORE:', beforeBlocks?.map((b) => `${b.blockType} (${b.id})`));

  for (const mutation of mutations) {
    console.log('[Mutations] Applying mutation:', JSON.stringify(mutation));
    if (mutation.op === 'set') {
      setAtPath(nextConfig as Record<string, unknown>, mutation.path, mutation.value);
      continue;
    }

    if (mutation.op === 'merge') {
      mergeAtPath(
        nextConfig as Record<string, unknown>,
        mutation.path,
        mutation.value
      );
      continue;
    }

    // Initialize blocks array if not exists
    if (!nextConfig.pages) {
      nextConfig.pages = { home: { sections: [] } } as any;
    }
    if (!nextConfig.pages.home) {
      nextConfig.pages.home = { sections: [] } as any;
    }
    if (!nextConfig.pages.home.blocks) {
      nextConfig.pages.home.blocks = [];
    }

    switch (mutation.op) {
      case 'add_block': {
        const blocks = nextConfig.pages.home.blocks;
        const { block, afterId } = mutation;
        if (afterId) {
          const index = blocks.findIndex((b) => b.id === afterId);
          if (index !== -1) {
            blocks.splice(index + 1, 0, block);
          } else {
            blocks.push(block);
          }
        } else {
          blocks.push(block);
        }
        break;
      }
      case 'remove_block': {
        const { blockId } = mutation;
        nextConfig.pages.home.blocks = nextConfig.pages.home.blocks.filter(
          (b) => b.id !== blockId
        );
        break;
      }
      case 'reorder_blocks': {
        const { orderedIds } = mutation;
        const blocks = nextConfig.pages.home.blocks;
        const reordered: typeof blocks = [];
        for (const id of orderedIds) {
          const block = blocks.find((b) => b.id === id);
          if (block) {
            reordered.push(block);
          }
        }
        for (const block of blocks) {
          if (!orderedIds.includes(block.id)) {
            reordered.push(block);
          }
        }
        nextConfig.pages.home.blocks = reordered;
        break;
      }
      case 'regenerate_block': {
        const { blockId, data } = mutation;
        nextConfig.pages.home.blocks = nextConfig.pages.home.blocks.map((b) => {
          if (b.id === blockId) {
            return { ...b, data: { ...b.data, ...data } };
          }
          return b;
        });
        break;
      }
    }
  }

  const afterBlocks = nextConfig.pages?.home?.blocks;
  console.log('[Mutations] Block order AFTER:', afterBlocks?.map((b) => `${b.blockType} (${b.id})`));

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
  if ('path' in mutation) {
    return `${mutation.op} ${mutation.path.join('.')}`;
  }
  if (mutation.op === 'add_block') {
    return `add_block ${mutation.block.blockType} (${mutation.block.id})`;
  }
  if (mutation.op === 'remove_block') {
    return `remove_block ${mutation.blockId}`;
  }
  if (mutation.op === 'reorder_blocks') {
    return `reorder_blocks [${mutation.orderedIds.join(', ')}]`;
  }
  if (mutation.op === 'regenerate_block') {
    return `regenerate_block ${mutation.blockId}`;
  }
  return (mutation as any).op;
}

export type {
  StoreConfigMergeMutation,
  StoreConfigMutation,
  StoreConfigMutationBatch,
  StoreConfigSetMutation,
  StoreConfigAddBlockMutation,
  StoreConfigRemoveBlockMutation,
  StoreConfigReorderBlocksMutation,
  StoreConfigRegenerateBlockMutation,
};
