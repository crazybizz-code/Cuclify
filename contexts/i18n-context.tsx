'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import uz from '../messages/uz.json';
import en from '../messages/en.json';
import ru from '../messages/ru.json';

type Locale = 'uz' | 'en' | 'ru';

const messages = {
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

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('uz');

  useEffect(() => {
    const savedLocale = localStorage.getItem('cuclify_locale') as Locale;
    if (savedLocale && (savedLocale === 'uz' || savedLocale === 'en' || savedLocale === 'ru')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('cuclify_locale', newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key itself if translation is missing
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
