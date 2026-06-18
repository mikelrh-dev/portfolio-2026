# About & Stack Section — Specification

## Purpose

Render the about section with bio paragraphs in JetBrains Mono 400 and a `[STACK]` panel with 5 technology categories, preceded by a `02/03 — ABOUT` mono indicator. Note: section counter is shared — this is the second of three sections.

## Requirements

### Requirement: Section Counter Alignment

The about section counter MUST align with the `selected-work-grid` indicator: `02/03 — ABOUT`.

**Note**: The section counter `02/03` matches the work grid section. The orchestrator MUST verify all section counters form a sequential chain without gaps. This requirement documents the constraint: section indicators MUST monotonically increment `01/03 → 02/03 → 03/03` across sections in DOM order.

- GIVEN the hero renders `01/03 — HERO` and contact renders `03/03 — CONTACT`
- WHEN the about section renders
- THEN its indicator reads `02/03 — ABOUT`

- GIVEN section indicators are inspected programmatically
- WHEN extracted in DOM order
- THEN they MUST form the sequence `01/03`, `02/03`, `03/03` without gaps or duplicates

### Requirement: Bio Paragraphs

The about section MUST render 2–3 bio text paragraphs in JetBrains Mono 400 at 14–16px.

- GIVEN the about section is visible
- WHEN bio paragraphs are displayed
- THEN they use JetBrains Mono 400, `font-size` 14–16px, `line-height` 1.6–1.8, `color` `#CCCCCC`, `#0A0A0A` container with `1px solid #222` border

### Requirement: Stack Panel

The about section MUST render a `[STACK]` panel listing 5 technology categories, each with inline items in JetBrains Mono 400.

- GIVEN the about section is visible
- WHEN the stack panel renders
- THEN a header reads `[STACK]` in JetBrains Mono 700 ALL CAPS, followed by 5 categories (e.g., Languages, Frameworks, Tools, Design, Infrastructure) with items in JetBrains Mono 400

- GIVEN a stack category contains multiple items
- WHEN rendered
- THEN items are separated by `color: #CCFF00` delimiter dots or pipes, with at most 1 electric green accent per category

### Requirement: Electric Green Accent Limit

The about section MUST use the `#CCFF00` accent on at most 3 elements total (e.g., a stack category label, a delimiter, a highlight word).

- GIVEN the about section is fully rendered
- WHEN counting `color: #CCFF00` elements
- THEN the count MUST be ≤ 3

## Acceptance Criteria

- [ ] `02/03 — ABOUT` indicator visible
- [ ] 2–3 bio paragraphs in JetBrains Mono 400
- [ ] `[STACK]` panel with 5 categories
- [ ] ≤ 3 electric green accents in the section
- [ ] Section counters form sequential chain 01/03 → 02/03 → 03/03

## Out of Scope

- Animated stack entry (Phase 2)
- Filter-by-category interactivity
- External resume/CV links
