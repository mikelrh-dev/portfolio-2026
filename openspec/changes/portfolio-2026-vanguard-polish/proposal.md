# Proposal: Portfolio 2026 — Vanguard Polish

## Intent

Fourth iteration. Cyber-hacker prototype has real content (52 keys, 4 sections, 3D wireframe) but lacks photo and feels flat. Add 8 Awwwards-level enhancements without changing structure or palette.

## Scope

### In Scope
- Profile photo, custom cursor, boot sequence, type-writer hero, text scramble, background grid, scroll indicator, enhanced card hover
- All respect `prefers-reduced-motion`

### Out of Scope
- New sections/pages, palette changes, git ops, writes to `Portfolio-Mikel/`, changes to prior change dirs
- Tests, CI/CD, deployment, a11y audit

## Capabilities

### New Capabilities
- `profile-photo-cyber`: Grayscale → green tint on hover, `[ OPERATOR_ID: MIKEL_ROMERO ]` label
- `custom-cursor-mono`: `[ _ ]` with lerp(0.2) → `[ ▶ ]` on interactives
- `boot-sequence`: 6 `[ SYS::INIT ]` lines pre-Hero, 80ms step, 800ms total
- `type-writer-hero`: Char-by-char with blinking cursor, 30ms delay
- `text-scramble-sections`: 300ms scramble then resolve on viewport enter
- `background-grid-parallax`: 1px #1A1A1A 80px grid, `::after`, 0.1× scroll
- `scroll-progress-indicator`: 2px×40vh fixed right bar, green, live %
- `enhanced-card-hover`: Image zoom 1.05, index scale 1.1, green line slide

### Modified Capabilities
None.

## Approach

1. Copy `profile.jpg` to `public/images/`, render in `AboutStack` with filter hook
2. `<CustomCursor />` + `useCustomCursor`: `[ _ ]`/`[ ▶ ]` top-level overlay
3. `<BootSequence />` guard in `App`: 6 lines, then mount real content
4. Replace `KineticHeadline` in Hero with `useTypeWriter` char-by-char
5. Wrap section `<h2>` with `useTextScramble` via ScrollTrigger
6. CSS `body::after` grid with parallax `background-position`
7. `<ScrollProgress>` with GSAP `ScrollTrigger` progress → fill + label
8. `Card.tsx`: Framer Motion `scale` on image, absolute `::after` green line

## Affected Areas

| Area | Impact | Files |
|------|--------|-------|
| Hooks | +4 new | `useCustomCursor`, `useTextScramble`, `useTypeWriter`, `useBootSequence` |
| Components | +3 new | `CustomCursor`, `BootSequence`, `ScrollProgress` |
| Sections | ~4 mod | `Hero`, `AboutStack`, `SelectedWork`, `Contact` |
| UI | ~1 mod | `Card.tsx` |
| Styles | ~1 mod | `globals.css` |
| App | ~1 mod | Wire boot/sequence/cursor |
| i18n | ~2 mod | +1 key per locale |
| Assets | +1 new | `public/images/profile.jpg` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Custom cursor blocks clicks | Low | `pointer-events: none` |
| Boot sequence feels slow | Low | 800ms, skip on reduced-motion |
| Grid paint cost | Low | GPU via `will-change: transform` |

## Rollback Plan

Revert 4 hooks, 3 components, `Card.tsx`/`App.tsx`/`globals.css` mods, delete `profile.jpg`. Not a git repo — manual revert.

## Dependencies

Same stack as cyber-hacker. Profile photo: `Portfolio-Mikel/images/profile.jpg` (read-only).

## Success Criteria

- [ ] Photo grayscale → green on hover, `[ OPERATOR_ID ]` visible
- [ ] `[ _ ]` cursor follows with inertia, `[ ▶ ]` on interactives
- [ ] Boot plays 6 lines on cold load then fades
- [ ] Hero types char-by-char then cursor vanishes
- [ ] Section headlines scramble 300ms then resolve
- [ ] Grid + parallax visible, scroll bar fills green, card zooms + green line
- [ ] `npm run dev` clean, no console errors
- [ ] All effects disabled on `prefers-reduced-motion: reduce`
