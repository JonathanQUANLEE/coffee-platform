import { zh } from './zh';
import { en } from './en';

export type Locale = 'zh' | 'en';
export type TranslationKeys = typeof zh;

export const locales: Locale[] = ['zh', 'en'];
export const defaultLocale: Locale = 'zh';

export const translations: Record<Locale, TranslationKeys> = {
  zh,
  en,
};

export const getTranslations = (locale: Locale) => translations[locale];

export const useTranslations = (locale: Locale = defaultLocale) => {
  const t = translations[locale];
  
  const tNested = (key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value: any = t;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce(
        (result, [paramKey, paramValue]) => result.replace(`{${paramKey}}`, paramValue),
        value
      );
    }
    
    return value;
  };
  
  return { t: tNested, locale };
};