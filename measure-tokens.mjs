import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { performance } from 'perf_hooks';

// Schemas matching route.ts exactly
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

async function runAudit() {
  const prompt = 'Premium laptop store in Uzbekistan';
  const results = [];

  // STAGE 1
  const startS1 = performance.now();
  const s1Result = await generateObject({
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
  const tS1 = ((performance.now() - startS1) / 1000).toFixed(2);

  results.push({
    stage: 'DNA, Brand, Categories',
    inputTokens: s1Result.usage.promptTokens,
    outputTokens: s1Result.usage.completionTokens,
    totalTokens: s1Result.usage.totalTokens,
    time: tS1
  });

  const dna = { ...s1Result.object.dna, currency: 'UZS' };
  const brand = s1Result.object.brand;
  const categories = s1Result.object.categories;

  // STAGE 2
  const startNavbar = performance.now();
  const navbarRes = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: NavbarSchema,
    prompt: `Using the following Store DNA context, Brand Identity, and Categories:
Store DNA: ${JSON.stringify(dna)}
Brand Config: ${JSON.stringify(brand)}
Categories: ${JSON.stringify(categories)}

Generate custom navigation bar links adapted to this e-commerce business type.
All text copy must be fully written in the language "${dna.language}".
Navigation links must contain: Home ("/"), Categories (e.g., "/#categories"), Products ("/products"), About (e.g. "/#about"), Contact (e.g. "/#contact"). Make sure links are adapted to the business context.`,
  });
  results.push({
    stage: 'Navbar generation',
    inputTokens: navbarRes.usage.promptTokens,
    outputTokens: navbarRes.usage.completionTokens,
    totalTokens: navbarRes.usage.totalTokens,
    time: ((performance.now() - startNavbar) / 1000).toFixed(2)
  });

  const startProducts = performance.now();
  const productsRes = await generateObject({
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
  });
  results.push({
    stage: 'Products generation',
    inputTokens: productsRes.usage.promptTokens,
    outputTokens: productsRes.usage.completionTokens,
    totalTokens: productsRes.usage.totalTokens,
    time: ((performance.now() - startProducts) / 1000).toFixed(2)
  });

  const startLayout = performance.now();
  const layoutRes = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: HomepageBlocksSchema,
    prompt: `Using the following Store DNA context and Brand:
Store DNA: ${JSON.stringify(dna)}
Brand Name: ${brand.name}

Decide on the most conversion-focused layout order for the homepage blocks for this specific e-commerce business type.
Select from: hero, categoryGrid, featuredProducts, benefits, promoBanner, testimonials, faq.
You must order these 7 block types based on what is most appropriate for the business concept (e.g. electronics might start with hero -> benefits -> categories -> featuredProducts -> promoBanner -> testimonials -> faq).`,
  });
  results.push({
    stage: 'Homepage layout generation',
    inputTokens: layoutRes.usage.promptTokens,
    outputTokens: layoutRes.usage.completionTokens,
    totalTokens: layoutRes.usage.totalTokens,
    time: ((performance.now() - startLayout) / 1000).toFixed(2)
  });

  const startFaq = performance.now();
  const faqRes = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: TestimonialsFaqSchema,
    prompt: `Using the following Store DNA context and Brand Positioning:
Store DNA: ${JSON.stringify(dna)}
Brand Config: ${JSON.stringify(brand)}

Generate exactly 3 customer testimonials and exactly 5 e-commerce FAQs (such as shipping, returns, warranty, local payment methods).
All copy must match the brand voice and tone and be written in the language "${dna.language}".`,
  });
  results.push({
    stage: 'FAQ/Testimonial generation',
    inputTokens: faqRes.usage.promptTokens,
    outputTokens: faqRes.usage.completionTokens,
    totalTokens: faqRes.usage.totalTokens,
    time: ((performance.now() - startFaq) / 1000).toFixed(2)
  });

  console.log(JSON.stringify(results, null, 2));
}

runAudit().catch(console.error);
