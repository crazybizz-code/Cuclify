import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getAIModel, mapAIError } from '@/lib/ai-provider';
import { StoreConfigMutationSchema } from '@/lib/store-config-mutations';
import { getAccessTokenFromCookieHeader } from '@/lib/request-auth';

// We define the schema we want the LLM to output
const ResponseSchema = z.object({
  prompt: z.string().describe('The normalized version of the user\'s prompt.'),
  mutations: z.array(StoreConfigMutationSchema).min(1).describe('The sequence of JSON mutations to apply to the StoreConfig.'),
  summary: z.array(z.string()).describe('A list of human-readable strings summarizing the changes made.'),
});

// ─── Legacy-path guardrails ──────────────────────────────────────────────────
// These paths exist in StoreConfigSchema but are NOT correct targets for AI set/merge
// mutations — content must be edited via regenerate_block on the matching block instead.
const LEGACY_BLOCK_PATH_PREFIXES = [
  ['pages', 'home', 'hero'],
  ['pages', 'home', 'benefits'],
  ['pages', 'home', 'promo'],
  ['pages', 'home', 'testimonials'],
  ['pages', 'home', 'faq'],
];

function detectLegacyPath(path: (string | number)[]): string | null {
  for (const prefix of LEGACY_BLOCK_PATH_PREFIXES) {
    if (
      prefix.length <= path.length &&
      prefix.every((seg, i) => seg === path[i])
    ) {
      return prefix.join('.');
    }
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const accessToken = getAccessTokenFromCookieHeader(request.headers.get('cookie'));
    if (!accessToken) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, config } = await request.json();

    if (!prompt) {
      return NextResponse.json({ ok: false, error: 'Prompt is required' }, { status: 400 });
    }

    if (!config) {
      return NextResponse.json({ ok: false, error: 'Config is required' }, { status: 400 });
    }

    // Build block ID context string for the AI
    const blocks: Array<{ blockType: string; id: string }> = config?.pages?.home?.blocks ?? [];
    const blockSummary = blocks.length > 0
      ? blocks.map((b: { blockType: string; id: string }) => `  - blockType: "${b.blockType}", id: "${b.id}"`).join('\n')
      : '  (no blocks yet — use add_block to create the initial layout)';

    // Call the LLM with structured output
    const { object } = await generateObject({
      model: getAIModel(),
      schema: ResponseSchema,
      prompt: `You are an AI mutation planner for Cuclify, an e-commerce store builder.
Your job is to translate the user's natural language request into a precise sequence of JSON mutations applied to the StoreConfig object.

## ARCHITECTURE — READ CAREFULLY

The store homepage is built from an ordered array of blocks stored at:
  config.pages.home.blocks[]

Each block has: { blockType, id, data, style }

Block types available:
  - "hero"             — headline, subheadline, badge, buttons (ALWAYS array), image, backgroundImage, alignment, overlayOpacity
  - "categoryGrid"     — title, subtitle, categories[], columns
  - "featuredProducts" — title, subtitle, products[], viewAllLink, columns
  - "benefits"         — title, subtitle, benefits[], layout
  - "promoBanner"      — headline, subheadline, backgroundImage, backgroundColor, textColor, button, countdown
  - "testimonials"     — title, subtitle, testimonials[], layout
  - "faq"              — title, subtitle, items[], contactLink

IMPORTANT: pages.home.hero, pages.home.benefits, pages.home.promo, pages.home.testimonials, pages.home.faq
are SCHEMA-ONLY LEGACY PATHS and MUST NEVER be used as targets for set/merge operations.
All homepage content mutations MUST use the block operations below.

## CURRENT BLOCKS IN THIS STORE

${blockSummary}

## CURRENT STORECONFIG

${JSON.stringify(config, null, 2)}

## USER REQUEST

${prompt}

---

## MUTATION OPERATIONS

### 1. set — Replace a scalar or primitive value at a top-level config path
Use ONLY for non-block, non-homepage-content fields:
  - theme.colors.light.<token>   e.g. ["theme","colors","light","primary"]
  - theme.colors.dark.<token>    e.g. ["theme","colors","dark","background"]
  - theme.typography.<field>     e.g. ["theme","typography","fontSans"]
  - theme.borderRadius           e.g. ["theme","borderRadius"]
  - brand.<field>                e.g. ["brand","name"], ["brand","tagline"]
  - seo.<field>                  e.g. ["seo","title"]
  - navigation.navbar.<field>    e.g. ["navigation","navbar","searchPlaceholder"]
  - commerce.<field>             e.g. ["commerce","currency"]
  - footer.<field>               e.g. ["footer","copyright"]
  - catalog.categories.title     e.g. ["catalog","categories","title"]
  - catalog.products.title       e.g. ["catalog","products","title"]

Available theme color tokens: primary, primaryForeground, secondary, secondaryForeground,
background, foreground, muted, mutedForeground, accent, accentForeground, border, card, cardForeground.

Example set:
  { "op": "set", "path": ["theme","colors","light","primary"], "value": "oklch(0.65 0.15 45)" }

### 2. merge — Partially update an object at a top-level path
Use the same restricted path list as set. Value must be an array of { key, value } pairs.

Example merge:
  { "op": "merge", "path": ["brand"], "value": [{ "key": "tagline", "value": "New tagline" }] }

### 3. regenerate_block — Update a block's data by id
ALWAYS use this to change homepage section content (hero text, testimonials, FAQs, benefits, etc.).
Merges the given data into the existing block data — only include fields you want to change.
Data value must be an array of { key, value } pairs.

IMPORTANT for "hero" blocks:
  - "buttons" field MUST always be an ARRAY, never a single object.
  - Each button: { "label": string, "href": string, "variant": "primary" | "secondary" | "outline" }

Example regenerate_block:
  {
    "op": "regenerate_block",
    "blockId": "hero-default",
    "data": [
      { "key": "headline", "value": "Summer Collection 2025" },
      { "key": "subheadline", "value": "Discover premium styles" },
      { "key": "buttons", "value": [{"label":"Shop Now","href":"/products","variant":"primary"}] }
    ]
  }

### 4. add_block — Add a new block to pages.home.blocks
{
  "op": "add_block",
  "block": {
    "blockType": "<type>",
    "id": "<unique-id-e.g.-testimonials-premium-abc123>",
    "data": { ...complete data matching the block type schema... },
    "style": null
  },
  "afterId": "<existing-block-id-or-null>"
}

For add_block, hero "data.buttons" MUST be an array:
  "buttons": [{"label":"Shop Now","href":"/products","variant":"primary"}]

### 5. remove_block — Remove a block by id
  { "op": "remove_block", "blockId": "<id>" }

### 6. reorder_blocks — Reorder all blocks
  { "op": "reorder_blocks", "orderedIds": ["hero-default", "benefits-default", "..."] }

---

## PRESET ACTION GUIDANCE

"Make it premium":
  - Upgrade theme colors to a dark, elegant palette (deep navy/charcoal with gold accent)
  - Use regenerate_block on hero to update headline copy to be luxurious
  - Upgrade typography: set fontSans to "Playfair Display" or "Cormorant"

"Create dark mode":
  - Update theme.colors.dark.background to a very dark value (oklch(0.08 0.01 60))
  - Update theme.colors.dark.foreground to near-white (oklch(0.96 0.005 80))
  - Update theme.colors.dark.primary and accent accordingly
  - Do NOT change theme.colors.light

"Improve conversion":
  - Use regenerate_block on hero to add a strong CTA button if missing
  - Ensure buttons array has at least one primary button
  - Use add_block to add a testimonials block if not present
  - Add a promoBanner block with a discount offer

"Add testimonials":
  - If a testimonials block exists, use regenerate_block to populate it with 3 compelling testimonials
  - If no testimonials block exists, use add_block to create one

"Generate products":
  - Update catalog.products.products via set on path ["catalog","products","products"]

---

Generate mutations. Produce a summary array describing the changes. Conform strictly to the ResponseSchema.`,
    });

    // ── Post-generation guardrail: reject any set/merge targeting legacy block paths ──
    for (const mutation of object.mutations) {
      if (mutation.op === 'set' || mutation.op === 'merge') {
        const legacy = detectLegacyPath(mutation.path as (string | number)[]);
        if (legacy) {
          console.error(`[Mutate] AI generated a legacy path mutation: ${legacy}. Rejecting.`);
          return NextResponse.json(
            {
              ok: false,
              error: `Invalid mutation: path "${legacy}" is a legacy schema path. Use regenerate_block to update homepage block content.`,
            },
            { status: 422 }
          );
        }
      }
    }

    return NextResponse.json({ ok: true, plan: object });
  } catch (error) {
    console.error('AI Mutation Error:', error);
    return NextResponse.json(
      { ok: false, error: mapAIError(error) },
      { status: 500 }
    );
  }
}
