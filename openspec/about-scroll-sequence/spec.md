# Delta Specs: About Scroll Sequence Integration

## Domain: scroll-sequence-about (New)

### Purpose
Drive a 199-frame canvas animation as an animated background for the About section, driven by the shared scroll container's external progress and crossfading from the Hero sequence.

### Requirements

#### R1: Frame Sequence Rendering
The system MUST render frames from `/assets/sequences/about/frame-{n}.webp` (n=001..199) with progress mapped from total scroll range [0.40, 1.0].

- **GIVEN** the shared container provides externalProgress
- **WHEN** total scroll progress is 0.40
- **THEN** frame 001 is displayed on the About canvas
- **WHEN** total scroll progress is 1.0
- **THEN** frame 199 is displayed

- **GIVEN** total scroll progress is below 0.40
- **WHEN** the About canvas is mounted
- **THEN** the canvas MUST render at opacity 0 (invisible, not rendering frames)

#### R2: Content Reveal Milestones
The system MUST reveal About section content at these progress points (relative to About's internal [0, 1] range, which maps to total scroll [0.40, 1.0]):

| Milestone | About progress | Behavior |
|-----------|---------------|----------|
| Canvas appear | 0.00–0.05 | About canvas opacity 0→1; Hero canvas 1→0 |
| Section indicator | 0.08 | Fade in, translateY 0→0 |
| Bio paragraph 1 | 0.20 | Opacity 0→1, translateY 20px→0 |
| Bio paragraph 2 | 0.30 | Same transition |
| Bio paragraph 3 | 0.40 | Same transition |
| Bio paragraph 4 | 0.50 | Same transition |
| Stack header | 0.55 | Fade in |
| Category tags | 0.60–0.75 | Staggered by category, 5% each |
| Full reveal | 0.85 | All content visible, hold until end |

- **GIVEN** a user scrolls downward through the About range
- **WHEN** aboutProgress crosses each milestone threshold
- **THEN** the corresponding element transitions using opacity and translateY with ease-out

- **GIVEN** a user scrolls upward (reverse direction)
- **WHEN** aboutProgress falls below a milestone threshold
- **THEN** the content MUST fade OUT symmetrically (reverse the transition), leaving no stale state

#### R3: Crossfade Window
During the overlap range [0.35, 0.40] of total scroll:

- Hero canvas opacity MUST transition 1→0 linearly
- About canvas opacity MUST transition 0→1 linearly
- About text content MUST remain hidden (opacity 0, not interactive)
- Background grid overlay opacity SHOULD hold at Hero's exit intensity then fade to 0

- **GIVEN** total scroll progress is 0.375
- **WHEN** both canvases are mounted and rendering
- **THEN** Hero canvas opacity ≈ 0.5, About canvas opacity ≈ 0.5
- **AND** no frame flicker, black gap, or jarring jump between sequences

#### R4: Mobile Frame Reduction
On viewport width ≤ 768px, the system MAY reduce the About frame count to 99 (every other frame, starting with frame 001).

- **GIVEN** viewport width ≤ 768px
- **WHEN** the ScrollSequence mounts
- **THEN** it loads and displays 99 frames (frame-001, frame-003, frame-005, ...)

- **GIVEN** the viewport is resized from ≤768px to >768px
- **WHEN** the sequence is already mounted
- **THEN** frame count SHOULD stay at 99 until next full mount (no hot-swap)

#### R5: Loading UX
While frames preload, the canvas MUST show a solid black background and the loading percentage from the `useImageSequence` hook.

- **GIVEN** a user visits the page
- **WHEN** frame loading progress < 1
- **THEN** the canvas displays a black background with "loading XX%" text (mono, 10px, #666)
- **AND** no partially-decoded frames flash during load

#### R6: Frame Format
All frames MUST be served as webp, max dimension 1920px on the long side, quality 80.

- **GIVEN** a frame file is served
- **THEN** it is `.webp` format, max dimension 1920px, quality 80
- **AND** it resides at `public/assets/sequences/about/frame-{n}.webp`

#### R7: Scroll Reverse — Hero Reset
When the user scrolls back up past the crossfade threshold into Hero's [0, 0.35] range:
- Hero canvas MUST restore scale 1, opacity 1, blur 0
- Grid overlay MUST reset to 0
- Fade overlay MUST reset to 0

- **GIVEN** a user scrolls past 0.40 then reverses
- **WHEN** total scroll progress re-enters ≤ 0.35
- **THEN** all Hero exit animation state is reversed (no stale transforms)
- **AND** no visual artifacts from the About section persist while Hero is visible

#### R8: Resize Behavior
The shared container MUST recalculate its ScrollTrigger on viewport resize.

- **GIVEN** a user resizes the browser window
- **WHEN** the resize completes
- **THEN** ScrollTrigger.refresh() fires and all progress values update
- **AND** both canvases repaint to the correct frame for the new scroll position

---

## Domain: about-stack-section (Modified)

### ADDED Requirements

#### AR1: Animated Canvas Background
The About section MUST render a ScrollSequence as a full-viewport sticky background, receiving `externalProgress` from the shared container.

- **GIVEN** the About section mounts within `SharedScrollSequence`
- **WHEN** the section renders
- **THEN** a `<canvas>` element covers the full section background in a sticky container
- **AND** it receives `externalProgress` mapped to the About range [0.40, 1.0]

#### AR2: Progress-Based Content Reveal
The About section's bio paragraphs, section indicator, stack header, and category tags MUST use `useTransform` on `aboutProgress` to fade/translate in at the milestones specified in scroll-sequence-about R2.

- **GIVEN** the About section renders
- **WHEN** aboutProgress is 0.0
- **THEN** all content elements are hidden (opacity 0)
- **WHEN** aboutProgress reaches 0.20
- **THEN** Bio paragraph 1 begins its fade-in transition
- **WHEN** aboutProgress reaches 0.85
- **THEN** all content is fully visible

#### AR3: Grid Layout — Photo Card Removal
The photo card panel MUST be removed from the About section layout. The grid MUST collapse to `grid-cols-1 lg:grid-cols-2` (bio column + stack column).

- **GIVEN** the About section renders
- **WHEN** inspecting the layout
- **THEN** no photo card, terminal chrome, profile image, or caption is present in the DOM
- **AND** the grid uses `grid-cols-1 lg:grid-cols-2`
- **AND** the existing bio and stack cards fill the available columns

### MODIFIED Requirements

#### MR1: Bio Content
The section MUST render bio paragraphs from i18n as described in the existing spec, with the addition that each paragraph is individually revealed by aboutProgress at the milestones in R2.

(Previously: bio rendered all paragraphs simultaneously at section mount)

- **GIVEN** a user scrolls through the About range
- **WHEN** aboutProgress enters each paragraph's reveal range
- **THEN** that paragraph fades in with opacity and translateY transition
- **AND** paragraphs before the current threshold remain visible
- **AND** paragraphs after the current threshold remain hidden

- **GIVEN** the user switches from EN to ES locale
- **WHEN** the bio re-renders
- **THEN** content updates without page refresh
- **AND** visibility state per paragraph is preserved

### REMOVED Requirements

#### RR1: Photo Card
(Reason: Replaced by animated frame background. The third panel no longer fits in layout — visual focus shifts to the scroll-driven canvas animation.)
(Migration: Remove `<Card>` with terminal chrome, profile image, and caption from AboutStack.tsx. Update grid from `lg:grid-cols-3` to `lg:grid-cols-2`.)
