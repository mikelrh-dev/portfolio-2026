# Tasks: fix-audit-findings

> Delivery: **single PR, 5 sequential commit series** (design Rollout §). Global
> gates after every series: `npx tsc --noEmit && npm run build && npx vitest run`
> (vitest gate applies from Series 2 onward — runner lands in Series 1).
> Strict TDD: unit-testable requirements follow RED → GREEN → TRIANGULATE → REFACTOR.

## Review Workload Forecast

| Field | Value |
| ------- | ------- |
| Estimated changed lines | ~300 (A ~90, B ~150, C ~60) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR; commit series: chore(test) → fix(a) → fix(b) → chore(deps) → perf(c) |
| Delivery strategy | single-pr |
| Chain strategy | pending |

```text
Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low
```

**Escalation trigger:** if KineticHeadline rewrite or dep removal exceeds +80 lines over estimate, re-forecast chained PRs before continuing.

---

## Series 1 — `chore(test): install vitest runner` (enables TDD)

- [x] 1.1 Install devDependencies `vitest@^2`, `jsdom`, `@testing-library/react@^16`; add scripts `"test": "vitest run"`, `"test:watch": "vitest"`.
      Files: `package.json`. Verify: `npx vitest run` exits 0 on empty suite (or trivial smoke test).
- [x] 1.2 Create `vitest.config.ts`: jsdom env, `@` → `src` alias, `globals: false`, `css: false`, react plugin (exact config in design Decision 7).
      Files: `vitest.config.ts`. Verify: `npx vitest run --passWithNoTests` passes.
- [x] 1.3 Update `openspec/config.yaml`: set `testing.runner: vitest`, retire `tdd_mode: degraded-minimum` → full strict-TDD note; keep build/minimum-check commands intact (do not destructively rewrite user-maintained sections beyond the testing block).
      Files: `openspec/config.yaml`.
- [x] 1.4 **Gates:** `npx tsc --noEmit && npm run build`. Commit `chore(test): ...`.

## Series 2 — `fix(a): critical error-surface fixes` (R1-001, R1-002, R1-008)

Spec traceability: `error-handling/spec.md` — Production Overlay Suppression, No Overlay Accumulation, Boot Log Hygiene; `codebase-hygiene/spec.md` — Dead About Component Removal.

- [x] 2.1 **RED:** write `src/lib/errorOverlay.test.ts` — (a) `shouldShowFatalOverlay(true)` → true, `(false)` → false; (b) call `showFatal()` ×3 in jsdom → exactly one `#fatal-diagnostic-overlay` node, textContent updated in place. Run `npx vitest run` → module missing → fails.
      Files: `src/lib/errorOverlay.test.ts`.
- [x] 2.2 **GREEN:** implement `src/lib/errorOverlay.ts` per design Decision 1 (`OVERLAY_ID = 'fatal-diagnostic-overlay'`, single-node reuse). Run tests → pass.
      Files: `src/lib/errorOverlay.ts`.
- [x] 2.3 Rewire `src/main.tsx`: import helpers; all four error paths (`window.error`, `unhandledrejection`, i18n-init catch, render catch) log `console.error` always, overlay only when `shouldShowFatalOverlay(import.meta.env.DEV)`; delete the three `[BOOT] console.log` lines (keep both `[BOOT] ... failed` errors).
      Trace: error-handling — all 3 requirements. Files: `src/main.tsx`.
- [x] 2.4 Delete `src/components/sections/About.tsx` (dead code; keys intentionally absent from locales).
      Trace: codebase-hygiene — Dead About Component Removal. Verify: `grep -r "sections/About" src/` → no matches.
- [ ] 2.5 Manual check: dev overlay appears once per repeated forced error (no stacking); prod preview shows no overlay.
- [x] 2.6 **Gates:** `npx tsc --noEmit && npm run build && npx vitest run`. Commit `fix(a): ...`.

## Series 3 — `fix(b): warning-tier fixes` (R1-003 … R1-007)

### 3A KineticHeadline DOM-safe split

- [ ] 3.1 Rewrite the `innerHTML` block in `src/components/effects/KineticHeadline.tsx` with imperative DOM construction (`textContent=''` clear → `createElement('span')` + `className='kinetic-word'` + `textContent` per word + text-node spaces), preserving downstream GSAP/ScrollTrigger code byte-for-byte (design Decision 2).
      Trace: `hero-section/spec.md` — Kinetic Headline Safe Rendering. Verify: `grep innerHTML src/` → no matches.
- [ ] 3.2 Manual pixel-compare in dev: stagger timing, word spacing, reduced-motion branch unchanged.

### 3B Scroll-spy stability (TDD)

- [ ] 3.3 **RED:** write `src/hooks/useScrollSpy.test.ts` — mock `IntersectionObserver`; export `SECTION_IDS` from hook module; assert (a) `SECTION_IDS` reference identical across renders, (b) `renderHook` + rerender ×3 → constructor called once. Fails: constant doesn't exist yet.
      Files: `src/hooks/useScrollSpy.test.ts`. Trace: scroll-effects — Scroll-Spy Observer Stability.
- [ ] 3.4 **GREEN:** add `export const SECTION_IDS = ['hero','about','work','contact'] as const` to `src/hooks/useScrollSpy.ts`; update `src/components/Nav.tsx` to import it and drop its private inline literals. Tests pass. REFACTOR if needed.

### 3C Image-sequence frame fallback (TDD)

- [ ] 3.5 **RED:** write `src/lib/frameFill.test.ts` — middle gap, leading gap, trailing gap, tie-break→earlier, all-null→all-null cases against `fillFailedFrames<T>()`. Fails: module missing.
      Files: `src/lib/frameFill.test.ts`. Trace: scroll-effects — Image Sequence Frame Fallback.
- [ ] 3.6 **GREEN:** implement `src/lib/frameFill.ts` (nearest non-null neighbor, ties→earlier). Tests pass; TRIANGULATE with one more asymmetric case.
- [ ] 3.7 Wire into `src/hooks/useImageSequence.ts`: track `failedIndices`, `console.warn` once per failed index in `onerror`, on completion `setImages(fillFailedFrames(results))`. Consumer signature unchanged.
      Files: `src/hooks/useImageSequence.ts`.

### 3D Hero i18n CTAs

- [ ] 3.8 **RED:** write `src/i18n/locales.test.ts` — `hero.cta_systems` / `hero.cta_contact` exist non-empty in BOTH `en.json` and `es.json`. Fails: keys absent.
      Files: `src/i18n/locales.test.ts`. Trace: hero-section — Localized CTA Labels.
- [ ] 3.9 **GREEN:** add both keys under the hero namespace in `src/i18n/locales/en.json` + `es.json`; replace hardcoded `'[ VER SISTEMAS ]'` / `'[ CONTACTO ]'` in `src/components/sections/Hero.tsx` with `t(...)` calls. Tests pass.

### 3E Contact form hardening

- [ ] 3.10 Convert `src/components/sections/Contact.tsx` per design Decision 3: hidden honeypot field `company_website` (off-screen wrapper, `aria-hidden`, `tabIndex={-1}`); hoist Formspree endpoint to module const; replace native POST action with controlled async `fetch` (`Accept: application/json`) using `SubmitStatus` machine `idle|pending|success|error`; honeypot-filled → fake success, send nothing; status region `<p role="status" aria-live="polite">`; submit control disabled + pending label while in flight; add i18n keys `contact.form.status_{success,error,sending}` to both locales.
      Trace: contact-section — Honeypot Spam Mitigation, Submit Status Feedback, Pending Submit State.
- [ ] 3.11 Manual live-endpoint verify: bot-fill does not submit; human path succeeds vs. failure message renders; double-click issues one request.

- [ ] 3.12 **Gates (Series 3):** `npx tsc --noEmit && npm run build && npx vitest run`. Commit `fix(b): ...`.

## Series 4 — `chore(deps): remove dead files & unused 3D deps` (R1-009, part of R1-014)

Spec traceability: `codebase-hygiene/spec.md` — Unused 3D Dependency Pruning; Single Button Component (file half).

- [ ] 4.1 Record baseline dist size (`npm run build`, note output size in `apply-progress.md`).
- [ ] 4.2 Delete `src/components/ui/splite.tsx` then `src/components/ui/Button.tsx` (zero call sites each — order per design Decision 6: deletions BEFORE uninstall). Verify: `grep -r "ui/Button\|splite" src/` → no matches.
- [ ] 4.3 Prune `package.json`: deps `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@splinetool/react-spline`, `@splinetool/runtime`; devDep `@types/three`. Run `npm install` to refresh lockfile.
- [ ] 4.4 Delete the entire `optimizeDeps.include` block from `vite.config.ts` (all entries reference removed packages).
- [ ] 4.5 Record post-change bundle size delta in `apply-progress.md`; confirm measurable reduction.
- [ ] 4.6 **Gates:** `npx tsc --noEmit && npm run build && npx vitest run`. Commit `chore(deps): ...`.

## Series 5 — `perf(c): Group C hygiene` (R1-010 … R1-014 remainder)

Spec traceability: `scroll-effects/spec.md` — Throttled Grid Offset Updates, ScrollProgress Redundant Write Skip; `hero-section/spec.md` — Resilient Canvas Acquisition; `i18n-runtime/spec.md` — Dynamic Document Language; `codebase-hygiene/spec.md` — Single Button Component (prop half). All manual/code-inspection verification per specs (NOT unit-tested).

- [ ] 5.1 `src/App.tsx`: wrap `--grid-offset` write in rAF gate (pending flag, latest-value var, initial call kept); delete unused `containerRef` + its ref attribute. Trace: Throttled Grid Offset Updates.
- [ ] 5.2 `src/components/effects/ScrollProgress.tsx`: cache last pct/scale, skip identical writes; stop rAF loop on no-change tick and restart via one-time passive `scroll`/`resize` listener. Trace: ScrollProgress Redundant Write Skip.
- [ ] 5.3 `src/components/sections/Hero.tsx`: replace single-rAF canvas lookup with self-rescheduling retry loop (closure `cancelled` flag, cleanup sets it, ~600-attempt cap + one warn). Trace: Resilient Canvas Acquisition.
- [ ] 5.4 `src/i18n/config.ts`: after `.init()`, set `document.documentElement.lang = lng` and subscribe `i18n.on('languageChanged', ...)`. Trace: Dynamic Document Language. Verify manually: EN↔ES toggle updates `<html lang>`.
- [ ] 5.5 `src/components/effects/MagneticButton.tsx`: drop unused `variant` prop from props type/usages. Trace: Single Button Component. Verify: only one button component remains; all call sites compile.
- [ ] 5.6 **Gates (final):** `npx tsc --noEmit && npm run build && npx vitest run`. Full manual browser pass: all sections render, EN/ES toggle end-to-end, contact form flows, film-grain/grid offset smoothness. Commit `perf(c): ...`.

---

## Acceptance cross-check (pre-PR)

- [ ] All proposal acceptance-criteria checkboxes re-verified against final state.
- [ ] Bundle-size delta recorded (Series 4) in `apply-progress.md`.
- [ ] Escalation trigger (Series header) not tripped; if tripped, re-forecast before PR.
