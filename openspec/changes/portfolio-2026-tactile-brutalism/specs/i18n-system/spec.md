# i18n System — Specification

## Purpose

Provide a complete internationalization system for EN/ES locales using i18next + react-i18next with 52 keys per locale, a language toggle, and static JSON imports from Portfolio-Mikel.

## Requirements

### Requirement: i18next + react-i18next Setup

The project MUST initialize i18next with `react-i18next` and load EN/ES JSON translation files via static import (no fetch, no HTTP).

- **GIVEN** the application starts
- **WHEN** i18next initializes
- **THEN** it loads EN and ES translations from static JSON imports (e.g., `import en from './locales/en.json'`) — no `XHR` backend

- **GIVEN** i18next is initialized
- **WHEN** a component calls `useTranslation()`
- **THEN** translations render correctly for the active locale without flickering or async gaps

### Requirement: 52 Keys Per Locale

Each locale file MUST contain exactly 52 key-value pairs covering all UI copy across all sections.

- **GIVEN** the EN locale file at `src/i18n/locales/en.json`
- **WHEN** the keys are counted
- **THEN** there are exactly 52 keys

- **GIVEN** the ES locale file at `src/i18n/locales/es.json`
- **WHEN** the keys are counted
- **THEN** there are exactly 52 keys, matching EN keys 1:1

### Requirement: Language Toggle

The app MUST render a language toggle (EN | ES) that switches all visible copy without page refresh.

- **GIVEN** the current locale is EN
- **WHEN** the user clicks "ES" on the toggle
- **THEN** all `useTranslation()` content re-renders in Spanish without a page reload

- **GIVEN** the user switches locale
- **WHEN** the locale changes
- **THEN** the selected locale persists in `localStorage` and restores on next visit

### Requirement: Content Migration

EN/ES JSON files MUST be copied from `Portfolio-Mikel/lang/` into `src/i18n/locales/` with no structural changes to the key schema.

- **GIVEN** the source files at `Portfolio-Mikel/lang/en.json` and `Portfolio-Mikel/lang/es.json`
- **WHEN** content is migrated
- **THEN** the same 52 keys exist in `src/i18n/locales/` with identical key names and structure

## Acceptance Criteria

- [ ] i18next initialized with static JSON imports (no HTTP fetch)
- [ ] EN and ES locale files with exactly 52 keys each, keys match 1:1
- [ ] Language toggle switches all visible copy without page refresh
- [ ] Selected locale persists in `localStorage`
- [ ] Translation files migrated from `Portfolio-Mikel/lang/` with identical structure

## Out of Scope

- RTL language support
- Locale auto-detection (browser Accept-Language)
- Pluralization or interpolation beyond simple key-value
- More than 2 locales (EN/ES only)
- SSR or server-side locale handling
