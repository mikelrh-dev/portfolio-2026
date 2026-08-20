# Tasks: About Scroll Sequence Integration

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 350–450 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation + SharedScrollSequence | Single PR | All changes in one PR (~350-450 lines). If budget tight, Hero exit + About content can be validated independently. |

## Phase 1: Foundation — Frame Conversion

- [ ] 1.1 **Install `sharp`**: `npm install -D sharp`
- [ ] 1.2 **Create `scripts/convert-frames.mjs`**: Read 199 PNGs from `asset/SequenceAbout/ezgif-frame-{n}.png` (n=001..199), output webp to `public/assets/sequences/about/frame-{n}.webp` with `{ quality: 80, width: 1920, withoutEnlargement: true }`
- [ ] 1.3 **Run conversion**: `node scripts/convert-frames.mjs` and verify 199 webp files exist under `public/assets/sequences/about/`

## Phase 2: Core — SharedScrollSequence Wrapper

- [ ] 2.1 **Create `src/components/effects/SharedScrollSequence.tsx`**: Owns one ~700vh scroll container. Uses GSAP ScrollTrigger to produce `totalProgress` (`MotionValue<number>` 0→1). Exposes context via `ScrollSequenceContext` with `{ heroProgress, aboutProgress, totalProgress, containerRef }`. Uses `useTransform` to split: `heroProgress` maps totalProgress [0, 0.35]→[0, 1], `aboutProgress` maps [0.40, 1.0]→[0, 1]. Crossfade region [0.35, 0.40]: drive Hero opacity 1→0 and About opacity 0→1 via useTransform on totalProgress. Both canvases always mounted (Hero z-index higher).
- [ ] 2.2 **Create `ScrollSequenceContext`**: Export context type `{ heroProgress, aboutProgress, totalProgress, containerRef }` from SharedScrollSequence.tsx so consumers can import.

## Phase 3: Hero Refactoring — Context Consumption

- [ ] 3.1 **Remove GSAP exit timeline from `src/components/sections/Hero.tsx`**: Delete `useLayoutEffect` block (lines 27-126) and its imports (`gsap`, `ScrollTrigger`, `gsap/ScrollTrigger`, `useLayoutEffect`). Delete `containerRef`, `titleRef`, `indicatorRef`, `fadeToBlackRef`, `gridProxy`.
- [ ] 3.2 **Add context + useTransform**: Import `useContext`, `ScrollSequenceContext`, `useTransform`, `motion`. Read `heroProgress` from context. Replace all exit behavior with useTransform: title opacity/blur, canvas scale/opacity/blur, fade overlay opacity, grid opacity (via useEffect setting `--grid-opacity` CSS var on change).
- [ ] 3.3 **Tagline reveal via useTransform**: Use `useTransform(heroProgress, [0.04, 0.05], [0, 1])` + `useEffect` to gate `showTagline` when transformed value > 0.5.
- [ ] 3.4 **JSX refactor**: Pass `containerRef` from context to `<ScrollSequence>`. Apply motion styles via inline `style={{ opacity, filter, scale }}` from useTransform values.

## Phase 4: AboutStack Refactoring — Scroll Background + Content Reveals

- [ ] 4.1 **Remove photo card from `src/components/sections/AboutStack.tsx`**: Delete lines 75-100 (terminal chrome, profile image, caption). Change grid from `lg:grid-cols-3` → `lg:grid-cols-2`.
- [ ] 4.2 **Consume context**: Import `ScrollSequenceContext` and read `aboutProgress`, `containerRef`. Accept optional `isMobile` prop.
- [ ] 4.3 **Add ScrollSequence background**: Insert `<ScrollSequence frameCount={isMobile ? 99 : 199} basePath="/assets/sequences/about/frame-" ext=".webp" containerRef={containerRef} externalProgress={aboutProgress} />` as first child inside section. Wrap content in `relative z-20` layer above canvas.
- [ ] 4.4 **Progress-based content reveals**: Use `useTransform(aboutProgress, [milestone_start, milestone_end], [0, 1])` for each content group per spec R2: section indicator (0.08), bio paragraphs (0.20, 0.30, 0.40, 0.50), stack header (0.55), category tags staggered (0.60–0.75). Apply opacity and translateY transforms to each element.

## Phase 5: Integration — App.tsx Wiring

- [ ] 5.1 **Wrap sections in `src/App.tsx`**: Import `<SharedScrollSequence>` and wrap `<Hero />` + `<AboutStack />`. Keep existing grid parallax `useEffect` (independent of scroll sequence). Verify no layout shifts.

## Phase 6: Verification

- [ ] 6.1 **Build check**: `npm run build` passes with no TypeScript or lint errors.
- [ ] 6.2 **Scroll behavior**: Scrolling from top to ~35% plays Hero sequence with exit animation. Scrolling past ~40% crossfades into About sequence.
- [ ] 6.3 **Content reveals**: About bio fades in by milestones, stack tags by category, reverse scroll hides content symmetrically.
- [ ] 6.4 **No photo card**: `lg:grid-cols-2` grid, no terminal chrome or profile image in DOM.
- [ ] 6.5 **Mobile**: Viewport ≤ 768px loads 99 frames; acceptable framerate.
- [ ] 6.6 **Console**: No GSAP/ScrollTrigger errors, no infinite loops.
