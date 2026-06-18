# Type Writer Hero Specification

## Purpose

Replace the static hero headline with a character-by-character typewriter reveal effect with a blinking cursor, reinforcing the terminal/coding aesthetic.

## Requirements

### Requirement: Character-by-Character Reveal

The system MUST reveal the hero headline text one character at a time at a rate of ~30ms per character.

#### Scenario: Hero types out char by char
- GIVEN the hero section is visible
- WHEN the boot sequence has completed or doesn't play
- THEN each character of the headline MUST appear sequentially at ~30ms intervals

### Requirement: Blinking Cursor

The system MUST display a blinking terminal-style cursor during the typewriter animation.

#### Scenario: Cursor blinks during typing
- GIVEN the typewriter effect is actively revealing characters
- THEN a blinking cursor MUST be visible after the last revealed character

### Requirement: Cursor Vanishes on Completion

The system MUST remove or stop the blinking cursor once all characters have been revealed.

#### Scenario: Cursor disappears when done
- GIVEN the typewriter effect has revealed all characters
- THEN the blinking cursor MUST vanish or stop blinking

### Requirement: Reduced Motion Skip

The system MUST display the full headline text immediately (no typewriter effect) when `prefers-reduced-motion: reduce` is active.

#### Scenario: Reduced motion shows full text
- GIVEN `prefers-reduced-motion: reduce` is enabled
- WHEN the hero section becomes visible
- THEN the full headline text MUST be displayed immediately
- AND no cursor MUST be shown

## Acceptance Criteria

- Headline types out character-by-character at ~30ms/char
- Blinking cursor appears during typing, vanishes on completion
- Full text shown immediately under `prefers-reduced-motion`
- Cursor never remains visible after animation completes

## Out of Scope

- Multiple headline lines or multi-paragraph typewriter
- Backspace or delete effects
- Typewriter effect on any text outside the hero headline
