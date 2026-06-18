# Background Grid Parallax Specification

## Purpose

Add a subtle 1px grid overlay on the page background using a CSS `::after` pseudo-element with a parallax scroll effect at 0.1× scroll speed.

## Requirements

### Requirement: Grid Overlay Rendering

The system MUST render a 1px solid `#1A1A1A` grid overlay with 80px spacing as a `body::after` pseudo-element covering the full viewport.

#### Scenario: Grid is visible
- GIVEN the application has loaded
- THEN a 1px `#1A1A1A` grid at 80px intervals MUST be visible as an overlay on the page background
- AND the grid MUST be rendered via a `::after` pseudo-element

### Requirement: Parallax Scroll

The system MUST move the grid background at 0.1× the page scroll speed, creating a subtle parallax depth effect.

#### Scenario: Grid moves slower than content
- GIVEN the page is scrolled
- WHEN scrolling down
- THEN the grid overlay MUST move at 0.1× the scroll speed relative to the content

### Requirement: GPU Acceleration

The system SHOULD use `will-change: transform` or equivalent hint on the grid element to promote rendering to the GPU.

### Requirement: Reduced Motion

The system MUST disable the parallax movement while keeping the grid visually present when `prefers-reduced-motion: reduce` is active.

#### Scenario: Reduced motion freezes parallax
- GIVEN `prefers-reduced-motion: reduce` is enabled
- WHEN the page is scrolled
- THEN the grid overlay MUST remain static (no parallax movement)
- BUT the grid MUST still be visible

## Acceptance Criteria

- 1px `#1A1A1A`, 80px-spaced grid visible as page overlay via `::after`
- Grid parallax scrolls at 0.1× content scroll speed
- Parallax disabled under `prefers-reduced-motion`, grid remains visible

## Out of Scope

- Multiple grid layers or grid color variants
- Grid visibility toggle or settings
- Animated grid (pulsing, moving without scroll)
