'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import uz from '../messages/uz.json';
import en from '../messages/en.json';
import ru from '../messages/ru.json';

// Open-ended Locale type to support dynamic additions easily
export type Locale = string;

const messages: Record<string, any> = {
  uz,
  en,
  ru,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>('uz');

  // Sync client-side locale selection
  useEffect(() => {
    const savedLocale = localStorage.getItem('cuclify_locale');
    if (savedLocale) {
      setLocaleState(savedLocale);
    } else if (initialLocale) {
      setLocaleState(initialLocale);
    }
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('cuclify_locale', newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    // Fallback if the requested locale dict is missing (e.g. dynamic languages)
    let value: any = messages[locale] || messages['en'] || messages['uz'];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
