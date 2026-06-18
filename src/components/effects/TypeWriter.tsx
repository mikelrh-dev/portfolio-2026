'use client';

import { useEffect, useState } from 'react';
import { useTypeWriter } from '../../hooks/useTypeWriter';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TypeWriterProps {
  text: string;
  speed?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  onDone?: () => void;
}

export default function TypeWriter({
  text,
  speed = 30,
  className = '',
  as: Tag = 'h1',
  onDone,
}: TypeWriterProps) {
  const { displayed, done } = useTypeWriter(text, speed);
  const [showCursor, setShowCursor] = useState(true);
  const reducedMotion = useReducedMotion();

  // Blink cursor while typing
  useEffect(() => {
    if (done) {
      setShowCursor(false);
      onDone?.();
      return;
    }

    const blink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(blink);
  }, [done, onDone]);

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {displayed}
      {showCursor && (
        <span className="inline-block w-[2px] h-[1em] bg-[#FFFFFF] ml-0.5 align-middle animate-pulse" />
      )}
    </Tag>
  );
}
