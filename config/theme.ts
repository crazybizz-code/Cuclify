import type { StoreConfig } from '@/types';

export const theme: StoreConfig['theme'] = {
    colors: {
      light: {
        primary: 'oklch(0.205 0 0)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.96 0.01 80)',
        secondaryForeground: 'oklch(0.205 0 0)',
        background: 'oklch(0.99 0.005 80)',
        foreground: 'oklch(0.145 0 0)',
        muted: 'oklch(0.96 0.01 80)',
        mutedForeground: 'oklch(0.45 0 0)',
        accent: 'oklch(0.65 0.15 45)',
        accentForeground: 'oklch(0.985 0 0)',
        border: 'oklch(0.9 0.01 80)',
        card: 'oklch(1 0 0)',
        cardForeground: 'oklch(0.145 0 0)',
      },
      dark: {
        primary: 'oklch(0.985 0 0)',
        primaryForeground: 'oklch(0.145 0 0)',
        secondary: 'oklch(0.25 0.01 80)',
        secondaryForeground: 'oklch(0.985 0 0)',
        background: 'oklch(0.12 0 0)',
        foreground: 'oklch(0.985 0 0)',
        muted: 'oklch(0.25 0.01 80)',
        mutedForeground: 'oklch(0.65 0 0)',
        accent: 'oklch(0.7 0.15 45)',
        accentForeground: 'oklch(0.145 0 0)',
        border: 'oklch(0.28 0.01 80)',
        card: 'oklch(0.16 0 0)',
        cardForeground: 'oklch(0.985 0 0)',
      },
    },
    typography: {
      fontSans: 'Geist',
      fontSerif: 'Playfair Display',
      fontMono: 'Geist Mono',
      headingWeight: '600',
      bodyWeight: '400',
    },
    spacing: {
      sectionPadding: 'py-16 md:py-24',
      containerMaxWidth: 'max-w-7xl',
      gap: 'gap-8',
    },
    borderRadius: '0.75rem',
  };

