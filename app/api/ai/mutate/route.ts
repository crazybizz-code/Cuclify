import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { StoreConfigMutationSchema } from '@/lib/store-config-mutations';
import { getAccessTokenFromCookieHeader } from '@/lib/request-auth';

// We define the schema we want the LLM to output
const ResponseSchema = z.object({
  prompt: z.string().describe('The normalized version of the user\'s prompt.'),
  mutations: z.array(StoreConfigMutationSchema).min(1).describe('The sequence of JSON mutations to apply to the StoreConfig.'),
  summary: z.array(z.string()).describe('A list of human-readable strings summarizing the changes made.'),
});

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

    // Call the LLM with structured output
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: ResponseSchema,
      prompt: `You are an AI planner for an e-commerce template engine.
Your job is to translate the user's natural language request into a sequence of precise JSON mutations.

Current StoreConfig:
${JSON.stringify(config, null, 2)}

User Request:
${prompt}

Instructions:
1. Core Mutations:
   - Use the "set" operation to completely replace a value at a given path.
   - Use the "merge" operation to partially update an object at a given path.

2. Visual Token Map (Theme Customization):
   - To modify colors, update the 26 tokens across light/dark themes:
     Paths: ["theme", "colors", "light", "<token>"] and ["theme", "colors", "dark", "<token>"]
     Tokens: primary, primaryForeground, secondary, secondaryForeground, background, foreground, muted, mutedForeground, accent, accentForeground, border, card, cardForeground.
   - To modify typography, use:
     - ["theme", "typography", "fontSans"] (Default Sans font)
     - ["theme", "typography", "fontSerif"] (Serif font)
     - ["theme", "typography", "fontMono"] (Monospace font)
     - ["theme", "typography", "headingWeight"] (e.g. "600", "700")
     - ["theme", "typography", "bodyWeight"] (e.g. "400", "500")
   - To modify spacing, use:
     - ["theme", "spacing", "sectionPadding"] (Default section padding class, e.g. "py-16 md:py-24")
     - ["theme", "spacing", "containerMaxWidth"] (Default container width, e.g. "max-w-7xl")
     - ["theme", "spacing", "gap"] (e.g. "gap-8")
   - To modify border radius: ["theme", "borderRadius"] (e.g. "0.75rem")

3. Block Operations (Home Page Blocks):
   - Use the block operations to modify blocks in "pages.home.blocks".
   - Operations:
     - "add_block":
       Adds a new block to "pages.home.blocks".
       Schema: { op: "add_block", block: StoreBlock, afterId?: string }
       StoreBlock has blockType ('hero' | 'categoryGrid' | 'featuredProducts' | 'benefits' | 'promoBanner' | 'testimonials' | 'faq'), a unique id (e.g., 'hero-abc123' or 'testimonials-xyz789'), data matching the schema of that blockType, and an optional style object { background?: string, textColor?: string, padding?: string, layout?: 'full-width' | 'contained' | 'narrow' }.
       Example:
       {
         "op": "add_block",
         "block": {
           "blockType": "hero",
           "id": "hero-promo-summer",
           "data": {
             "badge": "SUMMER",
             "headline": "Summer Mega Sale",
             "subheadline": "Up to 50% off everything",
             "buttons": [{"label": "Shop Now", "href": "/products", "variant": "primary"}]
           },
           "style": { "background": "oklch(0.65 0.15 45)", "textColor": "#ffffff", "padding": "4rem 2rem", "layout": "contained" }
         },
         "afterId": "hero-default"
       }
     - "remove_block":
       Removes a block by id from "pages.home.blocks".
       Schema: { op: "remove_block", blockId: string }
       Example: { "op": "remove_block", "blockId": "faq-default" }
     - "reorder_blocks":
       Reorders all blocks in "pages.home.blocks".
       Schema: { op: "reorder_blocks", orderedIds: string[] }
       Example: { "op": "reorder_blocks", "orderedIds": ["hero-default", "featuredProducts-default", "faq-default"] }
     - "regenerate_block":
       Updates data of an existing block in "pages.home.blocks".
       Schema: { op: "regenerate_block", blockId: string, data: any }
       Example: { "op": "regenerate_block", "blockId": "hero-default", "data": { "headline": "New Headline Here" } }

Note:
- Use stable block IDs from the current config when referencing blocks.
- Generate a summary array summarizing the changes made.
- Produce output strictly conforming to the ResponseSchema.`,
    });

    return NextResponse.json({ ok: true, plan: object });
  } catch (error) {
    console.error('AI Mutation Error:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to generate mutations' },
      { status: 500 }
    );
  }
}
