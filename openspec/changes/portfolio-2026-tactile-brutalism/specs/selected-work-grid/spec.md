# Selected Work Grid — Specification

## Purpose

Display a bento grid of 4 project cards using the Verbo+Stack+Métrica formula: a verb phrase description, a technology stack row, and a key metric (performance or scale number).

## Requirements

### Requirement: Bento Grid Layout

The work section MUST render exactly 4 project cards in a bento-style grid with varying column/row spans.

- **GIVEN** the work section is rendered
- **WHEN** the user views the section
- **THEN** exactly 4 card elements are visible in a grid layout with at least one card spanning 2 columns or 2 rows

- **GIVEN** the viewport width is ≤ 768px
- **WHEN** the grid renders on mobile
- **THEN** all cards collapse to a single-column stack with full width

### Requirement: Verbo+Stack+Métrica Content Formula

Each project card MUST display three content rows: a verb phrase, a technology stack list, and a metric value.

- **GIVEN** a project card exists
- **WHEN** the card renders
- **THEN** it contains:
  - **Verbo**: a short verb phrase (e.g., "Built a real-time lending engine") in Geist display, weight 500
  - **Stack**: technology names in JetBrains Mono, uppercase, color `#666666`
  - **Métrica**: a prominent numeric metric (e.g., "2.1s → 0.4s") in electric green `#CCFF00`, Geist display weight 700

### Requirement: Fixed Project Content

The 4 projects MUST be: reto-libreria, valaquiastore, agent-orchestrator, design-tokens. Content sourced from i18n keys.

- **GIVEN** the user views the work section in EN locale
- **WHEN** English project data is rendered
- **THEN** all three fields (Verbo, Stack, Métrica) display EN content from i18n

- **GIVEN** the user switches to ES locale
- **WHEN** Spanish project data is rendered
- **THEN** Verbo content switches to ES; Stack and Métrica remain locale-invariant

### Requirement: Card Visual Style

Cards MUST follow the tactile-brutalist token system: `#0A0A0A` background, `1px solid #222` border, `0px` radius.

- **GIVEN** a project card renders
- **WHEN** inspected
- **THEN** background is `#0A0A0A`, border is `1px solid #222222`, border-radius is `0px`

## Acceptance Criteria

- [ ] Exactly 4 project cards in bento grid layout (≥1 spanning multiple cells)
- [ ] Each card shows Verbo, Stack, Métrica rows with correct typography
- [ ] All 4 projects (reto-libreria, valaquiastore, agent-orchestrator, design-tokens) present
- [ ] Locale switch updates Verbo text; Stack/Métrica stay the same
- [ ] Cards use `#0A0A0A` bg, `1px #222` border, `0px` radius
- [ ] Mobile collapses to single-column stack

## Out of Scope

- Hover color transitions or animations beyond border color
- Project detail pages or modals
- Image thumbnails or screenshots
- Filtering or sorting
