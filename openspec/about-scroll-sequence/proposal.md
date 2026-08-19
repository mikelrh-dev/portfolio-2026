# Proposal: About Scroll Sequence Integration

## Intent

Integrate the `SequenceAbout` frame sequence (199 PNGs) as a scroll-driven animated background for the About section, replacing the static layout. The Hero's existing `ScrollSequence` and the About sequence share one tall scroll container for a seamless, "alive" transition — no interruption between sections.

## Scope

### In Scope
- Single shared scroll container (~700vh) owning both Hero and About `ScrollSequence` instances
- Hero maps progress [0, 0.35], About maps [0.40, 1.0] with 5% crossfade overlap
- Move SequenceAbout frames from `asset/` to `public/assets/sequences/about/`, converted to `.webp`
- About content (bio text, stack tags) revealed by progress milestones via ScrollTrigger
- Remove the photo card from AboutStack

### Out of Scope
- New sections beyond About (future work deferred)
- Page navigation indicators tied to the shared container
- Alternative scroll animations (parallax, fade sections)
- Performance optimization beyond webp conversion

## Capabilities

### New Capabilities
- `scroll-sequence-about`: Scroll-driven animated background for About section with progress-based content reveals

### Modified Capabilities
- `about-stack-section`: Remove photo card requirement; add content-reveal-by-progress behavior
- `hero-section`: No spec-level changes — scroll container is a structural refactor, hero visual behavior unchanged

## Approach

1. **Wrapper component (`SharedScrollSequence.tsx`)** owns a single `ScrollTrigger` and tall container. Exposes two `externalProgress` MotionValues — one for Hero range, one for About range.
2. **Hero.tsx** receives its `externalProgress` and `containerRef` — its ScrollSequence uses that instead of owning its own.
3. **AboutStack.tsx** receives its `externalProgress`, renders `ScrollSequence` behind content. Photo card removed. Bio and tags use `useTransform` on progress to fade/translate in at milestones (e.g., 20% bio, 50% tags).
4. Frames moved to `public/assets/sequences/about/frame-{n}.webp`. 199 PNGs → webp via batch conversion tool.
5. Hero's exit animation (scale 0.85, blur, overlay) remapped to trigger at the end of its [0, 0.35] range.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/sections/Hero.tsx` | Modified | Consume `containerRef` + `externalProgress` instead of owning scroll |
| `src/components/sections/AboutStack.tsx` | Modified | Add ScrollSequence bg, remove photo card, add progress reveals |
| `src/components/sections/About.tsx` | Unchanged | Not used — confirmed |
| `src/App.tsx` | Modified | Mount `SharedScrollSequence` wrapper around Hero + AboutStack |
| `src/components/effects/ScrollSequence.tsx` | Unchanged | Already supports `containerRef` + `externalProgress` |
| `asset/SequenceAbout/` | N/A | Frames moved to `public/assets/sequences/about/` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| 199 PNG frames → memory/performance | Medium | Convert to webp; lazy-load frames via existing `useImageSequence` hook; test on mobile |
| GSAP/ScrollTrigger conflict with shared container | Low | Single `ScrollTrigger` in wrapper — no overlapping triggers on same container |
| Hero exit animation (scale/blur) breaks with new ranges | Low | Remap to trigger at end of Hero's [0, 0.35] range; verify crossfade smoothness |
| Mobile scroll performance with two canvas renderers | Medium | Consider reducing About frame count on mobile; test frame rate |

## Rollback Plan

Revert `App.tsx`, `Hero.tsx`, and `AboutStack.tsx` to current state. Restore photo card. Keep frame files in `public/` (no-op if unused). No DB or data changes — purely UI.

## Dependencies

- Existing `ScrollSequence` and `useImageSequence` hooks (no changes needed)
- Batch webp conversion tool (e.g., `sharp`, `imagemagick`, or `squoosh-cli`)

## Success Criteria

- [ ] Scrolling from top to ~35% plays Hero sequence with exit animation as before
- [ ] Scrolling past ~40% smoothly crossfades into About sequence frames
- [ ] About bio text appears by ~20% of About range, stack tags by ~50%
- [ ] Photo card removed from AboutStack
- [ ] No GSAP console errors or ScrollTrigger conflicts
- [ ] Works on mobile (frame rate acceptable)
