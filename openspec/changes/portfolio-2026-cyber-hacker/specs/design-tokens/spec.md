# Design Tokens — Specification

## Purpose

Define the CSS custom properties and utility classes that implement the Cyber-Tech Hacker aesthetic consistently across all four sections: absolute black background, mono-only typography, electric green accent discipline, strict border/radius constraints, and the film grain overlay.

## Requirements

### Requirement: Color Palette Tokens

The design system MUST expose CSS custom properties for the cyber palette.

- GIVEN the application loads
- WHEN inspecting `:root` or the `<html>` element
- THEN the following CSS custom properties MUST be defined:

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-bg` | `#000000` | Page background |
| `--color-container` | `#0A0A0A` | Section/card containers |
| `--color-border` | `#222222` | All borders |
| `--color-accent` | `#CCFF00` | Electric green highlights |
| `--color-text-primary` | `#FFFFFF` | Headlines, primary text |
| `--color-text-secondary` | `#CCCCCC` | Body text |
| `--color-text-muted` | `#666666` | Labels, indicators, footer |

- GIVEN any section uses `--color-accent`
- WHEN counting accent-colored elements per section
- THEN each section MUST contain ≤ 3 accent elements

### Requirement: Typography Tokens

All text rendering MUST use JetBrains Mono exclusively — no serif, no sans-serif fallback.

- GIVEN the application renders any text element
- WHEN inspecting computed `font-family`
- THEN the value MUST contain `"JetBrains Mono"` as the primary face

- GIVEN the `:root` styles are loaded
- THEN these typography tokens MUST be defined:

| Variable | Value |
|----------|-------|
| `--font-mono` | `"JetBrains Mono", monospace` |
| `--font-weight-display` | `700` |
| `--font-weight-body` | `400` |
| `--font-size-display` | `128px` |
| `--font-size-email` | `56px` |
| `--font-size-body` | `14px` |
| `--font-size-small` | `12px` |
| `--line-height-display` | `1.0` |
| `--line-height-body` | `1.6` |

### Requirement: Border & Radius Tokens

Borders and radii MUST follow strict constraints: no shadows, no glow, no gradients.

- GIVEN the `:root` styles are loaded
- THEN these tokens MUST be defined:

| Variable | Value |
|----------|-------|
| `--border-width` | `1px` |
| `--border-color` | `var(--color-border)` |
| `--border-style` | `solid` |
| `--radius-sm` | `0px` |
| `--radius-md` | `4px` |

- GIVEN any container or card renders
- WHEN inspecting `box-shadow`
- THEN the value MUST be `none`

### Requirement: Section Indicator Utility

The design system MUST provide a utility class for the `XX/YY — SECTION` indicator format.

- GIVEN an element with class `section-indicator` renders
- THEN it MUST display text matching `/^\d{2}\/\d{2} — [A-Z ]+$/` using `--font-mono`, `--font-weight-body`, `--font-size-small`, `--color-text-muted`, with `1px solid #222` top border

### Requirement: Film Grain Overlay

A film grain texture MUST be applied as a global overlay using an SVG noise data-URI as `background-image`.

- GIVEN the application loads
- WHEN inspecting the `<body>` or a top-level overlay element
- THEN a `background-image` using an SVG noise filter data-URI is present, with `opacity: 0.03–0.05`, `pointer-events: none`, fixed position covering the full viewport

- GIVEN the film grain overlay is active
- WHEN the user interacts with any CTA or link
- THEN the overlay MUST NOT block clicks or text selection

## Acceptance Criteria

- [ ] All color tokens defined on `:root` with correct hex values
- [ ] JetBrains Mono as the sole `font-family` across all elements
- [ ] `box-shadow: none` on all containers
- [ ] `section-indicator` class renders mono `XX/YY — SECTION` format
- [ ] Film grain SVG data-URI overlay visible at low opacity
- [ ] ≤ 3 electric green accents per section

## Out of Scope

- Dark/light mode toggle (this is dark-only)
- CSS `@layer` or `@scope` organization
- Design token export for design tools (Figma)
- Animation keyframes as tokens (handled by animation specs)
