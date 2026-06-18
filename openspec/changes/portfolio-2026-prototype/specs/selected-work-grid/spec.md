# Selected Work Grid Specification

## Purpose

Display 4 projects in a responsive bento grid that proves the portfolio formula. Two real projects (Reto Librería, ValaquiaStore) anchor credibility; two placeholders (Book&Bugs, EcoDrive AD) use the Verbo+Tech+Impacto formula for copy. Each card references cover imagery from `public/images/`.

## Requirements

### Requirement: Project Card Count and Identity

The grid MUST render exactly 4 project cards covering the defined set.

#### Scenario: Four cards render
- GIVEN the selected-work section mounts
- WHEN the project data is loaded
- THEN exactly 4 cards MUST render
- AND the cards MUST be: Reto Librería, ValaquiaStore, Book&Bugs, EcoDrive AD

### Requirement: Card Content Structure

Each card MUST display a cover image, project title, technology tags, and a short description.

#### Scenario: Card content completeness
- GIVEN a project card renders
- WHEN the user views the card
- THEN it MUST show a cover image sourced from `public/images/project*.jpg` or `project*.png`
- AND the project title MUST render in Newsreader
- AND technology tags MUST render in JetBrains Mono with oxblood borders
- AND a short description MUST render in Inter

### Requirement: Placeholder Project Copy

The two placeholder projects MUST use the Verbo+Tech+Impacto formula for their descriptions.

#### Scenario: Placeholder copy formula
- GIVEN a placeholder project card (Book&Bugs or EcoDrive AD)
- WHEN the description renders
- THEN it MUST follow `{verb} {tech-stack} {impact-statement}` pattern
- Example: "Built a cross-platform reader sync with React Native + WebSockets — 40% faster load times"
- AND the real projects MUST use their authentic descriptions from the migrated content

### Requirement: Responsive Bento Layout

The grid MUST adapt from single-column mobile to the bento layout on desktop.

#### Scenario: Desktop bento layout (≥1024px)
- GIVEN a viewport width ≥1024px
- WHEN the section renders
- THEN the first project card MUST occupy a larger cell (2×1 or 2×2 grid area)
- AND the remaining 3 cards MUST fill the secondary positions
- AND the layout MUST use CSS Grid with explicit `grid-template-areas`

#### Scenario: Mobile layout (<768px)
- GIVEN a viewport width <768px
- WHEN the section renders
- THEN all 4 cards MUST stack in a single column at full width

### Requirement: Card Borders and Corners

Each card MUST use Corporate Goth styling: 1px oxblood border, 0–4px border radius, dark background.

#### Scenario: Card visual styling
- GIVEN any project card renders
- WHEN inspected
- THEN it MUST have a `#7A1F1F` 1px solid border
- AND `border-radius` MUST be between 0 and 4px
- AND the card background MUST be `#0A0A0A` or `#111111`

### Requirement: Keyboard Navigation

All cards MUST be reachable and operable via keyboard.

#### Scenario: Keyboard focus
- GIVEN the user navigates with Tab
- WHEN focus reaches a project card
- THEN the card MUST show a visible focus indicator (oxblood outline or ring)
- AND the card MUST be clickable via Enter or Space

### Requirement: Hard Constraints

The spec MUST enforce the discardable-prototype constraint.

#### Scenario: No git or Portfolio-Mikel dependency
- GIVEN prototype development
- WHEN rendering project cards
- THEN NO git operations SHALL be performed
- AND NO reads from `Portfolio-Mikel/` SHALL occur at runtime
- AND content MUST be sourced from `public/images/` and Astro content collection

## Acceptance Criteria

- [ ] Exactly 4 cards: Reto Librería, ValaquiaStore, Book&Bugs, EcoDrive AD
- [ ] Each card has image, title, tags, description
- [ ] Placeholder descriptions use Verbo+Tech+Impacto formula
- [ ] Bento layout on desktop (featured card + 3 secondary)
- [ ] Single column on mobile
- [ ] 1px oxblood borders, 0–4px radius
- [ ] All cards keyboard-accessible with visible focus
- [ ] Images load from `public/images/` relative paths

## Out of Scope

- Hover animation effects (handled by motion design)
- Click-through to live project pages
- Image optimization beyond the migrated source files
- Project CMS or admin interface
