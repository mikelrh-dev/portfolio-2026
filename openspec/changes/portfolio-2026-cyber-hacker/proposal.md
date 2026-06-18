---
title: "Portfolio 2026 — Cyber-Tech Hacker Prototype"
change: portfolio-2026-cyber-hacker
type: proposal
phase: propose
created: 2026-06-18
status: draft
supersedes: portfolio-2026-tactile-brutalism
stitch_project: 4141643879944533883
stitch_design_system: assets/4599387566136793557
stitch_screens:
  - Hero: 8badfa160ecc452a8720cdfb0c5641be
  - Selected Work: 65708335391c4fddad4fd78806583212
  - About & Stack: e635e40b9a69497b97d2aa01f9ffb3a2
  - Contact: 17b13731bbb54cf4ab6fdb099f0b177f
---

# Proposal: Portfolio 2026 — Cyber-Tech Hacker Prototype

## Intent

Third iteration. Previous tactile-brutalism rejected ("se siente de poca calidad"). Pivot to Cyber-Tech Hacker: mono-driven, electric green on black, wireframe 3D, bracket CTAs.

## Scope

### In Scope
- **4 sections**: Hero, Selected Work (bento/5), About & Stack, Contact — `01/03` mono indicators
- **3D Wireframe Centroide**: R3F EdgesGeometry + LineSegments, 10 components, 1 green, scroll-sync GSAP, mouse inertia
- **Mono-only type**: JetBrains Mono 400/700, display ALL CAPS 128-80px
- **Cyber palette**: `#000000` bg, `#0A0A0A` containers, `#222` 1px borders, `#CCFF00` accent ≤3x/section, 0-4px radius
- **Microinteractions**: magnetic + Web Audio clicks on `[ VER_TRABAJO → ]`
- **Film grain**: SVG noise data-URI overlay
- **i18n**: 52 EN/ES keys via i18next+react-i18next

### Out of Scope
- Phase 2 animations (custom cursor, type-writer, grid, boot, scramble — deferred)
- SEO, a11y audit, cross-browser, CI/CD, tests, Storybook, deployment
- ❌ NO git ops, NO writes to `Portfolio-Mikel/`, NO changes to previous change dirs

## Capabilities

### New Capabilities
- `cyber-hero`, `selected-work-grid`, `about-stack-section`, `contact-section`
- `wireframe-centroide-v2`: R3F + GSAP, 10 parts, 1 green, no postprocessing
- `mono-typography-system`: JetBrains Mono sole face, weight contrast 400/700
- `section-indicators`: `XX/YY — SECTION` mono format
- `microinteractions-engine`: magnetic + Web Audio

### Modified Capabilities
None — clean-slate.

## Approach

1. Scaffold Vite 5 + React 18 + TS, Tailwind v4, R3F/Drei/GSAP/Framer Motion/i18next
2. Configure DS tokens for cyber palette
3. Build `WireframeCentroide`: EdgesGeometry + LineSegments, 10 parts, 1 green, GSAP scroll + mouse lerp
4. Build 4 sections with `[ BRACKET ]` CTAs, `01/03` indicators, ALL CAPS headlines
5. Wire magnetic + Web Audio; add film grain; import 52 i18n keys
6. Stitch screen IDs (frontmatter) serve as blueprints

**Diffs**: Mono-only (was Geist), single tier containers (was layered), ALL CAPS (was Title Case), bracket CTAs (was plain), `01/03` indicators (was plain), green 3D part (was none).

## Affected Areas

| Path | Impact | Description |
|------|--------|-------------|
| `portfolio-2026/` | Replace | Previous code replaced. NOT a git repo. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| R3F bundle weight | Med | Dynamic import + suspense |
| Mono readability | Low | Weight/size hierarchy |
| Web Audio blocked | Low | Defer to first gesture |

## Rollback Plan

Delete `portfolio-2026/`. Previous artifacts preserved under `openspec/changes/portfolio-2026-tactile-brutalism/`.

## Dependencies

- Node 20+, npm; `@fontsource/jetbrains-mono`
- `Portfolio-Mikel/lang/` for i18n migration (read-only)

## Success Criteria

- [ ] 4 sections: cyber palette, mono-only, `01/03` indicators
- [ ] 3D centroide: fragmented → scroll assembly → green highlight → mouse inertia
- [ ] Bracket CTAs with magnetic + Web Audio
- [ ] i18n toggles 52 keys, film grain visible, `npm run dev` clean
