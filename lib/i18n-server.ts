import uz from '../messages/uz.json';
import en from '../messages/en.json';
import ru from '../messages/ru.json';

type Locale = 'uz' | 'en' | 'ru';

const messages = {
  uz,
  en,
  ru,
};

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = messages[locale] || messages['uz'];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
}
