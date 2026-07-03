import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';
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

/**
 * Provides a single scroll container that drives both Hero and About
 * canvas sequences via context.
 *
 * - heroProgress: 0→1 over [0, 0.671] of total scroll (245vh)
 * - aboutProgress: 0→1 over [0.671, 1.0] of total scroll (120vh)
 * - Children (Hero, AboutStack) each render their own ScrollSequence with
 *   this container's ref and the appropriate progress value.
 */
export default function SharedScrollSequence({ children }: SharedScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Hero: 245vh of 365vh total → 0.671
  const heroProgress = useTransform(scrollYProgress, [0, 0.671], [0, 1]);
  // About: 120vh of 365vh total → starts at 0.671
  const aboutProgress = useTransform(scrollYProgress, [0.671, 1.0], [0, 1]);

  return (
    <ScrollSequenceContext.Provider
      value={{ heroProgress, aboutProgress, containerRef, totalProgress: scrollYProgress, isMobile }}
    >
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: '365vh' }}
      >
        {children}
      </div>
    </ScrollSequenceContext.Provider>
  );
}
