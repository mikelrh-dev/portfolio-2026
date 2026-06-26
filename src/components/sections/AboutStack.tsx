import { motion, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollSequence from '../effects/ScrollSequence';
import { useScrollSequence } from '../effects/SharedScrollSequence';

const categories = ['production', 'frontend', 'ai_workflow', 'tools'] as const;

/** Reveal config: [start, end] progress thresholds for each element */
const REVEAL = {
  indicator: [0.08, 0.12] as [number, number],
  bio1: [0.20, 0.30] as [number, number],
  bio2: [0.30, 0.40] as [number, number],
  bio3: [0.40, 0.50] as [number, number],
  bio4: [0.50, 0.60] as [number, number],
  stackHeader: [0.55, 0.60] as [number, number],
  cat0: [0.60, 0.65] as [number, number],
  cat1: [0.65, 0.70] as [number, number],
  cat2: [0.70, 0.75] as [number, number],
  cat3: [0.75, 0.80] as [number, number],
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
  const { containerRef, isMobile, aboutProgress, totalProgress } = useScrollSequence();

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

  // Canvas fades in during the last ~3% of hero scroll range (32%→35%).
  // Fully opaque when aboutProgress begins, so the user sees frame 001
  // at full brightness without any frames lost to the transition.
  const canvasOpacity = useTransform(
    totalProgress,
    [0.32, 0.35, 1.0],
    [0, 1, 1],
  );

  // About section height: 65% of the 700vh shared container.
  // Starts at 35% (after hero), plays upscaled frames 1-143.
  const ABOUT_SECTION_HEIGHT = '455vh';

  return (
    <section
      id="about"
      className="relative w-full"
      style={{ height: ABOUT_SECTION_HEIGHT }}
    >
      {/* Sticky "camera" — holds canvas + content in viewport while
          the section provides scroll distance for the sequence */}
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-black">
        {/* Full-viewport canvas background */}
        <motion.div className="absolute inset-0" style={{ opacity: canvasOpacity }}>
          <ScrollSequence
          frameCount={isMobile ? 72 : 143}
          basePath="/assets/sequences/about/frame-"
          padWidth={3}
          ext=".webp"
          containerRef={containerRef}
          externalProgress={aboutProgress}
          alignY="top"
        />
        </motion.div>

        {/* Gradient overlay — darkens the bottom 2/3 of the viewport so
            text remains readable over the animation. Sits between canvas
            (z-0) and content (z-20). */}
        <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

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
                <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-8 md:items-end">

                  {/* ── Bio panel ── 5 columns ── */}
                  <div className="md:col-span-5 space-y-4">
                    <motion.p
                      className="text-[14px] md:text-[15px] leading-relaxed text-[#CCCCCC]"
                      style={revealBio1}
                    >
                      {t('about.bio_1')}
                    </motion.p>
                    <motion.p
                      className="text-[14px] md:text-[15px] leading-relaxed text-[#CCCCCC]"
                      style={revealBio2}
                    >
                      {t('about.bio_2')}
                    </motion.p>
                    <motion.p
                      className="text-[14px] md:text-[15px] leading-relaxed text-[#CCCCCC]"
                      style={revealBio3}
                    >
                      {t('about.bio_3')}
                    </motion.p>
                    <motion.p
                      className="text-[14px] md:text-[15px] leading-relaxed text-[#CCCCCC]"
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
                              className="inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-[#CCCCCC] px-2.5 py-1 border border-[#555555] bg-transparent hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-colors duration-150"
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
