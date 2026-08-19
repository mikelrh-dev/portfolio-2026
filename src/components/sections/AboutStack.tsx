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

  // Mobile: sticky 100vh "camera" — same visual as desktop (full-bleed frame
  // with overlaid HUD), but ALL content (4 bios, every stack chip, every
  // category) is reachable via a SMALL internal scroll box (max-h-[80vh]).
  // The sticky container is overflow-hidden, so the only scrollable element is
  // the HUD content box itself — nested scroll is small and local, never the
  // page, so there is no compositing/scroll lag. One-shot reveals (no
  // scroll-linked style writes). The 100vh section never overlaps the next.
  if (isMobile) {
    // Flat stack list (ordered by category) — ALL items, no slice.
    const stackItems = categories.flatMap((cat) =>
      (t(`about.items.${cat}`, { returnObjects: true }) as string[]) || [],
    );

    return (
      <section id="about" className="relative w-full bg-black pb-24">
        
        {/* Hero Header Fotográfico: Ocupa solo el 45% de la pantalla */}
        <div className="relative w-full h-[45vh]">
          <img
            src="/assets/sequences/about/frame-143-mobile.webp"
            alt="About background"
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
          {/* Degradado agresivo que funde la imagen a negro puro */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/40 to-black" />
        </div>

        {/* Contenido fluido: Descansa sobre fondo negro puro con scroll nativo */}
        <div className="relative z-20 px-6 -mt-8 max-w-sm mx-auto space-y-8">
          
          <motion.div className="section-indicator mb-0!" {...revealIndicator}>
            <span className="text-[#CCFF00] font-bold">02/04</span>
            <span className="text-[#888888]">&mdash;</span>
            <span>{t('indicators.about')}</span>
          </motion.div>

          {/* Bios */}
          <div className="space-y-5">
            <motion.p className="text-[15px] leading-relaxed text-[#E0E0E0] font-medium" {...revealBio1}>
              {t('about.bio_1')}
            </motion.p>
            <motion.p className="text-[15px] leading-relaxed text-[#E0E0E0] font-medium" {...revealBio2}>
              {t('about.bio_2')}
            </motion.p>
            <motion.p className="text-[15px] leading-relaxed text-[#E0E0E0] font-medium" {...revealBio3}>
              {t('about.bio_3')}
            </motion.p>
            <motion.p className="text-[15px] leading-relaxed text-[#E0E0E0] font-medium" {...revealBio4}>
              {t('about.bio_4')}
            </motion.p>
          </div>

          <div className="border-t border-[#CCFF00] pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#CCFF00]">
              <span>{'\u25CF'}</span> {t('about.status')}
            </p>
          </div>

          {/* Stack Grid */}
          <motion.div {...revealStackH}>
            <h4 className="font-mono text-[#CCFF00] text-[12px] font-bold tracking-[0.12em] uppercase mb-4">
              [{t('about.stack_header')}]
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {stackItems.map((tech: string) => (
                <span
                  key={tech}
                  className="inline-flex items-center justify-center text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#E0E0E0] px-2 py-2 border border-[#333333] bg-[#0A0A0A]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div {...revealCat0}>
            <h4 className="font-mono text-[#CCFF00] text-[12px] font-bold tracking-[0.12em] uppercase mb-4">
              [{t('about.categories_header')}]
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-[#E0E0E0] px-3 py-1.5 border border-[#333333] bg-[#0A0A0A]"
                >
                  {t(`about.categories.${cat}`)}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

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

        {/* Absolute full-screen flex container: pushes Bio to left, Stack to right */}
        <div className="absolute inset-0 z-10 w-full h-full flex flex-col md:flex-row justify-between items-center px-8 lg:px-24 pointer-events-none">
          
          {/* ── Bio panel (left) ── */}
          <div className="pointer-events-auto w-full max-w-md space-y-4 p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl"
            style={{ textShadow: isMobile ? 'none' : '0px 2px 6px rgba(0,0,0,0.9), 0px 0px 12px rgba(0,0,0,0.8)' }}
          >
            <motion.div
              className="section-indicator"
              {...revealIndicator}
            >
              <span className="text-[#CCFF00] font-bold">02/04</span>
              <span className="text-[#888888]">&mdash;</span>
              <span>{t('indicators.about')}</span>
            </motion.div>

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

          {/* ── Spacer for justify-between ── */}
          <div className="hidden md:flex flex-1" />

          {/* ── Stack panel (right) ── */}
          <div className="pointer-events-auto w-full max-w-md space-y-5 p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl"
            style={{ textShadow: isMobile ? 'none' : '0px 2px 6px rgba(0,0,0,0.9), 0px 0px 12px rgba(0,0,0,0.8)' }}
          >
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
                      className="inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-[#E0E0E0] px-2.5 py-1 border border-[#555555] bg-white/10 hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-colors duration-150"
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
    </section>
  );
}
