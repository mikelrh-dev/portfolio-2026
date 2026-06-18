# Editorial Photo Treatment — Specification

## Purpose

Define the profile photo treatment: grayscale default, NO hover filter, 3/4 aspect ratio, card chrome (window dots + filename + format), and OPERATOR_ID caption sourced from i18n.

## Requirements

### Requirement: Grayscale Default

The photo MUST render in full grayscale via CSS `filter: grayscale(1)`.

- **GIVEN** the About section is visible
- **WHEN** the page loads
- **THEN** the profile photo MUST display in grayscale

### Requirement: No Hover Filter

The photo MUST NOT change filter or color on hover.

- **GIVEN** the photo is in grayscale
- **WHEN** the user hovers over it
- **THEN** the photo MUST remain grayscale — no color shift, no sepia, no hue-rotate, no brightness change

### Requirement: Aspect Ratio 3/4

The photo container MUST enforce a 3:4 aspect ratio (width:height).

- **GIVEN** the profile photo is mounted
- **WHEN** inspecting rendered dimensions
- **THEN** aspect ratio MUST be 3:4

### Requirement: Card Chrome

The photo container MUST display three window dots (red, yellow, green) at top-left, plus filename and format label.

- **GIVEN** the photo container renders
- **THEN** three window dots (red, yellow, green) MUST be visible at top-left
- **AND** a filename from i18n `about.photo_filename` MUST be visible
- **AND** a format label from i18n `about.photo_meta` (e.g. `[ JPG ]`) MUST be visible

### Requirement: OPERATOR_ID Caption

The system MUST display the caption from i18n `about.photo_caption`.

- **GIVEN** the photo is rendered
- **THEN** the `[ OPERATOR_ID: MIKEL_ROMERO ]` caption MUST be visible adjacent to or below the photo

- **GIVEN** the user switches locale to ES
- **WHEN** the caption re-renders
- **THEN** it MUST show the Spanish value without page refresh

### Requirement: Lazy Loading

The `<img>` element MUST use `loading="lazy"`.

- **GIVEN** the profile photo `<img>` element
- **WHEN** inspecting its `loading` attribute
- **THEN** it MUST be `"lazy"`

## Non-goals

- Green tint hover effect (removed per kill list)
- Multiple photos or gallery
- Photo animation on entry

## Acceptance Criteria

- [ ] Photo renders grayscale, no hover color change
- [ ] Aspect ratio 3/4
- [ ] Window dots + filename + format label visible
- [ ] OPERATOR_ID caption from i18n, switches on locale change
- [ ] `loading="lazy"` set on `<img>`
