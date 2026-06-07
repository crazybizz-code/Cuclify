import type { StoreConfig, ThemeColors } from '@/types';

const THEME_STYLE_ID = 'convora-store-theme';

function buildThemeBlock(selector: string, colors: ThemeColors, radius: string) {
  return `${selector} {
  --background: ${colors.background};
  --foreground: ${colors.foreground};
  --card: ${colors.card};
  --card-foreground: ${colors.cardForeground};
  --popover: ${colors.card};
  --popover-foreground: ${colors.cardForeground};
  --primary: ${colors.primary};
  --primary-foreground: ${colors.primaryForeground};
  --secondary: ${colors.secondary};
  --secondary-foreground: ${colors.secondaryForeground};
  --muted: ${colors.muted};
  --muted-foreground: ${colors.mutedForeground};
  --accent: ${colors.accent};
  --accent-foreground: ${colors.accentForeground};
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: ${colors.border};
  --input: ${colors.border};
  --ring: ${colors.mutedForeground};
  --radius: ${radius};
  --sidebar: ${colors.background};
  --sidebar-foreground: ${colors.foreground};
  --sidebar-primary: ${colors.primary};
  --sidebar-primary-foreground: ${colors.primaryForeground};
  --sidebar-accent: ${colors.secondary};
  --sidebar-accent-foreground: ${colors.secondaryForeground};
  --sidebar-border: ${colors.border};
  --sidebar-ring: ${colors.mutedForeground};
}`;
}

function ensureStyleElement(id: string) {
  let style = document.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    document.head.appendChild(style);
  }
  return style;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }

  for (const [key, value] of Object.entries(attributes)) {
    tag.setAttribute(key, value);
  }
}

function removeMeta(selector: string) {
  const tag = document.head.querySelector(selector);
  tag?.remove();
}

export function syncStorePreviewDocument(config: StoreConfig) {
  const themeStyle = ensureStyleElement(THEME_STYLE_ID);
  themeStyle.textContent = [
    buildThemeBlock(':root', config.theme.colors.light, config.theme.borderRadius),
    buildThemeBlock('.dark', config.theme.colors.dark, config.theme.borderRadius),
  ].join('\n\n');

  document.documentElement.lang = config.seo.language;
  document.title = config.seo.title;

  upsertMeta('meta[name="description"][data-convora-store-meta="description"]', {
    name: 'description',
    content: config.seo.description,
    'data-convora-store-meta': 'description',
  });

  if (config.seo.keywords && config.seo.keywords.length > 0) {
    upsertMeta('meta[name="keywords"][data-convora-store-meta="keywords"]', {
      name: 'keywords',
      content: config.seo.keywords.join(', '),
      'data-convora-store-meta': 'keywords',
    });
  } else {
    removeMeta('meta[name="keywords"][data-convora-store-meta="keywords"]');
  }

  const openGraphTitle = config.seo.openGraph?.title ?? config.seo.title;
  const openGraphDescription = config.seo.openGraph?.description ?? config.seo.description;
  const twitterTitle = config.seo.twitter?.title ?? config.seo.title;
  const twitterDescription =
    config.seo.twitter?.description ?? config.seo.description;

  upsertMeta('meta[property="og:title"][data-convora-store-meta="og:title"]', {
    property: 'og:title',
    content: openGraphTitle,
    'data-convora-store-meta': 'og:title',
  });
  upsertMeta(
    'meta[property="og:description"][data-convora-store-meta="og:description"]',
    {
      property: 'og:description',
      content: openGraphDescription,
      'data-convora-store-meta': 'og:description',
    }
  );
  upsertMeta('meta[name="twitter:title"][data-convora-store-meta="twitter:title"]', {
    name: 'twitter:title',
    content: twitterTitle,
    'data-convora-store-meta': 'twitter:title',
  });
  upsertMeta(
    'meta[name="twitter:description"][data-convora-store-meta="twitter:description"]',
    {
      name: 'twitter:description',
      content: twitterDescription,
      'data-convora-store-meta': 'twitter:description',
    }
  );

  const lightThemeColor = config.seo.viewport.lightThemeColor;
  const darkThemeColor = config.seo.viewport.darkThemeColor;

  upsertMeta('meta[name="theme-color"][data-convora-store-meta="theme-color-light"]', {
    name: 'theme-color',
    content: lightThemeColor,
    media: '(prefers-color-scheme: light)',
    'data-convora-store-meta': 'theme-color-light',
  });
  upsertMeta('meta[name="theme-color"][data-convora-store-meta="theme-color-dark"]', {
    name: 'theme-color',
    content: darkThemeColor,
    media: '(prefers-color-scheme: dark)',
    'data-convora-store-meta': 'theme-color-dark',
  });
}
