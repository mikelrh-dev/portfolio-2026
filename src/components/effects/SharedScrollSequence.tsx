import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export interface ScrollSequenceCtx {
  heroProgress: MotionValue<number>;
  aboutProgress: MotionValue<number>;
  containerRef: RefObject<HTMLDivElement>;
  totalProgress: MotionValue<number>;
  isMobile: boolean;
}

const ScrollSequenceContext = createContext<ScrollSequenceCtx | null>(null);

export function useScrollSequence() {
  const ctx = useContext(ScrollSequenceContext);
  if (!ctx) {
    throw new Error('useScrollSequence must be used within SharedScrollSequence');
  }
  return ctx;
}

interface SharedScrollSequenceProps {
  children: ReactNode;
}

interface SequenceProviderProps extends SharedScrollSequenceProps {
  containerRef: RefObject<HTMLDivElement>;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
}

/**
 * Renders the tall scroll container and derives the shared progress values.
 * Hero and About each read their slice via context.
 *
 * - heroProgress: 0→1 over [0, heroShare] of total scroll (245vh desktop / 100vh mobile)
 * - aboutProgress: 0→1 over [heroShare, 1.0] of total scroll (120vh)
 */
function SequenceProvider({
  containerRef,
  scrollYProgress,
  isMobile,
  children,
}: SequenceProviderProps) {
  // Hero share of the scroll container: desktop 245vh of 365vh → 0.671,
  // mobile 100vh static hero of 220vh → 0.4545. Keeps About reveals aligned
  // to the About section's visual position on both breakpoints.
  const heroShare = isMobile ? 100 / 220 : 0.671;

  // Hero: 245vh of 365vh total → 0.671 (desktop) / 100vh of 220vh → 0.4545 (mobile)
  const heroProgress = useTransform(scrollYProgress, [0, heroShare], [0, 1]);
  // About: 120vh of 365vh total → starts at 0.671 (desktop) / 120vh of 220vh → starts at 0.4545 (mobile)
  const aboutProgress = useTransform(scrollYProgress, [heroShare, 1.0], [0, 1]);

  return (
    <ScrollSequenceContext.Provider
      value={{ heroProgress, aboutProgress, containerRef, totalProgress: scrollYProgress, isMobile }}
    >
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: isMobile ? 'auto' : '365vh' }}
      >
        {children}
      </div>
    </ScrollSequenceContext.Provider>
  );
}

/**
 * Desktop: framer-motion's useScroll tracks the container. Desktop stays
 * byte-identical to the pre-optimization behavior.
 */
function DesktopSequence({ children }: SharedScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <SequenceProvider containerRef={containerRef} scrollYProgress={scrollYProgress} isMobile={false}>
      {children}
    </SequenceProvider>
  );
}

/**
 * Mobile: avoids useScroll entirely. useScroll performs forced layout reads
 * (offsetParent walk) every frame while scrolling — the lag source when
 * entering the About section on low-end devices. Instead, a single passive
 * scroll listener computes progress from one getBoundingClientRect() per
 * frame (single measurement, no offsetParent traversal).
 */
function MobileSequence({ children }: SharedScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    // rAF-throttle: coalesce the per-event getBoundingClientRect() layout
    // read to one measurement per frame, and only push to the MotionValue
    // when progress actually changed. This removes the per-scroll-event
    // forced layout reads that compounded the About lag on low-end devices.
    let rafId = 0;
    let lastProgress = 0;

    const measure = () => {
      const container = containerRef.current;
      if (!container) {
        rafId = 0;
        return;
      }

      const rect = container.getBoundingClientRect();
      const scrollProgress = Math.max(
        0,
        Math.min(1, -rect.top / (rect.height - window.innerHeight)),
      );

      if (Math.abs(scrollProgress - lastProgress) > 0.001) {
        scrollYProgress.set(scrollProgress);
        lastProgress = scrollProgress;
      }

      rafId = 0;
    };

    const handleScroll = () => {
      if (rafId) return; // one rAF per frame — throttle layout reads
      rafId = requestAnimationFrame(measure);
    };

    handleScroll(); // initial position
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [scrollYProgress]);

  return (
    <SequenceProvider containerRef={containerRef} scrollYProgress={scrollYProgress} isMobile={true}>
      {children}
    </SequenceProvider>
  );
}

export default function SharedScrollSequence({ children }: SharedScrollSequenceProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return isMobile ? <MobileSequence>{children}</MobileSequence> : <DesktopSequence>{children}</DesktopSequence>;
}
