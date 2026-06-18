# Hero Section Specification

## Purpose

Render a full-viewport intro section that establishes the Corporate Goth identity — featuring a typed headline, dual CTAs, categorized tech-stack pills, and the 3D icosahedron as the visual centerpiece. Designed for the 5-second recruiter scan.

## Requirements

### Requirement: Viewport Layout

The hero section MUST render as a viewport-height (`100vh`) section with `#0A0A0A` background, bone-white (`#F5F5F0`) text, and oxblood (`#7A1F1F`) accent borders.

#### Scenario: Full viewport render
- GIVEN the page loads in a 1920×1080 viewport
- WHEN the hero section mounts
- THEN it MUST occupy exactly `100vh` height
- AND the background MUST be `#0A0A0A`
- AND the heading MUST use `#F5F5F0` at 4rem+ using Newsreader font

### Requirement: Headline and Subtitle

The section MUST display the full name as the primary headline and a typed subtitle line, both sourced from i18n keys.

#### Scenario: Headline renders from i18n
- GIVEN the default language is English
- WHEN the hero section renders
- THEN the headline MUST display the name from the `hero.headline` i18n key
- AND a subtitle MUST render beneath it from `hero.subtitle`

#### Scenario: prefers-reduced-motion
- GIVEN the user has `prefers-reduced-motion: reduce` set
- WHEN the hero section renders
- THEN the typing animation MUST NOT play
- AND the subtitle MUST render as static text immediately

### Requirement: Call-to-Action Pair

The section MUST render two CTAs: a primary button with oxblood fill and a secondary outline button.

#### Scenario: Both CTAs visible and distinct
- GIVEN the hero section is mounted
- WHEN the user views the section
- THEN a primary "View Work" CTA MUST render with `#7A1F1F` background and `#F5F5F0` text
- AND a secondary "Get in Touch" CTA MUST render with `#7A1F1F` 1px border and transparent background
- AND both CTAs MUST link to the corresponding section or scroll target

### Requirement: 3D Centerpiece Island

The section MUST contain the 3D icosahedron island rendered via a `client:only="react"` import of the `3d-icosahedron` component, positioned as the visual anchor.

#### Scenario: 3D island integrated
- GIVEN the hero section renders
- WHEN the 3D icosahedron component loads
- THEN it MUST be visible within the hero viewport, to the right or centered behind text depending on breakpoint

### Requirement: Tech Stack Pills

The section MUST render categorized tech-stack pills (languages, frameworks, tools) from i18n content below the CTAs.

#### Scenario: Stack pills render from i18n
- GIVEN the hero section is mounted
- WHEN the stack data loads from i18n keys
- THEN individual pill elements MUST render for each technology
- AND each pill MUST use JetBrains Mono at 0.75rem with `#7A1F1F` border

### Requirement: Font Loading

The section MUST apply `font-display: swap` for all custom fonts to prevent invisible text during load.

#### Scenario: Font swap behavior
- GIVEN custom fonts (Newsreader, Inter, JetBrains Mono) are loading
- WHEN the font files have not yet loaded
- THEN the browser MUST render fallback text immediately
- AND swap to the custom font once loaded

### Requirement: Hard Architectural Constraints

The spec MUST enforce the discardable-prototype constraint.

#### Scenario: No git or portfolio modifications
- GIVEN the prototype is under development
- WHEN any operation accesses git or `Portfolio-Mikel/`
- THEN it MUST NOT create, modify, or delete any git repository state
- AND it MUST NOT read or write files under `Portfolio-Mikel/`
- AND the entire `portfolio-2026/` directory MUST be deletable with no side effects

## Acceptance Criteria

- [ ] Hero section is `100vh` with `#0A0A0A` background
- [ ] Name headline renders from i18n in Newsreader
- [ ] Subtitle renders with typing animation (disabled on `prefers-reduced-motion`)
- [ ] Primary CTA with oxblood fill and secondary outline CTA both visible and functional
- [ ] 3D icosahedron visible within viewport
- [ ] Tech-stack pills render with JetBrains Mono and oxblood borders
- [ ] `font-display: swap` applied to all `@font-face` declarations
- [ ] No git commands executed; no files read from `Portfolio-Mikel/`

## Out of Scope

- Responsive behavior beyond hero viewport height (delegated to layout)
- 3D component implementation details (handled by `3d-icosahedron` spec)
- Background particle effects or canvas animations
- SEO meta tags
- Cross-browser testing of animations
