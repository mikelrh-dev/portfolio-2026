# Text Scramble Sections Specification

## Purpose

Add a headline scramble effect to section titles: when a section enters the viewport, its `<h2>` text scrambles for ~300ms before resolving to the final text.

## Requirements

### Requirement: Viewport-Triggered Scramble

The system MUST trigger the scramble effect on each section's `<h2>` element when the section scrolls into the viewport.

#### Scenario: Scramble triggers on scroll into view
- GIVEN a section with an `<h2>` headline
- WHEN the section enters the viewport
- THEN the headline text MUST scramble (characters rapidly change) for ~300ms

### Requirement: Scramble Resolution

After ~300ms of scrambling, the system MUST resolve the text to the correct final headline.

#### Scenario: Text resolves correctly
- GIVEN the scramble effect is active
- AFTER ~300ms
- THEN the headline MUST display the correct final text
- AND the scramble MUST stop

### Requirement: One-Time Scramble

The system SHOULD only trigger the scramble effect once per section (on first viewport entry).

#### Scenario: Scramble does not repeat
- GIVEN the scramble effect has already played for a section
- WHEN the user scrolls away and back to the same section
- THEN the scramble MUST NOT replay

### Requirement: Reduced Motion Skip

The system MUST display the headline text directly (no scramble) when `prefers-reduced-motion: reduce` is active.

#### Scenario: Reduced motion shows text directly
- GIVEN `prefers-reduced-motion: reduce` is enabled
- WHEN a section enters the viewport
- THEN the headline MUST be displayed in its final form immediately

## Acceptance Criteria

- Section `<h2>` headlines scramble for ~300ms on first viewport entry
- Scramble resolves to correct final text
- Scramble does not replay on subsequent scroll passes
- Text displays directly under `prefers-reduced-motion`

## Out of Scope

- Scramble effects on non-headline text
- Multi-word or multi-line scramble behavior
- Color or style changes during scramble
