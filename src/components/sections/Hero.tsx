import { useTranslation } from 'react-i18next';
import KineticHeadline from '../effects/KineticHeadline';
import TypeWriter from '../effects/TypeWriter';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-4 py-[clamp(4rem,8vw,8rem)] min-h-screen flex flex-col"
    >
      <div className="max-w-6xl mx-auto flex-1 w-full flex flex-col justify-center">
        {/* Section indicator */}
        <div className="section-indicator self-start w-full mb-8">
          01/04 — {t('indicators.hero')}
        </div>

        {/* Massive ALL CAPS headline — typewriter reveal */}
        <TypeWriter
          as="h1"
          text={t('hero.headline')}
          className="font-mono font-bold text-[clamp(1.75rem,7vw,7rem)] leading-[1.0] text-[#FFFFFF] mb-4 uppercase tracking-[-0.02em] w-full [overflow-wrap:anywhere]"
          speed={30}
        />

        {t('hero.headline_2') && (
          <KineticHeadline
            as="h2"
            className="font-mono font-bold text-[clamp(1.25rem,5vw,4.5rem)] leading-[1.0] text-[#FFFFFF] mb-6 uppercase tracking-[-0.02em] w-full [overflow-wrap:anywhere]"
            stagger={0.04}
          >
            {t('hero.headline_2')}
          </KineticHeadline>
        )}

        {/* Role labels */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          {t('hero.highlight').split(' / ').map((role, i) => (
            <span key={role} className="flex items-center gap-3">
              {i > 0 && <span className="text-[#CCFF00] font-mono text-[10px]">/</span>}
              <span className="font-mono text-[clamp(0.75rem,1vw,0.875rem)] text-[#888888] uppercase tracking-[0.12em]">
                {role}
              </span>
            </span>
          ))}
        </div>

        {/* Bracket CTAs */}
        <div className="flex gap-4 flex-wrap">
          <button
            className="font-mono text-[13px] uppercase tracking-[0.12em] px-6 py-3 bg-[#CCFF00] text-[#000000] border border-[#CCFF00] hover:bg-transparent hover:text-[#CCFF00] transition-colors duration-200 cursor-pointer"
            onClick={() => {
              document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('hero.cta_work')}
          </button>
          <button
            className="font-mono text-[13px] uppercase tracking-[0.12em] px-6 py-3 border border-[#333333] bg-transparent text-[#CCCCCC] hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors duration-200 cursor-pointer"
            onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('hero.cta_contact')}
          </button>
        </div>
      </div>
    </section>
  );
}