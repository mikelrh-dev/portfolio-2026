# Contact Section — Specification

## Purpose

Render the contact and footer section: email displayed at 56px in JetBrains Mono with an electric green underline, social links, bracket-format CTAs, and a `03/03 — CONTACT` mono indicator.

## Requirements

### Requirement: Email Display

The contact section MUST render the primary email address at 56px using JetBrains Mono 400 with a `#CCFF00` underline.

- GIVEN the contact section is visible
- WHEN the email element renders
- THEN `font-family` is `"JetBrains Mono"`, `font-size` is 56px, `font-weight` is 400, `text-decoration` is `underline`, `text-decoration-color` is `#CCFF00`, or a `::after` pseudo-element creates a green underline bar

- GIVEN the viewport width is ≤ 768px
- WHEN the email renders
- THEN `font-size` SHOULD scale down (minimum 24px) to avoid overflow

### Requirement: Social Links

Below the email, the contact section MUST render a row of social profile links in JetBrains Mono 400 14px.

- GIVEN the contact section is visible
- WHEN social links render
- THEN they are displayed in a single row, using JetBrains Mono 400 14px, separated by `#222` vertical bars or `#CCFF00` dots

- GIVEN a social link is clicked
- WHEN the link is an external profile
- THEN it opens in a new tab (`target="_blank"`)

### Requirement: Footer

The contact section MUST include a minimal footer with copyright and attribution in JetBrains Mono 400 12px.

- GIVEN the contact section is visible
- WHEN the footer renders
- THEN it shows copyright text in JetBrains Mono 400 12px, `color` `#666666`, with a `1px solid #222` top border

### Requirement: Section Indicator

The contact section MUST display `03/03 — CONTACT` in mono format at the section boundary.

- GIVEN the contact section is in viewport
- WHEN the indicator renders
- THEN text matches `/^\d{2}\/\d{2} — [A-Z]+$/`, JetBrains Mono 400 12px, `color` `#666666`

## Acceptance Criteria

- [ ] Email at 56px JetBrains Mono with `#CCFF00` underline
- [ ] Email responsive down to 24px on mobile
- [ ] Social links in single row with mono typography
- [ ] Footer with copyright and `1px solid #222` top border
- [ ] `03/03 — CONTACT` indicator visible
- [ ] Section counter chain complete (01 → 02 → 03)

## Out of Scope

- Contact form or mail-to integration
- Newsletter signup
- Google Analytics or tracking pixels
- Phase 2 animations on email reveal
