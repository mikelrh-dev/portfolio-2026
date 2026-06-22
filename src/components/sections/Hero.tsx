import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollSequence from '../effects/ScrollSequence';
import MagneticButton from '../effects/MagneticButton';

const FRAME_COUNT = 150;
const SCROLL_MULTIPLIER = 3;

export default function Hero() {
  const { t } = useTranslation();
  const [showTagline, setShowTagline] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress inside the hero's tall scroll container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Title stays anchored in place the whole sequence. Only its opacity
  // and blur change near the end (right before the transition into About).
  // The image sequence is the moving element — text is static overlay.
  const titleOpacity = useTransform(scrollYProgress, [0, 0.78, 0.95, 1], [1, 1, 0, 0]);
  const titleBlur = useTransform(scrollYProgress, [0.85, 1], [0, 6]);
  // Derived MotionValue (NOT inline in style — that would leak on every render)
  const titleFilter = useTransform(titleBlur, (v) => `blur(${v}px)`);

  // Section indicator stays pinned, dims near the transition
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.95, 1], [1, 1, 0]);

  // Trigger the tagline reveal a small amount into the scroll (feels alive,
  // doesn't fight the opening frames).
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > 0.04 && !showTagline) setShowTagline(true);
  });

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative z-0 w-full"
      style={{ height: `${SCROLL_MULTIPLIER * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Scroll-driven image sequence. Pass our ref so the canvas and the
            text overlays share the SAME scroll source — no double container.
            WebP frames: 89MB -> 4.7MB vs the original PNGs. */}
        <ScrollSequence
          frameCount={FRAME_COUNT}
          basePath="/firstAnim/ezgif-frame-"
          padWidth={3}
          ext=".webp"
          scrollMultiplier={SCROLL_MULTIPLIER}
          containerRef={containerRef}
        >
          {/* (No vignette — let the animation render at full clarity.
              Text legibility is handled by weight + the dark midframes.) */}

          {/* Watermark disguise — black radial gradient covering the
              bottom-right Gemini sparkle. Slightly larger and a touch
              darker than the original to better hide the mark, but kept
              as a single soft ellipse so it still reads as natural
              shadow rather than a visible patch. */}
          <div
            className="absolute bottom-0 right-0 pointer-events-none z-10"
            style={{
              width: '45%',
              height: '45%',
              background:
                'radial-gradient(ellipse at bottom right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 25%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 85%)',
            }}
          />

          {/* Section indicator — pinned to top-left, fades at the very end */}
          <motion.div
            className="section-indicator absolute top-6 left-6 z-30"
            style={{ opacity: indicatorOpacity }}
          >
            01/04 — {t('indicators.hero')}
          </motion.div>

          {/* Title — static overlay. Visible during the whole sequence;
              only blurs and fades out at the end (right before the
              transition into About). The image sequence is what moves. */}
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-start justify-center px-6 sm:px-12"
            style={{
              opacity: titleOpacity,
              filter: titleFilter,
            }}
          >
            <h1 className="font-mono font-bold text-[clamp(1.75rem,7vw,7rem)] leading-[1.0] text-[#FFFFFF] uppercase tracking-[-0.02em] w-full max-w-5xl [overflow-wrap:anywhere]">
              THE HUMAN IN THE LOOP.
            </h1>

            {showTagline && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
                className="mt-6 max-w-3xl"
              >
                <p className="font-mono text-[clamp(0.9rem,1.5vw,1.125rem)] text-[#888888] mb-2 uppercase tracking-[0.12em]">
                  <span>{t('hero.tagline_1')}</span>{' '}
                  <span className="text-[#CCFF00] font-bold">{t('hero.tagline_2')}</span>
                </p>
                <p className="font-mono text-[13px] text-zinc-500 uppercase tracking-[0.12em]">
                  {t('hero.role')}
                </p>
              </motion.div>
            )}

            {/* CTAs — visible during the whole sequence */}
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
          </motion.div>
        </ScrollSequence>
      </div>
    </section>
  );
}
