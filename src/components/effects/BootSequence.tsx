'use client';

import { useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const BOOT_LINES = [
  '[ SYS::INIT          ]',
  '[ STACK::LOAD        ]  OK',
  '[ ASSETS::FETCH      ]  OK',
  '[ I18N::READY        ]  OK',
  '[ SCENE::INIT        ]  OK',
  '[ PORTFOLIO::READY   ]  →',
];

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const reducedMotion = useReducedMotion();

  const complete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (reducedMotion) {
      complete();
      return;
    }

    const timers: number[] = [];

    BOOT_LINES.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setVisibleLines(i + 1), i * 80),
      );
    });

    // Start fade after all lines shown + 300ms pause
    timers.push(
      window.setTimeout(
        () => setFadingOut(true),
        BOOT_LINES.length * 80 + 300,
      ),
    );

    // Call onComplete after fade finishes (200ms)
    timers.push(
      window.setTimeout(
        () => complete(),
        BOOT_LINES.length * 80 + 500,
      ),
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [reducedMotion, complete]);

  if (reducedMotion) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#000000] flex items-center justify-center transition-opacity duration-200 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="font-mono text-[12px] text-[#FFFFFF] space-y-1">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={
              line.includes('PORTFOLIO::READY')
                ? 'text-[#CCFF00]'
                : line.includes('READY')
                  ? 'text-[#CCFF00]'
                  : ''
            }
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
