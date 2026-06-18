# Design: Portfolio 2026 — Vanguard Polish

## Technical Approach

Each of the 8 capabilities is implemented as a hook+component pair (or hook-only for pure-logic items), wired into existing sections with zero structural changes. All animations use the project's existing `useReducedMotion` hook (not framer-motion's). Boot sequence guards `<App>` render via a state gate — no new dependencies.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice |
|----------|---------|----------|--------|
| Cursor animation engine | GSAP RAF, raw `requestAnimationFrame` + lerp, framer-motion `useSpring` | GSAP adds bundle weight, framer-motion spring is harder to tune. RAF+lerp is 10 LOC and zero deps. | `rafLerp` in `useCustomCursor` — lightest, composes with existing RAF patterns. |
| ScrollProgress trigger | Raw `scroll` listener, GSAP `ScrollTrigger` | Project already has `useScrollProgress` using GSAP ScrollTrigger — consistent pattern. Raw listener is simpler but inconsistent. | GSAP `ScrollTrigger` via existing `useScrollProgress` pattern — consistency wins. |
| Reduced motion source | framer-motion `useReducedMotion()`, own hook | Project has own `useReducedMotion.ts`. Using it avoids import confusion and is the established convention. | Project's own `useReducedMotion` — follow existing pattern. |
| TextScramble viewport trigger | `IntersectionObserver`, GSAP `ScrollTrigger`, Framer `useInView` | GSAP ScrollTrigger is already used by KineticHeadline. IntersectionObserver is lighter. | `IntersectionObserver` with `once: true` — no GSAP dependency needed for simple visibility check. |
| Boot sequence state | Zustand, React context, local state | Single boolean `bootComplete` passed as prop. No global state needed — trivial lifecycle. | Local `useState` in `<App>`, passed as `onComplete` callback. |
| Profile photo source | Read from `Portfolio-Mikel/`, copy to `public/images/` | Source is read-only. Must copy to `public/images/profile.jpg`. Already exists partially. | `cp Portfolio-Mikel/images/profile.jpg public/images/profile.jpg` — overrides existing placeholder. |

## Data Flow

```
App (state: bootComplete)
 ├── <BootSequence onComplete={setBootComplete} />  ──→ 6 lines ──→ fadeOut ──→ setBootComplete(true)
 │   [if reducedMotion: setBootComplete(true) immediately]
 │
 └── {bootComplete && (
      ├── <CustomCursor />             ──→ RAF lerp ◄── pointermove
      ├── <Nav />
      ├── <Hero>
      │    └── <TypeWriter text={headline} />  ──→ useTypeWriter (interval)
      ├── <SelectedWork>
      │    └── <TextScramble />        ──→ IntersectionObserver → active → RAF scramble → resolve
      │    └── <Card> mods             ──→ framer-motion whileHover
      ├── <AboutStack>
      │    └── <TextScramble />
      │    └── <img profile />         ──→ CSS filter hover
      ├── <Contact>
      │    └── <TextScramble />
      └── <ScrollProgress />           ──→ GSAP ScrollTrigger → pct fill
      )}
 │
 body::after CSS grid ──→ parallax via JS transform (0.1× scrollY)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useCustomCursor.ts` | Create | RAF-based lerp cursor follower. Tracks `isHovering` via `closest('[data-cursor], a, button')`. Returns `{ cursorRef, isHovering, reducedMotion }`. Respects project's `useReducedMotion`. |
| `src/hooks/useTypeWriter.ts` | Create | Char-by-char reveal via `setInterval(speed)`. Returns `{ displayed, done }`. Falls through on reduced-motion (immediate full text). |
| `src/hooks/useTextScramble.ts` | Create | RAF animation cycling `SCRAMBLE_CHARS` for `duration`ms then resolving. Accepts `active: boolean` from IntersectionObserver. |
| `src/components/effects/CustomCursor.tsx` | Create | Renders `[ _ ]` / `[ ▶ ]` mono cursor. `pointer-events: none`, `z-[9999]`. Null on reduced motion. |
| `src/components/effects/BootSequence.tsx` | Create | 6-line terminal boot, 80ms each, fade-out, calls `onComplete`. Null on reduced motion. |
| `src/components/effects/TypeWriter.tsx` | Create | Wraps `useTypeWriter`, renders blinking `_` cursor while typing. Calls `onDone` when complete. |
| `src/components/effects/TextScramble.tsx` | Create | Wraps `useTextScramble` + IntersectionObserver (`once: true`). Triggers scramble on viewport enter. |
| `src/components/effects/ScrollProgress.tsx` | Create | 2px×40vh bar, GSAP ScrollTrigger fill, `{pct}%` label. Hidden <md. |
| `src/App.tsx` | Modify | Add `bootComplete` state. Gate main content. Render `<CustomCursor />`, `<BootSequence />`, `<ScrollProgress />`. |
| `src/components/sections/Hero.tsx` | Modify | Replace `<KineticHeadline>` with `<TypeWriter>` for the primary headline. Keep `headline_2` as KineticHeadline or TypeWriter — spec says only the primary. |
| `src/components/sections/AboutStack.tsx` | Modify | Add profile photo block (grayscale → green hue on hover). Wrap `<h2>` with `<TextScramble>`. |
| `src/components/sections/SelectedWork.tsx` | Modify | Wrap `<h2>` with `<TextScramble>`. Enhanced card hover via existing framer-motion additions in `Card.tsx`. |
| `src/components/sections/Contact.tsx` | Modify | Wrap `<h2>` with `<TextScramble>`. |
| `src/components/ui/Card.tsx` | Modify | Add `motion.div` wrapper around image: `whileHover={{ scale: 1.02 }}`, `transition={{ duration: 0.2 }}`. Add `::after` green sliding line on hover. |
| `src/styles/globals.css` | Modify | Add `body::after` grid (1px #1A1A1A, 80px, opacity 0.3). Add `* { cursor: none }` conditional (JS-driven class on `<html>` when custom cursor active). |
| `public/images/profile.jpg` | Copy | From `Portfolio-Mikel/images/profile.jpg`. Override if exists. |

## Interfaces / Contracts

```typescript
// Hook contracts
function useCustomCursor(): { cursorRef: RefObject<HTMLDivElement>, isHovering: boolean, reducedMotion: boolean }
function useTypeWriter(text: string, speed?: number, enabled?: boolean): { displayed: string, done: boolean }
function useTextScramble(text: string, active: boolean, duration?: number): string

// Component props
interface BootSequenceProps { onComplete: () => void }
interface TypeWriterProps { text: string; speed?: number; className?: string; as?: 'h1'|'h2'|'h3'|'p'; onDone?: () => void }
interface TextScrambleProps { text: string; className?: string; as?: 'h1'|'h2'|'h3'|'p' }
```

## Testing Strategy

Per proposal: no new tests. All effects are visual and verified manually via `npm run dev`. Skip.

## Migration / Rollout

No migration required. Additive changes only. Boot sequence auto-disables on reduced motion. Profile photo is a file copy — replace existing placeholder.

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Custom cursor `.closest()` misses some interactive elements | Low | Data attribute `[data-cursor]` on any element that should trigger the hover state. |
| Boot sequence re-fires on hot reload in dev | Low | `onComplete` is called once — React strict mode double-effects mitigated by cleanup in `BootSequence`. |
| TextScramble Grid of 8 char set looks same for all headings | Low | Use a larger char pool including lowercase and brackets. |

## Open Questions

- [ ] Hero: replace both `KineticHeadline` instances or only the primary `h1`? Spec says "hero headline" — keep `headline_2` as KineticHeadline.
- [ ] Profile photo: `profile.jpg` already exists in `public/images/` — confirm override OK.
- [ ] ScrollProgress: use raw scroll listener (per spec) or existing GSAP `useScrollProgress` hook? Recommend GSAP for consistency.
