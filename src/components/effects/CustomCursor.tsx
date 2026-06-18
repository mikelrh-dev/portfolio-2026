'use client';

import { useEffect } from 'react';
import { useCustomCursor } from '../../hooks/useCustomCursor';

export default function CustomCursor() {
  const { cursorRef, isHovering, reducedMotion } = useCustomCursor();

  // Add class to <html> to hide native cursor
  useEffect(() => {
    if (!reducedMotion) {
      document.documentElement.classList.add('custom-cursor-active');
    }
    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none font-mono text-[14px] leading-none whitespace-nowrap select-none"
      style={{ transform: 'translate(0, 0)' }}
      aria-hidden="true"
    >
      {isHovering ? (
        <span className="text-[#CCFF00] transition-colors duration-150">[ → ]</span>
      ) : (
        <span className="text-[#FFFFFF]">[ _ ]</span>
      )}
    </div>
  );
}
