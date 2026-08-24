# Scroll Effects Specification

New domain. Covers audit findings R1-004, R1-005, R1-010, R1-011 (scroll-driven hooks and handlers).

## Purpose

Scroll-driven effects must be stable across renders, resilient to asset failures, and frugal with main-thread work — without changing visible behavior.

## Requirements

### Requirement: Scroll-Spy Observer Stability

The section-ID list used by `useScrollSpy.ts` and `Nav.tsx` MUST have referential stability across renders (module-level constant or memoization), so the IntersectionObserver is constructed once per mount rather than on every render.

**Verification:** unit-testable (vitest) — render/re-render the hook and assert the observer (or its construction side effect) is invoked once; assert the sectionIds reference is identical across renders.

#### Scenario: Re-render without observer churn

- GIVEN the scroll-spy hook is mounted and parent state changes trigger re-renders
- WHEN multiple re-renders occur
- THEN the IntersectionObserver is created once per mount, not once per render

### Requirement: Image Sequence Frame Fallback

In `useImageSequence.ts`, frames that fail to load MUST be dropped from the frame index (skipped, never rendered as null/blank). A load failure SHALL log a warning once, not per frame event.

**Verification:** unit-testable (vitest) — simulate a failing frame URL and assert the sequence advances past it with no blank frame index and a single warning emitted.

#### Scenario: Failed frame skipped

- GIVEN one frame URL in the sequence fails to load
- WHEN the scroll progress maps to that frame's position
- THEN the nearest successfully loaded frame is displayed — no blank mid-sequence flash

#### Scenario: Single warning per failure

- GIVEN a failed frame has already been dropped and warned about
- WHEN subsequent scrolls cross that position repeatedly
- THEN no additional warnings are logged for the same failure

### Requirement: Throttled Grid Offset Updates

The App-level scroll handler writing the `--grid-offset` CSS custom property MUST update at most once per animation frame (rAF-gated or throttled), and the unused `containerRef` MUST be removed.

**Verification:** manual/browser inspection plus code inspection (handler wrapped in rAF gate); compile-level check via `tsc --noEmit`. NOT unit-tested.

#### Scenario: One write per frame

- GIVEN the user scrolls continuously
- WHEN multiple scroll events fire within a single animation frame
- THEN `--grid-offset` is written at most once for that frame

### Requirement: ScrollProgress Redundant Write Skip

The ScrollProgress component MUST run its rAF loop only while the displayed progress value actually changes, and MUST skip `textContent` writes when the value is unchanged.

**Verification:** manual/code inspection (guard on last-written value); compile-level check. NOT unit-tested.

#### Scenario: Static viewport

- GIVEN no scrolling occurs between two animation frames
- WHEN the rAF tick runs
- THEN no DOM textContent write happens because the displayed value is unchanged
