# About & Stack Section Specification

## Purpose

Render a bio section with professional narrative and a categorized technology inventory. Establishes engineering depth through organized stack display while keeping the human story front and center.

## Requirements

### Requirement: Bio Content

The section MUST render 2–3 bio paragraphs sourced from i18n keys, presenting the developer narrative.

#### Scenario: Bio renders from i18n
- GIVEN the about section mounts
- WHEN the bio content loads from i18n
- THEN 2–3 paragraphs MUST render in sequence
- AND the text MUST use Inter at 1rem with `#F5F5F0` color on `#0A0A0A` background

### Requirement: Categorized Tech Stack

The section MUST display the technology stack grouped by category, with each category sourced from i18n.

#### Scenario: Stack categories render
- GIVEN the about section mounts
- WHEN stack data loads from i18n keys
- THEN a grid of categories MUST render
- AND each category MUST display a heading (e.g., "Languages", "Frontend", "Backend", "Tools")
- AND each category MUST contain individual technology items
- AND technology items MUST use JetBrains Mono with `#7A1F1F` 1px badges

### Requirement: Staggered Entrance Animation

The section SHOULD animate bio paragraphs and stack categories into view with staggered timing, respecting reduced-motion preferences.

#### Scenario: Animation disabled for reduced motion
- GIVEN the user has `prefers-reduced-motion: reduce`
- WHEN the about section scrolls into view
- THEN all elements MUST appear immediately without animation

#### Scenario: Default animated entrance
- GIVEN the user has no motion preference
- WHEN about section scrolls into view
- THEN bio paragraphs SHOULD fade in sequentially (100ms stagger)
- AND stack categories SHOULD fade in after bio with 150ms stagger

### Requirement: Layout

The section SHOULD display bio on the left and stack grid on the right on desktop, stacking vertically on mobile.

#### Scenario: Desktop two-column layout
- GIVEN viewport width ≥768px
- WHEN the section renders
- THEN bio content SHOULD occupy ~40% width on the left
- AND stack grid SHOULD occupy ~60% on the right
- AND both columns MUST be visually separated by a `#7A1F1F` 1px vertical divider

#### Scenario: Mobile single-column layout
- GIVEN viewport width <768px
- WHEN the section renders
- THEN bio content MUST stack above stack grid
- AND both MUST be full width

### Requirement: Hard Constraints

#### Scenario: No git or Portfolio-Mikel dependency
- GIVEN prototype development
- WHEN the about section renders
- THEN NO git operations SHALL be performed
- AND NO reads from `Portfolio-Mikel/` SHALL occur at runtime

## Acceptance Criteria

- [ ] 2–3 bio paragraphs render from i18n in Inter
- [ ] 4+ technology categories render with items in JetBrains Mono
- [ ] Staggered entrance animation plays (disabled on `prefers-reduced-motion`)
- [ ] Two-column layout on desktop, stacked on mobile
- [ ] 1px oxblood vertical divider on desktop
- [ ] All text in bone white on dark background

## Out of Scope

- Image of the person (headshot)
- Downloadable resume link
- Animated skill progress bars or percentage metrics
- Social proof (testimonials, recommendations)
