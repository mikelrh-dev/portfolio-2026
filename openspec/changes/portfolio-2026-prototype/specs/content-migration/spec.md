# Content Migration Specification

## Purpose

Copy existing project markdown content and images from the `Portfolio-Mikel/` portfolio into the prototype's `public/images/` directory and Astro content collection. Two real projects (Reto Librería, ValaquiaStore) bring authentic content; two placeholders use the Verbo+Tech+Impacto formula.

## Requirements

### Requirement: Image Migration

The migration MUST copy 6 image files (`project01.jpg` through `project06.png`) from the existing portfolio into the prototype's `public/images/` directory.

#### Scenario: All six images copied
- GIVEN the migration step executes
- WHEN images are copied from `Portfolio-Mikel/assets/images/`
- THEN `project01.jpg` through `project06.png` MUST exist in `portfolio-2026/public/images/`
- AND each file MUST be a verbatim copy — same resolution, format, and file size
- AND the source files in `Portfolio-Mikel/` MUST remain unmodified

#### Scenario: Missing source image
- GIVEN a source image file is missing from `Portfolio-Mikel/`
- WHEN the migration step attempts to copy it
- THEN the migration MUST log a warning and continue
- AND a placeholder image MUST be created in `public/images/` for the missing file

### Requirement: Real Project Content

The two real projects (Reto Librería, ValaquiaStore) MUST use their authentic content from the migrated project markdown files.

#### Scenario: Real project card content
- GIVEN Reto Librería is the first project
- WHEN the project data is compiled
- THEN its title, description, and tech tags MUST match the migrated content from the existing portfolio
- AND the same MUST apply to ValaquiaStore

### Requirement: Placeholder Project Formula

The two placeholder projects MUST use the Verbo+Tech+Impacto formula for their descriptions.

#### Scenario: Book&Bugs placeholder
- GIVEN Book&Bugs is a placeholder project
- WHEN its description is authored
- THEN it MUST follow: `{action verb} {tech stack} {measurable impact}`
- Example: "Built a cross-platform reading tracker with React Native + WebSockets — syncing 40% faster than native SQLite"

#### Scenario: EcoDrive AD placeholder
- GIVEN EcoDrive AD is a placeholder project
- WHEN its description is authored
- THEN it MUST follow the same Verbo+Tech+Impacto formula
- Example: "Engineered an ad-serving pipeline with Go + Redis handling 2M+ requests/day at <50ms p99 latency"

### Requirement: Project Markdown Migration

The project content (descriptions, tech tags, metadata) MUST be migrated for the two real projects and authored inline for the two placeholders.

#### Scenario: Project data compilation
- GIVEN the migration step runs
- WHEN compiling project metadata
- THEN the two real projects MUST have their data extracted from migrated reference content
- AND the two placeholders MUST have data written following the Verbo+Tech+Impacto formula
- AND all four projects MUST be assembled into a structured data source (JSON or content collection)

### Requirement: Image References

All project cards MUST reference images using relative paths from `public/`.

#### Scenario: Relative path references
- GIVEN a project card renders
- WHEN the image `src` attribute is inspected
- THEN it MUST use a relative path from `public/` (e.g., `/images/project01.jpg`)
- AND it MUST NOT use absolute filesystem paths or paths referencing `Portfolio-Mikel/`

### Requirement: Read-Only Source Constraint

The migration MUST read from `Portfolio-Mikel/` without modifying any files.

#### Scenario: Source files untouched
- GIVEN the migration step completes
- WHEN all files in `Portfolio-Mikel/` are checked
- THEN no files SHALL have been created, modified, or deleted
- AND no git operations SHALL have been executed

### Requirement: Hard Constraints

#### Scenario: No git operations
- GIVEN the migration step executes
- WHEN any file operation occurs
- THEN NO `git init`, `git add`, `git commit`, `git push`, or `git restore` SHALL be called
- AND the prototype directory MUST be fully discardable

## Acceptance Criteria

- [ ] `project01.jpg`–`project06.png` exist in `public/images/`, unmodified copies
- [ ] Reto Librería and ValaquiaStore use authentic content
- [ ] Book&Bugs and EcoDrive AD use Verbo+Tech+Impacto formula
- [ ] All image paths are relative (`/images/project*.jpg`)
- [ ] `Portfolio-Mikel/` has zero modifications
- [ ] No git commands executed during migration
- [ ] Missing source images gracefully handled with warning + placeholder

## Out of Scope

- Image optimization or resizing
- Video content migration
- Blog or article content migration
- CMS import/export
- Content validation beyond file existence
- Thumbnail generation
