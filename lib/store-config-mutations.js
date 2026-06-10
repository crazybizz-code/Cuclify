"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreConfigMutationBatchSchema = exports.StoreConfigMutationSchema = void 0;
exports.validateStoreConfigMutations = validateStoreConfigMutations;
exports.validateStoreConfigMutationBatch = validateStoreConfigMutationBatch;
exports.applyStoreConfigMutations = applyStoreConfigMutations;
exports.applyStoreConfigMutationBatch = applyStoreConfigMutationBatch;
exports.describeStoreConfigMutation = describeStoreConfigMutation;
const zod_1 = require("zod");
const store_config_schema_1 = require("@/config/store-config.schema");
const mutationPathSegmentSchema = zod_1.z.union([zod_1.z.string(), zod_1.z.number().int()]);
const jsonPrimitiveSchema = zod_1.z.union([
    zod_1.z.string(),
    zod_1.z.number(),
    zod_1.z.boolean(),
    zod_1.z.null(),
]);
const jsonValueL1Schema = zod_1.z.union([
    jsonPrimitiveSchema,
    zod_1.z.array(jsonPrimitiveSchema),
    zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), value: jsonPrimitiveSchema })),
]);
const jsonValueL2Schema = zod_1.z.union([
    jsonValueL1Schema,
    zod_1.z.array(jsonValueL1Schema),
    zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), value: jsonValueL1Schema })),
]);
const jsonValueL3Schema = zod_1.z.union([
    jsonValueL2Schema,
    zod_1.z.array(jsonValueL2Schema),
    zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), value: jsonValueL2Schema })),
]);
const mutationSetSchema = zod_1.z.object({
    op: zod_1.z.literal('set'),
    path: zod_1.z.array(mutationPathSegmentSchema).min(1),
    value: jsonValueL3Schema,
});
const mutationMergeSchema = zod_1.z.object({
    op: zod_1.z.literal('merge'),
    path: zod_1.z.array(mutationPathSegmentSchema).min(1),
    value: zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), value: jsonValueL3Schema })),
});
const mutationAddBlockSchema = zod_1.z.object({
    op: zod_1.z.literal('add_block'),
    block: store_config_schema_1.storeBlockSchema,
    afterId: zod_1.z.string().optional(),
});
const mutationRemoveBlockSchema = zod_1.z.object({
    op: zod_1.z.literal('remove_block'),
    blockId: zod_1.z.string(),
});
const mutationReorderBlocksSchema = zod_1.z.object({
    op: zod_1.z.literal('reorder_blocks'),
    orderedIds: zod_1.z.array(zod_1.z.string()),
});
const mutationRegenerateBlockSchema = zod_1.z.object({
    op: zod_1.z.literal('regenerate_block'),
    blockId: zod_1.z.string(),
    data: zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), value: jsonValueL3Schema })),
});
exports.StoreConfigMutationSchema = zod_1.z.discriminatedUnion('op', [
    mutationSetSchema,
    mutationMergeSchema,
    mutationAddBlockSchema,
    mutationRemoveBlockSchema,
    mutationReorderBlocksSchema,
    mutationRegenerateBlockSchema,
]);
exports.StoreConfigMutationBatchSchema = zod_1.z.object({
    prompt: zod_1.z.string().optional(),
    mutations: zod_1.z.array(exports.StoreConfigMutationSchema).min(1),
});
function normalizeJsonValue(val) {
    if (val === null || val === undefined) {
        return val;
    }
    if (Array.isArray(val)) {
        const isKeyValuePairArray = val.length > 0 && val.every(item => item && typeof item === 'object' && 'key' in item && 'value' in item);
        if (isKeyValuePairArray) {
            const obj = {};
            for (const item of val) {
                obj[item.key] = normalizeJsonValue(item.value);
            }
            return obj;
        }
        return val.map(normalizeJsonValue);
    }
    if (typeof val === 'object') {
        const obj = {};
        for (const key of Object.keys(val)) {
            obj[key] = normalizeJsonValue(val[key]);
        }
        return obj;
    }
    return val;
}
function cloneConfig(config) {
    if (typeof structuredClone === 'function') {
        return structuredClone(config);
    }
    return JSON.parse(JSON.stringify(config));
}
function getParentContainer(root, path) {
    if (path.length === 0) {
        return { container: root, key: undefined };
    }
    let container = root;
    for (let index = 0; index < path.length - 1; index += 1) {
        const segment = path[index];
        if (Array.isArray(container)) {
            const next = container[segment];
            if (next === undefined || next === null) {
                throw new Error(`Cannot resolve array path segment ${String(segment)}`);
            }
            container = next;
            continue;
        }
        if (!(segment in container)) {
            throw new Error(`Cannot resolve object path segment ${String(segment)}`);
        }
        container = container[segment];
    }
    return { container, key: path[path.length - 1] };
}
function setAtPath(root, path, value) {
    if (path.length === 0) {
        throw new Error('Mutation path cannot be empty');
    }
    const { container, key } = getParentContainer(root, path);
    if (key === undefined) {
        throw new Error('Mutation path cannot be empty');
    }
    if (Array.isArray(container)) {
        container[key] = value;
        return;
    }
    container[key] = value;
}
function mergeAtPath(root, path, value) {
    if (path.length === 0) {
        throw new Error('Mutation path cannot be empty');
    }
    const { container, key } = getParentContainer(root, path);
    if (key === undefined) {
        throw new Error('Mutation path cannot be empty');
    }
    if (Array.isArray(container)) {
        const current = container[key];
        if (current === undefined || current === null || Array.isArray(current)) {
            container[key] = { ...value };
            return;
        }
        container[key] = {
            ...current,
            ...value,
        };
        return;
    }
    const current = container[key];
    if (current === undefined || current === null || Array.isArray(current)) {
        container[key] = { ...value };
        return;
    }
    container[key] = {
        ...current,
        ...value,
    };
}
function validateStoreConfigMutations(mutations) {
    return exports.StoreConfigMutationSchema.array().parse(mutations);
}
function validateStoreConfigMutationBatch(batch) {
    return exports.StoreConfigMutationBatchSchema.parse(batch);
}
function applyStoreConfigMutations(baseConfig, mutations) {
    const nextConfig = cloneConfig(baseConfig);
    console.log('[Mutations] applyStoreConfigMutations start');
    const beforeBlocks = nextConfig.pages?.home?.blocks;
    console.log('[Mutations] Block order BEFORE:', beforeBlocks?.map((b) => `${b.blockType} (${b.id})`));
    for (const mutation of mutations) {
        console.log('[Mutations] Applying mutation:', JSON.stringify(mutation));
        if (mutation.op === 'set') {
            const normalizedValue = normalizeJsonValue(mutation.value);
            setAtPath(nextConfig, mutation.path, normalizedValue);
            continue;
        }
        if (mutation.op === 'merge') {
            const normalizedValue = normalizeJsonValue(mutation.value);
            mergeAtPath(nextConfig, mutation.path, normalizedValue);
            continue;
        }
        // Initialize blocks array if not exists
        if (!nextConfig.pages) {
            nextConfig.pages = { home: { sections: [] } };
        }
        if (!nextConfig.pages.home) {
            nextConfig.pages.home = { sections: [] };
        }
        if (!nextConfig.pages.home.blocks) {
            nextConfig.pages.home.blocks = [];
        }
        switch (mutation.op) {
            case 'add_block': {
                const blocks = nextConfig.pages.home.blocks;
                const block = normalizeJsonValue(mutation.block);
                const { afterId } = mutation;
                if (afterId) {
                    const index = blocks.findIndex((b) => b.id === afterId);
                    if (index !== -1) {
                        blocks.splice(index + 1, 0, block);
                    }
                    else {
                        blocks.push(block);
                    }
                }
                else {
                    blocks.push(block);
                }
                break;
            }
            case 'remove_block': {
                const { blockId } = mutation;
                nextConfig.pages.home.blocks = nextConfig.pages.home.blocks.filter((b) => b.id !== blockId);
                break;
            }
            case 'reorder_blocks': {
                const { orderedIds } = mutation;
                const blocks = nextConfig.pages.home.blocks;
                const reordered = [];
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
                const normalizedData = normalizeJsonValue(data);
                nextConfig.pages.home.blocks = nextConfig.pages.home.blocks.map((b) => {
                    if (b.id === blockId) {
                        return { ...b, data: { ...b.data, ...normalizedData } };
                    }
                    return b;
                });
                break;
            }
        }
    }
    const afterBlocks = nextConfig.pages?.home?.blocks;
    console.log('[Mutations] Block order AFTER:', afterBlocks?.map((b) => `${b.blockType} (${b.id})`));
    return store_config_schema_1.StoreConfigSchema.parse(nextConfig);
}
function applyStoreConfigMutationBatch(baseConfig, batch) {
    const parsed = validateStoreConfigMutationBatch(batch);
    return applyStoreConfigMutations(baseConfig, parsed.mutations);
}
function describeStoreConfigMutation(mutation) {
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
    return mutation.op;
}
