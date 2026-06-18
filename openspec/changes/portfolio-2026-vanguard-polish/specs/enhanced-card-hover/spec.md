# Enhanced Card Hover Specification

## Purpose

Enhance project card hover effects in the Selected Work section with image zoom (1.05×), index number scale (1.1×), and a sliding green decorative line using Framer Motion.

## Requirements

### Requirement: Image Zoom on Hover

The system MUST scale the project card image to 1.05× on hover using Framer Motion.

#### Scenario: Image zooms on hover
- GIVEN a project card is displayed
- WHEN the user hovers over the card
- THEN the card image MUST scale smoothly to 1.05×
- AND when the user moves the cursor away, the image MUST return to 1× scale

### Requirement: Index Scale on Hover

The system MUST scale the card's index (project number) to 1.1× on hover.

#### Scenario: Index scales on hover
- GIVEN a project card with a visible index number
- WHEN the user hovers over the card
- THEN the index number MUST scale to 1.1×
- AND when the user moves the cursor away, the index MUST return to 1× scale

### Requirement: Sliding Green Decorative Line

The system MUST animate a green (`#CCFF00`) decorative line across the card on hover. The line SHOULD slide in from one side and stop at the center or cross the card.

#### Scenario: Green line slides on hover
- GIVEN a project card
- WHEN the user hovers over the card
- THEN a `#CCFF00` line MUST animate (slide) across the card
- AND when the user hovers away, the line MUST return to its resting position

### Requirement: Simultaneous Animation

All three hover effects (image zoom, index scale, green line) MUST trigger simultaneously on card hover.

#### Scenario: All effects activate together
- GIVEN the user is not hovering over a card
- WHEN the user hovers over a project card
- THEN the image zoom, index scale, AND green line slide MUST all begin simultaneously

### Requirement: Reduced Motion

The system MUST disable hover animations when `prefers-reduced-motion: reduce` is active. Cards MAY show a static visual indicator instead.

#### Scenario: Reduced motion disables hover effects
- GIVEN `prefers-reduced-motion: reduce` is enabled
- WHEN the user hovers over a project card
- THEN no zoom, scale, or line animation MUST play

## Acceptance Criteria

- Image zooms to 1.05× on hover, returns on hover-out
- Index scales to 1.1× on hover, returns on hover-out
- Green line slides across card on hover
- All effects trigger simultaneously via Framer Motion
- No animations under `prefers-reduced-motion`

## Out of Scope

- Card flip, 3D tilt, or parallax on cards
- Sound effects on hover
- Per-card variation in hover behavior
