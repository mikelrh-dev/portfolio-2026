# Delta for hero-section

Covers audit findings R1-003, R1-006, R1-012.

> **Archive note:** the canonical `contact-section` spec's "No Form" note is
> stale (a Formspree form already exists in code); that conflict is handled in
> the contact-section delta of this change, not here.

## ADDED Requirements

### Requirement: Kinetic Headline Safe Rendering

The kinetic headline MUST construct word spans using DOM APIs (`createElement` + `textContent`) only. It SHALL NOT assign to `innerHTML`, `outerHTML`, or `insertAdjacentHTML`. Rendered output (word-splitting, stagger animation) MUST remain visually identical to the pre-change behavior.

**Verification:** build/manual inspection (no `innerHTML` assignment in source); pixel-compare before/after in dev for animation parity. NOT unit-tested (DOM/animation visual parity).

#### Scenario: No HTML sink

- GIVEN the hero renders its headline through `KineticHeadline`
- WHEN each word span is created
- THEN every span's text is set via `textContent`, and the component source contains no `innerHTML` assignment (R1-003; sink located at `KineticHeadline.tsx:42-44`)

#### Scenario: Animation parity

- GIVEN the headline renders before and after this change
- WHEN the stagger animation plays
- THEN the visible output (words, timing, layout) is unchanged

### Requirement: Localized CTA Labels

The two hero CTAs MUST render their labels from i18n translation keys present in BOTH `en.json` and `es.json` (existing hero namespace conventions). Hardcoded Spanish strings (`'[ VER SISTEMAS ]'`, `'[ CONTACTO ]'`) MUST be removed from the component. English locale values SHOULD be English copy; Spanish locale values keep the current Spanish labels.

**Verification:** unit-testable (vitest) — assertion that both locale files contain both keys and values are non-empty.

#### Scenario: English active

- GIVEN language `en` is active
- WHEN the hero renders
- THEN both CTA labels display English copy from `en.json`, with no hardcoded Spanish text in the component source

#### Scenario: Spanish active

- GIVEN language `es` is active
- WHEN the hero renders
- THEN both CTA labels display the Spanish labels from `es.json`

### Requirement: Resilient Canvas Acquisition

Hero canvas lookup MUST tolerate late-mounted canvases: the lookup SHALL retry across animation frames until found or effect cleanup, instead of a single rAF-timed `querySelector` that can silently no-op.

**Verification:** manual browser inspection (canvas appears reliably; no console error when mount order shifts). NOT unit-tested.

#### Scenario: Late-mounted canvas

- GIVEN the hero mounts before its canvas element exists in the DOM
- WHEN the acquisition loop runs
- THEN the canvas is acquired on a subsequent frame without a silent no-op

#### Scenario: Unmount during retry

- GIVEN the retry loop is pending
- WHEN the component unmounts
- THEN the loop cancels via effect cleanup (no leaked timers/rAF callbacks)
