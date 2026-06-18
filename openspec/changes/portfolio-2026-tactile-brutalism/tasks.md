# Tasks: Portfolio 2026 — Tactile Brutalism Prototype

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~2500 (full Astro → Vite replacement) |
| 400-line budget risk | High |
| Chained PRs recommended | No |
| Chain strategy | size-exception |
| Delivery strategy | single-pr |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: High

> **Note**: `portfolio-2026/` is NOT a git repo. Fully discardable prototype. Single pass, no PRs.

## Hard Rules

- ❌ NO git operations. NO modifications to `Portfolio-Mikel/` or `openspec/changes/portfolio-2026-prototype/`.
- ✅ Working in `portfolio-2026/` only. NOT a git repo.

## Phase A — Foundation (replace Astro scaffold)

- [x] A.1 Delete Astro files: `astro.config.mjs`, `.astro/`, `src/pages/`, `src/layouts/`, `src/content/config.ts`, all `.astro` files. Keep `src/i18n/` and `public/images/`.
- [x] A.2 Rewrite `package.json` — Vite 5 + React 18 + TS + react-router-dom. Keep R3F/Drei/GSAP/framer-motion/i18next from existing deps.
- [x] A.3 Create `vite.config.ts` — React plugin, `@/` alias, lazy R3F `optimizeDeps`
- [x] A.4 Create `tsconfig.json` — strict mode, JSX, `@/` paths
- [x] A.5 Create `index.html` — Vite entry, Geist + JetBrains Mono via `@fontsource` or CDN
- [x] A.6 Create `src/main.tsx` (React root + i18n init) and `src/App.tsx` (router shell)
- [x] A.7 `npm install` — verify clean install

## Phase B — Design Tokens

- [x] B.1 `src/styles/tokens.css` — CSS vars: `#000` bg, `#0A0A0A` card, `#CCFF00` accent, `#222` 1px borders, 0px radius, type/space/motion scale
- [x] B.2 `src/styles/film-grain.css` — SVG noise data-URI `::before` overlay, `position: fixed`, `pointer-events: none`, `mix-blend-mode`
- [x] B.3 `src/styles/globals.css` — Tailwind v4 `@import "tailwindcss"` + `@theme` block referencing tokens
- [x] B.4 `src/index.css` — imports tokens, film-grain, globals

## Phase C — Content & i18n

- [x] C.1 Copy `Portfolio-Mikel/lang/en.json` → `src/i18n/locales/en.json` (52 keys)
- [x] C.2 Copy `Portfolio-Mikel/lang/es.json` → `src/i18n/locales/es.json` (52 keys)
- [x] C.3 `src/i18n/config.ts` — i18next init, static JSON imports, `localStorage` persistence
- [x] C.4 `src/components/LangToggle.tsx` — EN|ES toggle using `useTranslation()`
- [x] C.5–8 `src/content/projects/` — 4 project files (agent-orchestrator, design-tokens, reto-libreria, valaquiastore) + `index.ts` aggregator

## Phase D — UI Primitives

- [x] D.1 `src/components/ui/Button.tsx` — 0px radius, 1px `#222` border, mono label, `#CCFF00` hover border
- [x] D.2 `src/components/ui/Tag.tsx` — 1px border, mono uppercase text, `#666`
- [x] D.3 `src/components/ui/Card.tsx` — `#0A0A0A` bg, 1px `#222` border, `#CCFF00` accent on hover

## Phase E — Custom Hooks

- [x] E.1 `src/hooks/useMagneticCursor.ts` — pointer → lerp offset, spring return, `style.transform`
- [x] E.2 `src/hooks/useScrollProgress.ts` — GSAP ScrollTrigger → ref (0–1)
- [x] E.3 `src/hooks/useReducedMotion.ts` — wraps `prefers-reduced-motion` media query
- [x] E.4 `src/lib/audio/click.ts` — lazy AudioContext, 800Hz sine 40ms burst, silent error catch
- [x] E.5 `src/hooks/useHoverSound.ts` — attaches `playClick()` to `onPointerEnter`

## Phase F — 3D Wireframe + Effects

- [x] F.1 `src/components/effects/FilmGrain.tsx` — thin wrapper applying film-grain CSS to root
- [x] F.2 `src/components/effects/MagneticButton.tsx` — Button + `useMagneticCursor` + `useHoverSound`
- [x] F.3 `src/components/three/WireframeCentroide.tsx` — **BIGGEST TASK**. 4 sub-steps:
  - F.3a Geometry: `EdgesGeometry` from icosahedron/torus/cylinder/box → `LineSegments` with white `#FFF` material
  - F.3b Fragmented init: each vertex displaced by random offset + rotation at scroll 0
  - F.3c Scroll assembly: `scrollProgress` ref → `useFrame` → `THREE.MathUtils.lerp` fragments toward final position
  - F.3d Mouse inertia: `useFrame` damping-lerp (factor 0.05) on group rotation toward cursor
- [x] F.4 Dynamic import `WireframeCentroide` in Hero via `React.lazy()` + `<Suspense>`

## Phase G — Sections

- [x] G.1 `Hero.tsx` — Geist headline clamp(100–160px), role mono labels, 2 MagneticButton CTAs, R3F canvas background
- [x] G.2 `SelectedWork.tsx` — bento grid 4 cards (2-col span), Verbo+Stack+Métrica from i18n
- [x] G.3 `About.tsx` — bio from i18n + categorized stack tag grid, `#0A0A0A` card
- [x] G.4 `Contact.tsx` — email `magnetic` link, 3 socials `target="_blank"`, footer `#444`

## Phase H — App Shell

- [x] H.1 `src/App.tsx` — router with `/`, FilmGrain overlay, all 4 sections mounted
- [x] H.2 `src/hooks/useScrollSpy.ts` — IntersectionObserver tracking active section ID
- [x] H.3 `src/components/Nav.tsx` — top nav with `#CCFF00` active underline + LangToggle

## Phase I — Verify

- [x] I.1 Copy mockup images from `Portfolio-Mikel/images/` → `public/images/`
- [x] I.2 `npm run dev` starts clean (no warnings, no broken imports)
- [x] I.3 `npm run build` succeeds
- [ ] I.4 All 4 sections render with strict tokens (0px radius, `#000` bg, `#CCFF00` accent, 1px `#222` borders)
- [ ] I.5 3D wireframe: fragmented at top → scroll-assembled → mouse inertia tracking
- [ ] I.6 Magnetic cursor attracts on CTA hover; Web Audio click fires on first gesture
- [ ] I.7 Lang toggle switches all visible copy without refresh; persists in `localStorage`
- [ ] I.8 Film grain overlay visible across viewport, zero layout shift
- [ ] I.9 `prefers-reduced-motion` respected — no 3D animation, no magnetic movement

## Success Criteria

- [ ] `npm run dev` starts clean, `npm run build` succeeds
- [ ] All 4 sections render with tactile-brutalist tokens
- [ ] 3D centroide fragments → scroll-assembles → mouse-inertia tracks
- [ ] Magnetic cursor + Web Audio click on CTAs
- [ ] i18n toggle switches 52 EN/ES keys without page refresh
- [ ] Film grain overlay visible, CLS = 0
