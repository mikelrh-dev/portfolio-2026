import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n/config';

export default function LangToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language as 'en' | 'es';

  const toggle = () => {
    const next = current === 'en' ? 'es' : 'en';
    changeLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666666] hover:text-[#CCFF00] transition-colors duration-150 cursor-pointer"
      aria-label={`Switch language to ${current === 'en' ? 'Spanish' : 'English'}`}
    >
      <span className={current === 'en' ? 'text-[#FAFAFA]' : ''}>EN</span>
      <span className="mx-1.5 text-[#444444]">/</span>
      <span className={current === 'es' ? 'text-[#FAFAFA]' : ''}>ES</span>
    </button>
  );
}
