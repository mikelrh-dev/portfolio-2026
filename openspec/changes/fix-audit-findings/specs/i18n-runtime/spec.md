# i18n Runtime Specification

New domain. Covers audit finding R1-013 (document language synchronization). CTA label keys themselves are specified in the hero-section delta of this change.

## Purpose

The document's `lang` attribute must always reflect the active UI language so browsers, screen readers, and translation tooling interpret page copy correctly.

## Requirements

### Requirement: Dynamic Document Language

`document.documentElement.lang` MUST be set from the active i18n language at startup and MUST update whenever the language changes (including the `languageChanged` event), for every supported locale (`en`, `es`).

**Verification:** unit-testable (vitest with jsdom) — assert initial lang matches default locale, then simulate a toggle/languageChanged event and assert the attribute updates.

#### Scenario: Initial load

- GIVEN the app boots with i18n language `en`
- WHEN initialization completes
- THEN `<html lang>` is `"en"`

#### Scenario: Language toggle

- GIVEN `<html lang="en">` and the user switches to Spanish
- WHEN the language changes to `es`
- THEN `document.documentElement.lang` becomes `"es"` without a page reload

#### Scenario: Round-trip

- GIVEN the language toggles back from `es` to `en`
- WHEN `languageChanged` fires
- THEN `<html lang>` returns to `"en"`
