import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
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

function useReveal(thresholds: [number, number]) {
  const { aboutProgress } = useScrollSequence();
  return {
    opacity: useTransform(aboutProgress, thresholds, [0, 1]),
    y: useTransform(aboutProgress, thresholds, [20, 0]),
  };
}

export default function AboutStack() {
  const { t } = useTranslation();
  const { containerRef, isMobile, aboutProgress } = useScrollSequence();

  // Auto-play canvas: loops 143 frames (~6s at 24fps) while section is visible
  const autoProgress = useMotionValue(0);

  useEffect(() => {
    const section = document.getElementById('about');
    if (!section) return;
    let controls: ReturnType<typeof animate> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
  }, [autoProgress]);

  const revealIndicator = useReveal(REVEAL.indicator);
  const revealBio1 = useReveal(REVEAL.bio1);
  const revealBio2 = useReveal(REVEAL.bio2);
  const revealBio3 = useReveal(REVEAL.bio3);
  const revealBio4 = useReveal(REVEAL.bio4);
  const revealStackH = useReveal(REVEAL.stackHeader);
  const revealCat0 = useReveal(REVEAL.cat0);
  const revealCat1 = useReveal(REVEAL.cat1);
  const revealCat2 = useReveal(REVEAL.cat2);
  const revealCat3 = useReveal(REVEAL.cat3);

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
          // Mobile: show final frame (frame 143) as static image
          <img
            src="/assets/sequences/about/frame-143.webp"
            alt="About background"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
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
                style={revealIndicator}
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
                      style={revealBio1}
                    >
                      {t('about.bio_1')}
                    </motion.p>
                    <motion.p
                      className="text-[15px] md:text-[16px] leading-relaxed text-[#FFFFFF] font-medium"
                      style={revealBio2}
                    >
                      {t('about.bio_2')}
                    </motion.p>
                    <motion.p
                      className="text-[15px] md:text-[16px] leading-relaxed text-[#FFFFFF] font-medium"
                      style={revealBio3}
                    >
                      {t('about.bio_3')}
                    </motion.p>
                    <motion.p
                      className="text-[15px] md:text-[16px] leading-relaxed text-[#FFFFFF] font-medium"
                      style={revealBio4}
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
                      style={revealStackH}
                    >
                      [{t('about.stack_header')}]
                    </motion.p>

                    {categories.map((cat, catIdx) => (
                      <motion.div key={cat} style={catReveals[catIdx]}>
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
