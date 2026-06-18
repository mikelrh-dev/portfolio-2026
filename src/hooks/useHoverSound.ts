import { useCallback } from 'react';
import { playClick } from '../lib/audio/click';

export function useHoverSound() {
  const onPointerEnter = useCallback(() => {
    playClick();
  }, []);

  return { onPointerEnter };
}
