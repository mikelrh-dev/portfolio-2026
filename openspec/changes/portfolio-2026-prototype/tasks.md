# Tasks: Portfolio 2026 — Corporate Goth Prototype

## Hard Rules

- ❌ NO git, NO tests, NO CI/CD, NO production deploy
- ❌ NO modifications to `Portfolio-Mikel/` (read-only for content migration)
- ✅ Work ONLY in `portfolio-2026/` — discardable with `rmdir`

## Review Workload Forecast

Decision needed before apply: Yes
Chained PRs recommended: No (prototype — size:exception recommended)
Chain strategy: size-exception
400-line budget risk: High

| Field | Value |
|-------|-------|
| Estimated changed lines | ~2000–3500 |
| 400-line budget risk | High |
| Recommended | Single PR w/ size:exception |
| Delivery strategy | ask-on-risk |

## Foundation (5)

- [x] A.1 `package.json`, `astro.config.mjs`, `tsconfig.json` — Astro 5 + React 18
- [x] A.2 Install deps: astro, react, three, drei, gsap, framer-motion, i18next, tailwindcss, fontsource
- [x] A.3 `src/styles/tokens.css` — color/type/space/motion/border CSS vars
- [x] A.4 `film-grain.css` + `globals.css` — noise overlay, Tailwind v4 `@theme`
- [x] A.5 `BaseLayout.astro` — HTML shell, font preloads, nav, slot

## Content & i18n (3)

- [x] B.1 Copy `lang/{en,es}.json` → `src/i18n/` — 52 keys each
- [x] B.2 `src/i18n/config.ts` — i18next init, detection, react-i18next binding
- [x] B.3 4 project MDX files — reto-libreria, valaquiastore (real), agent-orchestrator, design-tokens (placeholder)

## UI Primitives (3)

- [x] C.1 `Button.astro` — 1px oxblood border, mono label, hover fill
- [x] C.2 `Tag.astro` — 1px border, mono text
- [x] C.3 `Card.astro` — 1px border, dark bg, hover oxblood accent

## React Islands (5)

- [x] D.1 `FilmGrain.tsx` — SVG noise, `client:load`
- [x] D.2 `MagneticButton.tsx` — Framer Motion mouse tracking, `client:visible`
- [x] D.3 `ScrollSpy.tsx` — IntersectionObserver + GSAP kinetic text, `client:idle`
- [x] D.4 `Hero3D.tsx` — R3F icosahedron, PBR mat, auto-rotation, mouse tilt, reduced-motion, `client:only`
- [x] D.5 Audio helper — Web Audio API base64 hover click

## Sections (4)

- [x] E.1 `Hero.astro` — 100vh, i18n headline, 2 CTAs, 3D island, stack pills
- [x] E.2 `SelectedWork.astro` — bento grid, 4 cards, responsive CSS Grid
- [x] E.3 `About.astro` — i18n bio, stack tags, two-column layout
- [x] E.4 `Contact.astro` — i18n form, email validation, social links, footer

## Pages & Routing (2)

- [x] F.1 `index.astro` (ES) + `en/index.astro` (EN) — assemble 4 sections + islands
- [x] F.2 Wire i18n routing — `/` → ES, `/en/` → EN via cookie detection

## Assets & Polish (5)

- [x] G.1 Copy 6 images `Portfolio-Mikel/images/` → `public/images/` (5 found, 1 placeholder for project04)
- [x] G.2 Kinetic text via IntersectionObserver word-split (GSAP SplitText is premium — manual equivalent used)
- [x] G.3 Build passes without errors (`npm run build` succeeds, code compiles)
- [x] G.4 `prefers-reduced-motion` CSS + JS — globals.css disables animations, Hero3D checks `window.matchMedia`
- [x] G.5 i18n EN/ES via URL routing (`/` → ES, `/en/` → EN), both pages build successfully

## Success Criteria

- [x] 4 sections with Corporate Goth styling matching design (bg #0A0A0A, oxblood #7A1F1F, bone-white #F5F5F0)
- [x] 3D icosahedron loads, auto-rotates, mouse tilt, disabled on reduced-motion
- [x] i18n pages render both EN and ES via `/` and `/en/` routes
- [x] `npm run build` succeeds (verified)
- [ ] `npm run dev` starts clean (runtime verification — CLI can't test interactively)

**Total: 27 tasks | ~12-16h | Recommend single PR with size:exception**
