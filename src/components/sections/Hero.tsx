import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollSequence from '../effects/ScrollSequence';
import MagneticButton from '../effects/MagneticButton';

const FRAME_COUNT = 150;
const SCROLL_MULTIPLIER = 3;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const { t } = useTranslation();
  const [showTagline, setShowTagline] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const indicator = indicatorRef.current;
    if (!container || !title || !indicator) return;

    // Keep non-null references for use inside callbacks
    const c: HTMLDivElement = container;
    const t: HTMLDivElement = title;
    const i: HTMLDivElement = indicator;

    const ctx = gsap.context(() => {
      const scrollRange = c.offsetHeight - window.innerHeight;

      // Single scroll-driven timeline. scrub: 0.5 gives a smooth catch-up feel.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: c,
          start: 'top top',
          end: () => `+=${scrollRange}`,
          scrub: 0.5,
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

      // Tagline reveal — fires once when the user scrolls past 4%
      ScrollTrigger.create({
        trigger: c,
        start: 'top top',
        end: () => `+=${scrollRange * 0.04}`,
        onEnter: () => setShowTagline(true),
      });
    }, c);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative z-0 isolate w-full"
      style={{ height: `${SCROLL_MULTIPLIER * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ScrollSequence
          frameCount={FRAME_COUNT}
          basePath="/firstAnim/ezgif-frame-"
          padWidth={3}
          ext=".webp"
          scrollMultiplier={SCROLL_MULTIPLIER}
          containerRef={containerRef}
        >
          {/* Watermark disguise */}
          <div
            className="absolute bottom-0 right-0 pointer-events-none z-10"
            style={{
              width: '45%',
              height: '45%',
              background:
                'radial-gradient(ellipse at bottom right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 25%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 85%)',
            }}
          />

          <div
            ref={indicatorRef}
            className="section-indicator absolute top-6 left-6 z-30"
          >
            01/04 — {t('indicators.hero')}
          </div>

          <div
            ref={titleRef}
            className="absolute inset-0 z-20 flex flex-col items-start justify-center px-6 sm:px-12"
          >
            <h1 className="font-mono font-bold text-[clamp(1.75rem,7vw,7rem)] leading-[1.0] text-[#FFFFFF] uppercase tracking-[-0.02em] w-full max-w-5xl [overflow-wrap:anywhere]">
              THE HUMAN IN THE LOOP.
            </h1>

            {showTagline && (
              <div className="mt-6 max-w-3xl animate-[tagline-in_0.6s_ease-out_forwards]">
                <p className="font-mono text-[clamp(0.9rem,1.5vw,1.125rem)] text-[#888888] mb-2 uppercase tracking-[0.12em]">
                  <span>{t('hero.tagline_1')}</span>{' '}
                  <span className="text-[#CCFF00] font-bold">{t('hero.tagline_2')}</span>
                </p>
                <p className="font-mono text-[13px] text-zinc-500 uppercase tracking-[0.12em]">
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
      </div>
    </section>
  );
}
