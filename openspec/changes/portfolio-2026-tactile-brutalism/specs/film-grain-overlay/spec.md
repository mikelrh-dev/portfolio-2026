# Film Grain Overlay — Specification

## Purpose

Apply a full-viewport SVG noise film grain overlay using an inline SVG data-URI as a CSS `background-image`, composited via GPU with zero JavaScript and zero layout shift.

## Requirements

### Requirement: SVG Noise Data-URI

The film grain MUST be defined as an inline SVG data-URI using SVG `<filter>` with `feTurbulence`, encoded as a CSS custom property or directly in CSS.

- **GIVEN** the page loads
- **WHEN** the CSS is evaluated
- **THEN** a CSS rule exists that sets `background-image` to `url("data:image/svg+xml,...")` containing an SVG with `<filter id="noise"><feTurbulence type="fractalNoise" .../></filter>`

- **GIVEN** the data-URI SVG
- **WHEN** decoded
- **THEN** it MUST be under 1KB (0kb runtime cost — no external asset fetch)

### Requirement: Full-Viewport GPU Overlay

The film grain MUST render across the entire viewport using `::before` or `::after` pseudo-element on the root/body with `pointer-events: none` and `mix-blend-mode` for GPU compositing.

- **GIVEN** the page has loaded
- **WHEN** the DOM is inspected
- **THEN** a pseudo-element on the root element (`<div id="root">::before` or `<body>::before`) applies the noise `background-image` with `position: fixed`, `inset: 0`, `pointer-events: none`, and `mix-blend-mode: overlay` (or `screen`/`multiply`)

- **GIVEN** the film grain overlay renders
- **WHEN** the user scrolls or resizes the viewport
- **THEN** the overlay stays fixed, covering the entire viewport at all times with zero jank

### Requirement: Zero Layout Impact

The film grain overlay MUST NOT affect layout, paint timing beyond compositing, or interactivity.

- **GIVEN** the overlay renders
- **WHEN** layout metrics are measured
- **THEN** it contributes zero to layout (no dimensions, no flow participation) — `position: fixed; inset: 0; pointer-events: none;`

## Acceptance Criteria

- [ ] SVG noise data-URI under 1KB, no external file fetch
- [ ] Applied via CSS pseudo-element (`::before`) on root element
- [ ] `position: fixed`, `inset: 0`, `pointer-events: none`
- [ ] `mix-blend-mode` for GPU compositing
- [ ] Zero layout shift (CLS = 0)
- [ ] No JavaScript runtime cost for overlay creation

## Out of Scope

- Canvas-based or JS-driven noise generation
- Multiple noise layers or animated grain
- User-toggle for grain effect
- Browser-specific workarounds for SVG filter rendering
