# Microinteractions Engine — Specification

## Purpose

Provide two tactile feedback systems: magnetic cursor attraction on `.magnetic` target elements using Framer Motion spring physics, and Web Audio API click sounds on hover — both WIRED to live elements, not dead code.

## Requirements

### Requirement: Magnetic Cursor Attraction

Elements with CSS class `magnetic` MUST attract the cursor toward their center using Framer Motion `useMotionValue` + `motion.div` spring physics when hovered.

- **GIVEN** a `.magnetic` element exists in the DOM (CTA button or email link)
- **WHEN** the cursor enters the element's bounding box
- **THEN** the element displaces toward the cursor position with spring physics (stiffness ≈ 300, damping ≈ 20), pulling the cursor visual toward its center

- **GIVEN** the cursor leaves the `.magnetic` element
- **WHEN** the hover ends
- **THEN** the element returns to its rest position with spring animation, no snap

- **GIVEN** a page contains zero `.magnetic` elements
- **WHEN** the engine initializes
- **THEN** it MUST NOT throw errors — it degrades silently

### Requirement: Web Audio Hover Click

A Web Audio `AudioContext` MUST be created on the first user gesture (click/touch/keydown) and reused to fire a short oscillator burst on `.magnetic` hover.

- **GIVEN** the page has loaded
- **WHEN** the user performs their first click, touch, or keydown
- **THEN** an `AudioContext` is created (deferred — never created before first gesture)

- **GIVEN** an `AudioContext` exists
- **WHEN** the user hovers any `.magnetic` element
- **THEN** a short oscillator burst (e.g., 800Hz sine, 30–50ms duration, gain envelope) fires via the existing `AudioContext`

- **GIVEN** the user's browser blocks autoplay or `AudioContext`
- **WHEN** hover triggers a sound
- **THEN** the engine catches the error silently — no console noise, no broken interaction

### Requirement: Wired by Default

The engine MUST be active on page load. No manual initialization required.

- **GIVEN** the page finishes loading
- **WHEN** the user hovers a `.magnetic` element
- **THEN** both magnetic attraction AND Web Audio click fire without extra setup

## Acceptance Criteria

- [ ] `.magnetic` elements attract cursor with spring physics on hover
- [ ] Element returns to rest smoothly on hover end
- [ ] `AudioContext` deferred to first user gesture (never auto-created)
- [ ] Oscillator click fires on `.magnetic` hover after gesture
- [ ] Silent error handling when Web Audio unavailable
- [ ] Zero `.magnetic` elements → no errors

## Out of Scope

- Custom cursor replacement or hide-default-cursor behavior
- Haptic feedback on mobile (vibration API)
- Sound variation per element type
- Volume control or user preferences UI
