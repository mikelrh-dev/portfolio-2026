# Delta for contact-section

Covers audit finding R1-007 (minimal contact-form hardening).

> **Canonical conflict (must reconcile at archive):** `openspec/specs/contact-section/spec.md`
> currently states "No Changes To — No Form — zero `<form>`, `<input>`,
> `<textarea>` elements unchanged." A Formspree-backed form exists in the
> shipped code, so the canonical note is stale. Archiving this change MUST
> update the canonical spec so the form requirements below become accepted
> behavior and the "No Form" note is removed.

## ADDED Requirements

### Requirement: Honeypot Spam Mitigation

The contact form MUST include a hidden honeypot field (non-colliding name, e.g. `_gotcha` style) that, when filled by a bot, prevents submission to the Formspree endpoint. There MUST be NO captcha and NO backend change; the Formspree endpoint stays unchanged.

**Verification:** manual browser inspection (bot-fill does not submit; human path unaffected).

#### Scenario: Bot fills honeypot

- GIVEN the honeypot field contains a non-empty value
- WHEN a submit is attempted
- THEN the request is not sent to the Formspree endpoint

#### Scenario: Human submitter unaffected

- GIVEN a human user leaves the (hidden) honeypot empty
- WHEN they submit valid form data
- THEN the form submits to the existing Formspree endpoint as before

### Requirement: Submit Status Feedback

After submit, the form MUST render a visible status region with `aria-live` announcing success or failure of the submission. Absence of feedback after submit is not acceptable.

**Verification:** manual browser inspection (success message on 200-class response; error message on failure; region is announced to assistive tech via `aria-live`).

#### Scenario: Successful submit

- GIVEN the user submits valid data and the endpoint responds successfully
- WHEN the response arrives
- THEN a visible success message renders inside an `aria-live` status region

#### Scenario: Failed submit

- GIVEN the user submits and the request fails (network or non-success response)
- WHEN the failure is detected
- THEN a visible error message renders inside the same status region

### Requirement: Pending Submit State

While a submission is in flight, the submit control MUST reflect pending state (disabled and/or pending label) and MUST NOT allow duplicate submissions.

**Verification:** manual browser inspection; compile-level check via `tsc --noEmit`.

#### Scenario: Double-submit prevention

- GIVEN a submission is in flight
- WHEN the user clicks the submit control again
- THEN the control is disabled and no second request is issued
