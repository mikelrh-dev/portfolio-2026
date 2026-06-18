# Design: Portfolio 2026 — Cyber-Tech Hacker Prototype

## Technical Approach

Clean-slate replacement from tactile-brutalism. Cyber-tech hacker aesthetic: JetBrains Mono sole face, electric green `#CCFF00` on black, ALL CAPS display 128-80px, bracket CTAs `[ TEXT → ]`, `01/03` section indicators. R3F EdgesGeometry wireframe centroide (10 components, 1 green) assembled via GSAP ScrollTrigger with mouse inertia lerp. Microinteractions: magnetic cursor + Web Audio oscillator clicks. Tailwind v4 `@theme` for design tokens.

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Mono-only vs dual font | Denser at small sizes but sharper aesthetic | JetBrains Mono 400/700 everywhere |
| EdgesGeometry vs postprocessing | Postprocessing bloats bundle + GPU cost | LineSegments — native, zero deps |
| Drei `<Html>` vs CSS overlay | `<Html>` auto-occludes with z-depth | Drei `<Html>` `occlude` — zero projection math |
| GSAP `onUpdate` vs FM scroll | FM adds bundle, same fidelity | GSAP `onUpdate` — proven from v1 |
| Custom magnetic hook vs FM spring | Custom ~1KB, explicit pointer math | Custom `useMagneticCursor` |
| Web Audio `OscillatorNode` vs audio file | Zero network, ~10 LOC | 800Hz 40ms, lazy AudioContext |
| Lazy import R3F vs eager | Eager blocks main thread | `React.lazy()` + `Suspense` |
| Static JSON i18n vs fetch | Static = zero latency, bundled | Static imports, 52 keys |

## Data Flow

```
Scroll ──→ GSAP ScrollTrigger ──→ scrollProgress ref (0-1)
              │                              │
              ▼                              ▼
         GSAP timelines              R3F useFrame
         (kinetic headlines)         (centroide lerp)
              │                              │
              └────────── Canvas ────────────┘
                           │
                     Mouse Move ──→ lerp(0.05) ──→ Group.rotation

CTA Hover ──→ playClick() ──→ OscillatorNode (800Hz, 40ms)
CTA Hover ──→ useMagneticCursor → translate(el, delta * 0.4)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `index.html`, `package.json`, `vite.config.ts`, `tsconfig.json` | Create | Vite 5 + React 18 scaffold, R3F optimizeDeps, @ alias |
| `src/main.tsx`, `src/App.tsx` | Create | React root, i18n init, 4-section scroll layout |
| `src/styles/tokens.css` | Create | Cyber palette CSS vars (`--color-accent: #CCFF00`) |
| `src/styles/globals.css` | Create | Tailwind v4 `@theme` block with JB Mono + type scale |
| `src/styles/film-grain.css` | Create | SVG noise data-URI `body::before` overlay |
| `src/components/sections/Hero.tsx` | Create | 128px headline, centroide, `[ VER_TRABAJO → ]` CTAs |
| `src/components/sections/SelectedWork.tsx` | Create | Bento grid, 1 featured + 4 cards |
| `src/components/sections/AboutStack.tsx` | Create | Bio + [STACK] categories two-column |
| `src/components/sections/Contact.tsx` | Create | 56px email, socials, footer |
| `src/components/three/WireframeCentroide.tsx` | Create | 10 EdgesGeometry parts, 1 green, scroll + mouse, Drei labels |
| `src/components/effects/` (FilmGrain, MagneticButton, KineticHeadline) | Create | 3 effect components |
| `src/components/ui/` (Button, Tag, Card) | Create | Bracket CTA, stack tag, project card |
| `src/hooks/` (useMagneticCursor, useScrollProgress, useReducedMotion, useScrollSpy) | Create | 4 custom hooks |
| `src/lib/audio/click.ts`, `src/lib/three/utils.ts` | Create | Web Audio + THREE math wrappers |
| `src/i18n/` (en.json, es.json, config.ts) | Create | 52 keys static imports |
| `src/content/projects/*.ts` | Create | 4 project data modules |

## Interfaces / Contracts

```ts
interface CentroideProps { scrollProgress: React.MutableRefObject<number> }
function useMagneticCursor<T extends HTMLElement>(strength?: number): {
  ref: React.RefObject<T>; style: React.CSSProperties
}
export function playClick(): void // lazy AudioContext, idempotent
type Locale = 'en' | 'es'

interface ProjectMeta {
  index: string; title: string; impact: string;
  stack: string[]; link: string; image: string; featured: boolean
}

interface I18nShape {
  nav: Record<string, string>;
  hero: { headline: string; highlight: string; cta_work: string; cta_contact: string };
  work: { indicator: string; headline: string; projects: ProjectMeta[] };
  about: { indicator: string; headline: string; bio: string; stack_categories: Record<string, string[]> };
  contact: { indicator: string; headline: string; email: string; socials: SocialLink[]; footer: string[] };
}
```

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Unit | `playClick()` oscillator params | Manual verify (no Audio in CI) |
| Unit | `useMagneticCursor` delta math | RTL component test |
| Visual | Centroide assembly at 0%/50%/100% scroll | Browser + devtools |
| Visual | Film grain compositing | CSS inspection |
| Visual | Bracket CTA hover states | Browser interaction |
| Integration | i18n 52-key toggle | Browser manual (deferred) |

## Migration / Rollout

Replace `portfolio-2026/` entirely. Previous artifacts preserved under `openspec/changes/portfolio-2026-tactile-brutalism/`. `npm install && npm run dev` must work clean. Stitch screens are visual blueprint — deviations are design issues.

## Open Questions

None — all technical decisions resolved per proposal. Design maps directly to Stitch screens.
