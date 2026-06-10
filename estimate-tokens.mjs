import { z } from 'zod';

// Mock responses matching the schemas
const mockStage1Response = {
  dna: {
    businessType: "Premium laptop retailer",
    industryTemplate: "electronics",
    market: "Uzbekistan",
    audience: "Tech enthusiasts and professionals",
    tone: "Professional, premium, and trustworthy",
    style: "Modern and sleek",
    language: "uz"
  },
  brand: {
    name: "TechUz Premium",
    logoAlt: "TechUz Premium Logo",
    tagline: "Eng sara noutbuklar siz uchun",
    story: "Bizning maqsadimiz O'zbekistondagi eng yaxshi texnologiyalarni taqdim etish...",
    voice: "Ishonchli va zamonaviy"
  },
  theme: {
    colors: {
      light: { primary: "oklch(0.65 0.15 45)", secondary: "oklch(0.7 0.1 200)", accent: "oklch(0.8 0.2 100)" },
      dark: { primary: "oklch(0.3 0.1 45)", secondary: "oklch(0.2 0.05 200)", accent: "oklch(0.4 0.15 100)" }
    },
    typography: { fontSans: "Inter", fontSerif: "Merriweather" }
  },
  categories: Array(4).fill({
    id: "cat-1", name: "O'yin noutbuklari", description: "Eng kuchli o'yin noutbuklari", image: "/placeholder.svg", href: "/category/gaming"
  })
};

const mockNavbarResponse = {
  navbar: {
    links: [
      { id: "1", label: "Bosh sahifa", href: "/" },
      { id: "2", label: "Katalog", href: "/#categories" },
      { id: "3", label: "Mahsulotlar", href: "/products" },
      { id: "4", label: "Biz haqimizda", href: "/#about" },
      { id: "5", label: "Aloqa", href: "/#contact" }
    ],
    searchPlaceholder: "Qidirish..."
  }
};

const mockProductsResponse = {
  products: Array(6).fill({
    id: "prod-1",
    name: "Asus ROG Strix",
    description: "Kuchli o'yin noutbuki, RTX 4080",
    price: 25000000,
    currency: "UZS",
    images: ["/placeholder.svg"],
    category: "O'yin noutbuklari",
    inStock: true,
    href: "/products/asus-rog-strix"
  })
};

const mockLayoutResponse = {
  blockOrder: ['hero', 'featuredProducts', 'categoryGrid', 'promoBanner', 'benefits', 'testimonials', 'faq']
};

const mockFaqResponse = {
  testimonials: Array(3).fill({
    id: "test-1",
    content: "Juda ajoyib xizmat ko'rsatish!",
    author: { name: "Alisher V.", title: "Dasturchi" },
    rating: 5
  }),
  faq: Array(5).fill({
    id: "faq-1",
    question: "Yetkazib berish qancha vaqt oladi?",
    answer: "Toshkent bo'ylab 1 kun."
  })
};

function estimateTokens(text) {
  // A rough estimate: ~4 chars per token. Add 20% buffer for JSON overhead.
  return Math.ceil(text.length / 4);
}

const promptBaseLength = "Premium laptop store in Uzbekistan".length;

const stages = [
  {
    name: "Stage 1 (DNA, Brand, Categories)",
    promptTokens: estimateTokens(`You are an expert e-commerce brand architect. Based on the user prompt, analyze the business requirements and generate the Store DNA, Brand Positioning, Visual Identity Theme, and custom categories. User Prompt: "Premium laptop store in Uzbekistan"`),
    outputTokens: estimateTokens(JSON.stringify(mockStage1Response)),
  },
  {
    name: "Stage 2 - Navbar",
    promptTokens: estimateTokens(`Using the following Store DNA context, Brand Identity, and Categories... Generate custom navigation bar links.`) + estimateTokens(JSON.stringify(mockStage1Response)),
    outputTokens: estimateTokens(JSON.stringify(mockNavbarResponse)),
  },
  {
    name: "Stage 2 - Products",
    promptTokens: estimateTokens(`Using the following Store DNA context and Categories... Generate exactly 6 realistic e-commerce products.`) + estimateTokens(JSON.stringify({ dna: mockStage1Response.dna, categories: mockStage1Response.categories })),
    outputTokens: estimateTokens(JSON.stringify(mockProductsResponse)),
  },
  {
    name: "Stage 2 - Homepage Layout",
    promptTokens: estimateTokens(`Using the following Store DNA context and Brand... Decide on the most conversion-focused layout order.`) + estimateTokens(JSON.stringify({ dna: mockStage1Response.dna, brand: mockStage1Response.brand })),
    outputTokens: estimateTokens(JSON.stringify(mockLayoutResponse)),
  },
  {
    name: "Stage 2 - FAQ/Testimonials",
    promptTokens: estimateTokens(`Using the following Store DNA context and Brand Positioning... Generate exactly 3 customer testimonials and exactly 5 e-commerce FAQs.`) + estimateTokens(JSON.stringify({ dna: mockStage1Response.dna, brand: mockStage1Response.brand })),
    outputTokens: estimateTokens(JSON.stringify(mockFaqResponse)),
  }
];

const inputRate = 0.25 / 1000000;
const outputRate = 2.00 / 1000000;

console.log("| Stage | Input Tokens | Output Tokens | Total Tokens | Cost |");
console.log("|---------|---------|---------|---------|---------|");

let totalCost = 0;
stages.forEach(stage => {
  // Add 100 tokens buffer for system instructions and schema definition formatting
  const input = stage.promptTokens + 100;
  const output = stage.outputTokens + 50; 
  const total = input + output;
  const cost = (input * inputRate) + (output * outputRate);
  totalCost += cost;
  console.log(`| ${stage.name} | ${input} | ${output} | ${total} | $${cost.toFixed(6)} |`);
});

console.log(`\nTotal cost per Genesis generation: $${totalCost.toFixed(5)}`);
console.log(`Estimated runs for $5: ${Math.floor(5 / totalCost)}`);
console.log(`Estimated runs for $10: ${Math.floor(10 / totalCost)}`);
console.log(`Estimated runs for $20: ${Math.floor(20 / totalCost)}`);
