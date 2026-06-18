# 3D Icosahedron Specification

## Purpose

Provide a lightweight, interactive 3D centerpiece using R3F and Drei — a PBR icosahedron with slow auto-rotation and mouse-reactive tilt. Rendered as a `client:only="react"` island in Astro, with full `prefers-reduced-motion` compliance.

## Requirements

### Requirement: Client-Only Rendering

The icosahedron MUST render exclusively as a client-side React island with no server-side rendering.

#### Scenario: SSR exclusion
- GIVEN the Astro page renders on the server
- WHEN the 3D component is encountered
- THEN it MUST use `client:only="react"` directive
- AND no 3D markup SHALL appear in the server-rendered HTML
- AND the component MAY render a static placeholder or skeleton during load

### Requirement: PBR Material Properties

The icosahedron geometry MUST use a PBR material with exact metalness, roughness, and color.

#### Scenario: Material parameters applied
- GIVEN the 3D scene initializes
- WHEN the icosahedron mesh is created
- THEN `meshStandardMaterial` MUST be used
- AND `metalness` MUST be 0.85
- AND `roughness` MUST be 0.25
- AND `color` MUST be `#1A1A1A`
- AND the material MUST still be visible against `#0A0A0A` background (ensure adequate lighting)

### Requirement: Ambient and Directional Lighting

The scene MUST include appropriate lighting to make the dark PBR material readable.

#### Scenario: Scene lighting
- GIVEN the 3D scene initializes
- WHEN the scene renders
- THEN an ambient light with sufficient intensity MUST be present
- AND at least one directional or point light MUST illuminate the icosahedron from an angle
- AND the lighting MUST reveal the metallic/shadow details of the `#1A1A1A` surface

### Requirement: Auto-Rotation

The icosahedron MUST auto-rotate slowly around the Y-axis.

#### Scenario: Continuous Y-axis rotation
- GIVEN the 3D scene is active
- WHEN the user has not interacted
- THEN the icosahedron MUST rotate around the Y-axis at a slow pace (~0.005–0.01 rad/frame)
- AND the rotation MUST be smooth and continuous

### Requirement: Mouse-Reactive Tilt

The icosahedron MUST tilt in response to mouse movement within the viewport.

#### Scenario: Mouse-driven tilt
- GIVEN the mouse moves within the viewport
- WHEN the cursor position changes
- THEN the icosahedron MUST tilt its X and Z rotation proportionally to mouse position
- AND the tilt MUST be subtle (max ±0.3 rad) to avoid disorientation
- AND the tilt SHOULD feel natural with some easing or lerp

### Requirement: prefers-reduced-motion Compliance

When the user prefers reduced motion, both auto-rotation AND mouse-reactive tilt MUST be disabled.

#### Scenario: All motion disabled
- GIVEN `prefers-reduced-motion: reduce` is active
- WHEN the 3D scene initializes
- THEN auto-rotation MUST NOT start
- AND mouse-reactive tilt MUST be disabled
- AND the icosahedron MUST render as a static mesh

### Requirement: Lazy Loading

The 3D component SHOULD use dynamic import to defer bundle loading until interaction or idle.

#### Scenario: Dynamic import
- GIVEN the page loads
- WHEN the R3F bundle is not yet loaded
- THEN the 3D component area SHOULD show a static placeholder (empty div or low-res fallback)
- AND the R3F dependencies SHOULD load via dynamic `import()` or Astro's client load strategy
- AND the bundle MUST NOT block initial page render

### Requirement: Development OrbitControls

The component SHOULD include Drei's `OrbitControls` during development for debugging, disabled in production.

#### Scenario: OrbitControls conditional
- GIVEN `import.meta.env.DEV` is true
- WHEN the 3D scene renders
- THEN `OrbitControls` from `@react-three/drei` SHOULD be active for debugging
- GIVEN `import.meta.env.PROD` is true
- WHEN the 3D scene renders
- THEN `OrbitControls` MUST NOT be present

### Requirement: Hard Constraints

#### Scenario: No git or Portfolio-Mikel dependency
- GIVEN prototype development
- WHEN the 3D component runs
- THEN NO git operations SHALL be performed
- AND NO files from `Portfolio-Mikel/` SHALL be read

## Acceptance Criteria

- [ ] Icosahedron renders as `client:only="react"` island
- [ ] PBR material: metalness 0.85, roughness 0.25, color #1A1A1A
- [ ] Lighting makes dark material readable against #0A0A0A
- [ ] Slow Y-axis auto-rotation active by default
- [ ] Mouse tilt reactive and subtle (≤ ±0.3 rad)
- [ ] `prefers-reduced-motion`: rotation AND tilt disabled, static mesh
- [ ] Lazy-loaded via dynamic import (SHOULD)
- [ ] OrbitControls in dev only (SHOULD)
- [ ] No bundle content visible in SSR HTML

## Out of Scope

- Additional geometries or 3D models
- Post-processing effects (bloom, DOF)
- Scroll-driven 3D interaction
- Touch/mobile gesture handling beyond basic mouse simulation
- Texture maps or normal maps (solid color PBR only)
