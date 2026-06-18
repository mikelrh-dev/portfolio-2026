# Tasks: Portfolio 2026 — Vanguard Polish

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~400 (additions only) |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR (all additive, no conflicts between units) |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

**Total estimated time**: ~6–8 hours

---

## Phase A — Foundation

- [x] **A.1** — Copy `Portfolio-Mikel/images/profile.jpg` → `public/images/profile.jpg` (if not identical)
- [x] **A.2** — Add to `src/styles/globals.css`: `* { cursor: none }` (via `.custom-cursor-active` class on `<html>`), `body::after` grid (1px #1A1A1A, 80px spacing, 0.3 opacity, `pointer-events: none`), parallax via `background-position-y` JS update

## Phase B — Custom Hooks (create all 3 in `src/hooks/`)

- [x] **B.1** — `useCustomCursor.ts`: RAF + pointermove + lerp(0.2) on `cursorRef`. `isHovering` via `document.elementFromPoint` + `.closest('a,button,[data-cursor]')`. Returns `{ cursorRef, isHovering, reducedMotion }`. No lerp on reduced-motion.
- [x] **B.2** — `useTypeWriter.ts`: `setInterval(speed)` char-by-char reveal, `{ displayed, done }`. Immediate full text on reduced-motion.
- [x] **B.3** — `useTextScramble.ts`: RAF cycling `SCRAMBLE_CHARS` for `duration`ms then resolve. `active` trigger param. Returns scrambled `string`.

## Phase C — Effect Components (create all 5 in `src/components/effects/`)

- [x] **C.1** — `CustomCursor.tsx`: Renders `[ _ ]` / `[ ▶ ]` at cursor position. `pointer-events: none`, `z-[9999]`, `fixed`. Uses `useCustomCursor`. Null on reduced-motion.
- [x] **C.2** — `BootSequence.tsx`: 6 `[ SYS::INIT ]` lines at 80ms intervals (~800ms), fade-out, `onComplete` callback. Reduced-motion: calls `onComplete` immediately.
- [x] **C.3** — `TypeWriter.tsx`: Uses `useTypeWriter`, renders blinking `_` cursor while typing, `onDone` callback. Renders as semantic tag via `as` prop.
- [x] **C.4** — `TextScramble.tsx`: Uses `useTextScramble` + `IntersectionObserver` (`once: true`). Triggers on viewport enter, scrambles ~300ms then resolves. Reduced-motion: shows text directly.
- [x] **C.5** — `ScrollProgress.tsx`: 2px × 40vh fixed right bar. GSAP `ScrollTrigger` for green fill + live `{n}%` label. Hidden below `md` breakpoint.

## Phase D — Integrate into Existing Sections

- [x] **D.1** — `src/App.tsx`: Add `bootComplete` state. Render `<BootSequence />` gating main content. Add `<CustomCursor />` and `<ScrollProgress />` alongside existing layout.
- [x] **D.2** — `src/components/sections/Hero.tsx`: Replace primary `<h1>` `KineticHeadline` with `<TypeWriter text={headline} />`. Keep `headline_2` as KineticHeadline.
- [x] **D.3** — `src/components/sections/AboutStack.tsx`: Add profile photo (`<img>` with `grayscale(1)` → `#CCFF00` hue on hover) + `[ OPERATOR_ID: MIKEL_ROMERO ]` label. Wrap `<h2>` with `<TextScramble>`.
- [x] **D.4** — `src/components/sections/SelectedWork.tsx`: Wrap `<h2>` with `<TextScramble>`.
- [x] **D.5** — `src/components/sections/Contact.tsx`: Wrap `<h2>` with `<TextScramble>`.

## Phase E — Enhanced Card Hover

- [x] **E.1** — `src/components/ui/Card.tsx`: Framer Motion `motion.div` around image with `whileHover={{ scale: 1.05 }}`. Index scale 1.1× on hover. CSS `::after` sliding green line (#CCFF00, 1px) from left on hover. All via Framer Motion; no animations under reduced-motion.

## Phase F — Build & Verify

- [x] **F.1** — `npm run build` succeeds with no errors
- [ ] **F.2** — `npm run dev` starts clean on port 5173
- [ ] **F.3** — Verify custom cursor `[ _ ]` follows with inertia, `[ ▶ ]` on links/buttons
- [ ] **F.4** — Verify boot sequence plays 6 lines on cold load, fades, then content appears
- [ ] **F.5** — Verify Hero headline types char-by-char with blinking cursor that vanishes on done
- [ ] **F.6** — Verify section headlines scramble ~300ms on viewport entry, once only
- [ ] **F.7** — Verify profile photo grayscale → green tint on hover, `[ OPERATOR_ID ]` label visible
- [ ] **F.8** — Verify background grid visible (subtle 1px lines at 80px) with parallax
- [ ] **F.9** — Verify scroll progress bar fills green on scroll, % label updates
- [ ] **F.10** — Verify card hover: image zoom 1.05×, index scale 1.1×, green line slides
- [ ] **F.11** — Toggle `prefers-reduced-motion: reduce` in DevTools → all effects skip or render statically

## Hard Rules

- ❌ NO git operations of any kind
- ❌ NO modifications to files in `Portfolio-Mikel/` (read-only access OK for profile.jpg)
- ❌ NO modifications to previous `openspec/changes/` folders
- ❌ NO production deployment, NO tests, NO CI/CD
- ❌ NO aesthetic/palette changes (cyber-hacker palette stays)
- ✅ Working in `portfolio-2026/` only
- ✅ ALL enhancements MUST respect `prefers-reduced-motion`
- ✅ PRESERVE all existing real content (i18n, project data, sections)

## Success Criteria

This vanguard polish is complete when:

1. All 8 capabilities render without console errors on `npm run dev`
2. Custom cursor replaces default with inertia + hover state change
3. Boot sequence plays on load, gates main content
4. Hero headline type-writes char-by-char, cursor vanishes on completion
5. Section headlines scramble on viewport entry (once per section)
6. Profile photo shows grayscale → green hover + operator label
7. Background grid visible with subtle parallax
8. Scroll progress bar fills green with live % label
9. Card hover triggers image zoom + index scale + sliding green line simultaneously
10. `npm run build` exits zero
11. Toggling `prefers-reduced-motion: reduce` disables all animations
