# Tasks: Portfolio 2026 — Editorial Redesign

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 300–450 |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | Kill list + color/type/photo (PR 1) → Hero + 3D (PR 2) |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: **Resolved**
Chained PRs recommended: **Yes**
Chain strategy: **stacked-to-main**
400-line budget risk: **Medium**

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Kill list + color + type + photo | PR 1 | Self-contained deletions + style edits, no layout risk |
| 2 | Hero redesign + 3D fidelity gate | PR 2 | Depends on PR 1; 3D budget unknown |

## Phase 1: Kill List — Deletions & Simplifications

- [x] 1.1 Delete: `BootSequence.tsx`, `CustomCursor.tsx`, `useCustomCursor.ts`, `useMagneticCursor.ts`, `useHoverSound.ts`, `lib/audio/click.ts`
- [x] 1.2 Strip `App.tsx`: remove `bootComplete` state, lazy-gating, BootSequence/CustomCursor imports + JSX
- [x] 1.3 Remove `.custom-cursor-active` block from `src/styles/globals.css`
- [x] 1.4 Rewrite `MagneticButton.tsx`: strip magnetic/hoverSound/audio imports; pure styled button, CSS hover only, no forwardRef
- [x] 1.5 Strip `Contact.tsx`: remove `useMagneticCursor` import, remove `magnetic` class from email + social links
- [x] 1.6 Strip `Hero.tsx`: replace `<MagneticButton>` with `<button>` CSS hover; remove `playClick` import
- [x] 1.7 Delete empty `src/lib/audio/` directory
- [x] 1.8 Verify: `npx tsc --noEmit` passes, `npm run build` passes

## Phase 2: Color Restraint

- [x] 2.1 `TypeWriter.tsx`: change cursor blink `bg-[#CCFF00]` → `bg-[#FFFFFF]`
- [x] 2.2 `AboutStack.tsx`: change photo caption `text-[#CCFF00]` → `text-[#FFFFFF]`
- [x] 2.3 Audit per-spec: confirm ≤3 green elements/section, no green body text, no green backgrounds >100px²

## Phase 3: Type Sizing

- [x] 3.1 Add body-size tokens to `globals.css` `@theme`: `--font-size-body-sm: 14px; --font-size-body-md: 15px; --font-size-body-lg: 16px;`
- [x] 3.2 `AboutStack.tsx`: bump bio body `text-[13px]` → `text-[14px]`/`text-[15px]`; confirm Geist Sans 400–500

## Phase 4: Photo Treatment

- [x] 4.1 `AboutStack.tsx`: remove hover filter classes (`hover:grayscale-[60%] hover:sepia-[60%] hover:hue-rotate-[40deg] hover:saturate-[3]`)
- [x] 4.2 Window dots: change `bg-[#333]` → `bg-[#FF5F57]`, `bg-[#FFBD2E]`, `bg-[#28C840]`
- [x] 4.3 Confirm grayscale always-on, `aspect-[3/4]`, `object-cover`, `loading="lazy"`, OPERATOR_ID caption from i18n

## Phase 5: Hero Redesign

- [ ] 5.1 Restructure `Hero.tsx` layout: `grid lg:grid-cols-[3fr_2fr] gap-12`, text column left, accent column right
- [ ] 5.2 Left column: mono display headline 100–160px (min 48px mobile), sans role labels 14–16px, 2× CTAs, `01/04 — HERO` indicator in `#666666`
- [ ] 5.3 Right column: empty `<div>` OR `<Canvas>` constrained to column bounds
- [ ] 5.4 Reposition Canvas from full-viewport absolute → `w-full h-full` inside right column; remove if 3D deleted
- [ ] 5.5 Mobile <768px: stack accent below text or hide

## Phase 6: 3D Fidelity Gate

- [ ] 6.1 Prototype branch: upgrade `WireframeCentroide.tsx` — `LineSegments`→`Line2`+`LineMaterial`, add `@react-three/postprocessing` `EffectComposer`+`Bloom` on `#CCFF00`
- [ ] 6.2 Measure gzip delta: if `@react-three/postprocessing` >50KB or <30fps → delete `WireframeCentroide.tsx`; else keep with contained Canvas
- [ ] 6.3 Clean up: if deleted, remove lazy import + `<WireframeCentroide>` JSX from Hero.tsx, archive 3D spec

## Phase 7: Verify

- [ ] 7.1 `npx tsc --noEmit` — 0 errors
- [ ] 7.2 `npm run build` — success, no dangling imports
- [ ] 7.3 Manual smoke: native cursor, no boot sequence, asymmetric hero, #CCFF00 only in allowed spots, photo grayscale static, body text 14–16px
