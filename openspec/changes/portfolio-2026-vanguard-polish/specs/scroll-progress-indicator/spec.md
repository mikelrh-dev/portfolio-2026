# Scroll Progress Indicator Specification

## Purpose

Display a fixed right-side scroll progress bar that fills vertically with electric green (`#CCFF00`) as the user scrolls, accompanied by a live percentage label.

## Requirements

### Requirement: Fixed Position Indicator

The system MUST render a fixed-position scroll progress indicator on the right edge of the viewport.

#### Scenario: Indicator is visible
- GIVEN the page is loaded
- THEN a 2px-wide vertical bar MUST be visible on the right side of the viewport

### Requirement: Bar Height

The indicator bar MUST be 40 viewport-height units (40vh) tall.

#### Scenario: Bar has correct height
- GIVEN the scroll indicator is rendered
- THEN its height MUST be 40vh

### Requirement: Progress Fill

The system MUST fill the indicator bar from bottom to top with `#CCFF00` (electric green) proportional to the user's scroll position through the page.

#### Scenario: Bar fills as user scrolls
- GIVEN the user is at the top of the page
- WHEN the user scrolls down
- THEN the indicator bar MUST fill with green proportionally to scroll progress
- AND at the bottom of the page, the bar MUST be fully filled

#### Scenario: Empty at top, full at bottom
- GIVEN the user is at the top of the page
- THEN the bar MUST show 0% fill
- GIVEN the user scrolls to the very bottom of the page
- THEN the bar MUST show 100% fill

### Requirement: Live Percentage Label

The system MUST display a numeric percentage label next to or within the indicator showing the current scroll progress as a number (0–100%).

#### Scenario: Label updates with scroll
- GIVEN the scroll indicator is visible
- WHEN the user scrolls
- THEN the percentage label MUST update to match the current scroll position

### Requirement: GSAP ScrollTrigger

The system MUST use GSAP's ScrollTrigger to track scroll progress and drive the indicator fill and label updates.

## Acceptance Criteria

- 2px × 40vh fixed bar on the right side
- Green (`#CCFF00`) fill proportional to scroll, 0% at top, 100% at bottom
- Live 0–100% label updates with scroll
- Driven by GSAP ScrollTrigger

## Out of Scope

- Horizontal scroll indicator
- Multiple section-based progress markers
- Click-to-scroll functionality on the indicator
