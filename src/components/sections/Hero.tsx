import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import KineticHeadline from '../effects/KineticHeadline';
import TypeWriter from '../effects/TypeWriter';

const WireframeCentroide = lazy(() => import('../three/WireframeCentroide'));

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* 3D Wireframe Canvas — full viewport background */}
      <Suspense fallback={null}>
        <WireframeCentroide />
      </Suspense>

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-6xl mx-auto w-full">
        {/* Section indicator */}
        <div className="section-indicator self-start w-full">
          01/04 — {t('indicators.hero')}
        </div>

        {/* Massive ALL CAPS headline — typewriter reveal */}
        <TypeWriter
          as="h1"
          text={t('hero.headline')}
          className="font-mono font-bold text-[clamp(2.5rem,10vw,8rem)] leading-[1.0] text-[#FFFFFF] mb-4 uppercase tracking-[-0.02em]"
          speed={30}
        />

        {t('hero.headline_2') && (
          <KineticHeadline
            as="h2"
            className="font-mono font-bold text-[clamp(2rem,7vw,5rem)] leading-[1.0] text-[#FFFFFF] mb-6 uppercase tracking-[-0.02em]"
            stagger={0.04}
          >
            {t('hero.headline_2')}
          </KineticHeadline>
        )}

        {/* Role labels */}
        <p className="font-mono text-[clamp(0.7rem,1.1vw,0.9rem)] uppercase tracking-[0.2em] text-[#666666] mb-10">
          {t('hero.highlight')}
        </p>

        {/* Bracket CTAs */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            className="font-mono text-[13px] uppercase tracking-[0.12em] px-6 py-3 border border-[#222222] bg-transparent text-[#FAFAFA] hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors duration-200 cursor-pointer"
            onClick={() => {
              document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('hero.cta_work')}
          </button>
          <button
            className="font-mono text-[13px] uppercase tracking-[0.12em] px-6 py-3 border border-[#222222] bg-transparent text-[#FAFAFA] hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors duration-200 cursor-pointer"
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
