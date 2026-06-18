# Tasks: Portfolio 2026 — Cyber-Tech Hacker Prototype

**Total est. time**: ~16–20h (clean-slate replacement, non-git dir)

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

> **Note**: `portfolio-2026/` is NOT a git repo (fully discardable). 400-line budget guard is informational — no PR workflow applies.

## Phase A: Foundation — Scaffold

- [x] **A.1** — Delete all existing `src/*.tsx`, `package.json`, `vite.config.ts`, `tsconfig.json` (keep `openspec/`, `public/`, `dist/`, `node_modules/`)
- [x] **A.2** — Create `package.json` — react@18, react-dom@18, react-router-dom@6, vite@5, @vitejs/plugin-react, three, @react-three/fiber, @react-three/drei, gsap, framer-motion, i18next, react-i18next, @fontsource-variable/jetbrains-mono, typescript, @types/react, @types/react-dom
- [x] **A.3** — Create `vite.config.ts` — React plugin, `@/` alias `src/`, R3F optimizeDeps `["three"]`
- [x] **A.4** — Create `tsconfig.json` — strict, JSX `"react-jsx"`, paths `@/* → src/*`
- [x] **A.5** — Create `index.html` — Vite entry, `<div id="root">`, JetBrains Mono preload
- [x] **A.6** — Create `src/main.tsx` + `src/App.tsx` — i18n init, router shell, `<FilmGrain>` + `<Nav>` + 4 sections
- [x] **A.7** — Run `npm install`

## Phase B: Design Tokens

- [x] **B.1** — `src/styles/tokens.css` — CSS vars: `--color-bg #000000`, `--color-container #0A0A0A`, `--color-border #222222`, `--color-accent #CCFF00`, type scale 128px–12px JetBrains Mono
- [x] **B.2** — `src/styles/film-grain.css` — `body::before` SVG noise data-URI overlay, opacity 0.03–0.05, fixed, `pointer-events: none`
- [x] **B.3** — `src/styles/globals.css` — Tailwind v4 `@import "tailwindcss"` + `@theme` block: all JetBrains Mono, cyber colors, `--radius-* 0px`, no shadows
- [x] **B.4** — `src/index.css` — imports tokens.css + globals.css + film-grain.css + `@fontsource-variable/jetbrains-mono`

## Phase C: Content & i18n

- [x] **C.1** — `src/i18n/locales/en.json` + `es.json` — 52 keys migrated from `Portfolio-Mikel/lang/` (read-only, include 4 sections + nav + projects)
- [x] **C.2** — `src/i18n/config.ts` — i18next init, `react-i18next`, language detector (path `/en/`), static imports
- [x] **C.3** — `src/content/projects/` — 4 modules (agent-orchestrator, design-tokens, reto-libreria, valaquiastore) + `index.ts` aggregator, typed `ProjectMeta[]`

## Phase D: UI Primitives

- [x] **D.1** — `src/components/ui/Button.tsx` — 0px radius, 1px `#222` border, JetBrains Mono, bracket format `[ LABEL → ]`, electric green hover
- [x] **D.2** — `src/components/ui/Tag.tsx` — 1px border, mono 12px, used for `[STACK]` tags
- [x] **D.3** — `src/components/ui/Card.tsx` — 1px border `#222`, `#0A0A0A` bg, hover border→green, mono title + `P.0X` index

## Phase E: Custom Hooks

- [x] **E.1** — `src/hooks/useMagneticCursor.ts` — RAF spring (stiffness 300, damping 20) translating el toward pointer, returns `{ ref, style, isActive }`
- [x] **E.2** — `src/hooks/useScrollProgress.ts` — GSAP ScrollTrigger `onUpdate` returning 0–1 ref
- [x] **E.3** — `src/hooks/useReducedMotion.ts` — `prefers-reduced-motion` media query
- [x] **E.4** — `src/hooks/useScrollSpy.ts` — IntersectionObserver for active section tracking

## Phase F: Effects (Audio + 3D + Motion)

- [x] **F.1** — `src/lib/audio/click.ts` — lazy `AudioContext`, 800Hz 40ms sine burst, silent error catch, exported `playClick()`
- [x] **F.2** — `src/components/effects/FilmGrain.tsx` — renders `film-grain` CSS class overlay
- [x] **F.3** — `src/components/effects/KineticHeadline.tsx` — GSAP SplitText + ScrollTrigger, splits `.kinetic-text` elements, stagger 0.03 opacity+y reveal, play-once
- [x] **F.4** — `src/components/effects/MagneticButton.tsx` — wraps Button with `useMagneticCursor` + `onMouseEnter={playClick}`, bracket format
- [x] **F.5** — `src/components/three/WireframeCentroide.tsx` — **THE BIG TASK** (see below)

### F.5 Wireframe Centroide Detail

R3F `<Canvas>` (lazy + Suspense) with:
- 10 `EdgesGeometry` + `LineSegments` nodes (3 icosahedrons, 3 tori, 2 cylinders, 2 boxes)
- Cycles component `comp-0` → electric green `#CCFF00`, comp-1..9 → white `#FFFFFF`
- Initial fragmented positions (displaced + rotated), target assembled positions (coherent shape)
- `useFrame` lerps positions toward target guided by scroll progress ref (0–1)
- GSAP `ScrollTrigger` with `onUpdate` writing to shared `useRef<number>(0)`
- Mouse tracking: `onPointerMove` → target rotation, `lerp(current, target, 0.05)` per frame
- ≥ 3 Drei `<Text>` / `<Html>` vector labels in JetBrains Mono
- Green component gets `[ FOCUS: comp-0 ]` label in `#CCFF00`
- `prefers-reduced-motion` disabled via `useReducedMotion`
- **No** post-processing, **No** OrbitControls, **No** glow

## Phase G: Sections

- [x] **G.1** — `src/components/sections/Hero.tsx` — 128px ALL CAPS KineticHeadline, role labels, `01/04 — HERO` indicator, 2× MagneticButton `[ VER_TRABAJO → ]` / `[ CONTACTO → ]`, `<WireframeCentroide>` full-viewport bg
- [x] **G.2** — `src/components/sections/SelectedWork.tsx` — `02/04 — WORK` indicator, headline `SELECTED_WORK.`, bento grid 5 cards, 1 featured + 4 small, responsive stack
- [x] **G.3** — `src/components/sections/AboutStack.tsx` — `03/04 — ABOUT` indicator, bio paragraphs, `[STACK]` 5 categories, ≤ 3 green accents
- [x] **G.4** — `src/components/sections/Contact.tsx` — `04/04 — CONTACT` indicator, 56px email green underline, 4 socials, footer `#666` 12px

## Phase H: App Shell

- [x] **H.1** — `src/App.tsx` — BrowserRouter, `/` + `/en/` routes, all 4 sections, `<FilmGrain>` global overlay, `<Nav>` with scroll-spy active indicator
- [x] **H.2** — `src/components/Nav.tsx` — mono `MIKEL_ROMERO` left, section indicator + locale toggle right, active state green underline

## Phase I: Polish & Verify

- [x] **I.1** — Copy mockup images from `Portfolio-Mikel/public/images/` to `portfolio-2026/public/images/`
- [x] **I.2** — `npm run dev` — verify clean startup on port 5173
- [x] **I.3** — `npm run build` — verify production build succeeds
- [ ] **I.4** — Manual verify: all 4 sections render, i18n toggle EN↔ES works, 3D centroide loads with green highlight, magnetic cursor + audio clicks on CTAs, film grain visible, `prefers-reduced-motion` respected (deferred to user)

## Section Counter Resolution

Spec conflict: `selected-work-grid` and `about-stack-section` both specified `02/03`. Resolution: all 4 sections get `/04` denominator — Hero `01/04`, Work `02/04`, About `03/04`, Contact `04/04`. Monotonically increments in DOM order per spec requirement.

## Success Criteria

- [ ] 4 sections render with cyber palette, JetBrains Mono only, `/04` section indicators
- [ ] Wireframe centroide: fragmented → scroll assembly → green `#CCFF00` highlight → mouse inertia lerp
- [ ] Bracket CTAs with magnetic attraction + Web Audio hover click
- [ ] i18n toggles 52 keys EN↔ES, film grain overlay visible
- [ ] `npm run dev` clean, `npm run build` succeeds

## Hard Rules

- ❌ NO git operations
- ❌ NO writes to `Portfolio-Mikel/`, no changes to previous change dirs
- ❌ NO tests, CI/CD, deployment, production setup
- ❌ NO Phase 2 animations (custom cursor, typewriter, boot, scramble, grid)
- ✅ Work in `portfolio-2026/` only; folder IS NOT a git repo
