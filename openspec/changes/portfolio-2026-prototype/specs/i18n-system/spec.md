# i18n System Specification

## Purpose

Provide EN/ES translation for all user-facing text using i18next, with 39 keys migrated from the existing portfolio. A language toggle lets users switch languages without page refresh, and the system is SSR-compatible for initial render in the correct language.

## Requirements

### Requirement: i18next Integration

The system MUST use the i18next library for all translation functionality.

#### Scenario: i18next initialized
- GIVEN the application starts
- WHEN the i18next instance initializes
- THEN it MUST load with English (`en`) as the default language
- AND it MUST support Spanish (`es`) as the secondary language
- AND it MUST be configured for SSR compatibility in Astro

### Requirement: 39-Key Dictionary

The system MUST load exactly 39 translation keys from JSON dictionaries migrated from `Portfolio-Mikel/lang/{en,es}.json`.

#### Scenario: Key count and structure
- GIVEN i18next is initialized
- WHEN both language dictionaries load
- THEN the English dictionary MUST contain exactly 39 keys
- AND the Spanish dictionary MUST contain the same 39 keys
- AND each key in `es.json` MUST have a corresponding translated value

#### Scenario: Frozen key set
- GIVEN the dictionaries have been migrated
- WHEN the prototype runs
- THEN the key set MUST be treated as frozen — no new keys added unless explicitly required
- AND the original `Portfolio-Mikel/lang/` files MUST NOT be modified

### Requirement: Language Toggle

The system MUST provide a language toggle UI component that switches all visible text without a page refresh.

#### Scenario: Toggle switches language
- GIVEN the page is rendering in English
- WHEN the user clicks the language toggle
- THEN all text MUST switch to Spanish
- AND the toggle MUST update to show the target language (e.g., "EN" → "ES")
- AND NO page refresh SHALL occur

#### Scenario: Toggle is bidirectional
- GIVEN the page is rendering in Spanish
- WHEN the user clicks the language toggle again
- THEN all text MUST switch back to English
- AND the toggle MUST reflect "ES" → "EN"

### Requirement: SSR Compatibility

The system MUST render text in the correct language on the server before JavaScript loads.

#### Scenario: Initial SSR render
- GIVEN a request comes with `Accept-Language: es` or a stored preference
- WHEN the page renders on the server
- THEN the HTML MUST contain Spanish text
- AND no client-side flash of English content SHALL occur
- AND the i18next instance MUST be initialized on the server with the detected language

#### Scenario: Default language fallback
- GIVEN no language preference is detected
- WHEN the page renders on the server
- THEN the HTML MUST contain English text (default)

### Requirement: Content Migration (Read-Only)

The system MUST read the 39-key dictionaries from the migrated copies in the prototype, NOT from the original `Portfolio-Mikel/` files.

#### Scenario: Read-only reference
- GIVEN the i18n migration step has completed
- WHEN i18next loads dictionaries
- THEN it MUST load from `src/i18n/locales/{en,es}.json` within the prototype
- AND it MUST NOT read from `Portfolio-Mikel/lang/{en,es}.json` at runtime

### Requirement: Hard Constraints

#### Scenario: No git operations
- GIVEN the i18n system initializes
- WHEN dictionaries are loaded
- THEN NO git operations SHALL be performed
- AND NO files from `Portfolio-Mikel/` SHALL be read at runtime

## Acceptance Criteria

- [ ] i18next initializes with EN default, ES secondary
- [ ] 39 keys present in both EN and ES dictionaries
- [ ] Language toggle switches all visible text without refresh
- [ ] SSR renders correct language based on preference
- [ ] No runtime reads from `Portfolio-Mikel/` files
- [ ] Key set frozen — no additions without explicit spec change
- [ ] `en.json` and `es.json` files exist under `src/i18n/locales/`

## Out of Scope

- Right-to-left (RTL) language support
- Language auto-detection from browser headers
- Translation management UI or CMS
- Pluralization rules (i18next supports it, but 39-key set doesn't require it)
- Dynamic key addition or runtime key generation
- Translation of 3D interface elements (none exist)
