# Apply Progress: Mobile Performance Round 2

**Change**: mobile-performance-round-2
**Mode**: Standard (no test runner in package.json — build-based verification)
**Base**: fb2b6bd (Phase 4 on base 133ff5d; Phase 5 on base ac003f3; FIX E rev. 2 on base 847cd64; FIX H on base 847cd64 working tree)
**Status**: 17/17 tasks complete. FIX H applied (mobile About shows ALL content, no lag). Ready for verify.

## Completed Tasks

- [x] 1.1 ScrollProgress gate — rAF loop + ScrollTrigger disabled on mobile
- [x] 1.2 Nav backdrop-blur removal on mobile
- [x] 1.3 Hero gridOpacity + taglineGate gate on mobile
- [x] 1.4 AboutStack autoProgress gate on mobile
- [x] 1.5 About mobile image (720x1280 webp, 433KB → 106KB)
- [x] 1.6 content-visibility below-fold (#work, #contact — NOT #about)
- [x] 1.7 Build check passes
- [x] 1.8 Runtime smoke test passes
- [x] 1.9 Desktop byte-identical verified
- [x] 1.10 AboutStack mobile reveals → one-shot IntersectionObserver fade-in
- [x] 1.11 SharedScrollSequence mobile → passive scroll listener, no useScroll
- [x] 1.12 will-change conditional on mobile (`[data-reveal] { will-change: auto }`)
- [x] 1.13 FIX D — text-shadow off on mobile (HUD container)
- [x] 1.14 FIX E — mobile About restored to sticky overlay (rev. 2)
- [x] 1.15 FIX F — GSAP ScrollTrigger gated on mobile (SelectedWork)
- [x] 1.16 FIX G — rAF-throttled getBoundingClientRect (MobileSequence)
- [x] 1.17 FIX H — mobile About shows ALL content (4 bios, 22 stack chips, 4 categories) in small internal HUD scroll box (max-h-[80vh])

## Phase 4 (About Scroll Lag) — Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `src/components/sections/AboutStack.tsx` | Modified | `useReveal` dual-mode: desktop keeps scroll-linked MotionValues; mobile returns static opacity/y + `transition` from an IntersectionObserver one-shot (staggered delays 0–0.9s). 10 reveal elements spread `{...reveal}` so `ref` + `data-reveal` apply. |
| `src/components/effects/SharedScrollSequence.tsx` | Modified | Split into `DesktopSequence` (useScroll, byte-identical) and `MobileSequence` (passive scroll listener, one `getBoundingClientRect()` per frame, no offsetParent walk). Shared `SequenceProvider` keeps context contract. |
| `src/styles/globals.css` | Modified | `@media (max-width: 767px)` adds `[data-reveal] { will-change: auto }` — no permanent compositor layer after the one-shot fade. |

## Verification Evidence (Phase 4)

- `npx tsc --noEmit` → exit 0
- `npm run build` → built in 4.33s, exit 0 (CSS 45.29 kB, JS 481.01 kB — no new dependencies, no network change)
- `vite preview` → HTTP 200 page + HTTP 200 CSS (45,291 bytes)
- Compiled CSS contains `[data-reveal]{will-change:auto}` inside the 767px media query
- Desktop path: `DesktopSequence` is the original `useScroll` + provider logic verbatim; desktop reveals still consume `aboutProgress` MotionValues — scroll-linked behavior unchanged
- Mobile path: zero style writes during scroll — reveals fire once via IntersectionObserver then freeze

## Deviations from Design

1. **FIX C `.is-visible { will-change: transform, opacity }` omitted** — that rule would *keep* a permanent compositor layer after the reveal, contradicting the stated goal ("only apply will-change during transition"). Framer-motion already promotes a layer only while the 0.6s transition runs; the CSS only guarantees `will-change: auto` in resting state. Implemented as `[data-reveal] { will-change: auto }` under the 767px media query.
2. **`data-reveal` added via hook spread** — the design assumed elements already carried `data-reveal`; they didn't (they only had `style`). Added `'data-reveal': true` to both `useReveal` return branches and spread `{...reveal}` on all 10 elements so the CSS selector has a target.
3. **Mobile scroll listener uses `getBoundingClientRect()` once per frame** (as proposed) plus `resize` listener for robustness; `useScroll` removed entirely from the mobile path rather than gated, because framer's `useScroll` cannot be conditionally called (Rules of Hooks) — hence the component split.

## Deviations from Design (Phase 5 — D–G)

1. **FIX D implemented as inline conditional, not CSS media query** — the CSS alternative targeted `[class*="about-hud"]`, which does not exist in the current markup (the HUD container has no distinguishing class). The inline `isMobile ? 'none' : '<triple shadow>'` keeps the change to one line; desktop evaluates to the identical string (byte-identical computed style).
2. **FIX E mobile branch reuses the existing `useReveal` hooks** instead of bare `data-reveal` divs — the 10 hooks already exist and return the one-shot mobile props (ref + data-reveal + style + transition); reusing them avoids duplicate observers and keeps the cascade delays. Added the desktop "status" separator for content parity (the design sketch omitted it).
3. **FIX F gate uses `useMediaQuery('(max-width: 768px)')` matching the project's mobile breakpoint** (the design said 768px) and adds `isMobile` to the effect deps so the gate re-evaluates across breakpoints; `reducedMotion` handling untouched.
4. **FIX G uses `let rafId = 0` instead of `let rafId: number;`** — the uninitialized declaration would trip `strict` TS ("used before being assigned"). rAF ids are always positive integers, so `if (rafId) return;` behaves identically. Resize listener routed through the same rAF'd handler.

## Issues Found

None.

## Phase 5 (D–G) — Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `src/components/sections/AboutStack.tsx` | Modified | FIX D: HUD `textShadow` conditional on `isMobile` ('none' on mobile). FIX E: early `if (isMobile)` return renders About as normal-flow content (static frame image, indicator, bios, status, stack, categories) — no sticky, no `overflow-y-auto`. Desktop branch byte-identical. |
| `src/components/sections/SelectedWork.tsx` | Modified | FIX F: `useMediaQuery('(max-width: 768px)')` + `if (isMobile) return;` in GSAP `useLayoutEffect`; deps `[]` → `[isMobile]`. |
| `src/components/effects/SharedScrollSequence.tsx` | Modified | FIX G: `MobileSequence` scroll/resize listener now rAF-throttled (one `getBoundingClientRect()` per frame) + 0.001 progress-change threshold. `DesktopSequence` untouched. |

## Verification Evidence (Phase 5)

- `npx tsc --noEmit` → exit 0 (after each fix)
- `npm run build` → exit 0 (tsc + vite build, 4.56s; JS 483.31 kB, CSS 45.66 kB — no new dependencies)
- `vite preview` (port 4173) → HTTP 200 (601 bytes)
- 4 separate commits, one per fix (see below), each revertible, each touching only mobile-gated code
- Desktop byte-identical: reviewed `git diff ac003f3..HEAD` — FIX D desktop evaluates the identical shadow string; FIX E desktop `return` block untouched; FIX F gate only triggers when `isMobile` (effect body unchanged); FIX G changes confined to `MobileSequence` (rendered only when `isMobile`)

## Commits (Phase 4 + Phase 5)

```
6eca274 fix(perf): use intersection-based reveals instead of scroll-linked on mobile about
5138b9a fix(perf): replace useScroll with simpler scroll calc on mobile
ac003f3 fix(perf): conditionally apply will-change on mobile
2378e39 fix(perf): remove expensive text-shadow from about hud on mobile        ← FIX D
f53ae7e fix(perf): remove sticky overflow structure on mobile about - flow content naturally  ← FIX E
617c242 fix(perf): disable gsap scrolltrigger on mobile selectedwork            ← FIX F
847cd64 fix(perf): raf-throttle getBoundingClientRect in mobile scroll listener ← FIX G
```

## FIX E Revision (rev. 2 — base 847cd64)

**Why**: rev. 1 removed the sticky/overflow structure entirely, so mobile About rendered as a plain image box + flowing text column — losing the desktop visual (image + overlaid HUD) and allowing the tall content to overlap the next section.

**What changed** (`src/components/sections/AboutStack.tsx`, mobile `if (isMobile)` branch only):

- Restored the sticky 100vh "camera" structure: `section#about` → `div.relative.h-dvh.sticky.top-0.overflow-hidden` with the full-bleed `frame-143-mobile.webp` as absolute background (same visual as desktop).
- Gradient overlay (`bg-gradient-to-b from-transparent via-black/50 to-black`) for HUD readability.
- HUD content: absolutely positioned, vertically centered; the *small* content box (`max-h-dvh overflow-y-auto`) is the only scrollable element — internal scroll only if content ever exceeds one viewport. No page-level scroll listener, no nested scroll container on the sticky wrapper → no compositing/scroll lag.
- Compact content: section indicator, first 2 bios (`line-clamp-2`), status separator, `[STACK]` with first 6 chips in a 2-column grid (flat `stackItems` from `categories.flatMap` over `about.items.*`), `[CATEGORIES]` chip row (4 labels).
- One-shot IntersectionObserver reveals (FIX phase 4) retained — zero style writes during scroll. Reuses existing `useReveal` hooks (indicator, bio1–2, stack header, cat0).
- Added `about.categories_header` key to `en.json` / `es.json` (CATEGORIES / CATEGORÍAS).
- Desktop branch byte-identical (verified via `git diff` — changes confined to the mobile branch + locale files).

**Deviation from proposed sketch**: content box uses `flex items-center justify-center` wrapper with a `max-h-dvh overflow-y-auto` inner box instead of `justify-center` directly on the scroll container — avoids the flexbox "clipped start" bug when an overflow container is center-justified. Chips use the site's existing About chip styling (border + `bg-black/40`) instead of the sketch's `bg-gray-800/50` to keep the desktop look. `line-clamp-2` + `slice(0, 6)` per the proposal.

## FIX H — Show ALL About content on mobile (rev. 3 — base 847cd64 working tree with FIX E rev. 2)

**Why**: FIX E rev. 2 solved the lag but cut content — only 2 bios (`line-clamp-2`) and 6 stack chips (`slice(0, 6)`) fit the compact HUD, so visitors couldn't see the full About on mobile.

**What changed** (`src/components/sections/AboutStack.tsx`, mobile `if (isMobile)` branch only):

- HUD content box: `max-h-dvh w-full overflow-y-auto px-6 py-10` + `mx-auto max-w-5xl` → `max-w-sm w-full max-h-[80vh] overflow-y-auto space-y-6 pr-2`, centered by the existing `flex items-center justify-center` wrapper (padding moved to the wrapper: `px-6 py-12`). `pr-2` keeps the scrollbar from clipping text.
- Bios: ALL 4 (`bio_1`–`bio_4`), `line-clamp-2` removed — full text always rendered.
- Stack: ALL 22 chips (`stackItems.map` — `slice(0, 6)` removed) in a 2-column grid.
- Categories: ALL 4 labels (unchanged set, now guaranteed reachable via the scroll box).
- Sticky 100vh "camera" + `overflow-hidden` wrapper kept — About never scrolls the page; the ONLY scrollable element is the small HUD box (`max-h-[80vh]`), so nested scroll is small and local → no compositing/scroll lag. Global scroll resumes after the About section (SelectedWork, Contact) as before.
- One-shot IntersectionObserver reveals retained (indicator, bio1–4, stack header, cat0) — zero style writes during scroll; `will-change: auto` media query untouched.
- The sketch's `entry.data.bios/stack/categories` shape does not exist in this project — adapted to the real i18n data sources (`about.bio_*`, `about.items.*` flatMap, `about.categories.*`) and the site's existing chip styling.
- Desktop branch byte-identical (verified via `git diff` — single hunk at line 147, mobile branch only).

## Verification Evidence (FIX H)

- `npx tsc --noEmit` → exit 0
- `npm run build` → exit 0 (4.54s; JS 483.77 kB, CSS 47.08 kB — no new dependencies)
- Compiled CSS contains `max-h-\[80vh\]{max-height:80vh`, `max-w-sm`, `pr-2`, `overflow-y-auto`, `grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}` (all new utilities generated)
- Bundle: `slice(0, 6)` absent from AboutStack; `line-clamp-2` only in SelectedWork (pre-existing)
- `vite preview` (port 4199) → HTTP 200 page; `frame-143-mobile.webp` HTTP 200 at 108,852 bytes
- Desktop byte-identical: `git diff` single hunk `@@ -147,98 +147,117 @@` — mobile branch only; desktop `ScrollSequence`/`md:grid`/`md:col-span` markers absent from diff
- No lag by construction: sticky + `overflow-hidden` (native compositor), nested scroll confined to the small `max-h-[80vh]` HUD box, one-shot reveals (no per-frame style writes), `MobileSequence` rAF-throttled reads (FIX G, unchanged)

## Verification Evidence (FIX E rev. 2)

- `npx tsc --noEmit` → exit 0
- `npm run build` → exit 0 (3.90s; JS 483.63 kB, CSS 46.70 kB — no new dependencies)
- Compiled CSS contains `h-dvh`, `max-h-dvh`, `line-clamp`, `mb-0`, `overflow-y-auto`, `bg-gradient-to-b` (all new utilities generated)
- `vite preview` (port 4173) → HTTP 200 page; `frame-143-mobile.webp` HTTP 200 at 108,852 bytes
- Desktop byte-identical: `git diff` touches only the mobile branch (lines 150–253) + 2 locale files
- No lag by construction: sticky + `overflow-hidden` (native compositor), one-shot reveals (no per-frame style writes), `MobileSequence` rAF-throttled reads (FIX G, unchanged)

## Status

17/17 tasks complete. Ready for verify.
