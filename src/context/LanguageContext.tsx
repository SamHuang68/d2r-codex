import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'zh' | 'en';

export interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isEn: boolean;
  t: <T = string>(zhVal: T, enVal: T) => T;
}

const STORAGE_KEY = 'd2r_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === 'en' || saved === 'zh') return saved;
      }
    } catch {
      // fallback
    }
    return 'zh';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, newLang);
      }
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  const t = <T = string>(zhVal: T, enVal: T): T => {
    return lang === 'en' ? enVal : zhVal;
  };

  const isEn = lang === 'en';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isEn, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'zh',
      setLang: () => {},
      toggleLang: () => {},
      isEn: false,
      t: (zhVal) => zhVal,
    };
  }
  return context;
};
