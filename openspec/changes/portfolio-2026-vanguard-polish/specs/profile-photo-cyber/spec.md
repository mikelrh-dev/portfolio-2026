# Profile Photo Cyber Specification

## Purpose

Display the profile photo with a grayscale-to-green-tint hover treatment and an operator label, reinforcing the cyber-hacker aesthetic in the About section.

## Requirements

### Requirement: Grayscale Default

The system MUST render the profile photo in full grayscale (`filter: grayscale(1)`) by default.

#### Scenario: Initial render shows grayscale
- GIVEN the About section is visible
- WHEN the page loads
- THEN the profile photo MUST display in grayscale

### Requirement: Green Tint on Hover

The system MUST transition from grayscale to a green color tint (`#CCFF00`) when the user hovers over the photo.

#### Scenario: Hover triggers green tint
- GIVEN the profile photo is displayed in grayscale
- WHEN the user hovers over the photo
- THEN the photo MUST transition to a green-tinted state

#### Scenario: Hover out returns to grayscale
- GIVEN the photo is in green-tinted hover state
- WHEN the user moves the cursor away
- THEN the photo MUST return to grayscale

### Requirement: Operator Label

The system MUST display an `[ OPERATOR_ID: MIKEL_ROMERO ]` label associated with the profile photo.

#### Scenario: Label is visible
- GIVEN the profile photo is rendered
- THEN an `[ OPERATOR_ID: MIKEL_ROMERO ]` label MUST be visible adjacent to or overlaid on the photo

### Requirement: Reduced Motion Respect

The system MUST skip the grayscale-to-green transition when `prefers-reduced-motion: reduce` is active.

#### Scenario: Reduced motion skips transition
- GIVEN the user has `prefers-reduced-motion: reduce` enabled
- WHEN the user hovers over the photo
- THEN the photo MUST snap to green tint instantly (no transition)

## Acceptance Criteria

- Profile photo loads in grayscale, transitions to green tint on hover, returns on hover-out
- `[ OPERATOR_ID: MIKEL_ROMERO ]` label is visible
- All transitions are disabled under `prefers-reduced-motion`

## Out of Scope

- Image editing, cropping, or optimization of the source photo
- Multiple photos or gallery behavior
- Any photo outside the About section
