import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress(): React.MutableRefObject<number> {
  const progress = useRef<number>(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return progress;
}
