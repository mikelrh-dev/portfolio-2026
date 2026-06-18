import { useRef, useState, useCallback, type CSSProperties, type RefObject } from 'react';

interface MagneticState {
  x: number;
  y: number;
}

interface UseMagneticCursorReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  style: CSSProperties;
  isActive: boolean;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
}

export function useMagneticCursor<T extends HTMLElement>(
  strength: number = 0.3,
): UseMagneticCursorReturn<T> {
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState<MagneticState>({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const rafRef = useRef<number>(0);
  const targetRef = useRef<MagneticState>({ x: 0, y: 0 });
  const currentRef = useRef<MagneticState>({ x: 0, y: 0 });

  const animate = useCallback(() => {
    const dx = targetRef.current.x - currentRef.current.x;
    const dy = targetRef.current.y - currentRef.current.y;

    currentRef.current.x += dx * 0.15;
    currentRef.current.y += dy * 0.15;

    if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
      setOffset({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setOffset({ x: 0, y: 0 });
      currentRef.current = { x: 0, y: 0 };
      setIsActive(false);
    }
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetRef.current = {
        x: (e.clientX - centerX) * strength,
        y: (e.clientY - centerY) * strength,
      };

      setIsActive(true);

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [strength, animate],
  );

  const onPointerLeave = useCallback(() => {
    targetRef.current = { x: 0, y: 0 };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const style: CSSProperties = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: 'none',
    willChange: 'transform',
  };

  return { ref, style, isActive, onPointerMove, onPointerLeave };
}
