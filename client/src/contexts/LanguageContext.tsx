import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { COUNTRY_LANGUAGES, getTranslation, type Language, type TranslationKey } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  country: string;
  setCountry: (country: string) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<string>('USA');
  const [language, setLanguage] = useState<Language>('en');

  // Auto-update language when country changes
  useEffect(() => {
    const newLang = COUNTRY_LANGUAGES[country as keyof typeof COUNTRY_LANGUAGES] || 'en';
    setLanguage(newLang as Language);
    
    // Save to localStorage
    localStorage.setItem('selectedCountry', country);
    localStorage.setItem('selectedLanguage', newLang);
  }, [country]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry) {
      setCountryState(savedCountry);
    }
  }, []);

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  const setCountry = (newCountry: string) => {
    setCountryState(newCountry);
  };

  return (
    <LanguageContext.Provider value={{ language, country, setCountry, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
