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
Your job is to translate the user's natural language request into a set of precise JSON mutations.

Current StoreConfig:
${JSON.stringify(config, null, 2)}

User Request:
${prompt}

Instructions:
- Use the "set" operation to completely replace a value at a given path.
- Use the "merge" operation to partially update an object at a given path.
- The path is an array of strings or numbers, e.g., ["pages", "home", "sections"].
- Determine the correct path in the StoreConfig based on the user's request.
- Generate a summary array of what was changed.
- If the user asks for color changes, typical tokens are "primary", "secondary", "background", "foreground", "muted", "accent", "border", "card". Update them in both "light" and "dark" theme modes if not specified.
- If the user asks for section changes on the homepage, the sections array path is ["pages", "home", "sections"].

Output the mutations and summary strictly matching the required schema.`,
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
