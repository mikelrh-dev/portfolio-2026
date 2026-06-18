# Delta for hero-section

## MODIFIED Requirements

### Requirement: Display Headline

The hero MUST render a large display headline using Geist Mono or JetBrains Mono weight 700, left-aligned, 100–160px.

(Previously: centered, Geist display weight 600-800)

- **GIVEN** the hero section renders
- **WHEN** the headline text is displayed
- **THEN** `font-family` is mono (Geist Mono or JetBrains Mono), size 100–160px, weight 700, color `#FFFFFF`, LEFT-ALIGNED

- **GIVEN** viewport width ≤ 768px
- **WHEN** the headline renders
- **THEN** font size SHOULD scale down (minimum 48px)

### Requirement: Stack Role Labels

Role labels MUST use Geist Sans 400–500, size 14–16px, left-aligned.

(Previously: JetBrains Mono uppercase, letter-spacing, centered)

- **GIVEN** the hero section renders
- **WHEN** role labels are displayed
- **THEN** they use Geist Sans 400–500, size 14–16px, color `#CCCCCC`, left-aligned

### Requirement: CTA Buttons (No Magnetic)

The hero MUST render exactly two CTAs using CSS hover only — no magnetic class, no `useMagneticCursor`.

(Previously: CTAs with `magnetic` class wired to microinteractions engine)

- **GIVEN** the hero section renders
- **WHEN** CTAs are displayed
- **THEN** there are exactly two `<button>` or `<a>` elements with CSS hover transitions only

- **GIVEN** a CTA is hovered
- **WHEN** hover state activates
- **THEN** the button MUST respond with CSS transition only — no magnetic, no Web Audio click

### Requirement: Wireframe Canvas (Compressed or Removed)

The hero MUST either contain the wireframe constrained to the right 40%, or have no canvas at all.

(Previously: wireframe as full-viewport background behind text)

- **GIVEN** the hero renders with 3D kept
- **WHEN** the canvas is mounted
- **THEN** it fills the right 40% of the hero, behind text content

- **GIVEN** the hero renders with 3D removed
- **WHEN** the section renders
- **THEN** no `<Canvas>` or R3F element is present

## REMOVED Requirements

### Requirement: Wireframe Canvas Background (Full-Viewport)

(Reason: Full-viewport 3D replaced by constrained right-slot or removal. See editorial-3d-fidelity for conditional upgrade path.)

(Migration: The old full-viewport canvas behavior is replaced. No migration needed — structural change.)
