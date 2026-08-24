# Error Handling Specification

New domain. Covers audit findings R1-001 and R1-002 in `src/main.tsx`.

## Purpose

Global error reporting must never leak source internals to production visitors or degrade UX below the original failure. The ErrorBoundary remains the only user-facing error surface in production; diagnostics stay developer-only.

## Requirements

### Requirement: Production Overlay Suppression

The fullscreen stack-trace overlay (`showFatal`) MUST be gated behind `import.meta.env.DEV`. In production builds, global handlers SHALL keep `console.error` reporting but MUST NOT render any overlay; the existing React ErrorBoundary SHALL be the sole user-facing error surface.

**Verification:** unit-testable (vitest) — extract the gate decision (e.g. `shouldShowFatalOverlay(isDev)`) into a pure function; test dev=true renders/creates overlay, dev=false does not. Overlay DOM behavior itself verified manually via build + preview.

#### Scenario: Unhandled error in production

- GIVEN a production build served via preview
- WHEN an unhandled `window.error` or `unhandledrejection` occurs
- THEN no stack-trace overlay appears in the DOM, the error is reported to `console.error`, and the ErrorBoundary UI (if within tree) is the only error surface shown

#### Scenario: Diagnostic overlay in development

- GIVEN a dev server run with `import.meta.env.DEV === true`
- WHEN an unhandled error occurs
- THEN the diagnostic overlay appears with the error details

### Requirement: No Overlay Accumulation

Regardless of mode, repeated global errors MUST NOT accumulate duplicate fullscreen overlays. The diagnostic surface, when shown, is singular (one element reused or replaced).

**Verification:** unit-testable (vitest) — call the handler logic N times, assert exactly one overlay node exists.

#### Scenario: Repeated errors in dev

- GIVEN the dev overlay is active
- WHEN three unhandled errors fire in sequence
- THEN exactly one overlay element exists (content updated, not stacked)

### Requirement: Boot Log Hygiene

Diagnostic `console.log` statements tagged `[BOOT]` (`main.tsx start`, `i18n initialized`, `React.render called`) MUST be removed from shipped code. `console.error` reporting for genuine failures SHALL remain.

**Verification:** build/manual inspection — no `[BOOT] console.log` present in source or built bundle output. NOT unit-tested.

#### Scenario: Clean bundle logs

- GIVEN the app boots normally
- WHEN the browser console is inspected
- THEN no `[BOOT]` informational log lines appear; only genuine errors are logged
