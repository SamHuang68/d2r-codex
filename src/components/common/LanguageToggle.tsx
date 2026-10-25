import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface LanguageToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  showLabel = true,
}) => {
  const { lang, toggleLang, isEn } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-xs transition-all duration-200 cursor-pointer shadow-inner group ${className}`}
      title={isEn ? '切換為繁體中文 (Switch to Traditional Chinese)' : 'Switch to English (切換為英文)'}
      aria-label={isEn ? 'Switch to Traditional Chinese' : 'Switch to English'}
    >
      <Globe className="w-3.5 h-3.5 text-d2-unique group-hover:rotate-45 transition-transform duration-300" />
      {showLabel && (
        <span className="font-diablo tracking-wider text-[11px] select-none flex items-center">
          <span className={lang === 'zh' ? 'text-d2-unique font-bold' : 'text-sanctuary-400 group-hover:text-sanctuary-200'}>
            中
          </span>
          <span className="text-sanctuary-600 mx-1">/</span>
          <span className={lang === 'en' ? 'text-d2-unique font-bold' : 'text-sanctuary-400 group-hover:text-sanctuary-200'}>
            EN
          </span>
        </span>
      )}
    </button>
  );
};
