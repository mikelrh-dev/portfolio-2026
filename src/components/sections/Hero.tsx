import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollSequence from '../effects/ScrollSequence';
import HeroNoise from '../effects/HeroNoise';
import MagneticButton from '../effects/MagneticButton';

const FRAME_COUNT = 90;
const SCROLL_MULTIPLIER = 3;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const { t } = useTranslation();
  const [showTagline, setShowTagline] = useState(false);
  const [enableMobileFrames, setEnableMobileFrames] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const fadeToBlackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const indicator = indicatorRef.current;
    const fadeToBlack = fadeToBlackRef.current;
    if (!container || !title || !indicator || !fadeToBlack) return;

    // Keep non-null references for use inside callbacks
    const c: HTMLDivElement = container;
    const t: HTMLDivElement = title;
    const i: HTMLDivElement = indicator;
    const f: HTMLDivElement = fadeToBlack;

    const ctx = gsap.context(() => {
      const scrollRange = c.offsetHeight - window.innerHeight;

      // Single scroll-driven timeline. scrub: 0.5 gives a smooth catch-up feel.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: c,
          start: 'top top',
          end: () => `+=${scrollRange}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // Title: stays opaque 0-78%, fades + blurs out 78-95%
      tl.to(
        t,
        { opacity: 0, filter: 'blur(6px)', duration: 0.17, ease: 'power1.out' },
        0.78,
      );

      // Indicator: stays opaque until 95%, fades out 95-100%
      tl.to(i, { opacity: 0, duration: 0.05, ease: 'power1.out' }, 0.95);

      // Fade-to-black: covers everything during the last 5% of scroll (95%-100%).
      // Integrated into the same timeline so it's perfectly synced with the
      // title/indicator fades.
      tl.to(f, { opacity: 1, duration: 0.05, ease: 'none' }, 0.95);

      // Tagline reveal — fires once when the user scrolls past 4%
      ScrollTrigger.create({
        trigger: c,
        start: 'top top',
        end: () => `+=${scrollRange * 0.04}`,
        onEnter: () => setShowTagline(true),
      });

      // Reset fade-to-black when the user scrolls back up past the Hero.
      // The overlay is fixed, so without this it would stay at opacity: 1
      // forever after the timeline completes.
      ScrollTrigger.create({
        trigger: c,
        start: 'top top',
        end: 'bottom top',
        onLeaveBack: () => { gsap.set(f, { opacity: 0 }); },
      });
    }, c);

    // Force recalculation after all triggers are created
    ScrollTrigger.refresh();

    // Re-calc GSAP on visual viewport resize (URL bar hide/show on mobile)
    const handleViewportResize = () => ScrollTrigger.refresh();
    window.visualViewport?.addEventListener('resize', handleViewportResize);

    return () => {
      ctx.revert();
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, []);

  // Detect mobile (<768px) via matchMedia to select frame set
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setEnableMobileFrames(mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnableMobileFrames(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
      <section
        id="hero"
        ref={containerRef}
        className={`relative z-0 isolate w-full${enableMobileFrames ? ' hero-height-mobile' : ''}`}
        style={enableMobileFrames ? undefined : { height: `${SCROLL_MULTIPLIER * 100}vh` }}
      >
        <ScrollSequence
            frameCount={FRAME_COUNT}
            basePath={enableMobileFrames ? "/firstAnim/ezgif-frame-mobile-" : "/firstAnim/ezgif-frame-"}
            padWidth={3}
            ext=".webp"
            scrollMultiplier={SCROLL_MULTIPLIER}
            containerRef={containerRef}
          >
          <HeroNoise />
          <div
            ref={indicatorRef}
            className="section-indicator absolute top-6 left-6 z-30"
          >
            01/04 — {t('indicators.hero')}
          </div>
          <div
            ref={titleRef}
            className="absolute inset-0 z-20 flex flex-col items-start justify-center px-6 sm:px-12 py-8 border-l-2 border-[#CCFF00]/40"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
            }}
          >
            <h1 className="font-mono font-bold text-[clamp(1.5rem,4.5vw,4.5rem)] leading-[1.05] text-[#FFFFFF] uppercase tracking-[0.02em] w-full max-w-5xl [overflow-wrap:anywhere] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_0_12px_rgba(0,0,0,0.9)]">
              THE HUMAN IN THE LOOP.
            </h1>

            {showTagline && (
              <div className="mt-6 max-w-3xl animate-[tagline-in_0.6s_ease-out_forwards] drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                <p className="font-mono text-[clamp(0.9rem,1.5vw,1.125rem)] text-[#E5E5E5] mb-2 uppercase tracking-[0.12em]">
                  <span>{t('hero.tagline_1')}</span>{' '}
                  <span className="text-[#CCFF00] font-bold">{t('hero.tagline_2')}</span>
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
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                [ VER SISTEMAS ]
              </MagneticButton>
              <MagneticButton
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                [ CONTACTO ]
              </MagneticButton>
            </div>
          </div>
        </ScrollSequence>
        <div
          ref={fadeToBlackRef}
          className="fixed inset-0 pointer-events-none z-[60] bg-black"
          style={{ opacity: 0 }}
        />
    </section>
  );
}
