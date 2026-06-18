---
title: "Portfolio 2026 — Corporate Goth Prototype"
change: portfolio-2026-prototype
type: proposal
phase: propose
created: 2026-06-18
design_system_id: assets/5405731237844893181
design_screens: [Hero, Selected Work, About & Stack, Contact]
status: draft
---

# Proposal: Portfolio 2026 — Corporate Goth Prototype

## Intent

Replace the static HTML5UP portfolio with a refined Astro 5 + React islands prototype that proves the Corporate Goth aesthetic and 3D centerpiece work before committing to a production build. Targeting technical recruiters with a 5-second scan.

## Scope

### In Scope
- **4 sections**: Hero, Selected Work (bento/4 projects), About & Stack, Contact
- **3D MVP**: R3F/Drei icosahedron with PBR materials, auto-rotation, mouse-reactive tilt, `prefers-reduced-motion` compliant
- **Corporate Goth DS**: `#0A0A0A` bg, `#F5F5F0` bone white, `#7A1F1F` oxblood, Newsreader/Inter/JetBrains Mono, 0-4px radius, 1px borders, no glow/gradients
- **i18n**: EN/ES via i18next, 39 keys from `Portfolio-Mikel/lang/{en,es}.json`
- **Content inventory**: 2 project MDs (`reto-libreria`, `valaquiastore`), 6 images (`project01.jpg`–`project06.png`)
- **Stitch designs**: 4 screens generated (project `5405731237844893181`), design system applied

### Out of Scope
- SEO, full a11y audit, cross-browser testing, unit tests, Storybook, CI/CD
- ❌ NO git operations (`init`, `add`, `commit`, `push`, `restore`)
- ❌ NO modifications to `C:\Users\mikel\Documents\Portfolio\Portfolio-Mikel\`
- ❌ NO production deployment — prototype is discardable with `rmdir`

## Capabilities

### New Capabilities
- `hero-section`: Viewport intro with typed headline, CTA pair, 3D icosahedron island
- `selected-work-grid`: Responsive bento of 4 project cards (Vespera, ValaquiaStore, Book&Bugs, EcoDrive AD — confirm in spec)
- `about-stack-section`: Bio paragraphs + tech stack grid from i18n content
- `contact-section`: Name/email/message form with i18n labels
- `3d-icosahedron`: R3F/Drei PBR mesh, slow Y-rotation, mouse-reactive tilt, `client:only`
- `i18n-system`: i18next with EN/ES JSON, language toggle, SSR-compatible
- `content-migration`: Copy 2 project MDs + 6 images into `public/`, reference in project cards

### Modified Capabilities
None — new project, no existing specs.

## Approach

1. Scaffold Astro 5 with React 18, TypeScript, Tailwind v4, GSAP, Framer Motion
2. Configure design tokens (colors, typography, spacing) matching Stitch theme
3. Build each section as Astro Layout + React island where interaction needed
4. Implement 3D icosahedron as `client:only="react"` island with Drei's `OrbitControls`
5. Wire i18next with full EN/ES key set (no placeholder text)
6. Stage 4 projects using Verbo+Tech+Impacto formula per card
7. Copy existing images to `public/images/` and project MDs to reference content

## Affected Areas

| Path | Impact | Description |
|------|--------|-------------|
| `portfolio-2026/` | New | Entire prototype directory — not a git repo, fully discardable |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| R3F bundle adds weight to cold load | Low | `client:only` island + dynamic import |
| i18n keys diverge from originals | Low | Freeze key set at migration; treat as source of truth |
| 3D motion discomfort | Low | `prefers-reduced-motion` disables rotation + tilt |
| Tailwind v4 CSS-first differs from v3 patterns | Medium | Consult Tailwind v4 docs before writing utility classes |

## Rollback Plan

N/A — standalone prototype. Delete `portfolio-2026/` to reset entirely.

## Dependencies

- Node 20+, npm
- Existing portfolio at `Portfolio-Mikel/` for read-only content reference
- Stitch designs at project `5405731237844893181` (Corporate Goth DS + 4 screens)

## Success Criteria

- [ ] All 4 sections render with Corporate Goth styling matching Stitch screens
- [ ] 3D icosahedron loads, auto-rotates, responds to mouse, disabled when `prefers-reduced-motion`
- [ ] i18n toggle switches EN/ES across all keys without refresh
- [ ] `npm run dev` starts without errors, all images load
