import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { getAccessTokenFromCookieHeader } from '@/lib/request-auth';
import { getCurrentUser } from '@/lib/supabase-auth';
import { createProjectRow } from '@/lib/project-repo';
import { blankStoreConfig } from '@/config/blank-store-config';
import { StoreConfigSchema } from '@/config/store-config.schema';

// Genesis Output Schema
const GenesisResponseSchema = z.object({
  analysis: z.object({
    industry: z.string(),
    audience: z.string(),
    style: z.string(),
  }),
  brand: z.object({
    name: z.string(),
    logoAlt: z.string(),
    tagline: z.string(),
  }),
  theme: z.object({
    colors: z.object({
      light: z.object({
        primary: z.string(),
        secondary: z.string(),
        accent: z.string(),
      }),
      dark: z.object({
        primary: z.string(),
        secondary: z.string(),
        accent: z.string(),
      }),
    }),
    typography: z.object({
      fontSans: z.string(),
      fontSerif: z.string(),
    }),
  }),
  pages: z.object({
    home: z.object({
      hero: z.object({
        headline: z.string(),
        subheadline: z.string(),
      }),
      benefits: z.object({
        title: z.string(),
        subtitle: z.string(),
        benefits: z.array(z.object({
          id: z.string(),
          icon: z.string(),
          title: z.string(),
          description: z.string(),
        })).length(4),
      }),
      promo: z.object({
        headline: z.string(),
        subheadline: z.string(),
      }),
      testimonials: z.object({
        title: z.string(),
        subtitle: z.string(),
        testimonials: z.array(z.object({
          id: z.string(),
          content: z.string(),
          author: z.object({
            name: z.string(),
            title: z.string(),
          }),
          rating: z.number(),
        })).length(3),
      }),
      faq: z.object({
        title: z.string(),
        subtitle: z.string(),
        items: z.array(z.object({
          id: z.string(),
          question: z.string(),
          answer: z.string(),
        })).length(5),
      }),
    }),
  }),
});

export async function POST(request: Request) {
  try {
    const accessToken = getAccessTokenFromCookieHeader(request.headers.get('cookie'));
    if (!accessToken) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ ok: false, error: 'Prompt is required' }, { status: 400 });
    }

    const user = await getCurrentUser(accessToken);

    // Call the LLM to generate the store identity and content
    const { object: genesis } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: GenesisResponseSchema,
      prompt: `You are an expert e-commerce brand architect. 
Based on the following user request, generate a complete, cohesive, and premium store configuration.

User Request: "${prompt}"

Instructions:
0. Analysis: Identify the industry, target audience, and brand style from the request.
1. Brand: Create a unique, memorable brand name and tagline.
2. Theme: Choose elegant primary, secondary, and accent colors in OKLCH format (e.g., "oklch(0.6 0.2 250)"). Pick high-end Google Fonts for sans and serif (e.g., "Inter", "Playfair Display").
3. Hero: Write a compelling headline and subheadline.
4. Benefits: Create 4 distinct value propositions with Lucide icon names (e.g., "truck", "shield", "star", "heart").
5. Promo: Create a localized promotional message.
6. Testimonials: Write 3 believable customer reviews.
7. FAQ: Create 5 relevant frequently asked questions.

Style Guide:
- Tone: Professional, inviting, and industry-appropriate.
- Colors: Ensure high contrast and accessibility.
- Content: Avoid generic placeholders; be specific to the brand concept.`,
    });

    // Construct the final StoreConfig by merging genesis data into blankStoreConfig
    const finalConfig = {
      ...blankStoreConfig,
      brand: {
        ...blankStoreConfig.brand,
        name: genesis.brand.name,
        logoAlt: genesis.brand.logoAlt,
        tagline: genesis.brand.tagline,
      },
      seo: {
        ...blankStoreConfig.seo,
        title: `${genesis.brand.name} | ${genesis.brand.tagline}`,
        description: genesis.pages.home.hero.subheadline,
      },
      theme: {
        ...blankStoreConfig.theme,
        colors: {
          light: {
            ...blankStoreConfig.theme.colors.light,
            primary: genesis.theme.colors.light.primary,
            secondary: genesis.theme.colors.light.secondary,
            accent: genesis.theme.colors.light.accent,
          },
          dark: {
            ...blankStoreConfig.theme.colors.dark,
            primary: genesis.theme.colors.dark.primary,
            secondary: genesis.theme.colors.dark.secondary,
            accent: genesis.theme.colors.dark.accent,
          },
        },
        typography: {
          ...blankStoreConfig.theme.typography,
          fontSans: genesis.theme.typography.fontSans,
          fontSerif: genesis.theme.typography.fontSerif,
        },
      },
      pages: {
        ...blankStoreConfig.pages,
        home: {
          ...blankStoreConfig.pages.home,
          hero: {
            ...blankStoreConfig.pages.home.hero,
            headline: genesis.pages.home.hero.headline,
            subheadline: genesis.pages.home.hero.subheadline,
          },
          benefits: {
            ...blankStoreConfig.pages.home.benefits,
            title: genesis.pages.home.benefits.title,
            subtitle: genesis.pages.home.benefits.subtitle,
            benefits: genesis.pages.home.benefits.benefits,
          },
          promo: {
            ...blankStoreConfig.pages.home.promo,
            headline: genesis.pages.home.promo.headline,
            subheadline: genesis.pages.home.promo.subheadline,
          },
          testimonials: {
            ...blankStoreConfig.pages.home.testimonials,
            title: genesis.pages.home.testimonials.title,
            subtitle: genesis.pages.home.testimonials.subtitle,
            testimonials: genesis.pages.home.testimonials.testimonials,
          },
          faq: {
            ...blankStoreConfig.pages.home.faq,
            title: genesis.pages.home.faq.title,
            subtitle: genesis.pages.home.faq.subtitle,
            items: genesis.pages.home.faq.items,
          },
        },
      },
      footer: {
        ...blankStoreConfig.footer,
        brand: {
          ...blankStoreConfig.footer.brand,
          name: genesis.brand.name,
          tagline: genesis.brand.tagline,
        },
        copyright: `© ${new Date().getFullYear()} ${genesis.brand.name}. All rights reserved.`,
      },
    };

    // Validate the assembled config against the StoreConfig schema
    const validationResult = StoreConfigSchema.safeParse(finalConfig);
    if (!validationResult.success) {
      console.error('[Genesis] StoreConfig validation failed:', validationResult.error.flatten());
      return NextResponse.json(
        { ok: false, error: 'Generated config failed validation', details: validationResult.error.flatten() },
        { status: 500 }
      );
    }

    // Persist the project to Supabase
    console.log('[Genesis] Creating project row for user:', user.id);
    const project = await createProjectRow(
      accessToken,
      user.id,
      genesis.brand.name,
      validationResult.data
    );
    console.log('[Genesis] Project created:', project.id);

    // Return project + genesis preview data
    return NextResponse.json({ ok: true, project, genesis });
  } catch (error) {
    console.error('Genesis Engine Error:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to generate store' },
      { status: 500 }
    );
  }
}
