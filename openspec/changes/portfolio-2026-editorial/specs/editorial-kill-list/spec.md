# Editorial Kill List — Specification

## Purpose

Define the exact set of components, hooks, CSS rules, and files to remove. NON-NEGOTIABLE — all deletions with no replacement.

## Requirements

### Requirement: BootSequence Removal

`src/components/effects/BootSequence.tsx` MUST be deleted. All imports and JSX in `App.tsx` MUST be removed.

- **GIVEN** the codebase is inspected after apply
- **THEN** `src/components/effects/BootSequence.tsx` MUST NOT exist
- **AND** `App.tsx` MUST have no `BootSequence` import or `<BootSequence>` JSX

### Requirement: CustomCursor Removal

`CustomCursor.tsx` and `useCustomCursor.ts` MUST be deleted. All references in `App.tsx` MUST be removed.

- **GIVEN** the codebase is inspected
- **THEN** `src/components/effects/CustomCursor.tsx` MUST NOT exist
- **AND** `src/hooks/useCustomCursor.ts` MUST NOT exist
- **AND** `App.tsx` MUST have no `CustomCursor` import or `<CustomCursor>` JSX

### Requirement: CSS Cursor Rule Removal

The `.custom-cursor-active` rule MUST be removed from `globals.css`.

- **GIVEN** `src/styles/globals.css` is inspected
- **THEN** NO `.custom-cursor-active` selector or rule SHALL exist

### Requirement: useMagneticCursor Hook Removal

`useMagneticCursor.ts` MUST be deleted. All imports (Contact.tsx, MagneticButton.tsx) MUST be removed.

- **GIVEN** the codebase is inspected
- **THEN** `src/hooks/useMagneticCursor.ts` MUST NOT exist
- **AND** no `.tsx` or `.ts` file SHALL import `useMagneticCursor`

### Requirement: useHoverSound Hook Removal

`useHoverSound.ts` MUST be deleted. All imports MUST be removed.

- **GIVEN** the codebase is inspected
- **THEN** `src/hooks/useHoverSound.ts` MUST NOT exist

### Requirement: Photo Hover Filter Removal

The sepia/hue-rotate hover filter on the profile photo in `AboutStack.tsx` MUST be removed.

- **GIVEN** AboutStack.tsx renders the profile photo
- **WHEN** the photo is hovered
- **THEN** NO `filter` change SHALL occur (no sepia, no hue-rotate, no color shift)

### Requirement: Dangling Reference Check

The build MUST pass with no broken imports.

- **GIVEN** all kill-list items are removed
- **WHEN** `npm run build` executes
- **THEN** it MUST succeed with zero import errors

## Non-goals

- Replacing removed components with alternatives (pure deletions)
- Modifying kept component behavior (covered by other deltas)

## Acceptance Criteria

- [ ] 5 files deleted: BootSequence.tsx, CustomCursor.tsx, useCustomCursor.ts, useMagneticCursor.ts, useHoverSound.ts
- [ ] `.custom-cursor-active` removed from globals.css
- [ ] No dangling imports in any source file
- [ ] `npm run build` passes
