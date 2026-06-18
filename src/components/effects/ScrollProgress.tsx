'use client';

import { useRef, useEffect } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function ScrollProgress() {
  const progressRef = useScrollProgress();
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let raf: number;
    const update = () => {
      const pct = Math.round(progressRef.current * 100);
      if (barRef.current) {
        barRef.current.style.transform = `scaleY(${progressRef.current})`;
      }
      if (labelRef.current) {
        labelRef.current.textContent = `${pct}%`;
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, progressRef]);

  if (reducedMotion) return null;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[9998] hidden md:flex flex-col items-center gap-2">
      {/* Bar track */}
      <div className="w-[2px] h-[40vh] bg-[#222222] relative overflow-hidden">
        {/* Bar fill */}
        <div
          ref={barRef}
          className="absolute bottom-0 left-0 w-full bg-[#CCFF00] origin-bottom"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>
      {/* Percentage label */}
      <span
        ref={labelRef}
        className="font-mono text-[10px] text-[#CCFF00] tracking-[0.1em]"
      >
        0%
      </span>
    </div>
  );
}
