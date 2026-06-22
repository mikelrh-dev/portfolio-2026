import { useEffect, useState } from 'react';

/**
 * Pre-loads a sequence of image frames so the scroll animation can render
 * without network or decode stalls mid-scroll.
 *
 * @param frameCount  total number of frames in the sequence (1..frameCount)
 * @param basePath    path prefix; the URL will be `${basePath}${pad(frame, width)}${ext}`
 * @param width       zero-pad width (e.g. 3 -> "001", "002", ...)
 * @param ext         file extension including the leading dot
 * @returns           { images, loaded, progress } — `images[i]` is null until ready
 */
export function useImageSequence(
  frameCount: number,
  basePath: string,
  width: number,
  ext: string,
) {
  const [images, setImages] = useState<(HTMLImageElement | null)[]>(() =>
    new Array<HTMLImageElement | null>(frameCount).fill(null),
  );
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    if (frameCount <= 0) return;

    let cancelled = false;
    const results: (HTMLImageElement | null)[] = new Array(frameCount).fill(null);
    let completed = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const padded = String(i + 1).padStart(width, '0');
      img.src = `${basePath}${padded}${ext}`;
      img.decoding = 'async';
      img.onload = () => {
        if (cancelled) return;
        results[i] = img;
        completed += 1;
        setLoaded(completed);
        if (completed === frameCount) setImages([...results]);
      };
      img.onerror = () => {
        if (cancelled) return;
        // Even on error, count it as "done" so we don't block the progress forever
        completed += 1;
        setLoaded(completed);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [frameCount, basePath, width, ext]);

  const progress = frameCount > 0 ? loaded / frameCount : 0;

  return { images, loaded, progress };
}
