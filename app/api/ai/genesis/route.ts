import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { getAccessTokenFromCookieHeader } from '@/lib/request-auth';
import { getCurrentUser } from '@/lib/supabase-auth';
import { createProjectRow } from '@/lib/project-repo';
import { blankStoreConfig } from '@/config/blank-store-config';
import { StoreConfigSchema } from '@/config/store-config.schema';

// Helper for deterministic currency mapping
function getCurrencyForMarket(market: string): string {
  const m = market.toLowerCase();
  if (m.includes('uzbekistan') || m.includes('uzb') || m.includes('uz')) return 'UZS';
  if (m.includes('united kingdom') || m.includes('uk') || m.includes('gb') || m.includes('london')) return 'GBP';
  if (m.includes('europe') || m.includes('eu') || m.includes('euro') || m.includes('germany') || m.includes('france') || m.includes('spain') || m.includes('italy')) return 'EUR';
  if (m.includes('japan') || m.includes('jp') || m.includes('tokyo')) return 'JPY';
  if (m.includes('kazakhstan') || m.includes('kz') || m.includes('almaty')) return 'KZT';
  if (m.includes('russia') || m.includes('ru') || m.includes('moscow')) return 'RUB';
  if (m.includes('turkey') || m.includes('tr') || m.includes('istanbul')) return 'TRY';
  return 'USD'; // default
}

// ─── Stage 1 Schema ──────────────────────────────────────────────────────────
const Stage1ResponseSchema = z.object({
  dna: z.object({
    businessType: z.string(),
    industryTemplate: z.enum([
      'electronics',
      'fashion',
      'beauty',
      'furniture',
      'food',
      'sports',
      'books',
      'generic',
    ]),
    market: z.string(),
    audience: z.string(),
    tone: z.string(),
    style: z.string(),
    language: z.string(),
  }),
  brand: z.object({
    name: z.string(),
    logoAlt: z.string(),
    tagline: z.string(),
    story: z.string(),
    voice: z.string(),
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
  categories: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.string(),
    href: z.string(),
  })).length(4),
});

// ─── Stage 2 Parallel Schemas ────────────────────────────────────────────────
const NavbarSchema = z.object({
  navbar: z.object({
    links: z.array(z.object({
      id: z.string(),
      label: z.string(),
      href: z.string(),
    })),
    searchPlaceholder: z.string(),
  }),
});

const ProductsSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    currency: z.string(),
    images: z.array(z.string()),
    category: z.string(),
    inStock: z.boolean(),
    href: z.string(),
  })).length(6),
});

const HomepageBlocksSchema = z.object({
  blockOrder: z.array(z.enum([
    'hero',
    'categoryGrid',
    'featuredProducts',
    'benefits',
    'promoBanner',
    'testimonials',
    'faq',
  ])),
});

const TestimonialsFaqSchema = z.object({
  testimonials: z.array(z.object({
    id: z.string(),
    content: z.string(),
    author: z.object({
      name: z.string(),
      title: z.string(),
    }),
    rating: z.number(),
  })).length(3),
  faq: z.array(z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
  })).length(5),
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

    // Stage 1: Brand & DNA & Categories Generation
    const { object: stage1 } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: Stage1ResponseSchema,
      prompt: `You are an expert e-commerce brand architect. Based on the user prompt, analyze the business requirements and generate the Store DNA, Brand Positioning, Visual Identity Theme, and custom categories.

User Prompt: "${prompt}"

Instructions:
1. DNA: Identify the e-commerce business type (businessType), local market, target audience, style, language code (e.g. "en", "uz") appropriate for the market, and assign the most matching industryTemplate ('electronics' | 'fashion' | 'beauty' | 'furniture' | 'food' | 'sports' | 'books' | 'generic').
2. Brand: Create a premium brand name, compelling tagline, story, and voice.
3. Colors: Choose elegant, accessible primary, secondary, and accent colors in OKLCH format (e.g. "oklch(0.65 0.15 45)") for both light and dark themes. Ensure high contrast.
4. Typography: Choose high-end Google Fonts for fontSans and fontSerif.
5. Categories: Generate exactly 4 product categories suitable for this business. Use "/placeholder.svg" for category images.
6. Language: Ensure all generated copy (tagline, brand story, brand voice description, category names, and category descriptions) is written entirely in the identified local language code (e.g. if the market is Uzbekistan, identify "uz" and write all brand story/tagline/categories/etc. copy in Uzbek).`,
    });

    // Code-driven deterministic currency mapping
    const detectedCurrency = getCurrencyForMarket(stage1.dna.market);

    const dna = {
      ...stage1.dna,
      currency: detectedCurrency,
    };
    const brand = stage1.brand;
    const categories = stage1.categories;

    // Stage 2: Parallel Content Generation
    const [taskA, taskB, taskC, taskD] = await Promise.all([
      generateObject({
        model: google('gemini-2.5-flash'),
        schema: NavbarSchema,
        prompt: `Using the following Store DNA context, Brand Identity, and Categories:
Store DNA: ${JSON.stringify(dna)}
Brand Config: ${JSON.stringify(brand)}
Categories: ${JSON.stringify(categories)}

Generate custom navigation bar links adapted to this e-commerce business type.
All text copy must be fully written in the language "${dna.language}".
Navigation links must contain: Home ("/"), Categories (e.g., "/#categories"), Products ("/products"), About (e.g. "/#about"), Contact (e.g. "/#contact"). Make sure links are adapted to the business context.`,
      }).then((r) => r.object),

      generateObject({
        model: google('gemini-2.5-flash'),
        schema: ProductsSchema,
        prompt: `Using the following Store DNA context and Categories:
Store DNA: ${JSON.stringify(dna)}
Categories: ${JSON.stringify(categories)}

Generate exactly 6 realistic e-commerce products for this store catalog.
Ensure product prices are set in the currency "${dna.currency}" with realistic price values.
Ensure each product's "category" field matches the "name" of one of the generated categories exactly.
All copy (names, descriptions) must be written in the language "${dna.language}".
Use ["/placeholder.svg"] for all product images.`,
      }).then((r) => r.object),

      generateObject({
        model: google('gemini-2.5-flash'),
        schema: HomepageBlocksSchema,
        prompt: `Using the following Store DNA context and Brand:
Store DNA: ${JSON.stringify(dna)}
Brand Name: ${brand.name}

Decide on the most conversion-focused layout order for the homepage blocks for this specific e-commerce business type.
Select from: hero, categoryGrid, featuredProducts, benefits, promoBanner, testimonials, faq.
You must order these 7 block types based on what is most appropriate for the business concept (e.g. electronics might start with hero -> benefits -> categories -> featuredProducts -> promoBanner -> testimonials -> faq).`,
      }).then((r) => r.object),

      generateObject({
        model: google('gemini-2.5-flash'),
        schema: TestimonialsFaqSchema,
        prompt: `Using the following Store DNA context and Brand Positioning:
Store DNA: ${JSON.stringify(dna)}
Brand Config: ${JSON.stringify(brand)}

Generate exactly 3 customer testimonials and exactly 5 e-commerce FAQs (such as shipping, returns, warranty, local payment methods).
All copy must match the brand voice and tone and be written in the language "${dna.language}".`,
      }).then((r) => r.object),
    ]);

    // Construct the final StoreConfig by merging genesis data into blankStoreConfig
    const finalConfig = {
      ...blankStoreConfig,
      brand: {
        ...blankStoreConfig.brand,
        name: brand.name,
        logoAlt: brand.logoAlt,
        tagline: brand.tagline,
        story: brand.story,
        voice: brand.voice,
      },
      seo: {
        ...blankStoreConfig.seo,
        title: `${brand.name} | ${brand.tagline}`,
        description: brand.story,
      },
      theme: {
        ...blankStoreConfig.theme,
        colors: {
          light: {
            ...blankStoreConfig.theme.colors.light,
            primary: stage1.theme.colors.light.primary,
            secondary: stage1.theme.colors.light.secondary,
            accent: stage1.theme.colors.light.accent,
          },
          dark: {
            ...blankStoreConfig.theme.colors.dark,
            primary: stage1.theme.colors.dark.primary,
            secondary: stage1.theme.colors.dark.secondary,
            accent: stage1.theme.colors.dark.accent,
          },
        },
        typography: {
          ...blankStoreConfig.theme.typography,
          fontSans: stage1.theme.typography.fontSans,
          fontSerif: stage1.theme.typography.fontSerif,
        },
      },
      dna,
      genesisVersion: 'v2', // Mark as generated by V2
      navigation: {
        navbar: {
          ...blankStoreConfig.navigation.navbar,
          links: taskA.navbar.links,
          searchPlaceholder: taskA.navbar.searchPlaceholder,
        },
      },
      commerce: {
        ...blankStoreConfig.commerce,
        currency: dna.currency,
        locale: dna.language === 'uz' ? 'uz-UZ' : 'en-US',
      },
      catalog: {
        categories: {
          ...blankStoreConfig.catalog.categories,
          categories: categories,
        },
        products: {
          ...blankStoreConfig.catalog.products,
          products: taskB.products.map((product) => ({
            ...product,
            currency: dna.currency,
          })),
        },
      },
      pages: {
        ...blankStoreConfig.pages,
        home: {
          ...blankStoreConfig.pages.home,
          blocks: undefined, // Let the normalization pipeline dynamically generate the blocks!
          hero: {
            ...blankStoreConfig.pages.home.hero,
            headline: brand.tagline,
            subheadline: brand.story,
          },
          benefits: {
            ...blankStoreConfig.pages.home.benefits,
          },
          promo: {
            ...blankStoreConfig.pages.home.promo,
          },
          testimonials: {
            ...blankStoreConfig.pages.home.testimonials,
            testimonials: taskD.testimonials,
          },
          faq: {
            ...blankStoreConfig.pages.home.faq,
            items: taskD.faq,
          },
          sections: taskC.blockOrder.map((type) => ({ type: type as any })),
        },
      },
      footer: {
        ...blankStoreConfig.footer,
        brand: {
          ...blankStoreConfig.footer.brand,
          name: brand.name,
          tagline: brand.tagline,
        },
        copyright: `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`,
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
      brand.name,
      validationResult.data
    );
    console.log('[Genesis] Project created:', project.id);

    // Return project + genesis preview data for UI Form step rendering
    return NextResponse.json({
      ok: true,
      project,
      genesis: {
        analysis: {
          industry: dna.businessType,
          audience: dna.audience,
          style: dna.style,
        },
        brand: {
          name: brand.name,
          tagline: brand.tagline,
        },
        theme: {
          colors: {
            light: {
              primary: stage1.theme.colors.light.primary,
              accent: stage1.theme.colors.light.accent,
            },
          },
          typography: {
            fontSans: stage1.theme.typography.fontSans,
            fontSerif: stage1.theme.typography.fontSerif,
          },
        },
      },
    });
  } catch (error) {
    console.error('Genesis Engine Error:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to generate store' },
      { status: 500 }
    );
  }
}
