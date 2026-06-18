# Hero Section — Specification

## Purpose

Render the primary above-fold section: an ALL CAPS 128px mono headline, role labels in JetBrains Mono, two bracket-format CTAs wired to the microinteractions engine, and the wireframe centroide 3D canvas as a full-viewport background.

## Requirements

### Requirement: Mono Display Headline

The hero MUST render an ALL CAPS headline at 128px using JetBrains Mono font weight 700.

- GIVEN the hero section renders
- WHEN the headline text is displayed
- THEN `font-family` is `"JetBrains Mono"`, `font-size` is 128px, `font-weight` is 700, text is ALL CAPS, and `color` is `#FFFFFF`

- GIVEN the viewport width is ≤ 768px
- WHEN the headline renders
- THEN `font-size` SHOULD scale down responsively (minimum 48px) with no horizontal overflow

### Requirement: Role Labels

Below the headline, the hero MUST render mono-space role labels in JetBrains Mono 400, uppercase.

- GIVEN the hero section renders
- WHEN role labels are displayed
- THEN they use JetBrains Mono 400, uppercase, `letter-spacing` ≥ 0.08em, `color` `#666666`

### Requirement: Bracket CTAs with Magnetic Wiring

The hero MUST render exactly two bracket-format CTAs in the pattern `[ VER_TRABAJO → ]`, each with CSS class `magnetic`.

- GIVEN the hero section renders
- WHEN CTAs are displayed
- THEN there are exactly two elements with text matching `[ \w+ → ]` and CSS class containing `magnetic`

- GIVEN a CTA with class `magnetic`
- WHEN hovered
- THEN the microinteractions engine SHALL apply magnetic attraction and fire a Web Audio click

### Requirement: Section Indicator

The hero MUST display a section indicator in `01/03 — HERO` mono format positioned at the section boundary.

- GIVEN the hero section is in viewport
- WHEN the indicator renders
- THEN text matches `/^\d{2}\/\d{2} — [A-Z]+$/`, uses JetBrains Mono 400 12px, `color` `#666666`

### Requirement: Wireframe Canvas Background

The hero MUST render the wireframe centroide 3D canvas as a full-viewport background layer (z-index below text).

- GIVEN the hero section is mounted
- WHEN the page renders
- THEN the R3F `<Canvas>` fills the hero viewport dimensions, behind all text content

## Acceptance Criteria

- [ ] Headline: 128px JetBrains Mono 700 ALL CAPS, responsive down to 48px
- [ ] Role labels: JetBrains Mono 400 uppercase, tracked
- [ ] Two bracket CTAs with `magnetic` class
- [ ] `01/03 — HERO` indicator visible
- [ ] Wireframe canvas fills hero viewport behind text

## Out of Scope

- Animated headline entrance or letter-by-letter reveal (covered by kinetic-typography if added later)
- Background video, images, or gradients
- Scroll-down indicator or arrow
