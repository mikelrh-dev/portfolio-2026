/**
 * Local noise overlay for the Hero canvas. Denser than the global film
 * grain and tuned to break up 8-bit banding in dark gradients.
 *
 * Pure CSS — GPU composited, no layout impact. Sits above the canvas
 * but below the text/UI overlays.
 */
export default function HeroNoise() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-[5]"
      style={{
        mixBlendMode: 'overlay',
        opacity: 0.06,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}
    />
  );
}
