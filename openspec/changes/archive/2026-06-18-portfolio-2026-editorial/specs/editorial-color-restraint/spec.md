# Editorial Color Restraint — Specification

## Purpose

Define strict rules for `#CCFF00` usage: limited to impact numbers, CSS hover states, and one decorative accent per section. No large color blocks, no green body text, no green section indicators.

## Requirements

### Requirement: Allowed Uses

The system MUST restrict `#CCFF00` to: (1) impact numbers/metrics, (2) CSS hover states, (3) exactly one decorative accent per section.

- **GIVEN** a section displays impact numbers (e.g. "1 SYSTEM · 4 MODULES")
- **WHEN** the metric text renders
- **THEN** it MAY use `color: #CCFF00`

- **GIVEN** any interactive element is hovered
- **WHEN** the CSS hover state applies
- **THEN** it MAY use `#CCFF00` as text color or underline

- **GIVEN** any section is fully rendered
- **WHEN** counting distinct `color: #CCFF00` elements
- **THEN** count MUST be ≤ 3 per section, with at most 1 decorative (non-interactive, non-metric) accent

### Requirement: Forbidden Uses

The system MUST NOT use `#CCFF00` for large backgrounds, body text, or section indicators.

- **GIVEN** any section renders
- **WHEN** inspecting backgrounds
- **THEN** NO element MAY have `background-color: #CCFF00` on area > 100px²

- **GIVEN** body or paragraph text renders
- **WHEN** inspecting `color`
- **THEN** body text MUST NOT be `#CCFF00`

- **GIVEN** a section indicator renders
- **WHEN** inspecting its `color`
- **THEN** it MUST be `#666666`, NOT `#CCFF00`

### Requirement: Selection Color

The `::selection` background MAY use `#CCFF00`.

- **GIVEN** the user selects text
- **WHEN** `::selection` styles apply
- **THEN** the highlight background MAY be `#CCFF00`

### Requirement: Token Integrity

`--color-accent` MUST remain `#CCFF00`.

- **GIVEN** CSS `:root` is inspected
- **THEN** `--color-accent` MUST equal `#CCFF00`

### Requirement: Code Review Gate

A code review MUST confirm ≤ 3 green elements per section.

- **GIVEN** every section is rendered
- **WHEN** counting `color` or `background-color` values of `#CCFF00` per section
- **THEN** each SHALL have ≤ 3 green elements

## Non-goals

- Changing `--color-accent` token value
- Removing green from impact numbers
- Color restraint on images or embedded media
- Green in non-visual contexts (code comments)

## Acceptance Criteria

- [ ] Green limited to: impact numbers, hover states, 1 accent/section
- [ ] No green backgrounds > 100px²
- [ ] No green body text, no green indicators
- [ ] `--color-accent` stays `#CCFF00`
- [ ] ≤ 3 green elements per section (code review)
