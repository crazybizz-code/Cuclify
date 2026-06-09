import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { CartProvider } from '@/contexts/cart-context';
import { StoreConfigProvider } from '@/contexts/store-config-context';
import { I18nProvider } from '@/contexts/i18n-context';
import { storeConfig } from '@/config/store-config';
import './globals.css';

const _geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const _geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const _playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: storeConfig.seo.title,
  description: storeConfig.seo.description,
  keywords: storeConfig.seo.keywords,
  openGraph: storeConfig.seo.openGraph,
  twitter: storeConfig.seo.twitter,
  icons: storeConfig.seo.icons,
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: storeConfig.seo.viewport.lightThemeColor,
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: storeConfig.seo.viewport.darkThemeColor,
    },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={storeConfig.seo.language} className="bg-background">
      <body className="font-sans antialiased min-h-screen">
        <I18nProvider initialLocale={storeConfig.seo.language}>
          <StoreConfigProvider initialConfig={storeConfig}>
            <CartProvider>{children}</CartProvider>
          </StoreConfigProvider>
        </I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
