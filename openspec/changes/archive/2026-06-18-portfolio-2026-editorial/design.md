# Design: Portfolio 2026 — Editorial Redesign

## Technical Approach

Strip cyberpunk UX gimmicks (boot, cursor, magnetic), enforce color restraint on `#CCFF00`, bump body type to 14–16px, and rebalance hero to asymmetric editorial layout. Each subsystem is independently revertible. 3D kept only if Line2+Bloom upgrade fits ≤50KB gzip.

## Architecture Decisions

### Decision: Kill-List Mapping (delete vs simplify)

| File | Action | Reason |
|------|--------|--------|
| `src/components/effects/BootSequence.tsx` | Delete | Blocks content on load |
| `src/components/effects/CustomCursor.tsx` | Delete | Hides native cursor |
| `src/hooks/useCustomCursor.ts` | Delete | Only consumed by CustomCursor |
| `src/hooks/useMagneticCursor.ts` | Delete | Only consumed by MagneticButton + Contact |
| `src/hooks/useHoverSound.ts` | Delete | Only consumed by MagneticButton |
| `src/lib/audio/click.ts` | Delete | No remaining consumers after useHoverSound removal |
| `src/components/effects/MagneticButton.tsx` | Rewrite | Strip magnetic wiring → pure styled button via `Button.tsx` pattern |
| `src/components/effects/ScrollProgress.tsx` | Keep | #CCFF00 scroll bar is editorial-compatible |

`App.tsx`: remove `bootComplete` state, lazy-gating pattern, BootSequence + CustomCursor imports/JSX. `globals.css`: remove `.custom-cursor-active` block (lines 61–64).

### Decision: No New Directories

All changes land in existing files or delete existing files. Zero new directories. `lib/audio/` becomes empty — delete it after confirming no import chain survives.

### Decision: No New State Libraries

Current state pattern (React `useState`/`useRef` + GSAP ScrollTrigger) is sufficient. Boot gating removal eliminates the only forced-content-latency concern.

### Decision: Deps Strategy

| Package | Action |
|---------|--------|
| `@react-three/postprocessing` | Add ONLY if 3D is kept (conditional) |
| `three/examples/jsm/lines` | Already bundled with `three@0.170` — no install needed |
| `@fontsource-variable/geist-mono` | Optionally swap or keep JetBrains Mono for display |

No new runtime deps for kill-list, color, type, or photo changes.

### Decision: Hero Redesign

```
grid lg:grid-cols-[3fr_2fr] gap-12
```

Text column (left 60%): mono display 100–160px headline (TypeWriter + KineticHeadline retained), sans role labels 14–16px, 2× CTAs (styled `<button>`) with CSS hover only, `01/04 — HERO` indicator.

Accent column (right 40%): empty `<div>` OR `<Canvas>` constrained to column bounds. On mobile (<768px): stack accent below text or hide.

`min-h-screen` stays. Full-viewport canvas removed — canvas becomes `className="w-full h-full"` inside the right column `<div>`.

## Decision: 3D Fidelity Gate

**Bias toward REMOVE.** Apply phase MUST prototype `Line2` + `LineMaterial` + `EffectComposer` + `Bloom` in a fresh branch, measure gzip delta. If `@react-three/postprocessing` adds >50KB or frame drops below 30fps on M1-class GPU → delete `WireframeCentroide.tsx`, archive its spec, remove `<Canvas>` JSX from Hero. Otherwise implement:

- Replace `LineSegments`/`lineBasicMaterial` with `Line2`/`LineMaterial` (enable `lineWidth > 1`)
- Wrap `<Scene>` in `<EffectComposer>` + `<Bloom luminanceThreshold={0.8} mipmapBlur />` so only `#CCFF00` lines glow
- Conditional render: `prefers-reduced-motion ? null : <Canvas>`
- Canvas positioned inside right 40% grid column, NOT absolute full-viewport

### Color Restraint — Audit & Edits

**Allowed:** impact numbers/metrics, CSS hover states, `::selection`, scroll progress bar, 1 decorative accent/section (≤3 total green elements/section).

**Forbidden:** body text, section indicators, backgrounds >100px², large decorative blocks.

| File | Line | Usage | Verdict |
|------|------|-------|---------|
| `src/components/effects/TypeWriter.tsx` | 49 | `bg-[#CCFF00]` cursor blink | **CHANGE** to `#FFFFFF` — body type element |
| `src/components/sections/AboutStack.tsx` | 89 | photo caption `text-[#CCFF00]` | **CHANGE** to `#FFFFFF` — section already has 3 green elements (stack header, category label, format badge) |
| `src/components/sections/AboutStack.tsx` | 71 | format label `text-[#CCFF00]` | Keep — decorative accent (1 of 3/section) |
| `src/components/sections/AboutStack.tsx` | 42 | stack header `text-[#CCFF00]` | Keep — impact/metric (1 of 3) |
| `src/components/sections/AboutStack.tsx` | 48 | category label `text-[#CCFF00]` | Keep — decorative accent (2 of 3) |
| `src/components/sections/About.tsx` | 13, 46 | Not in App.tsx import graph | Leave untouched — dead code per kill list, not in scope |
| `src/components/sections/Contact.tsx` | 35 | email underline `decoration-[#CCFF00]` | Keep — decorative accent (1 of 1 in section) |
| `src/components/sections/SelectedWork.tsx` | 73, 109 | tech labels `text-[#CCFF00]` | Keep — impact/metrics |
| `src/components/ui/Card.tsx` | 53, 75, 92 | accent line / section number / hover border | Keep — decorative accent + hover state |
| `src/components/effects/ScrollProgress.tsx` | 40, 47 | bar + percentage | Keep — editorial-acceptable |
| `src/components/effects/MagneticButton.tsx` | 11 | hover `text-[#CCFF00]` | Keep — hover state (component rewritten) |
| `src/components/ui/Button.tsx` | 9 | hover `text-[#CCFF00]` | Keep — hover state |
| `src/components/Nav.tsx` | 24 | hover | Keep |
| `src/components/LangToggle.tsx` | 16 | hover | Keep |
| `tokens.css` / `globals.css` | — | `--color-accent: #CCFF00` | **UNCHANGED** per spec |

### Type Sizing System

Add to `tokens.css` and `globals.css` `@theme`:

```css
--font-size-body-sm: 14px;
--font-size-body-md: 15px;
--font-size-body-lg: 16px;
--font-size-label: 11px;  /* unchanged */
```

Replace all hardcoded `text-[13px]` body references in `AboutStack.tsx` (lines 32, 35) with `text-[14px]`/`text-[15px]`. Keep `text-[11px]` for labels/chrome.

### Photo Treatment

Edit `AboutStack.tsx` lines 75–85:

- Remove conditional hover classes (`hover:grayscale-[60%] hover:sepia-[60%] hover:hue-rotate-[40deg] hover:saturate-[3]`)
- Keep `grayscale` filter always-on
- Keep `aspect-[3/4]` and `object-cover`
- Keep window dots (need `bg-[#FF5F57]`, `bg-[#FFBD2E]`, `bg-[#28C840]` — currently all `#333333`)
- Keep `loading="lazy"`
- Change OPERATOR_ID caption color from `#CCFF00` to `#FFFFFF` (per color audit)

### Kill List — Full Inventory

| File | Action | Impact |
|------|--------|--------|
| `src/components/effects/BootSequence.tsx` | Delete | Remove import + JSX from App.tsx; remove `bootComplete` state + gating |
| `src/components/effects/CustomCursor.tsx` | Delete | Remove import + `<CustomCursor>` from App.tsx |
| `src/hooks/useCustomCursor.ts` | Delete | No remaining consumers |
| `src/hooks/useMagneticCursor.ts` | Delete | Remove imports from MagneticButton.tsx + Contact.tsx |
| `src/hooks/useHoverSound.ts` | Delete | Remove import from MagneticButton.tsx |
| `src/lib/audio/click.ts` | Delete | No remaining consumers |
| `src/lib/audio/` | Delete | Empty directory |
| `.custom-cursor-active` in `globals.css` | Remove block (lines 61–64) | Native cursor restored |
| `src/components/effects/MagneticButton.tsx` | Rewrite | Remove import + usage of useMagneticCursor, useHoverSound, playClick. Keep `baseClasses` hover styles. Remove `forwardRef` complexity — use pure `Button.tsx`-style component |
| `src/components/sections/Contact.tsx` | Edit | Remove `useMagneticCursor` import + usage; playClick import; `magnetic` CSS class from email + social links |
| `src/components/sections/Hero.tsx` | Edit | Change `<MagneticButton>` to `<button>` with CSS hover only |

### Order of Operations

1. **Kill list**: Delete files, strip imports from App.tsx/globals.css, rewrite MagneticButton.tsx, simplify Contact.tsx/Hero.tsx CTAs
2. **Color audit**: TypeWriter cursor → `#FFFFFF`, AboutStack caption → `#FFFFFF`, photo window dots → real colors
3. **Type sizes**: Add tokens to `tokens.css` + `globals.css`, bump AboutStack body
4. **Photo**: Grayscale always-on, no hover filter, 3/4 aspect, lazy loading
5. **Hero**: Restructure to 3fr/2fr grid, left-align text, move/inline Canvas
6. **3D decision gate**: Prototype, measure, keep-or-delete WireframeCentroide

Step order enforces that each step's cleanup doesn't cascade — kill list is self-contained, color audit is pure style changes, etc. Each step is independently testable via `npm run build`.

## Verification

| Check | Command | Expectation |
|-------|---------|-------------|
| TypeScript | `npx tsc --noEmit` | 0 errors |
| Vite build | `npm run build` | Success, no import errors |
| Manual | Load in browser | Native cursor, no boot, hero asymmetric, green only in allowed spots |
| 3D gate | Prototype branch | `npm run build` + `npx vite-bundle-visualizer` or comparable gzip measure for `@react-three/postprocessing` delta |

## Migration / Rollout

No data migration. No feature flags. Each commit is independently revertible. Rollback = `git revert <commit>` per atomic commit.

## Open Questions

None — all decisions are specified or conditional with clear gates.
