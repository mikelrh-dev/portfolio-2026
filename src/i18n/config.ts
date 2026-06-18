import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

export function detectLanguage(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'es') return stored;
    const navLang = navigator.language?.startsWith('es') ? 'es' : 'en';
    return navLang;
  }
  return 'en';
}

export function initI18n(lang?: string): typeof i18n {
  const lng = lang || detectLanguage();
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        es: { translation: es },
      },
      lng,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
        skipOnVariables: false,
      },
      returnObjects: false,
    });
  } else {
    i18n.changeLanguage(lng);
  }
  return i18n;
}

export function changeLanguage(lng: string): void {
  i18n.changeLanguage(lng);
  if (typeof window !== 'undefined') {
    localStorage.setItem('lang', lng);
  }
}

export default i18n;
