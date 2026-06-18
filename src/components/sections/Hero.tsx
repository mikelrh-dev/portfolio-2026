import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TypeWriter from '../effects/TypeWriter';
import MagneticButton from '../effects/MagneticButton';

export default function Hero() {
  const { t } = useTranslation();
  const [showTagline, setShowTagline] = useState(false);

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

        {/* Headline — typewriter */}
        <TypeWriter
          as="h1"
          text="THE HUMAN IN THE LOOP."
          className="font-mono font-bold text-[clamp(1.75rem,7vw,7rem)] leading-[1.0] text-[#FFFFFF] mb-4 uppercase tracking-[-0.02em] w-full [overflow-wrap:anywhere]"
          speed={30}
          onDone={() => setShowTagline(true)}
        />

        {/* Tagline — dual weight with green punchline */}
        {showTagline && (
          <>
            <p className="font-mono text-[clamp(0.9rem,1.5vw,1.125rem)] text-[#888888] mb-2 uppercase tracking-[0.12em]">
              <span>{t('hero.tagline_1')}</span>{' '}
              <span className="text-[#CCFF00] font-bold">{t('hero.tagline_2')}</span>
            </p>
            <p className="font-mono text-[13px] text-zinc-500 mb-10 uppercase tracking-[0.12em]">
              {t('hero.role')}
            </p>
          </>
        )}

        {/* CTAs */}
        <div className="flex gap-4 flex-wrap">
          <MagneticButton
            className="bg-[#CCFF00] text-[#000000] border-[#CCFF00] hover:bg-transparent hover:text-[#CCFF00]"
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
          >
            [ VER SISTEMAS ]
          </MagneticButton>
          <MagneticButton
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            [ CONTACTO ]
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
