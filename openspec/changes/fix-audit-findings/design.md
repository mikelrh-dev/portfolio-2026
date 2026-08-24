# Design: fix-audit-findings

**Change ID:** `fix-audit-findings` · **Date:** 2026 · **Status:** designed
**Inputs:** proposal.md, specs/{error-handling, codebase-hygiene, hero-section, scroll-effects, contact-section}/spec.md, openspec/config.yaml
**Budget:** ~300 est. changed lines vs. 400 budget → **single PR, sequential commit series** (per proposal forecast).

## Context summary

React 18 + Vite 5 SPA, no test runner installed (`testing.runner: none`,
strict_tdd degraded-minimum). All fixes are localized edits; no redesign.
Key source files read: `main.tsx`, `KineticHeadline.tsx`, `useScrollSpy.ts`,
`useImageSequence.ts`, `ScrollSequence.tsx`, `Hero.tsx`, `Contact.tsx`,
`App.tsx`, `Nav.tsx`, `ScrollProgress.tsx`, `MagneticButton.tsx`,
`ui/Button.tsx`, `ui/splite.tsx`, `vite.config.ts`, `package.json`,
`i18n/config.ts`, locale JSONs.

---

## Decision 1 — Error-overlay gate as pure function (R1-001, R1-002)

### Approach

Extract overlay logic out of `main.tsx` into a new module
`src/lib/errorOverlay.ts` so the gate decision and overlay-singularity
behavior are unit-testable without touching bootstrap:

```ts
// src/lib/errorOverlay.ts
export function shouldShowFatalOverlay(isDev: boolean): boolean {
  return isDev === true;
}

const OVERLAY_ID = 'fatal-diagnostic-overlay';

export function showFatal(msg: string, detail?: unknown): void {
  // Reuse a single node: getElementById(OVERLAY_ID) ?? create+append.
  // Update textContent in place — never accumulates duplicates.
}
```

### `main.tsx` rewiring (bootstrap stays intact)

- Handlers become:

```ts
window.addEventListener('error', (e) => {
  console.error('[window.error]', e.error || e.message);
  if (shouldShowFatalOverlay(import.meta.env.DEV)) showFatal(e.message, e.error);
});
```

- Same pattern for `unhandledrejection` and the two `catch` blocks
  (i18n init, `React.render`). In prod: `console.error` only; the existing
  `ErrorBoundary` (already wrapping `App`) remains the sole user surface.
- Remove all three `[BOOT] console.log` lines; keep the two
  `console.error('[BOOT] ... failed')` paths (R1-002 — errors stay).
- The `#root`-missing branch: log via `console.error`; overlay only in DEV.

### Why this shape

- `import.meta.env.DEV` is read at the **call site**, not inside the helper,
  keeping `shouldShowFatalOverlay(isDev: boolean)` pure and injectable in
  tests (spec verification requires exactly this).
- Moving `showFatal` into `lib/` lets a jsdom test call it N times and assert
  exactly one overlay node (No-Accumulation requirement). Bootstrap order in
  `main.tsx` is otherwise untouched (imports hoisted, listeners attached
  before `initI18n()` / render — same as today).

---

## Decision 2 — KineticHeadline rewrite: imperative DOM, same effect (R1-003)

### Approach: keep the imperative useEffect, swap the sink

Two candidate approaches were weighed:

| Option | Verdict |
| --- | --- |
| **A. Imperative DOM construction inside the existing `useEffect`** | ✅ Chosen. GSAP targets need real DOM nodes *before* `gsap.set`/`ScrollTrigger.create` run; Option A is a surgical replacement of 4 lines, zero animation-code changes → guaranteed stagger parity. |
| B. Render word-spans as React elements + ref map | Rejected. Requires restructuring JSX return, a ref-collection mechanism, and reordering effect timing; larger diff (~40 lines) with higher regression risk against the exact-stagger requirement — for zero safety gain over A. |

Replacement of the `innerHTML` block (KineticHeadline.tsx:42-44):

```ts
const words = children.split(' ');
el.textContent = ''; // clear previous spans (idempotent re-runs)
words.forEach((word, i) => {
  const span = document.createElement('span');
  span.className = 'kinetic-word';
  span.style.display = 'inline-block';
  span.textContent = word;
  el.appendChild(span);
  if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
});
```

Everything downstream is byte-identical: `el.querySelectorAll('.kinetic-word')`
→ `gsap.set({ opacity: 0, y: 40 })` → `ScrollTrigger.create({ start: 'top 85%',
once })` → `gsap.to({ duration: 0.8, stagger, ease: 'power3.out' })`.
Whitespace between words is preserved via text nodes (matches the old
`.join(' ')` output). Reduced-motion branch (plain `{children}` text) untouched.
Verification: pixel-compare in dev + `grep innerHTML src/` returns nothing.

---

## Decision 3 — Contact form: honeypot name + fetch-based status flow (R1-007)

### Honeypot field name: `company_website`

Formspree treats **all underscore-prefixed fields as reserved/special**
(`_replyto`, `_subject`, `_cc`, `_next`, `_format`, and `_gotcha` is
Formspree's own native honeypot). Using `_gotcha` would collide with /
double-drive Formspree's server-side honeypot semantics; any other `_name`
risks 400s or silent special handling.

Decision: **`company_website`** — an innocuous bot-bait name that Formspree
treats as an ordinary field (inert if ever sent; it never will be, because
the client blocks submission). Hidden wrapper:

```tsx
<div className="absolute -left-[5000px] top-auto" aria-hidden="true">
  <label htmlFor="company_website">Company website</label>
  <input type="text" name="company_website" id="company_website"
         tabIndex={-1} autoComplete="off" />
</div>
```

(Off-screen positioning rather than `display:none` — some bots skip
`display:none` fields.)

### Submit mechanism: native POST action → controlled `fetch`

The current form uses `method="post" action={formspree-url}`, which navigates
away and makes success/error/pending feedback impossible. Minimal conversion:

```ts
type SubmitStatus = 'idle' | 'pending' | 'success' | 'error';

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  if ((data.get('company_website') ?? '').toString().trim() !== '') {
    setStatus('success'); // silent bot trap: pretend success, send nothing
    return;
  }
  setStatus('pending');
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });
    setStatus(res.ok ? 'success' : 'error');
  } catch {
    setStatus('error');
  }
};
```

- Status region below the button:
  `<p role="status" aria-live="polite">` rendering
  `t('contact.form.status_success')` / `t('contact.form.status_error')`.
- Submit control: `disabled={status === 'pending'}` and label swaps to
  `t('contact.form.status_sending')` while pending (double-submit prevention).
- New i18n keys in **both** `en.json` + `es.json` under existing
  `contact.form.*` namespace: `status_success`, `status_error`,
  `status_sending`.
- Endpoint string `https://formspree.io/f/xeoldrbg` unchanged (hoisted to a
  module const). No captcha, no backend change.
- Manual verify against the live endpoint before merge (proposal risk item).

---

## Decision 4 — Scroll-spy dep stabilization (R1-004)

Root cause: `Nav.tsx:7` passes an inline array literal, so `sectionIds`
identity changes every render → `useEffect([sectionIds])` tears down and
recreates the IntersectionObserver per render.

Fix: module-level constant exported next to the hook:

```ts
// src/hooks/useScrollSpy.ts
export const SECTION_IDS = ['hero', 'about', 'work', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];
```

- `Nav.tsx` imports `SECTION_IDS` and passes it (also replaces its private
  `sectionOrder` literal with `SECTION_IDS` — one source of truth).
- Hook body unchanged; `[sectionIds]` dep is now referentially stable, so the
  observer is created once per mount.
- No memoization needed (a module constant beats `useMemo` here — zero
  per-instance cost, trivially assertable reference equality).
- Vitest: mock `IntersectionObserver`, `renderHook(() => useScrollSpy([...]))`,
  rerender ×3, assert constructor called once.

---

## Decision 5 — Image-sequence failed-frame fallback (R1-005)

Current defect: `onerror` increments `completed` but leaves
`results[i] = null`; after `ready`, `ScrollSequence.drawAt(i)` hits
`if (!img) return;` → permanent blank flash whenever progress maps to that
frame.

### Strategy: nearest-loaded backfill via pure helper

New pure module `src/lib/frameFill.ts` (unit-testable, no DOM):

```ts
/** Replace null slots with the nearest non-null neighbor (ties → earlier). */
export function fillFailedFrames<T>(frames: (T | null)[]): (T | null)[]
```

Rules: scan distance 1,2,3… in both directions; prefer the closer neighbor,
tie-break toward the earlier frame; all-null input returns all-null
(degenerate case, pre-existing behavior, one aggregate warning).

In `useImageSequence`:

- Track `failedIndices: Set<number>` locally in the effect; on `img.onerror`
  add the index and `console.warn('[useImageSequence] frame %d failed; skipped', i)`
  **once per index** (emission happens only in `onerror`, which fires once —
  later scrolls never re-warn because nothing re-triggers load).
- On completion (`completed === frameCount`):
  `setImages(fillFailedFrames(results))` — post-ready array contains no nulls
  unless *every* frame failed.
- Public hook signature and `ScrollSequence` consumption (`images[i]`) are
  unchanged; the consumer's existing `if (!img) return` guard stays as a
  belt-and-braces for the all-failed case.
- Vitest: synthetic failing URL (or direct `fillFailedFrames` tests +
  a hook test stubbing `Image`), assert no null mid-sequence slot and a
  single warning per failed frame.

---

## Decision 6 — Dependency + dead-file removal plan (R1-009, part of R1-008/R1-014)

Verified by grep: the only import graph edge into 3D packages is
`splite.tsx → '@splinetool/react-spline'`; `splite.tsx` itself is imported
nowhere. `'three.js'` in `SelectedWork.tsx` is a string literal (skill tag),
not an import — safe.

Removal sequence (order matters — file deletions **before** uninstall):

1. Delete `src/components/ui/splite.tsx` (dead Spline consumer).
2. Delete `src/components/ui/Button.tsx` (R1-014: unused — zero call sites;
   `MagneticButton` is the surviving component).
3. `package.json` removals:
   - deps: `three`, `@react-three/fiber`, `@react-three/drei`,
     `@react-three/postprocessing`, `@splinetool/react-spline`, and
     **`@splinetool/runtime`** (direct dep whose only consumer was the Spline
     path — proposal lists react-spline; runtime goes with it).
   - devDeps: `@types/three` ("if present" clause — it is present).
4. `vite.config.ts`: delete the entire `optimizeDeps.include` block — all
   three entries (`three`, `@react-three/fiber`, `@react-three/drei`)
   reference removed packages; no other optimizeDeps config exists.
5. `npm install` to refresh `package-lock.json`; then gates:
   `npx tsc --noEmit` (type-level stragglers), `npm run build` (module
   resolution), record dist size before/after in apply-progress.md.
   Rollback = revert the commit / restore package.json entries.

---

## Decision 7 — Vitest setup (lands FIRST in apply)

Per `openspec/config.yaml` (strict_tdd, degraded-minimum): the runner must
exist before any red/green cycle. First apply commit:

**devDependencies added:** `vitest` (^2.x), `jsdom`, `@testing-library/react`
(^16, provides `renderHook`).

**package.json scripts:** `"test": "vitest run"`, `"test:watch": "vitest"`.

**Config:** new `vitest.config.ts` (separate file keeps `vite.config.ts`
build-only):

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'jsdom',
    globals: false,           // explicit imports (describe/it/expect)
    css: false,
  },
});
```

**Test targets (only what tasks require — logic-level, no snapshot bloat):**

| Test file | Covers |
| --- | --- |
| `src/lib/errorOverlay.test.ts` | `shouldShowFatalOverlay(true/false)`; `showFatal` ×N → exactly one `#fatal-diagnostic-overlay` node |
| `src/lib/frameFill.test.ts` | nearest-loaded backfill: middle gap, leading gap, trailing gap, all-null, tie-break |
| `src/hooks/useScrollSpy.test.ts` | observer constructed once across re-renders; stable `SECTION_IDS` reference |
| `src/hooks/useImageSequence.test.ts` | stubbed `Image`: failed frame yields no null slot post-ready; single warning |
| `src/i18n/locales.test.ts` | `hero.cta_systems` / `hero.cta_contact` exist and are non-empty in BOTH locales |

Everything else relies on `tsc --noEmit` + `npm run build` + manual browser
pass (matches each spec's declared verification method).

---

## Group C designs (small, independent)

- **R1-010 `App.tsx`:** wrap the `--grid-offset` write in an rAF gate —
  handler stores latest `scrollY` in a local var; a `pending` flag ensures at
  most one write per frame; initial call kept. Delete `containerRef` and its
  `ref=` attribute on the root div (verified unused).
- **R1-011 `ScrollProgress.tsx`:** cache `lastPct` / `lastScale`; skip both
  writes when unchanged. When a tick produces no change, do **not** schedule
  the next rAF; instead register a one-time passive `scroll` (+`resize`)
  listener that restarts the loop. Loop therefore runs only while values
  actually change (literal spec compliance, zero idle-frame cost).
- **R1-012 `Hero.tsx` canvas acquisition:** replace the single
  `requestAnimationFrame(setup)` with a self-rescheduling lookup loop:
  `cancelled` closure flag; each frame tries `section.querySelector('canvas')`;
  found → subscribe transforms and stop; not found → next rAF. Cleanup sets
  `cancelled = true` (no leaked callbacks). Cap at ~600 attempts with one
  `console.warn` (defensive bound; never hit in practice).
- **R1-013 `<html lang>`:** in `i18n/config.ts` `initI18n`, after `.init()`:
  set `document.documentElement.lang = lng` and register
  `i18n.on('languageChanged', (lng) => { document.documentElement.lang = lng; })`.
  Single choke point covers boot + `changeLanguage` toggle; no component
  changes.
- **R1-014:** covered in Decision 6 step 2 — keep `MagneticButton` (sole
  component with call sites; supports `href` dual-render), delete
  `ui/Button.tsx`, drop the unused `variant` prop from
  `MagneticButtonProps`.

---

## File change manifest

| File | Action | Finding |
| --- | --- | --- |
| `vitest.config.ts`, `package.json` | add runner/scripts/deps | infra |
| `src/lib/errorOverlay.ts` | new | R1-001 |
| `src/main.tsx` | edit (gate + log hygiene) | R1-001, R1-002 |
| `src/components/sections/About.tsx` | delete | R1-008 |
| `src/components/effects/KineticHeadline.tsx` | edit (DOM-safe split) | R1-003 |
| `src/hooks/useScrollSpy.ts`, `src/components/Nav.tsx` | edit (SECTION_IDS) | R1-004 |
| `src/lib/frameFill.ts` | new | R1-005 |
| `src/hooks/useImageSequence.ts` | edit (backfill + warn-once) | R1-005 |
| `src/i18n/locales/{en,es}.json` | edit (CTA keys, form status keys) | R1-006, R1-007 |
| `src/components/sections/Hero.tsx` | edit (CTA keys, canvas retry) | R1-006, R1-012 |
| `src/components/sections/Contact.tsx` | edit (honeypot, fetch, status) | R1-007 |
| `src/components/ui/splite.tsx`, `src/components/ui/Button.tsx` | delete | R1-009, R1-014 |
| `package.json`, `vite.config.ts`, lockfile | prune 3D deps/entries | R1-009 |
| `src/App.tsx` | edit (rAF gate, drop containerRef) | R1-010 |
| `src/components/effects/ScrollProgress.tsx` | edit (write guard + sleep) | R1-011 |
| `src/i18n/config.ts` | edit (html lang sync) | R1-013 |
| `src/components/effects/MagneticButton.tsx` | edit (drop variant prop) | R1-014 |
| 5×`*.test.ts` | new | TDD targets |

## Rollout (commit series within one PR)

1. `chore(test)`: vitest setup (**first** — enables red/green for the rest).
2. `fix(a)`: error-overlay gating + `[BOOT]` removal + About.tsx deletion.
3. `fix(b)`: KineticHeadline, useScrollSpy/Nav, useImageSequence/frameFill,
   Hero CTAs, Contact form hardening.
4. `chore(deps)`: splite/Button deletion → package.json/vite.config pruning →
   lockfile refresh → build + bundle-size delta recorded.
5. `perf(c)`: App rAF gate, ScrollProgress sleep, Hero canvas retry,
   html lang, MagneticButton cleanup.

Each series independently revertible; global gates (`tsc --noEmit`, `npm run
build`, manual EN/ES + form pass) run after each series and before PR.

## Risks

| Risk | Mitigation |
| --- | --- |
| Stagger regression in KineticHeadline | Animation code untouched (only span construction swapped); pixel-compare in dev; revert commit 3. |
| Formspree rejects new field/header shape | `company_website` is a plain field (never sent when honeypot works); `Accept: application/json` is Formspree's documented AJAX mode; manual live-endpoint verify before merge. |
| Hidden dep reference breaks build | `tsc --noEmit` + build gate immediately after removal; rollback = restore package.json entry. |
| Prod errors become invisible | `console.error` retained in all prod paths; ErrorBoundary UI unchanged; DEV overlay fully preserved. |
| Vitest/jsdom version friction with Vite 5 | Pin vitest ^2 line (Vite-5-compatible); setup commit is isolated so failures don't block other groups' code review. |
