# Delta for contact-section

## MODIFIED Requirements

### Requirement: Email Link (No Magnetic)

The email address MUST render as a standard `<a href="mailto:...">` link with CSS hover only — no `magnetic` class, no `useMagneticCursor`.

(Previously: email link with `magnetic` class wired to microinteractions engine)

- **GIVEN** the contact section renders
- **WHEN** the email link is displayed
- **THEN** it is an `<a href="mailto:...">` element with underlined text, NO CSS class containing `magnetic`

- **GIVEN** the email link is hovered
- **WHEN** the user hovers over it
- **THEN** the link MUST use simple CSS hover — no magnetic attraction, no Web Audio click

### Requirement: Social Links

The section MUST render 3 social links in bracket format (`[ GITHUB ]`, `[ LINKEDIN ]`, `[ EMAIL ]`) in JetBrains Mono uppercase.

(Previously: 3 social links without bracket format, including X/Twitter)

- **GIVEN** the contact section renders
- **WHEN** social links are displayed
- **THEN** exactly 3 text links (`[ GITHUB ]`, `[ LINKEDIN ]`, `[ EMAIL ]`) appear in JetBrains Mono, uppercase, tracked, color `#666666`, `target="_blank" rel="noopener noreferrer"`

- **GIVEN** the user clicks a social link
- **WHEN** activated
- **THEN** a new tab opens to the correct external URL

## REMOVED Requirements

### Requirement: Email Link — Magnetic Wiring

(Reason: Editorial design removes all magnetic behavior. Email uses standard CSS hover.)

(Migration: Remove `magnetic` class from email anchor. Remove `useMagneticCursor` import from Contact.tsx. Replace with simple CSS `:hover { color: #CCFF00 }` or equivalent.)

## No Changes To

- **Footer Bar** — copyright in JetBrains Mono, uppercase, 11–12px, `#444444`, `1px solid #222` top border unchanged.
- **No Form** — zero `<form>`, `<input>`, `<textarea>` elements unchanged.
