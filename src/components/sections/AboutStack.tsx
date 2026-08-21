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

  // Transformaciones para el efecto "Holograma" al final del scroll (85% al 100%)
  const finalOpacity = useTransform(autoProgress, [0.85, 1], [1, 0.35]);
  const finalScale = useTransform(autoProgress, [0.85, 1], [1, 0.96]);
  const finalFilter = useTransform(
    autoProgress,
    [0.85, 1],
    ["grayscale(0%) blur(0px) brightness(100%)", "grayscale(100%) blur(5px) brightness(60%)"]
  );

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
      <section id="about" className="relative w-full bg-black">
        {/* Sticky "camera" — pins the About viewport while the page scrolls */}
        <div className="relative h-dvh sticky top-0 overflow-hidden">
          {/* Background — static final frame, lazily loaded */}
          <img
            src="/assets/sequences/about/frame-143-mobile.webp"
            alt="About background"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />

          {/* Gradient overlay — darkens the frame so HUD text stays readable */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/50 to-black" />

          {/* HUD — vertically centered; ONLY this small box scrolls internally
              (max-h-[80vh]) so every bio/stack chip/category is reachable
              without making the page itself scroll. pr-2 keeps the scrollbar
              from clipping text. */}
          <div className="absolute inset-0 z-20 flex items-center justify-center px-6 py-12">
            <div className="max-w-sm w-full max-h-[80vh] overflow-y-auto space-y-6 pr-2">
              {/* Section indicator */}
              <motion.div className="section-indicator mb-0!" {...revealIndicator}>
                <span className="text-[#CCFF00] font-bold">02/04</span>
                <span className="text-[#888888]">&mdash;</span>
                <span>{t('indicators.about')}</span>
              </motion.div>

              {/* Bio — headline + narrative */}
              <div className="space-y-3">
                <motion.p
                  className="text-[14px] leading-snug text-[#FFFFFF] font-medium"
                  {...revealBio1}
                >
                  {t('about.bio_headline_prefix')}{' '}
                  <span className="text-[#CCFF00]">{t('about.bio_headline_accent')}</span>
                </motion.p>
                <motion.p
                  className="text-[14px] leading-snug text-[#FFFFFF] font-medium"
                  {...revealBio2}
                >
                  {t('about.bio_1')}
                </motion.p>
                <motion.p
                  className="text-[14px] leading-snug text-[#FFFFFF] font-medium"
                  {...revealBio3}
                >
                  {t('about.bio_2')}
                </motion.p>
                <motion.p
                  className="text-[14px] leading-snug text-[#FFFFFF] font-medium"
                  {...revealBio4}
                >
                  {t('about.bio_3')}
                </motion.p>
              </div>

              {/* Status — green accent separator */}
              <div className="border-t border-[#CCFF00] pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#CCFF00]">
                  <span>{'\u25CF'}</span> {t('about.status')}
                </p>
              </div>

              {/* Stack — ALL items in a 2-column grid */}
              <motion.div {...revealStackH}>
                <h4 className="font-mono text-[#CCFF00] text-[12px] font-bold tracking-[0.12em] uppercase mb-2">
                  [{t('about.stack_header')}]
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {stackItems.map((tech: string) => (
                    <span
                      key={tech}
                      className="inline-block font-mono text-[10px] uppercase tracking-[0.08em] text-[#E0E0E0] px-2 py-1 border border-[#555555] bg-black/40"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Categories — ALL */}
              <motion.div {...revealCat0}>
                <h4 className="font-mono text-[#CCFF00] text-[12px] font-bold tracking-[0.12em] uppercase mb-2">
                  [{t('about.categories_header')}]
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-block font-mono text-[10px] uppercase tracking-[0.08em] text-[#E0E0E0] px-2 py-0.5 border border-[#555555] bg-black/40"
                    >
                      {t(`about.categories.${cat}`)}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
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
        {/* Background: auto-play canvas sequence */}
        <motion.div
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          style={{
            opacity: finalOpacity,
            scale: finalScale,
            filter: finalFilter
          }}
        >
          <ScrollSequence
            frameCount={143}
            basePath="/assets/sequences/about/frame-"
            padWidth={3}
            ext=".webp"
            containerRef={containerRef}
            externalProgress={autoProgress}
            alignY="top"
          />

          {/* Gradient overlay — darkens the bottom 2/3 of the viewport so
              text remains readable over the animation. Sits between canvas
              (z-0) and content (z-20). */}
          <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-10" />
        </motion.div>

        {/* Content overlay */}
        <div className="absolute inset-0 z-20 overflow-y-auto pointer-events-none">
          {/* Indicator — pinned top-left so it never competes with centering */}
          <div className="absolute top-0 left-0 p-6 md:p-12 z-10">
            <motion.div
              className="section-indicator"
              {...revealIndicator}
            >
              <span className="text-[#CCFF00] font-bold">02/04</span>
              <span className="text-[#888888]">&mdash;</span>
              <span>{t('indicators.about')}</span>
            </motion.div>
          </div>

          {/* Grid area — perfectly centered vertically in viewport */}
          <div className="flex min-h-dvh items-center justify-center">
            <div className="w-full max-w-full pb-4 md:pb-6">
              <div className="w-full">
                {/* 12-col grid: bio(4) | center(4 clear for face) | stack(4) */}
                <div
                  className="flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-8 items-center pb-2"
                  style={{ textShadow: '0px 2px 4px rgba(0,0,0,1), 0px 0px 30px rgba(0,0,0,0.95), 0px 0px 80px rgba(0,0,0,0.7)' }}
                >

                   {/* ── Bio panel ── 4 columns ── */}
                   <div className="md:col-span-5 lg:col-span-4 space-y-5 p-6 lg:p-8 bg-black/85 backdrop-blur-md border-l-2 border-[#CCFF00] border-y border-r border-white/10 rounded-none pointer-events-auto shadow-2xl relative">
                    {/* Corner accent — HUD style (top-right only) */}
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#CCFF00]" />

                    {/* Terminal header */}
                    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                      <div className="w-2 h-2 rounded-full bg-[#CCFF00]" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#CCFF00]">bio.md</span>
                    </div>

                {/* Intro y Claim Principal */}
                <motion.h3 className="text-[15px] lg:text-[16px] leading-snug font-bold text-white tracking-tight mb-4" {...revealBio1}>
                  {t('about.bio_headline_prefix')}{' '}
                  <span className="text-[#CCFF00]">{t('about.bio_headline_accent')}</span>
                </motion.h3>

                {/* Texto Fluido Narrativo (Formato Teaser y Pragmático) */}
                <div className="space-y-5 pt-2 border-t border-white/10">
                  
                  <motion.p className="text-[13px] lg:text-[15px] text-[#CCCCCC] leading-[1.8]" {...revealBio2}>
                    {t('about.bio_1')}
                  </motion.p>

                  <motion.p className="text-[13px] lg:text-[15px] text-[#CCCCCC] leading-[1.8]" {...revealBio3}>
                    {t('about.bio_2')}
                  </motion.p>

                  <motion.p className="text-[13px] lg:text-[15px] text-[#CCCCCC] leading-[1.8]" {...revealBio4}>
                    {t('about.bio_3')}
                  </motion.p>

                </div>

                {/* Botón de Expansión / Historia Completa */}
                <motion.div className="pt-5 mt-2" {...revealBio4}>
                  <button className="font-mono text-[11px] text-black bg-[#CCFF00] hover:bg-white hover:text-black transition-colors duration-300 px-4 py-1.5 uppercase tracking-wider font-bold">
                    {t('about.cta_story')}
                  </button>
                </motion.div>

                    {/* STATUS — green accent separator */}
                    <div className="pt-4 mt-4 border-t border-[#CCFF00]">
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#CCFF00]">
                        <span>{'\u25CF'}</span> {t('about.status')}
                      </p>
                    </div>
                  </div>

                   {/* ── Center spacer ── 4 columns cleared for face video ── */}
                   <div className="hidden md:block md:col-span-4" />

                   {/* ── Stack panel ── 4 columns ── */}
                   <div className="md:col-span-5 lg:col-span-4 space-y-7 p-6 lg:p-8 bg-black/85 backdrop-blur-md border-r-2 border-[#CCFF00] border-y border-l border-white/10 rounded-none pointer-events-auto shadow-2xl relative">
                    {/* Corner accent — HUD style (top-left only) */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#CCFF00]" />

                    {/* Terminal header */}
                    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                      <div className="w-2 h-2 rounded-full bg-[#CCFF00]" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#CCFF00]">stack.json</span>
                    </div>

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
                              className="inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-[#E0E0E0] px-2.5 py-1 border border-[#333333] bg-black/80 hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-colors duration-150"
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
