# Editorial Hero — Specification

## Purpose

Define the editorial hero layout: an asymmetric 60/40 text-to-accent split with text-dominant typography (sans body, mono display headlines), no boot sequence, and 3D either compressed to the right 40% or removed.

## Requirements

### Requirement: Asymmetric Layout

The hero MUST render a 60/40 column split — text content on the left 60%, accent area on the right 40%.

- **GIVEN** the hero renders on viewport ≥ 1024px
- **WHEN** the layout is computed
- **THEN** text content MUST occupy ~60% left, accent area ~40% right

- **GIVEN** viewport width < 768px
- **WHEN** the hero renders
- **THEN** the accent MUST stack below text or be hidden

### Requirement: Text-Dominant Typography

Headlines MUST use mono display (Geist Mono 700 or JetBrains Mono 700). Body/role labels MUST use Geist Sans 400–500.

- **GIVEN** the hero renders
- **WHEN** the primary headline is displayed
- **THEN** it MUST use mono display font weight 700, size 100–160px (≥48px mobile), left-aligned

- **GIVEN** the hero renders
- **WHEN** role labels or body text are displayed
- **THEN** they MUST use Geist Sans 400–500, size 14–16px, color `#CCCCCC`

### Requirement: TypeWriter + KineticHeadline

The hero MUST retain TypeWriter (character-by-character) and KineticHeadline (GSAP SplitText + ScrollTrigger) within the new left-aligned layout.

- **GIVEN** the hero renders
- **WHEN** the page loads
- **THEN** the headline MUST type out at ~30ms/char (unless `prefers-reduced-motion: reduce`)

- **GIVEN** the hero scrolls into view
- **WHEN** ScrollTrigger fires
- **THEN** the headline MAY animate via GSAP SplitText staggered opacity + translateY (play-once)

### Requirement: Static CTAs (No Magnetic)

CTAs MUST use the MagneticButton component WITHOUT magnetic cursor attraction — CSS hover only.

- **GIVEN** the hero renders
- **WHEN** CTAs are displayed
- **THEN** buttons MUST NOT use `useMagneticCursor`; hover MUST use simple CSS transition

### Requirement: No Boot Sequence

Content MUST be visible immediately on page load.

- **GIVEN** the page loads
- **WHEN** the hero is inspected
- **THEN** text and CTAs MUST be visible without waiting for any boot animation

### Requirement: Section Indicator

The hero MUST display `01/04 — HERO` in mono `#666666`.

- **GIVEN** the hero is in viewport
- **WHEN** the indicator renders
- **THEN** it matches `/^\d{2}\/\d{2} — [A-Z]+$/`, JetBrains Mono 400 12px, `color: #666666`

## Non-goals

- Full-viewport 3D background
- Boot sequence
- Magnetic cursor attraction
- Centered or text-center layout

## Acceptance Criteria

- [ ] Asymmetric 60/40 split on desktop, stacked on mobile
- [ ] Mono display headlines 100–160px (≥48px mobile), left-aligned
- [ ] Body/role labels in Geist Sans 14–16px
- [ ] `01/04 — HERO` indicator in `#666666`
- [ ] CTAs use CSS hover only (no magnetic)
- [ ] Content visible immediately — no boot sequence
