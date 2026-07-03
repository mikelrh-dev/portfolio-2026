import { useEffect, useRef, useState } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollSequence from '../effects/ScrollSequence';
import HeroNoise from '../effects/HeroNoise';
import MagneticButton from '../effects/MagneticButton';
import { useScrollSequence } from '../effects/SharedScrollSequence';

const FRAME_COUNT = 90;

export default function Hero() {
  const { t } = useTranslation();
  const { heroProgress, containerRef } = useScrollSequence();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showTagline, setShowTagline] = useState(false);

  // --- Title transforms ---
  const titleOpacity = useTransform(heroProgress, [0, 0.78, 0.95], [1, 1, 0]);
  const titleFilter = useTransform(
    heroProgress,
    [0.78, 0.95],
    ['blur(0px)', 'blur(6px)'],
  );

  // --- Indicator transform ---
  const indicatorOpacity = useTransform(heroProgress, [0.95, 1], [1, 0]);

  // --- Canvas exit transforms (applied via ref → canvas element) ---
  const canvasScale = useTransform(heroProgress, [0.95, 1], [1, 0.85]);
  const canvasOpacity = useTransform(heroProgress, [0.95, 1], [1, 0]);
  const canvasBlurStr = useTransform(
    heroProgress,
    [0.95, 1],
    ['blur(0px)', 'blur(8px)'],
  );

  // --- Fade overlay transform ---
  const fadeOverlayOpacity = useTransform(heroProgress, [0.95, 1], [0, 0.15]);

  // --- Tagline reveal: fire once when heroProgress crosses 0.04 ---
  const taglineGate = useTransform(heroProgress, [0.04, 0.05], [0, 1]);
  useEffect(() => {
    const unsub = taglineGate.on('change', (v) => {
      if (v > 0.5) setShowTagline(true);
    });
    return unsub;
  }, [taglineGate]);

  // --- Grid opacity: drive CSS custom property ---
  const gridOpacity = useTransform(heroProgress, [0.95, 1], [0, 0.2]);
  useEffect(() => {
    document.documentElement.style.setProperty('--grid-opacity', '0');
    const unsub = gridOpacity.on('change', (v) => {
      document.documentElement.style.setProperty('--grid-opacity', String(v));
    });
    return unsub;
  }, [gridOpacity]);

  // --- Direct canvas style subscription (avoids modifying ScrollSequence) ---
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let unsubScale: (() => void) | undefined;
    let unsubOpacity: (() => void) | undefined;
    let unsubFilter: (() => void) | undefined;

    const setup = () => {
      const canvas = section.querySelector('canvas');
      if (!canvas) return;

      unsubScale = canvasScale.on('change', (v) => {
        canvas.style.transform = `scale(${v})`;
      });
      unsubOpacity = canvasOpacity.on('change', (v) => {
        canvas.style.opacity = String(v);
      });
      unsubFilter = canvasBlurStr.on('change', (v) => {
        canvas.style.filter = v;
      });
    };

    // rAF to wait for ScrollSequence to mount its canvas
    const raf = requestAnimationFrame(setup);

    return () => {
      cancelAnimationFrame(raf);
      unsubScale?.();
      unsubOpacity?.();
      unsubFilter?.();
    };
  }, [canvasScale, canvasOpacity, canvasBlurStr]);

  // Hero section height: 245vh — takes first ~67% of the 365vh container.
  // Hero plays frames 1-90 and completes exit. About starts after.
  const HERO_SECTION_HEIGHT = '245vh';

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: HERO_SECTION_HEIGHT }}
    >
      <ScrollSequence
        frameCount={FRAME_COUNT}
        basePath="/firstAnim/ezgif-frame-"
        padWidth={3}
        ext=".webp"
        containerRef={containerRef}
        externalProgress={heroProgress}
      >
        <HeroNoise />

        {/* Section indicator */}
        <motion.div
          className="section-indicator absolute top-6 left-6 z-30"
          style={{ opacity: indicatorOpacity }}
        >
          01/04 — {t('indicators.hero')}
        </motion.div>

        {/* Title + CTA */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-start justify-center px-6 sm:px-12 py-8 border-l-2 border-[#CCFF00]/40"
          style={{
            opacity: titleOpacity,
            filter: titleFilter,
            background:
              'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
          }}
        >
          <h1 className="font-mono font-bold text-[clamp(1.5rem,4.5vw,4.5rem)] leading-[1.05] text-[#FFFFFF] uppercase tracking-[0.02em] w-full max-w-5xl [overflow-wrap:anywhere] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_0_12px_rgba(0,0,0,0.9)]">
            THE HUMAN IN THE LOOP.
          </h1>

          {showTagline && (
            <div className="mt-6 max-w-3xl animate-[tagline-in_0.6s_ease-out_forwards] drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
              <p className="font-mono text-[clamp(0.9rem,1.5vw,1.125rem)] text-[#E5E5E5] mb-2 uppercase tracking-[0.12em]">
                <span>{t('hero.tagline_1')}</span>{' '}
                <span className="text-[#CCFF00] font-bold">
                  {t('hero.tagline_2')}
                </span>
              </p>
              <p className="font-mono text-[13px] text-[#AAAAAA] uppercase tracking-[0.12em]">
                {t('hero.role')}
              </p>
            </div>
          )}

          <div className="mt-10 flex gap-4 flex-wrap">
            <MagneticButton
              className="bg-[#CCFF00] text-[#000000] border-[#CCFF00] hover:bg-transparent hover:text-[#CCFF00]"
              onClick={() =>
                document
                  .getElementById('about')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              [ VER SISTEMAS ]
            </MagneticButton>
            <MagneticButton
              onClick={() =>
                document
                  .getElementById('contact')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              [ CONTACTO ]
            </MagneticButton>
          </div>
        </motion.div>
      </ScrollSequence>

      {/* Fade overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[60] bg-black"
        style={{ opacity: fadeOverlayOpacity }}
      />
    </section>
  );
}
