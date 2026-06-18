# Magnetic Cursor & CTA — Specification

## Purpose

Provide two tactile feedback systems on bracket-format CTAs: magnetic cursor attraction using spring physics, and Web Audio API click sounds on hover. Both systems SHALL be WIRED to live `.magnetic` elements and degrade silently when no targets exist.

## Requirements

### Requirement: Magnetic Cursor Attraction

Elements with CSS class `magnetic` MUST attract toward the cursor position using spring physics (stiffness ≈ 300, damping ≈ 20).

- GIVEN a `.magnetic` element exists in the DOM (CTA buttons)
- WHEN the cursor enters the element's bounding box
- THEN the element displaces toward the cursor position with spring physics, pulling toward its center

- GIVEN the cursor leaves the `.magnetic` element
- WHEN the hover ends
- THEN the element returns to its rest position with spring animation — no snap

- GIVEN a page contains zero `.magnetic` elements
- WHEN the engine initializes
- THEN it MUST NOT throw errors — degrades silently

### Requirement: Web Audio Hover Click

A Web Audio `AudioContext` MUST be deferred to the first user gesture and reused to fire a short oscillator burst on `.magnetic` hover.

- GIVEN the page has loaded
- WHEN the user performs their first click, touch, or keydown
- THEN an `AudioContext` is created (NOT before — strictly deferred)

- GIVEN an `AudioContext` exists
- WHEN the user hovers any `.magnetic` element
- THEN a short oscillator burst fires (800Hz–1200Hz sine, 30–50ms, gain envelope 0–0.1–0) via the existing `AudioContext`

- GIVEN the user's browser blocks autoplay or `AudioContext`
- WHEN hover triggers a sound
- THEN the engine catches the error silently — no console noise, no broken interaction

### Requirement: Wired by Default

The engine MUST initialize on page load without manual setup. No extra imports or provider wrappers beyond mounting the component.

- GIVEN the page finishes loading
- WHEN the user hovers a `.magnetic` element
- THEN both magnetic attraction AND Web Audio click fire without additional initialization

- GIVEN the microinteractions engine mounts
- WHEN it detects zero `.magnetic` elements in the DOM
- THEN it MAY self-unmount or idle — no console warnings, no event listeners on `document`

### Requirement: Bracket CTA Specificity

While the engine targets any `.magnetic` element, the primary intended targets are bracket-format CTAs (`[ VER_TRABAJO → ]` and `[ EMAIL → ]`).

- GIVEN a bracket CTA in the hero section
- WHEN the page renders
- THEN the CTA includes the `magnetic` CSS class matching this engine's selector

## Acceptance Criteria

- [ ] `.magnetic` elements attract with spring physics on hover
- [ ] Element returns to rest smoothly on hover end
- [ ] `AudioContext` deferred to first user gesture (never auto-created)
- [ ] Oscillator click fires on `.magnetic` hover after gesture
- [ ] Silent error handling when Web Audio unavailable
- [ ] Zero `.magnetic` elements → no errors
- [ ] Bracket CTAs include `magnetic` class

## Out of Scope

- Custom cursor replacement or hide-default-cursor behavior (Phase 2)
- Haptic feedback on mobile (vibration API)
- Sound variation per element type
- Volume control or user preferences UI
