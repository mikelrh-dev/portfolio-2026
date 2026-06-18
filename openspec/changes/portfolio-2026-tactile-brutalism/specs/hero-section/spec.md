# Hero Section — Specification

## Purpose

Render the primary above-fold section: a massive display headline, Stack mono role labels, two magnetic CTAs, and the wireframe centroide 3D canvas as the full-viewport background.

## Requirements

### Requirement: Display Headline

The hero MUST render a large display headline (100px–160px `font-size`) using Geist display font weight 600–800.

- **GIVEN** the hero section renders
- **WHEN** the headline text is displayed
- **THEN** the `font-family` is Geist (display), font size is between 100px and 160px, weight is 600–800, and color is `#FFFFFF`

- **GIVEN** the viewport width is ≤ 768px
- **WHEN** the headline renders
- **THEN** the font size SHOULD scale down responsively (minimum 48px) to avoid horizontal overflow

### Requirement: Stack Role Labels

Below the headline, the hero MUST render mono-space role labels using JetBrains Mono, uppercase with letter-spacing.

- **GIVEN** the hero section renders
- **WHEN** role labels are displayed
- **THEN** they use JetBrains Mono, uppercase, tracked (letter-spacing ≥ 0.05em), color `#666666`

### Requirement: CTA Buttons with Magnetic Wiring

The hero MUST render exactly two primary CTAs, each with class `magnetic` for the microinteractions engine to target.

- **GIVEN** the hero section renders
- **WHEN** CTAs are displayed
- **THEN** there are exactly two `<button>` or `<a>` elements with CSS class containing `magnetic`

- **GIVEN** a CTA with class `magnetic`
- **WHEN** hovered
- **THEN** the microinteractions engine SHOULD apply magnetic attraction and fire a Web Audio click (per `microinteractions-engine` spec)

### Requirement: Wireframe Canvas Background

The hero MUST render the wireframe centroide 3D canvas as a full-viewport background behind the headline and CTAs.

- **GIVEN** the hero section is mounted
- **WHEN** the page renders
- **THEN** the R3F canvas fills the hero viewport, behind all text content (`z-index` below text layer)

- **GIVEN** the wireframe centroide is dynamically loaded
- **WHEN** it finishes loading
- **THEN** the canvas renders seamlessly without layout shift

## Acceptance Criteria

- [ ] Headline renders at 100–160px (≥48px on mobile) in Geist display weight 600–800
- [ ] Role labels render in JetBrains Mono, uppercase, tracked
- [ ] Two CTAs present with `magnetic` class
- [ ] Wireframe canvas fills hero viewport behind text
- [ ] No layout shift on canvas mount

## Out of Scope

- Animated headline entrance (covered by kinetic-typography if added later)
- Background video, images, or gradients
- Scroll-down indicator or arrow
