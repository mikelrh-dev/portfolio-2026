import { useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseTypeWriterResult {
  displayed: string;
  done: boolean;
}

export function useTypeWriter(
  text: string,
  speed: number = 30,
  enabled: boolean = true,
): UseTypeWriterResult {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled) {
      setDisplayed('');
      setDone(false);
      return;
    }

    if (reducedMotion) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed('');
    setDone(false);

    if (!text) {
      setDone(true);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled, reducedMotion]);

  return { displayed, done };
}
