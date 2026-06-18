import { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !cursorRef.current) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('a, button, .magnetic, [data-cursor]');
      setIsHovering(isInteractive);
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    // Reset cursor to center-ish to avoid jump from (0,0)
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
    currentX = targetX;
    currentY = targetY;

    window.addEventListener('pointermove', onMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  return { cursorRef, isHovering, reducedMotion };
}
