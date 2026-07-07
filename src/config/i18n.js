import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locales/en.json';
import ml from '../locales/ml.json';

export const LANGUAGE_STORAGE_KEY = 'app_language';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ml', label: 'മലയാളം' },
];

const resources = {
  en: { translation: en },
  ml: { translation: ml },
};

const detectDeviceLanguage = () => {
  const best = RNLocalize.findBestLanguageTag(
    SUPPORTED_LANGUAGES.map(language => language.code),
  );
  return best?.languageTag ?? 'en';
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      callback(stored ?? detectDeviceLanguage());
    } catch {
      callback(detectDeviceLanguage());
    }
  },
  init: () => {},
  cacheUserLanguage: async language => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // best-effort persistence, next launch falls back to device locale
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map(language => language.code),
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
