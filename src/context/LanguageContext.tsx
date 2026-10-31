import React, { createContext, useContext, useState, useEffect } from 'react';
import { langFromLocation, switchLangPath } from '../utils/routes';

export type Language = 'zh' | 'en';

export interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isEn: boolean;
  t: <T = string>(zhVal: T, enVal: T) => T;
}

const STORAGE_KEY = 'd2r_language';

/**
 * 語言由網址決定：/en/… 是英文，其餘是繁體中文（每個語言版本有自己的網址，搜尋引擎才分得出來，hreflang 才成立）。
 * 切換語言＝前往同一頁的另一種語言網址（新增一筆歷史紀錄，上一頁會回到原本的語言）；localStorage 只記最後一次的選擇。
 */

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => (typeof window !== 'undefined' ? langFromLocation() : 'zh'));

  const setLang = (newLang: Language) => {
    try {
      if (typeof window !== 'undefined' && newLang !== langFromLocation()) {
        // 換成另一種語言的網址（同一頁、同一個單品）；沿用歷史紀錄裡的導覽狀態，上一頁／下一頁才能還原
        window.history.pushState(window.history.state, '', switchLangPath(newLang) + window.location.search);
      }
    } catch {
      // 網址無法改寫時仍切換畫面語言
    }
    setLangState(newLang);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, newLang);
      }
    } catch {
      // ignore
    }
  };

  // 上一頁／下一頁到另一種語言的網址：畫面語言跟著網址
  useEffect(() => {
    const onPop = () => setLangState(langFromLocation());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

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
