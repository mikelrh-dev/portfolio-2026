# Custom Cursor Mono Specification

## Purpose

Replace the default system cursor with a custom monospaced `[ _ ]` cursor that follows the pointer with inertia and changes to `[ ▶ ]` when hovering interactive elements.

## Requirements

### Requirement: Custom Cursor Rendering

The system MUST render a custom cursor overlay that replaces the default cursor within the application viewport.

#### Scenario: Cursor renders on page load
- GIVEN the application is loaded
- THEN the default system cursor MUST be hidden and the custom `[ _ ]` cursor MUST be visible

### Requirement: Non-blocking Pointer Events

The custom cursor overlay MUST have `pointer-events: none` set so it does not block mouse interactions with underlying elements.

#### Scenario: Clicks pass through cursor
- GIVEN the custom cursor is rendered
- WHEN the user clicks on any element
- THEN the click MUST register on the underlying element, not the cursor overlay

### Requirement: Mouse Position Tracking with Lerp

The system MUST track the mouse position and update the cursor overlay position with a lerp factor of 0.2 for smooth inertial movement.

#### Scenario: Cursor follows pointer with inertia
- GIVEN the custom cursor is active
- WHEN the user moves the mouse
- THEN the cursor MUST follow with a smooth lag (lerp 0.2)

### Requirement: Hover State Change

The system MUST change the cursor display from `[ _ ]` to `[ ▶ ]` when hovering over clickable/interactive elements (links, buttons, cards).

#### Scenario: Cursor changes on interactive elements
- GIVEN the custom cursor shows `[ _ ]`
- WHEN the user hovers over a link, button, or card
- THEN the cursor MUST change to `[ ▶ ]`

#### Scenario: Cursor reverts on exit
- GIVEN the cursor shows `[ ▶ ]` over an interactive element
- WHEN the user moves away from the interactive element
- THEN the cursor MUST revert to `[ _ ]`

### Requirement: Reduced Motion Respect

The system MUST render the cursor at the exact pointer position (no lerp) when `prefers-reduced-motion: reduce` is active.

#### Scenario: Reduced motion disables inertia
- GIVEN `prefers-reduced-motion: reduce` is enabled
- WHEN the user moves the mouse
- THEN the cursor MUST follow at the exact pointer position without inertial lag

## Acceptance Criteria

- Custom `[ _ ]` cursor replaces default, follows mouse with lag
- Changes to `[ ▶ ]` on interactive elements
- Clicks pass through to underlying elements
- Lerp disabled under `prefers-reduced-motion`

## Out of Scope

- Multiple cursor themes or color variants
- Cursor trails or particle effects
- Custom cursor outside the application viewport
