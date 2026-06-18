import { useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export function useTextScramble(
  text: string,
  active: boolean,
  duration: number = 300,
): string {
  const [displayed, setDisplayed] = useState(text);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !active) {
      setDisplayed(text);
      return;
    }

    let frame: number;
    const startTime = performance.now();

    const scramble = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (Math.random() < 1 - progress) {
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        } else {
          result += text[i];
        }
      }

      setDisplayed(result);

      if (progress < 1) {
        frame = requestAnimationFrame(scramble);
      }
    };

    frame = requestAnimationFrame(scramble);
    return () => cancelAnimationFrame(frame);
  }, [text, active, duration, reducedMotion]);

  return displayed;
}
