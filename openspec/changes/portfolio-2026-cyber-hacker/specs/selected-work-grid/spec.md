# Selected Work Grid — Specification

## Purpose

Render a bento-style grid of 5 project cards using mono typography and `#0A0A0A` containers with `1px solid #222` borders, with a `02/03 — WORK` section indicator.

## Requirements

### Requirement: Bento Grid Layout

The work section MUST display exactly 5 project cards in an asymmetric bento grid layout.

- GIVEN the work section is visible
- WHEN the grid renders
- THEN exactly 5 cards are rendered, arranged in a bento pattern (not uniform grid), using `#0A0A0A` background containers

- GIVEN the viewport width is ≤ 768px
- WHEN the grid renders
- THEN cards stack vertically in a single column

### Requirement: Project Card

Each project card MUST use mono typography with `1px solid #222` borders, border-radius 0–4px, and a project title ALL CAPS in JetBrains Mono 700.

- GIVEN a project card is rendered
- WHEN inspecting its style
- THEN border is `1px solid #222`, `border-radius` is between 0px and 4px, background is `#0A0A0A`, and title is ALL CAPS JetBrains Mono 700

- GIVEN a project card
- WHEN the cursor hovers over it
- THEN the card MAY scale subtly (1–2%) — NO shadows, NO glow, NO gradients

### Requirement: Project Thumbnail Area

Each card MUST include a visual thumbnail area (placeholder or image) maintaining the cyber aesthetic.

- GIVEN a project card
- WHEN inspecting its layout
- THEN it contains a thumbnail region occupying approximately 60% of card height, with a fallback placeholder (`#0A0A0A` with mono label) when no image is loaded

### Requirement: Section Indicator

The work section MUST display `02/03 — WORK` in mono format at the section boundary.

- GIVEN the work section is in viewport
- WHEN the indicator renders
- THEN text matches `/^\d{2}\/\d{2} — [A-Z]+$/`, JetBrains Mono 400 12px, `color` `#666666`

## Acceptance Criteria

- [ ] 5 project cards in asymmetric bento grid
- [ ] Cards use `#0A0A0A` background, `1px solid #222` border, radius 0–4px
- [ ] Titles ALL CAPS JetBrains Mono 700
- [ ] Thumbnail area present in each card
- [ ] `02/03 — WORK` indicator visible
- [ ] Responsive: single column on mobile

## Out of Scope

- Project detail modals or routing
- Image optimization or lazy loading (browser-native only)
- Drag-to-reorder or grid interactivity
