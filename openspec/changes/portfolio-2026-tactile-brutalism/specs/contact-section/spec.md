# Contact Section — Specification

## Purpose

Render the contact area with an email link, social media links, and a footer bar — no contact form.

## Requirements

### Requirement: Email Link

The section MUST render the email address as an underlined `href="mailto:..."` link with magnetic class.

- **GIVEN** the contact section renders
- **WHEN** the email link is displayed
- **THEN** it is an `<a href="mailto:...">` element with underlined text decoration and CSS class containing `magnetic`

- **GIVEN** the email link has class `magnetic`
- **WHEN** hovered
- **THEN** the microinteractions engine applies magnetic attraction and fires Web Audio click (per `microinteractions-engine` spec)

### Requirement: Social Links

The section MUST render a minimal row of social links (GitHub, LinkedIn, X/Twitter) as text labels in JetBrains Mono, uppercase.

- **GIVEN** the contact section renders
- **WHEN** social links are displayed
- **THEN** exactly 3 text links (GitHub, LinkedIn, X/Twitter) appear in JetBrains Mono, uppercase, tracked, color `#666666`, opening in new tabs (`target="_blank" rel="noopener noreferrer"`)

- **GIVEN** the user clicks a social link
- **WHEN** the link is activated
- **THEN** a new browser tab opens to the correct external URL

### Requirement: Footer Bar

The section MUST render a thin footer bar with copyright and locale-invariant credit text.

- **GIVEN** the contact section renders
- **WHEN** the footer is visible
- **THEN** it shows a copyright line (e.g., `© 2026 Mikel`) in JetBrains Mono, uppercase, 11–12px, color `#444444`, with a `1px solid #222` top border

### Requirement: No Form

The section MUST NOT render any form, input fields, or text areas.

- **GIVEN** the contact section renders
- **WHEN** inspected for form elements
- **THEN** there are zero `<form>`, `<input>`, `<textarea>`, or `<button type="submit">` elements

## Acceptance Criteria

- [ ] Email `mailto:` link present with underline and `magnetic` class
- [ ] Exactly 3 social links (GitHub, LinkedIn, X/Twitter) open in new tabs
- [ ] Social links in JetBrains Mono, uppercase, `#666666`
- [ ] Footer with copyright, `#444444`, `1px solid #222` top border
- [ ] Zero form elements present

## Out of Scope

- Contact form, email sending, or backend integration
- Captcha or anti-spam measures
- Newsletter signup
- Map embed or physical address
