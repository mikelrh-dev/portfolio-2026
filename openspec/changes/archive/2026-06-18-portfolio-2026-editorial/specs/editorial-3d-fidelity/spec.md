# Editorial 3D Fidelity — Specification

## Purpose

Define the conditional upgrade or removal of WireframeCentroide. If kept: Line2 + LineMaterial for proper line width, `@react-three/postprocessing` Bloom on `#CCFF00`, position in right 40% of hero. If removed: delete component and archive its spec.

## Requirements

### Requirement: Decision Gate

The apply phase MUST decide keep vs. remove based on bundle budget. If `@react-three/postprocessing` adds > 50KB or causes render drops, remove.

- **GIVEN** the 3D upgrade prototype loads within bundle budget
- **WHEN** the decision is to keep
- **THEN** all upgrade requirements below SHALL be implemented

- **GIVEN** the 3D upgrade exceeds 50KB additional bundle OR degrades performance
- **WHEN** the decision is to remove
- **THEN** WireframeCentroide.tsx SHALL be deleted and its spec archived

### Requirement: Line2 + LineMaterial (conditional)

IF 3D is kept, replace `LineSegments` + `lineBasicMaterial` with `Line2` + `LineMaterial` from `three/examples/jsm/lines/`.

- **GIVEN** the upgraded centroide renders
- **WHEN** inspecting line geometry
- **THEN** `LineMaterial.resolution` MUST be set and `lineWidth` MUST be > 1

### Requirement: Bloom Post-Processing (conditional)

IF 3D is kept, use `@react-three/postprocessing` with `EffectComposer` + `Bloom` so the `#CCFF00` component emits glow.

- **GIVEN** post-processing is configured
- **WHEN** the scene renders
- **THEN** the `#CCFF00` component MUST have visible bloom glow; white components MUST NOT bloom

### Requirement: Size and Position (conditional)

IF 3D is kept, the canvas MUST be constrained to the right 40% of the hero.

- **GIVEN** the hero renders with 3D
- **WHEN** the canvas element is inspected
- **THEN** its dimensions MUST fit within the right 40% of the hero viewport

### Requirement: Reduced Motion (conditional)

IF 3D is kept, the canvas MUST hide when `prefers-reduced-motion: reduce` is active.

- **GIVEN** `prefers-reduced-motion: reduce` is enabled
- **WHEN** the page renders
- **THEN** the 3D canvas MUST NOT be visible (CSS `display: none` or conditional render)

### Requirement: New Dependencies (conditional)

IF 3D is kept, `@react-three/postprocessing` MUST be in `package.json`. `three` is already installed.

- **GIVEN** 3D is kept
- **WHEN** inspecting `package.json`
- **THEN** `@react-three/postprocessing` MUST be listed in `dependencies`

## Non-goals

- Maintaining old LineSegments implementation
- OrbitControls or 3D user interaction
- Touch equivalents for mouse inertia

## Acceptance Criteria

- [ ] Decision recorded: keep or remove
- [ ] If kept: Line2 + LineMaterial, Bloom on green, right 40% slot
- [ ] If kept: hidden under `prefers-reduced-motion: reduce`
- [ ] If kept: `@react-three/postprocessing` in dependencies
- [ ] If removed: no dead code or dangling imports
