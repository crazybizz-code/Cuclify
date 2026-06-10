"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreConfigMutationBatchSchema = exports.StoreConfigMutationSchema = void 0;
exports.validateStoreConfigMutations = validateStoreConfigMutations;
exports.validateStoreConfigMutationBatch = validateStoreConfigMutationBatch;
exports.applyStoreConfigMutations = applyStoreConfigMutations;
exports.applyStoreConfigMutationBatch = applyStoreConfigMutationBatch;
exports.describeStoreConfigMutation = describeStoreConfigMutation;
var zod_1 = require("zod");
var store_config_schema_1 = require("@/config/store-config.schema");
var mutationPathSegmentSchema = zod_1.z.union([zod_1.z.string(), zod_1.z.number().int()]);
var jsonPrimitiveSchema = zod_1.z.union([
    zod_1.z.string(),
    zod_1.z.number(),
    zod_1.z.boolean(),
    zod_1.z.null(),
]);
var jsonValueL1Schema = zod_1.z.union([
    jsonPrimitiveSchema,
    zod_1.z.array(jsonPrimitiveSchema),
    zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), value: jsonPrimitiveSchema })),
]);
var jsonValueL2Schema = zod_1.z.union([
    jsonValueL1Schema,
    zod_1.z.array(jsonValueL1Schema),
    zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), value: jsonValueL1Schema })),
]);
var jsonValueL3Schema = zod_1.z.union([
    jsonValueL2Schema,
    zod_1.z.array(jsonValueL2Schema),
    zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), value: jsonValueL2Schema })),
]);
var mutationSetSchema = zod_1.z.object({
    op: zod_1.z.literal('set'),
    path: zod_1.z.array(mutationPathSegmentSchema).min(1),
    value: jsonValueL3Schema,
});
var mutationMergeSchema = zod_1.z.object({
    op: zod_1.z.literal('merge'),
    path: zod_1.z.array(mutationPathSegmentSchema).min(1),
    value: zod_1.z.array(zod_1.z.object({ key: zod_1.z.string(), value: jsonValueL3Schema })),
});
var mutationAddBlockSchema = zod_1.z.object({
    op: zod_1.z.literal('add_block'),
    block: store_config_schema_1.storeBlockSchema,
    afterId: zod_1.z.string().optional(),
});
var mutationRemoveBlockSchema = zod_1.z.object({
    op: zod_1.z.literal('remove_block'),
    blockId: zod_1.z.string(),
});
var mutationReorderBlocksSchema = zod_1.z.object({
    op: zod_1.z.literal('reorder_blocks'),
    orderedIds: zod_1.z.array(zod_1.z.string()),
});
var mutationRegenerateBlockSchema = zod_1.z.object({
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
        var isKeyValuePairArray = val.length > 0 && val.every(function (item) { return item && typeof item === 'object' && 'key' in item && 'value' in item; });
        if (isKeyValuePairArray) {
            var obj = {};
            for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
                var item = val_1[_i];
                obj[item.key] = normalizeJsonValue(item.value);
            }
            return obj;
        }
        return val.map(normalizeJsonValue);
    }
    if (typeof val === 'object') {
        var obj = {};
        for (var _a = 0, _b = Object.keys(val); _a < _b.length; _a++) {
            var key = _b[_a];
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
    var container = root;
    for (var index = 0; index < path.length - 1; index += 1) {
        var segment = path[index];
        if (Array.isArray(container)) {
            var next = container[segment];
            if (next === undefined || next === null) {
                throw new Error("Cannot resolve array path segment ".concat(String(segment)));
            }
            container = next;
            continue;
        }
        if (!(segment in container)) {
            throw new Error("Cannot resolve object path segment ".concat(String(segment)));
        }
        container = container[segment];
    }
    return { container: container, key: path[path.length - 1] };
}
function setAtPath(root, path, value) {
    if (path.length === 0) {
        throw new Error('Mutation path cannot be empty');
    }
    var _a = getParentContainer(root, path), container = _a.container, key = _a.key;
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
    var _a = getParentContainer(root, path), container = _a.container, key = _a.key;
    if (key === undefined) {
        throw new Error('Mutation path cannot be empty');
    }
    if (Array.isArray(container)) {
        var current_1 = container[key];
        if (current_1 === undefined || current_1 === null || Array.isArray(current_1)) {
            container[key] = __assign({}, value);
            return;
        }
        container[key] = __assign(__assign({}, current_1), value);
        return;
    }
    var current = container[key];
    if (current === undefined || current === null || Array.isArray(current)) {
        container[key] = __assign({}, value);
        return;
    }
    container[key] = __assign(__assign({}, current), value);
}
function validateStoreConfigMutations(mutations) {
    return exports.StoreConfigMutationSchema.array().parse(mutations);
}
function validateStoreConfigMutationBatch(batch) {
    return exports.StoreConfigMutationBatchSchema.parse(batch);
}
function applyStoreConfigMutations(baseConfig, mutations) {
    var _a, _b, _c, _d;
    var nextConfig = cloneConfig(baseConfig);
    console.log('[Mutations] applyStoreConfigMutations start');
    var beforeBlocks = (_b = (_a = nextConfig.pages) === null || _a === void 0 ? void 0 : _a.home) === null || _b === void 0 ? void 0 : _b.blocks;
    console.log('[Mutations] Block order BEFORE:', beforeBlocks === null || beforeBlocks === void 0 ? void 0 : beforeBlocks.map(function (b) { return "".concat(b.blockType, " (").concat(b.id, ")"); }));
    var _loop_1 = function (mutation) {
        console.log('[Mutations] Applying mutation:', JSON.stringify(mutation));
        if (mutation.op === 'set') {
            var normalizedValue = normalizeJsonValue(mutation.value);
            setAtPath(nextConfig, mutation.path, normalizedValue);
            return "continue";
        }
        if (mutation.op === 'merge') {
            var normalizedValue = normalizeJsonValue(mutation.value);
            mergeAtPath(nextConfig, mutation.path, normalizedValue);
            return "continue";
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
                var blocks = nextConfig.pages.home.blocks;
                var block = normalizeJsonValue(mutation.block);
                var afterId_1 = mutation.afterId;
                if (afterId_1) {
                    var index = blocks.findIndex(function (b) { return b.id === afterId_1; });
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
                var blockId_1 = mutation.blockId;
                nextConfig.pages.home.blocks = nextConfig.pages.home.blocks.filter(function (b) { return b.id !== blockId_1; });
                break;
            }
            case 'reorder_blocks': {
                var orderedIds = mutation.orderedIds;
                var blocks = nextConfig.pages.home.blocks;
                var reordered = [];
                var _loop_2 = function (id) {
                    var block = blocks.find(function (b) { return b.id === id; });
                    if (block) {
                        reordered.push(block);
                    }
                };
                for (var _e = 0, orderedIds_1 = orderedIds; _e < orderedIds_1.length; _e++) {
                    var id = orderedIds_1[_e];
                    _loop_2(id);
                }
                for (var _f = 0, blocks_1 = blocks; _f < blocks_1.length; _f++) {
                    var block = blocks_1[_f];
                    if (!orderedIds.includes(block.id)) {
                        reordered.push(block);
                    }
                }
                nextConfig.pages.home.blocks = reordered;
                break;
            }
            case 'regenerate_block': {
                var blockId_2 = mutation.blockId, data = mutation.data;
                var normalizedData_1 = normalizeJsonValue(data);
                nextConfig.pages.home.blocks = nextConfig.pages.home.blocks.map(function (b) {
                    if (b.id === blockId_2) {
                        return __assign(__assign({}, b), { data: __assign(__assign({}, b.data), normalizedData_1) });
                    }
                    return b;
                });
                break;
            }
        }
    };
    for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
        var mutation = mutations_1[_i];
        _loop_1(mutation);
    }
    var afterBlocks = (_d = (_c = nextConfig.pages) === null || _c === void 0 ? void 0 : _c.home) === null || _d === void 0 ? void 0 : _d.blocks;
    console.log('[Mutations] Block order AFTER:', afterBlocks === null || afterBlocks === void 0 ? void 0 : afterBlocks.map(function (b) { return "".concat(b.blockType, " (").concat(b.id, ")"); }));
    return store_config_schema_1.StoreConfigSchema.parse(nextConfig);
}
function applyStoreConfigMutationBatch(baseConfig, batch) {
    var parsed = validateStoreConfigMutationBatch(batch);
    return applyStoreConfigMutations(baseConfig, parsed.mutations);
}
function describeStoreConfigMutation(mutation) {
    if ('path' in mutation) {
        return "".concat(mutation.op, " ").concat(mutation.path.join('.'));
    }
    if (mutation.op === 'add_block') {
        return "add_block ".concat(mutation.block.blockType, " (").concat(mutation.block.id, ")");
    }
    if (mutation.op === 'remove_block') {
        return "remove_block ".concat(mutation.blockId);
    }
    if (mutation.op === 'reorder_blocks') {
        return "reorder_blocks [".concat(mutation.orderedIds.join(', '), "]");
    }
    if (mutation.op === 'regenerate_block') {
        return "regenerate_block ".concat(mutation.blockId);
    }
    return mutation.op;
}
