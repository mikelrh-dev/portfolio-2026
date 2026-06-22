import { useTranslation } from 'react-i18next';
import { useScrollSpy } from '../hooks/useScrollSpy';
import LangToggle from './LangToggle';

export default function Nav() {
  const { t } = useTranslation();
  const activeId = useScrollSpy(['hero', 'about', 'work', 'contact']);

  const sectionLabels: Record<string, string> = {
    hero: t('indicators.hero'),
    work: t('indicators.work'),
    about: t('indicators.about'),
    contact: t('indicators.contact'),
  };

  const sectionOrder = ['hero', 'about', 'work', 'contact'] as const;
  const activeIndex = sectionOrder.indexOf(activeId as typeof sectionOrder[number]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#000000]/80 backdrop-blur-sm border-b border-[#222222]">
      {/* Left — Name */}
      <a
        href="#hero"
        className="font-mono text-[12px] uppercase tracking-[0.15em] text-[#FFFFFF] no-underline hover:text-[#CCFF00] transition-colors duration-150"
      >
        MIKEL_ROMERO
      </a>

      {/* Right — Section indicator + locale toggle */}
      <div className="flex items-center gap-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#666666]">
          {activeIndex >= 0
            ? `${String(activeIndex + 1).padStart(2, '0')}/04 — ${sectionLabels[activeId] || ''}`
            : '—/04'}
        </span>
        <LangToggle />
      </div>
    </nav>
  );
}
