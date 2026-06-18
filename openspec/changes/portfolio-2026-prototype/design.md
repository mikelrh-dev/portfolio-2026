# Design: Portfolio 2026 — Corporate Goth Prototype

## Technical Approach

Astro 5 static site with 4 React islands at precise hydration boundaries. CSS-driven Tailwind v4 tokens matching Stitch Corporate Goth DS. R3F/Drei icosahedron as `client:only` island. i18next for EN/ES. Animation layered: GSAP/ScrollTrigger for kinetic headlines, Framer Motion for micro-interactions, CSS transitions everywhere else. No SSR for 3D, no data fetching, no tests — prototype is discardable with `rmdir`.

## Architecture Decisions

### Decision: React Island Boundaries

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Full SPA | Higher JS, worse cold start | ❌ |
| `client:only` + lower directives | Precise hydration | ✅ Hero3D: `client:only="react"` (R3F can't SSR). MagneticButton: `client:visible`. FilmGrain: `client:load`. ScrollSpy: `client:idle` |

**Rationale**: 4 interactive islands out of ~15 total components. Static sections (About, Contact form) render as zero-JS Astro. Saves ~150KB unused React runtime.

### Decision: 3D Strategy

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Three.js vanilla | More boilerplate, manual lifecycle | ❌ |
| R3F/Drei | React-idiomatic, auto-cleanup | ✅ ~50 lines |

**Rationale**: Drei handles frameloop, OrbitControls, reduced-motion check. Canvas: `dpr=[1,2]`, `gl={{ antialias:true, alpha:true }}`, no shadows. Icosahedron (detail 2) + MeshStandardMaterial (metalness 0.85, roughness 0.25, color #1A1A1A). Ambient 0.3 + directional 0.8 `[3,4,2]`. Auto-rotate via `useFrame((_, d) => (mesh.rotation.y += d * 0.3))`. Mouse tilt via lerp. Skip rotation if `useReducedMotion()`.

### Decision: i18n Strategy

| Option | Tradeoff | Decision |
|--------|----------|----------|
| astro:i18n built-in | No React hook, lost in islands | ❌ |
| i18next + react-i18next | SSR-compatible, hooks, lazy | ✅ 79 keys/locale |

**Rationale**: Islands lose Astro's i18n context. i18next inits once in `src/i18n/config.ts` with `navigator.language` detection + localStorage override. Routing: `/` = ES, `/en/` = EN. Migrate `lang/{en,es}.json` from Portfolio-Mikel (79 keys, 4 namespaces: hero, selectedWork, about, contact).

### Decision: Animation Layering

| Option | Tradeoff | Decision |
|--------|----------|----------|
| GSAP + ScrollTrigger | 35KB, but kinetic text only | ✅ Headlines only |
| Framer Motion | React-native, micro-interactions | ✅ Hover/tap/card scale |
| CSS transitions | Free, zero JS | ✅ Nav, toggles, state changes |

**Rationale**: GSAP only in hero (ScrollSpy island — split-text headline, scrub). Framer Motion scoped to MagneticButton + Card hover. ~70% of animations cost zero bytes.

## Data Flow

```
Browser ──→ Astro SSR ──→ Serves HTML+CSS ──→ Hydrates islands
                    │
        ┌───────────┼───────────┐
      Hero3D    MagneticBtn  ScrollSpy
      (R3F)     (FM)         (GSAP)
        │
  i18next ──→ EN/ES JSON (static)
```

All content is static JSON. No runtime data fetching.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Create | Astro 5, React 18, three, drei, i18next, framer-motion, gsap, tailwindcss v4, fontsource |
| `astro.config.mjs` | Create | `output:'static'`, integrations: react, mdx, tailwind; `vite.optimizeDeps: { include: ['three', 'three-stdlib'] }` |
| `tsconfig.json` | Create | Extends `astro/tsconfigs/strict` |
| `src/styles/tokens.css` | Create | CSS vars: `--color-bg #0A0A0A`, `--color-bone-white #F5F5F0`, `--color-oxblood #7A1F1F`, `--color-surface #1A1A1A`, `--color-text-primary #F5F5F0`, `--color-text-secondary #888`, `--color-border #2A2A2A`. Type: Newsreader (display), Inter (body), JetBrains Mono (code). Space: 8px base (xs/sm/md/lg/xl/2xl/3xl). Motion: `ease-refined cubic-bezier(0.65,0,0.35,1)`, duration-fast (150ms)/normal (300ms)/slow (500ms). Borders: radius-sharp 0, radius-soft 4px |
| `src/styles/globals.css` | Create | `@import "tailwindcss"`, `@theme` block mapping tokens → Tailwind utilities, film-grain import |
| `src/styles/film-grain.css` | Create | SVG noise pseudo-element, mix-blend-mode overlay |
| `src/i18n/{en,es}.json` | Create | 79 keys from Portfolio-Mikel/lang/ |
| `src/i18n/config.ts` | Create | i18next init, detection, `useTranslation` hook ready |
| `src/layouts/BaseLayout.astro` | Create | HTML shell, Fontsource imports, nav, footer, `<slot/>` |
| `src/components/sections/{Hero,SelectedWork,About,Contact}.astro` | Create | 4 section wrappers, each composing ui/ + React island children |
| `src/components/ui/{Button,Tag,Card}.astro` | Create | Pure Astro, zero JS |
| `src/components/react/{Hero3D,MagneticButton,FilmGrain,ScrollSpy}.tsx` | Create | 4 React islands per decision table above |
| `src/content/projects/*.mdx` | Create | 4 MDX (Vespera ERP, ValaquiaStore, Book&Bugs, EcoDrive AD) — 2 from Portfolio-Mikel references, 2 new |
| `src/pages/{index.astro,en/index.astro}` | Create | ES default and EN route |
| `public/images/` | Copy | 6 images from Portfolio-Mikel/images/ |

## Interfaces / Contracts

```ts
// i18next init — one-time setup
i18next.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: detectLanguage(), fallbackLng: 'es',
  interpolation: { escapeValue: false },
});

// React island receives t through useTranslation()
// Astro pages receives lang via URL path (/ vs /en/)
```

## Testing Strategy

None per proposal scope. Prototype only. No CI/CD.

## Migration / Rollout

No migration. Standalone project. Copy strategy:
- `Portfolio-Mikel/lang/{en,es}.json` → `src/i18n/` (79 keys, unmodified)
- `Portfolio-Mikel/images/project*.{jpg,png}` → `public/images/` (6 files)
- `Portfolio-Mikel/project-images/{reto-libreria,valaquiastore}.md` → `src/content/projects/` (adapt to MDX frontmatter)

## Open Questions

None resolved.
