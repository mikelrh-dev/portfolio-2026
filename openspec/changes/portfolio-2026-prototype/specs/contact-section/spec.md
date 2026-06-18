# Contact Section Specification

## Purpose

Provide a contact form and social links prototype — a visual placeholder that demonstrates the form layout, i18n integration, and Corporate Goth styling without backend submission.

## Requirements

### Requirement: Contact Form Fields

The section MUST render three form fields (name, email, message) with labels sourced from i18n keys.

#### Scenario: Form fields render with i18n labels
- GIVEN the contact section mounts
- WHEN the form renders
- THEN a "Name" field MUST render with label from i18n key `contact.name`
- AND an "Email" field MUST render with label from `contact.email`
- AND a "Message" textarea MUST render with label from `contact.message`
- AND all fields MUST have matching placeholder attributes in the current language

### Requirement: Form Styling

All form fields MUST use Corporate Goth styling — dark background, oxblood borders, bone-white text.

#### Scenario: Form field visual style
- GIVEN any form field renders
- WHEN inspected
- THEN the field MUST have `#0A0A0A` background
- AND a `#7A1F1F` 1px solid border
- AND `border-radius` MUST be 4px
- AND text MUST render in Inter at 1rem with `#F5F5F0` color
- AND the focused state MUST show an oxblood focus ring

### Requirement: Client-Side Validation

The form SHOULD validate the email field format on the client side and display an inline error message.

#### Scenario: Invalid email shows error
- GIVEN the user types an invalid email ("not-an-email")
- WHEN the email field loses focus
- THEN an inline error message SHOULD render below the field
- AND the error message SHOULD use `#7A1F1F` or a bone-white text with oxblood indicator

#### Scenario: Valid email passes
- GIVEN the user types "hello@example.com"
- WHEN the email field loses focus
- THEN no error message SHOULD appear
- AND the field MAY show a valid-state indicator

### Requirement: No Backend Submission

The form MUST NOT submit data to any backend server — prototype behavior only.

#### Scenario: Submit button is presentational
- GIVEN the user fills all fields and clicks submit
- WHEN the submit event fires
- THEN the form MUST NOT send an HTTP request
- AND a toast or inline message MAY display showing "Message sent (prototype)" or equivalent from i18n

### Requirement: Social Links

The section MUST render social links (GitHub, LinkedIn) from i18n key data, plus a copyright footer.

#### Scenario: Social links render
- GIVEN the contact section mounts
- WHEN the social links section renders
- THEN GitHub and LinkedIn links MUST be visible with their icons
- AND each link MUST open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`)
- AND a copyright notice MUST render below from i18n key `footer.copyright`

### Requirement: Hard Constraints

#### Scenario: No git or Portfolio-Mikel dependency
- GIVEN prototype development
- WHEN the contact section renders
- THEN NO git operations SHALL be performed
- AND NO reads from `Portfolio-Mikel/` SHALL occur at runtime

## Acceptance Criteria

- [ ] Name, email, message fields render with i18n labels and placeholders
- [ ] Fields styled: `#0A0A0A` bg, `#7A1F1F` 1px border, 4px radius
- [ ] Email validation shows inline error for invalid input (SHOULD)
- [ ] Submit button does not send HTTP request
- [ ] GitHub and LinkedIn links render with icons and correct URLs
- [ ] Copyright footer renders from i18n
- [ ] Focus styles visible on all interactive elements

## Out of Scope

- Backend form handling or API endpoint
- reCAPTCHA or spam protection
- Contact form data persistence
- Server-side validation
- Email delivery (SMTP, SendGrid, etc.)
