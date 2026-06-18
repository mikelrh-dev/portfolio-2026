---
title: "Portfolio 2026 — Tactile Brutalism Prototype"
change: portfolio-2026-tactile-brutalism
type: proposal
phase: propose
created: 2026-06-18
status: draft
supersedes: portfolio-2026-prototype
---

# Proposal: Portfolio 2026 — Tactile Brutalism Prototype

## Intent

Previous `portfolio-2026-prototype` (Corporate Goth, Astro) built but rejected as "se siente de poca calidad, no llama la atención". Full pivot to a kinetic, aggressive tactile-brutalist aesthetic with 3D wireframe centerpiece, magnetic cursors, Web Audio haptics, and scroll-synced assembly animation. React 18 + Vite 5, NOT Astro.

## Scope

### In Scope
- **4 sections**: Hero, Selected Work (bento/4 projects), About/Stack, Contact
- **3D wireframe centroide**: R3F LineSegments + EdgesGeometry, white 1px lines on black, GSAP ScrollTrigger assembly, mouse inertia
- **Tactile microinteractions**: magnetic cursors on CTAs, Web Audio hi-fi click on hover — both WIRED
- **Strict aesthetic**: `#000000` bg, `#0A0A0A` cards, `#CCFF00` accent, 0px radius, 1px `#222` borders, no glow/gradients/blur
- **Film grain**: SVG noise data-URI overlay, GPU-friendly, full-app
- **i18n**: EN/ES via i18next+react-i18next, 52 keys per locale (migrated from Portfolio-Mikel/lang/)
- **Typography**: Geist (display 600-800), Geist Sans (body 400-500), JetBrains Mono (metadata/stack/labels, uppercase tracked)

### Out of Scope
- SEO, full a11y audit, cross-browser, unit tests, Storybook, CI/CD, deployment
- ❌ NO git operations, NO modifications to `Portfolio-Mikel/`, NO changes to previous change artifacts
- ✅ Working in `portfolio-2026/` ONLY (existing Astro code REPLACED, not preserved)

## Capabilities

### New Capabilities
- `wireframe-centroide`: 3D wireframe mechanical assembly via R3F LineSegments + EdgesGeometry, GSAP ScrollTrigger-driven extrusion from fragmented to assembled state, mouse liquid inertia
- `hero-section`: Massive display headline (100-160px), stack mono labels, 2 CTAs with magnetic cursors + Web Audio hover, wireframe centroide canvas background
- `selected-work-grid`: Bento grid of 4 project cards (reto-libreria, valaquiastore, agent-orchestrator, design-tokens) with Verbo+Stack+Métrica formula
- `about-stack-section`: Bio from i18n + categorized stack tag grid (no icons, pure text tags)
- `contact-section`: Email underline link + socials + footer, no form
- `microinteractions-engine`: Magnetic cursor attraction on `.magnetic` elements + Web Audio API `AudioContext` click on hover — wired into CTA components
- `film-grain-overlay`: SVG noise data-URI via CSS `::before` pseudo-element, GPU composite-only
- `i18n-system`: i18next + react-i18next, 52 keys per locale, language toggle (no SSR — pure SPA)
- `content-migration`: Copy 52-key EN/ES JSON from Portfolio-Mikel/lang/ into `src/i18n/locales/`

### Modified Capabilities
None — clean-slate change, no existing specs to modify.

## Approach

1. Scaffold Vite 5 + React 18 + TS, Tailwind v4 CSS-first (`@theme` block, NO `tailwind.config.js`)
2. Install R3F/Drei, GSAP+ScrollTrigger, Framer Motion, react-i18next, React Router 6
3. Configure DS via Tailwind `@theme` — tokens for carbon bg, electric green accent, 0px radius, 1px borders
4. Build `CentroideMecanico` R3F component: EdgesGeometry + LineSegments + scroll-driven GSAP timeline
5. Build sections as React components with CSS modules + Tailwind utility classes
6. Wire magnetic cursor via Framer Motion `useMotionValue` + `motion.div` with spring physics
7. Wire Web Audio click — create `AudioContext` on first user gesture, play short oscillator burst on CTA hover
8. Add SVG film grain via `background-image: url("data:image/svg+xml,...")` on root element
9. Import EN/ES JSON files into i18next init — no fetch, static imports

## Affected Areas

| Path | Impact | Description |
|------|--------|-------------|
| `portfolio-2026/` | Replace | Entire directory — previous Astro code replaced. NOT a git repo. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| R3F bundle weight on cold load | Med | Dynamic import `@react-three/fiber`, suspense fallback |
| Web Audio blocked before user gesture | Low | Defer AudioContext creation to first click/touch event |
| GSAP ScrollTrigger + R3F sync drift | Med | Use ScrollTrigger's `onUpdate` progress (0-1) to drive timeline, not scroll events |
| Tailwind v4 `@theme` vs utility conflicts | Low | Single source of truth in `@theme` block; no hardcoded color values |

## Rollback Plan

Delete `portfolio-2026/` entirely. Previous change artifacts preserved under `openspec/changes/portfolio-2026-prototype/`.

## Dependencies

- Node 20+, npm
- `Portfolio-Mikel/` for read-only i18n content migration
- Geist font via `@fontsource/geist-sans` or direct CDN
- JetBrains Mono via `@fontsource/jetbrains-mono`

## Success Criteria

- [ ] All 4 sections render with strict tactile-brutalist tokens (0px radius, `#000` bg, `#CCFF00` accent, 1px `#222` borders)
- [ ] 3D wireframe centroide: initial fragmented state → scroll-driven assembly → liquid mouse tracking
- [ ] Magnetic cursor attracts on CTA hover, Web Audio click fires on first user gesture
- [ ] Language toggle switches all 52 EN/ES keys without refresh
- [ ] Film grain overlay visible across full viewport, zero layout shift
- [ ] `npm run dev` starts clean — no warnings, no broken imports
