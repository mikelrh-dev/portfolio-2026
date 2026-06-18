# About / Stack Section — Specification

## Purpose

Display a brief bio paragraph sourced from i18n followed by a categorized grid of technology stack tags using text-only labels in JetBrains Mono.

## Requirements

### Requirement: Bio Content

The section MUST render a short bio paragraph sourced from an i18n key, displayed in Geist Sans body weight 400–500.

- **GIVEN** the about section renders in EN locale
- **WHEN** the bio text displays
- **THEN** it shows content from the EN i18n key in Geist Sans, weight 400–500, color `#CCCCCC`

- **GIVEN** the user switches locale to ES
- **WHEN** the bio re-renders
- **THEN** it shows content from the ES i18n key without page refresh

### Requirement: Categorized Stack Tag Grid

Below the bio, the section MUST display technology tags grouped by category (e.g., Languages, Frontend, Backend, Tooling). Tags are text-only — no icons, no logos.

- **GIVEN** the stack section renders
- **WHEN** tags are displayed
- **THEN** each tag is plain text in JetBrains Mono, uppercase, `font-size` 12–14px, color `#666666`

- **GIVEN** tags belong to a category
- **WHEN** rendered
- **THEN** the category label appears above its group (e.g., "// Languages") in JetBrains Mono, color `#CCFF00` electric green

- **GIVEN** the about section renders
- **WHEN** inspected for images or icons
- **THEN** NO icon, logo, or SVG is present in the stack tag area — tags are pure `<span>` text elements

### Requirement: Section Visual Style

The section MUST follow tactile-brutalist tokens: `#0A0A0A` card background, `1px solid #222` border, `0px` radius.

- **GIVEN** the about/stack section renders
- **WHEN** its container is inspected
- **THEN** background is `#0A0A0A`, border is `1px solid #222222`, border-radius is `0px`

## Acceptance Criteria

- [ ] Bio renders from i18n key in Geist Sans, switches per locale without refresh
- [ ] Stack tags grouped by category with green `#CCFF00` category labels
- [ ] All tags are text-only (`<span>`) — no icons, logos, or images
- [ ] Tags use JetBrains Mono, uppercase, 12–14px
- [ ] Section uses `#0A0A0A` card, `1px #222` border, `0px` radius

## Out of Scope

- Interactive tag filtering or search
- Progress bars or skill percentage indicators
- Downloadable resume/CV link
- Testimonials or client logos
