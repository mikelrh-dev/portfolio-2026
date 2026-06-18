# portfolio-2026

Personal portfolio site. React 18 + TypeScript 5 + Vite 5, with i18n, design tokens, 3D scenes, and motion-driven interactions.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Scripts

| Command         | What it does                                       |
| --------------- | -------------------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                        |
| `npm run build`   | Type-check with `tsc`, then build to `dist/`     |
| `npm run preview` | Serve the production build locally              |

## Stack

| Concern  | Choice                                              |
| -------- | --------------------------------------------------- |
| UI       | React 18, TypeScript 5                              |
| Build    | Vite 5                                              |
| Styling  | Tailwind 4 + CSS custom properties (`tokens.css`)   |
| 3D       | three.js, @react-three/fiber, @react-three/drei     |
| Motion   | framer-motion, GSAP                                 |
| Routing  | react-router-dom 6                                  |
| i18n     | i18next, locales: `en`, `es`                        |

## Structure

Atomic-design layout — folder names tell you what the app does at a glance.

```
src/
├── App.tsx
├── main.tsx
├── components/
│   ├── LangToggle.tsx
│   ├── Nav.tsx
│   ├── effects/      BootSequence, CustomCursor, FilmGrain, KineticHeadline,
│   │                 MagneticButton, ScrollProgress, TextScramble, TypeWriter
│   ├── sections/     Hero, About, AboutStack, SelectedWork, Contact
│   ├── three/        WireframeCentroide
│   └── ui/           Button, Card, Tag
├── hooks/            useCustomCursor, useHoverSound, useMagneticCursor,
│                     useReducedMotion, useScrollProgress, useScrollSpy,
│                     useTextScramble, useTypeWriter
├── i18n/             config + locales (en, es)
├── lib/              cross-cutting helpers (audio)
└── styles/           tokens.css, globals.css, film-grain.css
```

## Design tokens

All visual primitives (color, type, spacing) live in `src/styles/tokens.css` as CSS custom properties. Components consume tokens — no hard-coded values in components.

## Accessibility

- Motion effects respect `prefers-reduced-motion` via `useReducedMotion`.
- Build runs `tsc` before bundling, so type errors fail the build.

## Conventions

- **New section**: drop a component under `src/components/sections/`, wire it in `App.tsx`, and add copy to both `src/i18n/locales/en.json` and `es.json`.
- **Non-trivial changes**: start in `openspec/changes/<name>/` with a proposal, then specs, design, and tasks before touching code.

## Author

Mikel Romero Homobono — mikelromerohomobono@gmail.com
