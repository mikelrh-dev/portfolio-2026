# Proposal: fix-audit-findings

**Change ID:** `fix-audit-findings`
**Project:** portfolio-2026 v0.2.0
**Date:** 2026 (fresh-context risk audit, same session)
**Status:** proposed
**Review budget:** 400 changed lines (auto-forecast strategy)

## Problem statement

A fresh-context risk audit of the codebase surfaced **14 findings** spanning three severity tiers. The most serious issues ship broken or unsafe behavior to every production visitor:

1. **Global error handlers leak internals (R1-001).** `src/main.tsx` attaches `window.error` / `unhandledrejection` listeners that render full stack traces into an accumulating fullscreen `<pre>` overlay — unconditionally, in production, for all users, stacking one overlay per event. This leaks source internals and degrades any error into a worse UX than the original failure.
2. **Dead component with crash-latent i18n (R1-008).** `src/components/sections/About.tsx` is imported nowhere (App renders `AboutStack`) and depends on ~15 translation keys that exist in neither `en.json` nor `es.json`. If ever mounted, `t(...).map` on undefined arrays crashes the tree.
3. **XSS-latent sink (R1-003).** `KineticHeadline.tsx` writes `el.innerHTML` from `children` string interpolation — currently fed static copy, but structurally unsafe.
4. **Correctness/perf warnings:** observer churn on every render (R1-004), blank frames in image sequences on load failure (R1-005), hardcoded Spanish hero CTAs breaking the EN/ES promise (R1-006), a contact form with zero spam mitigation and zero success/error feedback (R1-007), and ~4 unused heavy 3D dependencies shipped in the dep graph via a single dead file (R1-009).

None of these require redesign to resolve; they are targeted fixes that make the existing product correct, safe, and honest about its bilingual scope.

## Scope

All 14 findings, grouped into three delivery groups:

### Group A — Critical fixes

| Finding | Fix |
| --- | --- |
| R1-001 | Gate `showFatal` overlay behind `import.meta.env.DEV`. In prod, keep `console.error` reporting and let the existing ErrorBoundary be the only user-facing error surface. Prevent overlay accumulation regardless of mode. |
| R1-008 | Delete `src/components/sections/About.tsx` entirely (dead code; its keys intentionally absent from locales). Verify no imports remain (`tsc --noEmit` gates this). |

### Group B — Warning fixes

| Finding | Fix |
| --- | --- |
| R1-002 | Remove `[BOOT]` diagnostic `console.log`s from `main.tsx`; keep errors only. |
| R1-003 | Replace the `innerHTML` sink in `KineticHeadline.tsx` with DOM-safe construction (`document.createElement('span')` + `textContent`, or equivalent) preserving identical animation behavior. |
| R1-004 | Stabilize `sectionIds` identity in `useScrollSpy.ts` and `Nav.tsx` (module-level constant or memoization) so the IntersectionObserver is created once, not per render. |
| R1-005 | In `useImageSequence.ts`, drop failed frames from the frame index (skip rather than render null) so a failed load never yields a blank mid-sequence frame; log a warning once. |
| R1-006 | Move Hero CTA labels `'[ VER SISTEMAS ]'` / `'[ CONTACTO ]'` into `en.json` + `es.json` under existing hero namespace conventions. |
| R1-007 | Minimal hardening of the Contact form (Formspree endpoint unchanged): honeypot field for spam mitigation plus visible success/error status region (aria-live) after submit; button disabled/pending state. No captcha, no backend change. |
| R1-009 | Delete dead `src/components/ui/splite.tsx`; remove `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@splinetool/react-spline` (and `@types/three` if present) from `package.json`; prune stale entries from `vite.config.ts` `optimizeDeps`. |

### Group C — Hygiene / suggestions

| Finding | Fix |
| --- | --- |
| R1-010 | Throttle/rAF-gate the App.tsx scroll handler writing `--grid-offset`; remove the unused `containerRef`. |
| R1-011 | ScrollProgress: run rAF loop only while progress value actually changes; skip redundant textContent writes. |
| R1-012 | Hero canvas acquisition: replace single-rAF `querySelector` with a resilient lookup (retry via rAF until found or effect cleanup), avoiding a silent no-op if the canvas mounts late. |
| R1-013 | Set `document.documentElement.lang` dynamically from the active i18n language (and on `languageChanged`). |
| R1-014 | Deduplicate MagneticButton vs Button: keep one component, migrate usages, drop the unused variant prop. |

## Non-goals

- **No section redesign** — visual design, layout, and animation feel stay as-is; fixes preserve current rendered behavior exactly (except removing broken/blank states).
- **No new features** beyond the *minimal* contact-form success/error feedback required by R1-007. No captcha service, no email backend swap, no analytics.
- **No i18n expansion** other than the two Hero CTA keys (R1-006) and the dynamic `<html lang>` attribute (R1-013).
- **No test-framework migration story** — vitest is installed during apply per `openspec/config.yaml` (strict_tdd, degraded-minimum), but building out a test suite is out of scope; tests cover only what tasks.md requires.
- **No changes to routing, content data, or tokens.css.**

## Acceptance criteria

### Group A — Critical

- [ ] In a production build (`npm run build` + preview), an unhandled error does **not** render any stack-trace overlay; the ErrorBoundary remains the sole prod error surface. In dev (`DEV=true`), the diagnostic overlay still appears and never accumulates duplicates.
- [ ] `src/components/sections/About.tsx` no longer exists; `npx tsc --noEmit` passes with no dangling imports.

### Group B — Warnings

- [ ] No `[BOOT]` `console.log` statements remain in shipped bundles.
- [ ] `KineticHeadline` contains no `innerHTML` assignment; word-split spans are built via DOM APIs and animation output is visually unchanged.
- [ ] IntersectionObserver in `useScrollSpy` is constructed once per mount (verified by reading deps array; section IDs are referentially stable).
- [ ] A deliberately failing frame URL results in the sequence skipping that frame — no blank flash.
- [ ] Hero CTAs render English copy when `en` is active, Spanish when `es` is active; both locale files contain the new keys.
- [ ] Contact form: bot-filling the hidden honeypot does not submit; successful submit shows a visible success message; failed submit shows an error message; the submit control reflects pending state.
- [ ] `three`, `@react-three/*`, `@splinetool/*` removed from `package.json`; `npm run build` succeeds; bundle size measurably reduced; `vite.config.ts` optimizeDeps has no stale 3D entries.

### Group C — Hygiene

- [ ] `--grid-offset` updates at most once per animation frame; `containerRef` removed.
- [ ] ScrollProgress performs no DOM write when the displayed value is unchanged.
- [ ] Hero canvas is acquired reliably even if mounted later than first rAF tick.
- [ ] `<html lang>` matches the active UI language and updates on toggle (EN↔ES).
- [ ] Only one button component remains; all prior call sites compile against it.

### Global gates (all groups)

- [ ] `npx tsc --noEmit` passes (minimum automated check per config).
- [ ] `npm run build` passes.
- [ ] Manual browser pass: all sections render, EN/ES toggle works end-to-end, contact form flows verified.

## Delivery forecast

Estimated changed lines (insertions + deletions, per auto-forecast):

| Group | Est. lines | Notes |
| --- | --- | --- |
| A — Critical | ~90 | Mostly edits in main.tsx (~25); About.tsx deletion ~72 lines but trivial review weight |
| B — Warnings | ~150 | Contact form (~35), KineticHeadline rewrite (~25), useImageSequence (~15), dep/vite cleanup (~20 across configs), rest small edits |
| C — Hygiene | ~60 | Small, independent touch-ups across 5 files |
| **Total** | **~300** | Under the 400-line review budget |

**Recommendation: single PR.** At ~300 estimated lines the change fits comfortably inside the 400-line budget. Groups are logically ordered (A → B → C) and should be delivered as **three sequential commit series within one PR**, so review can proceed group-by-group and any group can be reverted independently without chained-PR overhead. Escalate to chained PRs only if implementation reveals the KineticHeadline rewrite or dependency removal exceeding ~+80 lines over estimate.

**TDD note (per config):** apply phase must install vitest before any red/green cycle. Given degraded-minimum mode, tests target the highest-risk pure logic only (useScrollSpy stability, useImageSequence frame filtering); everything else relies on `tsc --noEmit` + build + manual browser verification.

## Risks & rollback

- **Behavior regression in KineticHeadline** (R1-003 rewrite alters stagger timing). Mitigation: pixel-compare before/after in dev; rollback = revert single commit.
- **Dependency removal breaks hidden import** missed by grep/tsc. Mitigation: `npx tsc --noEmit` catches type-level references; build catches module resolution; rollback = restore package.json entry.
- **Error-overlay gating hides real prod errors from developers.** Mitigation: `console.error` retained in prod; ErrorBoundary message includes a support hint. Rollback = revert Group A commit.
- **Contact form change interacts badly with Formspree** (honeypot field name collision). Mitigation: use non-colliding `_gotcha`-style field; verify manually against live endpoint before merge.
