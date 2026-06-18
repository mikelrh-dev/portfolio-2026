'use client';

import { useState, useEffect, useRef } from 'react';
import { useTextScramble } from '../../hooks/useTextScramble';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TextScrambleProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
}

export default function TextScramble({
  text,
  className = '',
  as: Tag = 'h2',
}: TextScrambleProps) {
  const [active, setActive] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const scrambled = useTextScramble(text, active, 300);

  useEffect(() => {
    if (reducedMotion) return;

    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <div ref={observerRef}>
      <Tag className={className}>{scrambled}</Tag>
    </div>
  );
}
