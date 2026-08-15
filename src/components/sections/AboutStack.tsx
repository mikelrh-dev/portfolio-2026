import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type Transition,
} from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollSequence from '../effects/ScrollSequence';
import { useScrollSequence } from '../effects/SharedScrollSequence';

const categories = ['production', 'frontend', 'ai_workflow', 'tools'] as const;

/** Reveal config: [start, end] progress thresholds for each element
 *  Compressed to 120vh so content is scannable while keeping smooth
 *  fade+translate reveals for each block. */
const REVEAL = {
  indicator: [0.04, 0.08] as [number, number],
  bio1: [0.10, 0.22] as [number, number],
  bio2: [0.24, 0.36] as [number, number],
  bio3: [0.38, 0.50] as [number, number],
  bio4: [0.52, 0.64] as [number, number],
  stackHeader: [0.66, 0.70] as [number, number],
  cat0: [0.72, 0.77] as [number, number],
  cat1: [0.78, 0.83] as [number, number],
  cat2: [0.84, 0.89] as [number, number],
  cat3: [0.90, 0.95] as [number, number],
};

type RevealStyle = {
  opacity: number | MotionValue<number>;
  y: number | MotionValue<number>;
};

type RevealProps<T extends HTMLElement> = {
  ref: RefObject<T>;
  'data-reveal'?: boolean;
  style: RevealStyle;
  transition?: Transition;
};

/**
 * Reveal hook with two modes:
 *
 * - Desktop: scroll-linked — interpolates `aboutProgress` into opacity/y
 *   MotionValues. Runs every scroll frame; smooth and fine on desktop.
 * - Mobile: one-shot — an IntersectionObserver fades the element in once
 *   (CSS-like transition) and then freezes. Zero style writes during scroll,
 *   which removes the 10-per-frame transform updates that caused the lag
 *   while scrolling through the About section on low-end devices.
 *
 * Both hooks are created unconditionally (Rules of Hooks); only the
 * appropriate branch is consumed.
 */
function useReveal<T extends HTMLElement>(thresholds: [number, number], delay = 0): RevealProps<T> {
  const { aboutProgress, isMobile } = useScrollSequence();
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Desktop: scroll-linked MotionValues
  const scrollOpacity = useTransform(aboutProgress, thresholds, [0, 1]);
  const scrollY = useTransform(aboutProgress, thresholds, [20, 0]);

  // Mobile: one-shot IntersectionObserver fade-in
  useEffect(() => {
    if (!isMobile) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile]);

  if (isMobile) {
    return {
      ref,
      'data-reveal': true,
      style: { opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 },
      transition: { duration: 0.6, delay },
    };
  }

  return {
    ref,
    'data-reveal': true,
    style: { opacity: scrollOpacity, y: scrollY },
  };
}

export default function AboutStack() {
  const { t } = useTranslation();
  const { containerRef, isMobile } = useScrollSequence();

  // Auto-play canvas: loops 143 frames (~6s at 24fps) while section is visible
  const autoProgress = useMotionValue(0);

  useEffect(() => {
    if (isMobile) return;
    const section = document.getElementById('about');
    if (!section) return;
    let controls: ReturnType<typeof animate> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          autoProgress.jump(0);
          controls = animate(autoProgress, 1, {
            duration: 6,
            ease: 'linear',
          });
        } else {
          controls?.stop();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      controls?.stop();
    };
  }, [autoProgress, isMobile]);

  // Stagger delays for the one-shot mobile fade-in cascade
  const revealIndicator = useReveal<HTMLDivElement>(REVEAL.indicator, 0);
  const revealBio1 = useReveal<HTMLParagraphElement>(REVEAL.bio1, 0.1);
  const revealBio2 = useReveal<HTMLParagraphElement>(REVEAL.bio2, 0.2);
  const revealBio3 = useReveal<HTMLParagraphElement>(REVEAL.bio3, 0.3);
  const revealBio4 = useReveal<HTMLParagraphElement>(REVEAL.bio4, 0.4);
  const revealStackH = useReveal<HTMLParagraphElement>(REVEAL.stackHeader, 0.5);
  const revealCat0 = useReveal<HTMLDivElement>(REVEAL.cat0, 0.6);
  const revealCat1 = useReveal<HTMLDivElement>(REVEAL.cat1, 0.7);
  const revealCat2 = useReveal<HTMLDivElement>(REVEAL.cat2, 0.8);
  const revealCat3 = useReveal<HTMLDivElement>(REVEAL.cat3, 0.9);

  const catReveals = [revealCat0, revealCat1, revealCat2, revealCat3];

  // About section height: 120vh keeps the section compact.
  // Canvas auto-plays as background; content reveals via scroll progress.
  const ABOUT_SECTION_HEIGHT = '120vh';

  return (
    <section
      id="about"
      className="relative w-full"
      style={{ height: ABOUT_SECTION_HEIGHT }}
    >
      {/* Sticky "camera" — holds canvas + content in viewport while
          the section provides scroll distance for the sequence */}
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-black">
        {/* Background: animated canvas on desktop, static final frame on mobile */}
        {isMobile ? (
          // Mobile: show final frame (frame 143) as static image,
          // downscaled to 720x1280 to cut payload by ~75%
          <img
            src="/assets/sequences/about/frame-143-mobile.webp"
            alt="About background"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        ) : (
          // Desktop: auto-play canvas sequence
          <ScrollSequence
            frameCount={143}
            basePath="/assets/sequences/about/frame-"
            padWidth={3}
            ext=".webp"
            containerRef={containerRef}
            externalProgress={autoProgress}
            alignY="top"
          />
        )}

        {/* Gradient overlay — darkens the bottom 2/3 of the viewport so
            text remains readable over the animation. Sits between canvas
            (z-0) and content (z-20). */}
        <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-10" />

        {/* Content overlay */}
        <div className="absolute inset-0 z-20 overflow-y-auto pointer-events-none">
          <div className="flex min-h-dvh flex-col">

            {/* Spacer pulls indicator up, keeps it accessible */}
            <div className="flex-1 p-6 md:p-12">
              <motion.div
                className="section-indicator"
                {...revealIndicator}
              >
                <span className="text-[#CCFF00] font-bold">02/04</span>
                <span className="text-[#888888]">&mdash;</span>
                <span>{t('indicators.about')}</span>
              </motion.div>
            </div>

            {/* ---- HUD Panel — anchored to the bottom ---- */}
            <div className="w-full px-6 pb-12 md:px-12 md:pb-16">
              <div className="max-w-5xl mx-auto">
                {/* Mobile: stacked — desktop: 12-col grid */}
                <div
                  className="flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-8 md:items-end"
                  style={{ textShadow: '0px 2px 4px rgba(0,0,0,1), 0px 0px 30px rgba(0,0,0,0.95), 0px 0px 80px rgba(0,0,0,0.7)' }}
                >

                  {/* ── Bio panel ── 5 columns ── */}
                  <div className="md:col-span-5 space-y-4">
                    <motion.p
                      className="text-[15px] md:text-[16px] leading-relaxed text-[#FFFFFF] font-medium"
                      {...revealBio1}
                    >
                      {t('about.bio_1')}
                    </motion.p>
                    <motion.p
                      className="text-[15px] md:text-[16px] leading-relaxed text-[#FFFFFF] font-medium"
                      {...revealBio2}
                    >
                      {t('about.bio_2')}
                    </motion.p>
                    <motion.p
                      className="text-[15px] md:text-[16px] leading-relaxed text-[#FFFFFF] font-medium"
                      {...revealBio3}
                    >
                      {t('about.bio_3')}
                    </motion.p>
                    <motion.p
                      className="text-[15px] md:text-[16px] leading-relaxed text-[#FFFFFF] font-medium"
                      {...revealBio4}
                    >
                      {t('about.bio_4')}
                    </motion.p>

                    {/* STATUS — green accent separator */}
                    <div className="pt-4 mt-4 border-t border-[#CCFF00]">
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#CCFF00]">
                        <span>{'\u25CF'}</span> {t('about.status')}
                      </p>
                    </div>
                  </div>

                  {/* ── Stack panel ── 6 columns, offset by 1 ── */}
                  <div className="md:col-span-6 md:col-start-7 space-y-5">
                    <motion.p
                      className="font-mono text-[#CCFF00] text-[13px] font-bold tracking-[0.12em] uppercase"
                      {...revealStackH}
                    >
                      [{t('about.stack_header')}]
                    </motion.p>

                    {categories.map((cat, catIdx) => (
                      <motion.div key={cat} {...catReveals[catIdx]}>
                        <p className="font-mono text-[11px] uppercase tracking-[0.08em] mb-2 text-[#FFFFFF]">
                          {'//'} {t(`about.categories.${cat}`)}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(
                            (t(`about.items.${cat}`, {
                              returnObjects: true,
                            }) as string[]) || []
                          ).map((tech: string) => (
                            <span
                              key={tech}
                              className="inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-[#E0E0E0] px-2.5 py-1 border border-[#555555] bg-transparent hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-colors duration-150"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
