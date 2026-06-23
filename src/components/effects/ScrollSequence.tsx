import { useEffect, useRef, type RefObject } from 'react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useImageSequence } from '../../hooks/useImageSequence';

interface ScrollSequenceProps {
  /** Total number of frames */
  frameCount: number;
  /** Public URL prefix; e.g. "/firstAnim/ezgif-frame-" */
  basePath: string;
  /** Zero-pad width of the frame number */
  padWidth?: number;
  /** File extension including leading dot */
  ext?: string;
  /**
   * Scroll length multiplier — the sticky container will be this many
   * viewports tall. Higher = more scroll distance to play through the sequence.
   * 3 = 300vh of scroll, which feels good for a 180-frame hero animation.
   */
  scrollMultiplier?: number;
  /**
   * Optional external ref for the tall scroll container. When provided,
   * ScrollSequence does NOT create its own wrapper (and does NOT add the
   * `scrollMultiplier * 100vh` height). The parent owns the layout and the
   * scroll source of truth — required when the same scroll needs to drive
   * other effects (text fade, etc.) in lockstep with the frame index.
   */
  containerRef?: RefObject<HTMLDivElement>;
  /**
   * Optional external progress (0-1). When provided, ScrollSequence uses
   * this MotionValue as the source of truth instead of the container's
   * own scroll. This enables hybrid patterns (manual scroll + autoplay).
   */
  externalProgress?: MotionValue<number>;
  /** Children rendered ON TOP of the canvas (e.g. hero text) */
  children?: React.ReactNode;
}

/** Draw `img` into `ctx` with object-fit: cover semantics. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number,
  dpr: number,
) {
  const targetW = Math.floor(canvasW * dpr);
  const targetH = Math.floor(canvasH * dpr);
  if (ctx.canvas.width !== targetW || ctx.canvas.height !== targetH) {
    ctx.canvas.width = targetW;
    ctx.canvas.height = targetH;
  }

  const canvasAspect = canvasW / canvasH;
  const imgAspect = img.naturalWidth / img.naturalHeight;
  let drawW: number;
  let drawH: number;
  let dx: number;
  let dy: number;
  if (imgAspect > canvasAspect) {
    // Image is wider — fit by height, crop sides
    drawH = canvasH;
    drawW = canvasH * imgAspect;
    dx = (canvasW - drawW) / 2;
    dy = 0;
  } else {
    // Image is taller — fit by width, crop top/bottom
    drawW = canvasW;
    drawH = canvasW / imgAspect;
    dx = 0;
    dy = (canvasH - drawH) / 2;
  }

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(img, dx, dy, drawW, drawH);
}

/**
 * A scroll-driven image sequence animation.
 *
 * Renders a fixed/sticky canvas that plays a sequence of images as the user
 * scrolls through a tall container. Pre-loads every frame before showing
 * (controlled via `ready` to avoid mid-scroll decodes).
 */
export default function ScrollSequence({
  frameCount,
  basePath,
  padWidth = 3,
  ext = '.png',
  scrollMultiplier = 3,
  containerRef: externalRef,
  externalProgress,
  children,
}: ScrollSequenceProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Use the external ref if provided so scroll + layout stay in sync with
  // the parent. Otherwise ScrollSequence owns its own tall container.
  const containerRef = (externalRef ?? internalRef) as RefObject<HTMLDivElement>;

  const { images, progress } = useImageSequence(frameCount, basePath, padWidth, ext);
  const ready = progress === 1;

  // Internal scroll progress (used when no externalProgress is supplied)
  const { scrollYProgress: internalScrollProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  // Source of truth for the frame index — external override wins
  const sourceProgress = externalProgress ?? internalScrollProgress;

  // Map [0, 1] -> [0, frameCount - 1]
  const frameIndex: MotionValue<number> = useTransform(
    sourceProgress,
    [0, 1],
    [0, frameCount - 1],
  );

  // Draw whenever the current frame changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawAt = (index: number) => {
      const i = Math.max(0, Math.min(frameCount - 1, Math.round(index)));
      const img = images[i];
      if (!img) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      drawCover(ctx, img, w, h, dpr);
    };

    // Initial draw
    drawAt(0);

    // Subscribe to scroll-driven frame index
    const unsubscribe = frameIndex.on('change', (latest) => {
      drawAt(latest);
    });

    return () => {
      unsubscribe();
    };
  }, [frameIndex, images, frameCount]);

  // Repaint on resize (debounced via rAF)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;

    const handleResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const i = Math.max(0, Math.min(frameCount - 1, Math.round(frameIndex.get())));
        const img = images[i];
        if (!img) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (w === 0 || h === 0) return;
        drawCover(ctx, img, w, h, dpr);
      });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, [frameIndex, images, frameCount]);

  // When the parent owns the layout (externalRef provided), render ONLY the
  // sticky stage. The parent supplies the tall scroll container and the
  // `ref` so scroll source of truth stays single. Otherwise wrap it here.
  // `z-10` lifts the sticky stage above the body::after grid overlay so
  // the animation renders cleanly without parallax-grid interference.
  const stage = (
    <div className="sticky top-0 z-10 h-[100svh] md:h-screen w-full overflow-hidden">
      {/* Black backdrop while frames are still loading */}
      <div className="absolute inset-0 bg-black" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      {!ready && (
        <div className="absolute bottom-4 right-4 z-30 font-mono text-[10px] uppercase tracking-[0.15em] text-[#666666]">
          loading {Math.round(progress * 100)}%
        </div>
      )}

      {/* Children sit above the canvas (hero text, CTAs, overlays) */}
      <div className="relative z-20 h-full w-full">{children}</div>
    </div>
  );

  if (externalRef) {
    // Parent owns the wrapper + height. We just render the sticky stage.
    return <>{stage}</>;
  }

  return (
    <div
      ref={internalRef}
      style={{ height: `${scrollMultiplier * 100}vh` }}
      className="relative w-full"
    >
      {stage}
    </div>
  );
}
