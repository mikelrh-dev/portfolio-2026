# Boot Sequence Specification

## Purpose

Display a terminal-style boot sequence of 6 sequential `[ SYS::INIT ]` lines on page load before revealing the main content, reinforcing the cyber-hacker system startup metaphor.

## Requirements

### Requirement: Sequential Line Reveal

The system MUST display exactly 6 lines of boot sequence text, each revealed sequentially with an 80ms interval between lines (total ~800ms duration).

#### Scenario: Full sequence plays on cold load
- GIVEN the user navigates to the application
- WHEN the page loads
- THEN 6 `[ SYS::INIT ]` lines MUST appear one by one, each spaced 80ms apart
- AND after all 6 lines are revealed, the sequence MUST complete by fading out

### Requirement: Content Guard

The system MUST prevent the main application content from rendering until the boot sequence completes.

#### Scenario: Main content hidden during boot
- GIVEN the boot sequence is playing
- THEN the main page content MUST NOT be visible behind the boot overlay

#### Scenario: Main content visible after boot
- GIVEN the boot sequence has completed its fade-out
- THEN the main application content MUST be fully visible and interactive

### Requirement: Reduced Motion Skip

The system MUST skip the boot sequence entirely when `prefers-reduced-motion: reduce` is active, rendering the main content immediately.

#### Scenario: Reduced motion skips boot
- GIVEN the user has `prefers-reduced-motion: reduce` enabled
- WHEN the page loads
- THEN the boot sequence MUST NOT play
- AND the main content MUST be visible immediately

## Acceptance Criteria

- 6 boot lines appear sequentially at 80ms intervals on cold page load
- Main content is hidden during boot, visible after fade-out
- Boot sequence is skipped entirely under `prefers-reduced-motion`
- No flicker or layout shift after boot completes

## Out of Scope

- Loading progress or percentage indicators
- Network-dependent loading (photo, data, R3F assets)
- Sound effects or audio cues
