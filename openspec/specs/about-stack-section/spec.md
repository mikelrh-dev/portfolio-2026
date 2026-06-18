# Delta for about-stack-section

## ADDED Requirements

### Requirement: Typography Audit

The about section MUST use mono (JetBrains Mono) for all chrome, indicator, and stack items — and sans (Geist Sans) for all body text. No mixing within a content class.

- **GIVEN** the about section is fully rendered
- **WHEN** inspecting all text elements
- **THEN** stack tags, section indicators, and chrome labels MUST use JetBrains Mono; bio paragraphs MUST use Geist Sans

## MODIFIED Requirements

### Requirement: Bio Content

The section MUST render a short bio paragraph from i18n in Geist Sans 400–500 at 14–16px.

(Previously: no explicit font-size requirement for body text)

- **GIVEN** the about section renders in EN locale
- **WHEN** the bio text displays
- **THEN** it shows EN i18n content in Geist Sans 400–500, size 14–16px, color `#CCCCCC`

- **GIVEN** the user switches to ES locale
- **WHEN** the bio re-renders
- **THEN** it shows ES i18n content without page refresh

## REMOVED Requirements

### Requirement: Section Visual Style — Photo Hover Filter

(Reason: The sepia/hue-rotate hover filter on the profile photo is removed per editorial-kill-list. Photo remains grayscale static per editorial-photo-treatment.)

(Migration: Remove the hover CSS rule for the profile photo in AboutStack.tsx. The grayscale filter stays.)

## No Changes To

- **Categorized Stack Tag Grid** — tags remain JetBrains Mono, uppercase, 12–14px, `#666666`. Category labels may keep `#CCFF00` per editorial-color-restraint limits.
- **Section Visual Style** — `#0A0A0A` card, `1px solid #222` border, `0px` radius unchanged.
