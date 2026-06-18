# Kinetic Typography — Specification

## Purpose

Animate mono display headlines using GSAP SplitText and ScrollTrigger for scroll-driven text reveals. Targets the ALL CAPS 128px headlines in hero and section headers.

## Requirements

### Requirement: GSAP SplitText Integration

The kinetic typography engine MUST load GSAP `SplitText` as a scoped plugin and split ALL CAPS mono headlines into staggered characters, words, or lines.

- GIVEN a headline element with class `kinetic-text` is in the DOM
- WHEN `SplitText` is invoked on the element
- THEN the headline is split into individual `<span>` elements per character or word, preserving the original ALL CAPS JetBrains Mono styling

- GIVEN the page loads
- WHEN GSAP registers plugins
- THEN `SplitText` is registered via `gsap.registerPlugin(SplitText)` to ensure production builds include the plugin

### Requirement: ScrollTrigger-Driven Reveal

Each kinetic headline MUST animate from initial hidden state to visible state driven by ScrollTrigger when the section enters the viewport.

- GIVEN a section with a `kinetic-text` headline scrolls into view
- WHEN `ScrollTrigger.create` fires on section enter
- THEN the split characters animate from `opacity: 0; y: 40px` to `opacity: 1; y: 0` with staggered timing (stagger: 0.02–0.05)

- GIVEN the user scrolls past the section
- WHEN the headline exits the viewport
- THEN the headline MAY remain visible (does not reverse on leave) to avoid visual noise

### Requirement: Play-Once Behavior

Kinetic typography animations MUST fire once per page load and not replay on re-entry.

- GIVEN a kinetic headline has already animated
- WHEN the user scrolls back up and re-enters the section
- THEN the animation does NOT replay — the headline stays in its final animated state

### Requirement: No Layout Shift

SplitText MUST operate on fully laid-out text. The engine MUST wait for the font to load before splitting.

- GIVEN the page loads with `@fontsource/jetbrains-mono`
- WHEN `SplitText` initializes
- THEN it MUST execute after `document.fonts.ready` or within a `useLayoutEffect` (React 18) to prevent cumulative layout shift

## Acceptance Criteria

- [ ] GSAP SplitText registered and splitting `.kinetic-text` elements
- [ ] Staggered reveal on ScrollTrigger section enter (opacity + translateY)
- [ ] Play-once behavior — no replay on re-entry
- [ ] No layout shift from SplitText DOM manipulation
- [ ] Animation targets ALL CAPS mono headlines only

## Out of Scope

- Typewriter, scramble, boot, or matrix effects (deferred to Phase 2 user evaluation)
- Per-character color or rotation variation
- Reverse animation on scroll up
- Custom cursor integration
