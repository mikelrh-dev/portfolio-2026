# Wireframe Centroide 3D — Specification

## Purpose

Render a 10-piece wireframe assembly using R3F EdgesGeometry + LineSegments as the portfolio's visual centerpiece. One component highlighted in electric green `#CCFF00`. Assembly driven by GSAP ScrollTrigger progress. Camera responds to mouse inertia with lerp factor 0.05.

## Requirements

### Requirement: 10-Component Wireframe Assembly

The centroide MUST consist of exactly 10 individual wireframe components, each rendered as an `EdgesGeometry` + `LineSegments` node.

- GIVEN the R3F canvas is mounted
- WHEN the scene graph is inspected
- THEN there are exactly 10 `LineSegments` children, each with a unique `userData.componentId` from `comp-0` to `comp-9`

### Requirement: Single Green Highlight

Exactly one of the 10 components MUST be rendered in `#CCFF00` electric green; the remaining 9 MUST be `#FFFFFF` white.

- GIVEN the scene is rendered
- WHEN inspecting line material colors
- THEN exactly 1 component uses `color: #CCFF00` and 9 use `color: #FFFFFF`

- GIVEN the user scrolls (wireframe assembles)
- WHEN the green component reaches its assembled position
- THEN its `#CCFF00` color remains stable — no color animation, no glow, no pulsing

### Requirement: Scroll-Driven Assembly

The wireframe MUST start in a fragmented state (each component displaced from its final position) and assemble into a coherent shape driven by GSAP ScrollTrigger progress via `onUpdate`.

- GIVEN the page loads at scroll position 0
- WHEN the wireframe is inspected
- THEN each component is displaced and rotated from its final position (fragmented state)

- GIVEN the user scrolls through the hero + work + about viewports (progress 0 → 1)
- WHEN ScrollTrigger `onUpdate` fires
- THEN each component translates and rotates toward its assembled position using GSAP interpolated progress values

- GIVEN the user scrolls rapidly
- WHEN ScrollTrigger reports progress
- THEN assembly animation MUST use `onUpdate` progress values — NOT scroll events — to prevent R3F/GSAP sync drift

### Requirement: Mouse Inertia (lerp 0.05)

The wireframe group MUST respond to mouse movement with inertia using a lerp factor of 0.05 on a `useFrame` loop.

- GIVEN the wireframe is visible
- WHEN the user moves the mouse
- THEN the parent group rotates toward the target rotation with `lerp(current, target, 0.05)` each frame

- GIVEN the mouse stops moving
- WHEN the inertia loop continues
- THEN the group decelerates smoothly and settles at rest without snapping

### Requirement: Vector Labels

The wireframe MUST display mono vector labels near 3 or more components using `Text` from `@react-three/drei` or a sprite-based label approach.

- GIVEN the scene is rendered
- WHEN inspecting for labels
- THEN at least 3 components have associated mono labels (JetBrains Mono) using `fontSize` ≤ 0.3, showing vector identifiers (e.g., `v1`, `v2`)

### Requirement: Dynamic Import

The R3F `<Canvas>` MUST be dynamically imported with `<Suspense>` to avoid blocking initial paint.

- GIVEN the page loads
- WHEN `<Canvas>` is needed
- THEN it is imported via `React.lazy()` or dynamic `import()`, with `<Suspense>` fallback showing a minimal skeleton (absolute black blank area)

## Acceptance Criteria

- [ ] 10 wireframe components (EdgesGeometry + LineSegments)
- [ ] Exactly 1 component in `#CCFF00`, 9 in `#FFFFFF`
- [ ] Scroll progress 0→1 drives fragmented→assembled via GSAP `onUpdate`
- [ ] Mouse inertia uses `lerp(0.05)` on `useFrame`
- [ ] ≥ 3 mono vector labels visible
- [ ] Dynamic import with `<Suspense>` fallback
- [ ] No post-processing, no glow, no orbit controls

## Out of Scope

- Textures, materials, lighting, or post-processing
- OrbitControls or user 3D manipulation
- Mobile touch equivalent for mouse inertia
- Component selection or click interaction
