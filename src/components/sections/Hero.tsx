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
      className="relative overflow-hidden px-4 py-[clamp(4rem,8vw,8rem)]"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4 items-center min-h-[calc(100vh-8rem)]">
        {/* Left column — 60% width, text content */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center items-start text-left">
          {/* Section indicator */}
          <div className="section-indicator self-start w-full mb-8">
            01/04 — {t('indicators.hero')}
          </div>

          {/* Massive ALL CAPS headline — typewriter reveal */}
          <TypeWriter
            as="h1"
            text={t('hero.headline')}
            className="font-mono font-bold text-[clamp(3rem,10vw,160px)] leading-[1.0] text-[#FFFFFF] mb-4 uppercase tracking-[-0.02em]"
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

          {/* Role labels — sans, 14–16px */}
          <p className="font-sans text-[clamp(0.875rem,1.1vw,1rem)] text-[#CCCCCC] mb-10 leading-relaxed">
            {t('hero.highlight')}
          </p>

          {/* Bracket CTAs */}
          <div className="flex gap-4 flex-wrap">
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

        {/* Right column — 40% width, 3D canvas with bloom */}
        <div className="col-span-12 lg:col-span-5 h-full min-h-[400px] relative overflow-visible">
          <Suspense fallback={null}>
            <WireframeCentroide />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
