# Design: Portfolio 2026 — Tactile Brutalism Prototype

## Technical Approach

Clean-slate React 18 + Vite 5 replacement of the existing Astro project. Single-page SPA with 4 sections driven by scroll. 3D wireframe centroide (R3F LineSegments + EdgesGeometry) as visual centerpiece, assembled via GSAP ScrollTrigger progress and tracked with liquid mouse inertia. Tactile microinteractions via custom hooks (magnetic cursor, Web Audio oscillator clicks). CSS-first Tailwind v4 `@theme` for strict design tokens (0px radius, `#000` bg, `#CCFF00` accent, 1px `#222` borders).

## Architecture Decisions

| Option | Tradeoff | Decision |
|--------|----------|----------|
| React 18 + Vite 5 vs Astro | Astro SSR incompatible with R3F canvas; SPA better for kinetic 3D | React 18 + Vite 5 |
| R3F `useFrame` lerp vs Framer Motion `useMotionValue` for scroll sync | Framer Motion adds bundle; `onUpdate` ref + `THREE.MathUtils.lerp` is 0-dep, same fidelity | R3F `useFrame` + GSAP `onUpdate` |
| Custom magnetic cursor hook vs Framer Motion `motion.div` spring | Custom hook is ~1KB, no extra dep; Framer Motion spring is smoother but already a dep | Custom hook (1KB, explicit control) |
| Dynamic `import()` vs eager for R3F Canvas | Eager blocks main thread; lazy + Suspense delays 200ms but keeps LCP intact | `React.lazy()` + `Suspense` |
| Static i18n imports vs fetch from API | Static = bundled, zero runtime latency, no loading state; fetch = dynamic but adds complexity | Static JSON imports |
| GSAP SplitText vs manual word splitting | SplitText is premium GSAP plugin ($); manual `split(' ')` + spans is free, same visual | Manual word-by-word |

## Data Flow

```
User Scroll ──→ GSAP ScrollTrigger ──→ scrollProgress ref (0-1)
                                              │
     ┌────────────────────────────────────────┤
     │                                        │
     ▼                                        ▼
  R3F useFrame                         GSAP timelines
  (centroide assembly)                  (kinetic headlines)
     │                                        │
     └────────────── Canvas ──────────────────┘
                          │
                     Mouse Move ──→ lerp(0.05) ──→ Group rotation

CTA Hover ──→ playClick() ──→ AudioContext oscillator burst
CTA Hover ──→ useMagneticCursor ──→ translate(X, Y) on element
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Replace | Vite 5 deps, remove Astro |
| `vite.config.ts` | Create | React plugin, `@/` alias, SSR skip |
| `tsconfig.json` | Replace | Vite strict TS, paths |
| `index.html` | Create | SPA entry, Geist + JB Mono links |
| `src/main.tsx` | Create | React root, i18n init, Router |
| `src/App.tsx` | Create | ScrollSpy layout, 4 sections |
| `src/styles/tokens.css` | Replace | Palette CSS vars |
| `src/styles/globals.css` | Replace | Tailwind v4 `@theme` block |
| `src/styles/film-grain.css` | Replace | SVG noise overlay |
| `src/components/sections/*.tsx` | Replace | 4 section components |
| `src/components/three/WireframeCentroide.tsx` | Create | R3F centroide scene |
| `src/hooks/useMagneticCursor.ts` | Create | Pointer → lerp offset |
| `src/hooks/useScrollProgress.ts` | Create | ScrollTrigger ref wrapper |
| `src/lib/audio/click.ts` | Create | Web Audio oscillator |
| `src/i18n/en.json` | Replace | 52 keys from Portfolio-Mikel |
| `src/i18n/es.json` | Replace | 52 keys from Portfolio-Mikel |
| `src/i18n/config.ts` | Replace | i18next static imports |
| `public/images/` | Keep | Mockup images |

## Interfaces / Contracts

```ts
// WireframeCentroide component contract
interface CentroideProps {
  scrollProgress: React.MutableRefObject<number>; // 0–1 from ScrollTrigger
}

// Magnetic cursor hook
function useMagneticCursor<T extends HTMLElement>(strength?: number): {
  ref: React.RefObject<T>;
  style: React.CSSProperties; // transform: translate(x, y)
};

// Web Audio click
export function playClick(): void; // idempotent, creates AudioContext lazily

// i18n shape
type Locale = 'en' | 'es';
interface I18nKeys {
  hero: { headline: string; subtitle: string; cta_work: string; cta_contact: string };
  work: { title: string; projects: ProjectMeta[] };
  about: { bio: string; stack: Record<string, string[]> };
  contact: { email: string; socials: SocialLink[] };
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `playClick()` — AudioContext creation, oscillator params | Manual verification (no Audio in CI) |
| Unit | `useMagneticCursor` — event listeners, offset calculation | RTL component test |
| Visual | Wireframe Centroide — fragmented → assembled states | Manual browser check at scroll positions |
| Visual | Film grain — compositing visibility | CSS devtools inspection |
| Integration | i18n toggle — all 52 keys switch without refresh | Browser test |

## Migration / Rollout

Replace entire `portfolio-2026/` directory. Delete previous Astro files, write new Vite structure. Previous change artifacts are preserved under `openspec/changes/portfolio-2026-prototype/`. `npm install && npm run dev` should work cleanly.

## Open Questions

- None — all technical decisions resolved per proposal and wireframe spec.
