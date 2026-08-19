# Tasks: Mobile Performance Round 2

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~55 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | exception-ok |

Decision needed before apply: No
Chained PRs recommended: No
400-line budget risk: Low

## Phase 1: Mobile Gates

- [x] 1.1 **ScrollProgress gate**: Disable rAF loop + GSAP ScrollTrigger on mobile (`useMediaQuery('(max-width: 768px)')`). Do not render component on mobile.
- [x] 1.2 **Nav backdrop-blur removal on mobile**: `backdrop-blur-none md:backdrop-blur-sm` + `bg-[#000000]/95 md:bg-[#000000]/80`. Desktop computed style identical to base.
- [x] 1.3 **Hero gridOpacity + taglineGate gate on mobile**: Skip tagline subscription and grid-opacity scroll subscription when `isMobile`. Initial `--grid-opacity: 0` still set on mobile to avoid grid overlay regression.
- [x] 1.4 **AboutStack autoProgress gate on mobile**: Skip IntersectionObserver + 6s animate tween when `isMobile`.

## Phase 2: Asset + CSS Optimization

- [x] 1.5 **About mobile image**: Generate `public/assets/sequences/about/frame-143-mobile.webp` (720x1280, webp q80, cover) via sharp. 433KB → 106KB. Point mobile `<img>` at it, add `decoding="async"`.
- [x] 1.6 **content-visibility below-fold**: `@media (max-width: 1024px)` applies `content-visibility: auto` + `contain-intrinsic-size` to `#work` and `#contact`. **#about explicitly excluded** (breaks useScroll measurement).

## Phase 3: Verification

- [x] 1.7 **Build check**: `npm run build` (tsc + vite) passes with zero errors.
- [x] 1.8 **Runtime smoke test**: `vite preview` serves HTTP 200; mobile image served at 108,852 bytes.
- [x] 1.9 **Desktop byte-identical**: Reviewed full diff fb2b6bd..HEAD — all changes gated by mobile media queries / `isMobile` branches. Desktop behavior unchanged.

## Phase 4: About Scroll Lag Fixes (base 133ff5d)

- [x] 1.10 **AboutStack mobile reveals → one-shot IntersectionObserver**: `useReveal` now returns static opacity/y + `transition` on mobile (fade-in once, then frozen) instead of scroll-linked MotionValues — zero style writes during scroll.
- [x] 1.11 **SharedScrollSequence mobile → no useScroll**: `MobileSequence` uses a passive scroll listener with a single `getBoundingClientRect()` per frame; `DesktopSequence` keeps framer's `useScroll` byte-identical.
- [x] 1.12 **will-change conditional on mobile**: `[data-reveal] { will-change: auto }` inside `@media (max-width: 767px)` — layers degrade after the one-shot transition. Desktop untouched.

## Phase 5: Residual About Lag Fixes D–G (base ac003f3)

- [x] 1.13 **FIX D — text-shadow off on mobile**: HUD container `textShadow` becomes `isMobile ? 'none' : '<triple shadow>'`. Desktop evaluates to the identical string (byte-identical computed style); mobile paints no shadow during scroll/reveals.
- [x] 1.14 **FIX E — mobile About restored to sticky overlay (rev. 2)**: early `if (isMobile)` return renders About as a sticky 100vh "camera" (full-bleed frame + gradient + compact HUD overlay) matching the desktop visual — no overlap with the next section. Compact content: 2 clamped bios (`line-clamp-2`), status separator, first 6 stack chips in a 2-column grid, 4 category chips. `overflow-hidden` on the sticky container; internal scroll only on the small `max-h-dvh` HUD box. One-shot reveals retained (no scroll-linked style writes). Desktop sticky + `ScrollSequence` branch untouched.
- [x] 1.15 **FIX F — GSAP ScrollTrigger gated on mobile**: `useMediaQuery('(max-width: 768px)')` + `if (isMobile) return;` in the `useLayoutEffect`; dep becomes `[isMobile]` so the gate re-evaluates across breakpoints. No ScrollTrigger created on mobile.
- [x] 1.16 **FIX G — rAF-throttled layout reads**: `MobileSequence` scroll/resize listener coalesces `getBoundingClientRect()` into one measurement per frame via `requestAnimationFrame`, and only pushes to the MotionValue when progress changes > 0.001. `DesktopSequence` untouched.

## Phase 6: FIX H — Show ALL About content on mobile (base 847cd64, FIX E rev. 2 working tree)

- [x] 1.17 **FIX H — mobile About shows ALL content in a small internal HUD scroll box**: Content was cut off (only 2 bios via `line-clamp-2`, only 6 stack chips via `slice(0, 6)`). Now the mobile HUD scroll box (`max-w-sm w-full max-h-[80vh] overflow-y-auto space-y-6 pr-2`, centered via `flex items-center justify-center px-6 py-12`) renders ALL 4 bios, ALL 22 stack chips in a 2-column grid, and ALL 4 category chips. No `slice`, no `line-clamp`. Sticky 100vh "camera" + `overflow-hidden` wrapper kept (no page-level scroll of About); the only scrollable element is the small HUD box (nested scroll is small and local — no compositing/scroll lag). One-shot reveals retained (zero style writes during scroll). Desktop branch byte-identical.
