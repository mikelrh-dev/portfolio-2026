import { useState, useEffect, useRef } from 'react';

export function useScrollSpy(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    observerRef.current = observer;

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeId;
}
