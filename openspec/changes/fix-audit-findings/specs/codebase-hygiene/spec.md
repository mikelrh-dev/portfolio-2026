# Codebase Hygiene Specification

New domain. Covers audit findings R1-008, R1-009, R1-014 (dead code removal, dependency pruning, component deduplication).

## Purpose

The shipped dependency graph and component surface must contain only code that is imported and used. Dead modules must not carry runtime risk (crash-latent i18n) or heavy unused dependencies into production bundles.

## Requirements

### Requirement: Dead About Component Removal

The dead file `src/components/sections/About.tsx` (imported nowhere; App renders `AboutStack`) MUST be deleted entirely. Its translation keys remain intentionally absent from both locales. No dangling imports may remain after deletion.

**Verification:** build/manual inspection — file absent; `npx tsc --noEmit` gates that no import references it. NOT unit-tested.

#### Scenario: Deletion compiles clean

- GIVEN `About.tsx` is deleted
- WHEN `npx tsc --noEmit` runs
- THEN it passes with no unresolved imports of `About`

### Requirement: Unused 3D Dependency Pruning

The following MUST be removed from `package.json`: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@splinetool/react-spline` (and `@types/three` if present), together with the sole consumer `src/components/ui/splite.tsx`. Stale 3D entries MUST be pruned from `vite.config.ts` `optimizeDeps`. The build MUST succeed afterwards with a measurably reduced bundle size.

**Verification:** build/manual inspection — `npm run build` passes; no stale optimizeDeps entries; bundle size comparison before/after. NOT unit-tested.

#### Scenario: Build survives dependency removal

- GIVEN the listed packages and `splite.tsx` are removed
- WHEN `npm run build` runs
- THEN the build succeeds, no module-resolution errors occur, and the output bundle is smaller than the pre-change baseline

#### Scenario: Config hygiene

- GIVEN `vite.config.ts` previously pre-bundled 3D packages
- WHEN this change is applied
- THEN `optimizeDeps` contains no entries for removed packages

### Requirement: Single Button Component

MagneticButton and Button MUST be deduplicated to exactly one surviving button component; all prior call sites MUST compile against it; the unused variant prop SHALL be dropped.

**Verification:** manual/code inspection plus compile gate — one button component remains in source; `npx tsc --noEmit` proves all call sites migrated. NOT unit-tested.

#### Scenario: All call sites migrate

- GIVEN one button component remains and the other is deleted
- WHEN `npx tsc --noEmit` runs
- THEN every former Magnetic/Button usage resolves against the surviving component and no unused variant prop exists in its API
