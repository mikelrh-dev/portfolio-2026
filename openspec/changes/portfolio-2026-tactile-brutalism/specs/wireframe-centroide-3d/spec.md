# Wireframe Centroide 3D — Specification

## Purpose

Render a mechanical wireframe assembly as the portfolio's visual centerpiece: a 3D centroide using R3F LineSegments + EdgesGeometry that starts fragmented and extrudes/assembles on scroll, with liquid mouse inertia for tactile feedback.

## Requirements

### Requirement: Scroll-Driven Assembly Animation

The wireframe centroide MUST start in a fragmented state (disconnected line fragments scattered in 3D space) and assemble into a coherent mechanical shape driven by GSAP ScrollTrigger scroll progress (0–1).

- **GIVEN** the page loads at the top
- **WHEN** the user has not scrolled (progress ≈ 0)
- **THEN** the wireframe is fully fragmented — individual line pieces are displaced, rotated, and scattered from their final positions

- **GIVEN** the wireframe is fragmented
- **WHEN** the user scrolls through the hero + work sections (progress from 0 → 1)
- **THEN** each line fragment translates and rotates toward its assembled position, reaching full assembly at progress ≈ 1

- **GIVEN** the scroll position changes rapidly (e.g., scroll wheel flick)
- **WHEN** ScrollTrigger reports progress
- **THEN** assembly animation MUST use `onUpdate` progress values (not scroll events) to avoid R3F/GSAP sync drift

### Requirement: Liquid Mouse Inertia

The assembled wireframe MUST track mouse movement with liquid inertia — smooth, damped follow, not direct 1:1 mapping.

- **GIVEN** the wireframe is visible
- **WHEN** the user moves the mouse across the viewport
- **THEN** the wireframe rotates with smooth spring-damped delay (inertia), returning to rest when the mouse stops

- **GIVEN** the user rapidly moves the mouse then stops
- **WHEN** inertia is applied
- **THEN** the wireframe decelerates naturally and settles at rest position without snapping

### Requirement: Visual Style

The wireframe MUST render as white 1px lines on absolute black background, with no fill, no glow, no post-processing.

- **GIVEN** the R3F canvas is mounted
- **WHEN** the scene renders
- **THEN** all lines are stroke width 1px, white (`#FFFFFF`), with no material fill or emissive effects

### Requirement: Performance & Loading

The R3F canvas MUST be dynamically imported with a suspense fallback to avoid blocking initial paint.

- **GIVEN** the page loads
- **WHEN** `<Canvas>` from `@react-three/fiber` is needed
- **THEN** it MUST be imported via `React.lazy()` or dynamic `import()`, with a `<Suspense>` wrapper showing a minimal skeleton or blank area

- **GIVEN** a device without WebGL support
- **WHEN** R3F canvas fails to initialize
- **THEN** the section SHOULD degrade gracefully (empty canvas or fallback text) without breaking the page

## Acceptance Criteria

- [ ] Wireframe renders as white 1px LineSegments (no fill, no glow) on `#000` background
- [ ] Initial state is fragmented; scroll progress 0→1 drives GSAP timeline to assembled state
- [ ] Mouse tracking uses damped spring inertia, not direct position mapping
- [ ] R3F `<Canvas>` dynamically imported with `<Suspense>` fallback
- [ ] No drift between ScrollTrigger progress and R3F animation state

## Out of Scope

- Textures, materials, lighting, or post-processing effects
- Multiple 3D objects or a full 3D scene beyond the wireframe assembly
- OrbitControls or user 3D interaction beyond mouse tracking
- Mobile touch equivalent for mouse inertia
