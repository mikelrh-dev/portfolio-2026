# Design: About Scroll Sequence Integration

## Technical Approach

Single `SharedScrollSequence` wrapper creates a ~700vh scroll container with one GSAP ScrollTrigger. It exposes two `MotionValue<number>` via React Context — `heroProgress` [0, 0.35] and `aboutProgress` [0.40, 1.0] — mapped to [0, 1] internally. Hero replaces its own GSAP exit timeline with `useTransform` on `heroProgress`. AboutStack passes `aboutProgress` as `externalProgress` to a second `ScrollSequence` instance and uses `useTransform` for content reveals. Crossfade at [0.35, 0.40] drives both canvas opacities via `useTransform`.

## Architecture Decisions

### Decision: Shared Progress Distribution

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **React Context** `ScrollSequenceContext` | Cleanest API, no prop drilling, extendable | ✅ **Adopted** |
| Props via `cloneElement` | Fragile, breaks if wrapper structure changes | ❌ Rejected |
| Custom hook with shared ref | Global mutable state, hard to track | ❌ Rejected |

Context provides `{ heroProgress, aboutProgress, containerRef, totalProgress }`.

### Decision: Hero Exit Animation Strategy

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **UseTransform on heroProgress** | Replaces GSAP entirely for exit. Linear interpolation, but framer-motion handles reverse naturally. No ScrollTrigger conflicts. | ✅ **Adopted** |
| GSAP onUpdate with proxy | Dual animation system fighting over same values. Complex, fragile. | ❌ Rejected |
| Keep ScrollTrigger via shared container ref | Overlapping ScrollTriggers on same container — GSAP doesn't support this cleanly. | ❌ Rejected |

Mapping: `heroProgress` 0→1 drives 5 transforms: title opacity/blur, canvas scale/opacity/blur, grid opacity, fade overlay. Tagline reveal at 4% via `useEffect` + `useTransform` gate.

### Decision: Canvas Crossfade Layout

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Both canvases mounted, z-index toggled** | Hero canvas z-10, About canvas z-5 behind it. Crossfade region [0.35,0.40]: Hero opacity 1→0, About opacity 0→1. Clean, one-directional. | ✅ **Adopted** |
| Dynamic mount/unmount | Causes flash on transition. Harder to reverse-scroll. | ❌ Rejected |

## Data Flow

```
window scroll
     │
     ▼
SharedScrollSequence (700vh container)
  ├─ GSAP ScrollTrigger ──→ totalProgress (MotionValue 0→1)
  │
  ├─ useTransform(totalProgress, [0,0.35], [0,1]) ──→ heroProgress
  ├─ useTransform(totalProgress, [0.40,1], [0,1]) ──→ aboutProgress
  │
  ├─ ScrollSequence(Hero) ← heroProgress as externalProgress
  │     └─ useImageSequence → canvas paint
  │
  └─ ScrollSequence(About) ← aboutProgress as externalProgress
        └─ useImageSequence → canvas paint
  
  About content:
    aboutProgress → useTransform → opacity, translateY per element at R2 milestones
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/effects/SharedScrollSequence.tsx` | **Create** | Single-scroll wrapper + Context provider |
| `src/components/sections/Hero.tsx` | **Modify** | Consume `heroProgress` from context; replace GSAP exit timeline with `useTransform` |
| `src/components/sections/AboutStack.tsx` | **Modify** | Consume `aboutProgress`; render `ScrollSequence` bg; remove photo card; progress-driven content |
| `src/App.tsx` | **Modify** | Wrap Hero + AboutStack in `<SharedScrollSequence>` |
| `scripts/convert-frames.mjs` | **Create** | Node script using `sharp` to convert PNG → webp |
| `public/assets/sequences/about/` | **Create** | 199 webp frames output directory |

## Interfaces

```tsx
// Context
interface ScrollSequenceCtx {
  heroProgress: MotionValue<number>;   // [0, 1] over Hero range [0, 0.35]
  aboutProgress: MotionValue<number>;  // [0, 1] over About range [0.40, 1.0]
  containerRef: RefObject<HTMLDivElement>;
  totalProgress: MotionValue<number>;  // raw [0, 1]
}
```

## Hero Refactoring Detail

- Remove GSAP `useLayoutEffect` block entirely (lines 27–126).
- Tagline state: `useTransform(heroProgress, [0.04, 0.05], [0, 1])` → when > 0.5, set `showTagline(true)`.
- Exit transforms applied as inline styles via `useTransform`:
  - Title: `opacity: useTransform(heroProgress, [0, 0.78, 0.95], [1, 1, 0])`, blur via `useTransform` + `filter`.
  - Canvas: `useTransform(heroProgress, [0.95, 1], [1, 0.85])` for scale, same pattern for opacity/blur.
  - Fade overlay: `useTransform(heroProgress, [0.95, 1], [0, 0.15])`.
  - Grid opacity: `useEffect` subscription on transformed value, sets `--grid-opacity`.
- Reverse scroll handled automatically — `useTransform` is bijective by default.

## AboutStack Refactoring Detail

- Wrap section content in a `relative z-20` layer above canvas.
- Insert `<ScrollSequence frameCount={199} basePath="/assets/sequences/about/frame-" ext=".webp" containerRef={containerRef} externalProgress={aboutProgress} />` as first child inside section (full-viewport sticky background).
- Remove photo card `<Card>` (lines 76–100) and terminal chrome.
- Change grid: `lg:grid-cols-3` → `lg:grid-cols-2`.
- Content reveals via `useTransform(aboutProgress, [0.20, 0.30], [0, 1])` per paragraph, etc. per spec R2 milestones.

## Crossfade Mechanics

| Progress [0, 0.35] | [0.35, 0.40] | [0.40, 1.0] |
|---|---|---|
| Hero canvas visible | Hero opacity 1→0 | Hero hidden |
| About canvas hidden | About opacity 0→1 | About visible |
| Section indicator at 0.08 | Text hidden | Text reveals (R2) |

Both canvases always mounted. z-index: Hero canvas `z-10`, About canvas `z-[5]`. Crossfade opacities driven by `useTransform` on `totalProgress`.

## Frame Pipeline

Node script with `sharp`:
```bash
npm i -D sharp
node scripts/convert-frames.mjs
```
Script reads `asset/SequenceAbout/ezgif-frame-{n}.png` (n=001..199), outputs to `public/assets/sequences/about/frame-{n}.webp` with `{ quality: 80, width: 1920, withoutEnlargement: true }`.

## Mobile Strategy

Custom `useMediaQuery('(max-width: 768px)')` hook. In `SharedScrollSequence`, pass `isMobile` to `AboutStack`. AboutStack selects `frameCount = isMobile ? 99 : 199` and computes odd-frame stride for `useImageSequence`.

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Unit | `SharedScrollSequence` progress mappings | Mock `useScroll`, verify `useTransform` inputs produce correct [0,1] range outputs |
| Unit | Content reveal thresholds | Verify `useTransform` at each R2 milestone produces expected opacity |
| Integration | Two-canvas mount + crossfade | Render wrapper, verify both ScrollSequence instances mount without errors |
| E2E | Scroll through full container | Playwright: scroll to bottom, capture frame consistency, no console errors |
| Manual | Mobile frame reduction | Resize to 768px, verify 99 frames loaded, 199 on >768px |

## Migration / Rollout

No migration required. Frame conversion runs once. Photo card removal is DOM-only.

## Open Questions

- Hero's blur filter via `useTransform` returns a number — needs `useMemo` + `filter: blur(${x}px)` string interpolation. Is there a cleaner framer-motion pattern for CSS filter strings?
- The shared container's exact height: 700vh or calculated from `Hero height + About content height`? Auto-calculation is more robust but adds complexity.
