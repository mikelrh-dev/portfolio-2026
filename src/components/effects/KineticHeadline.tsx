'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface KineticHeadlineProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'div';
  className?: string;
  /**
   * Split mode for GSAP SplitText-like word-by-word reveal.
   * Uses native split by word since SplitText is a club plugin.
   */
  stagger?: number;
  once?: boolean;
}

/**
 * Kinetic headline that reveals words one by one with opacity + translateY.
 * Uses GSAP ScrollTrigger driven reveal — fires once on section enter.
 * Respects prefers-reduced-motion.
 */
export default function KineticHeadline({
  children,
  as: Tag = 'h1',
  className = '',
  stagger = 0.03,
  once = true,
}: KineticHeadlineProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion) return;

    const words = children.split(' ');
    el.innerHTML = words
      .map((word) => `<span class="kinetic-word" style="display:inline-block">${word}</span>`)
      .join(' ');

    const wordEls = el.querySelectorAll('.kinetic-word');

    gsap.set(wordEls, { opacity: 0, y: 40 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once,
        onEnter: () => {
          gsap.to(wordEls, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger,
            ease: 'power3.out',
          });
        },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, [children, stagger, once, reducedMotion]);

  // If reduced motion, render plain text
  if (reducedMotion) {
    return (
      <Tag ref={containerRef} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={containerRef} className={className}>
      {children}
    </Tag>
  );
}
