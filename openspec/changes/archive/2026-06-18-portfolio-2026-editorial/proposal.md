# Proposal: portfolio-2026-editorial

## Why

Cyberpunk (boot, cursor, magnetic, #CCFF00 everywhere, full 3D) → dark editorial (typeset book, one accent, senior signal).

## Scope

| In | Out |
|----|-----|
| Remove BootSequence, CustomCursor, useMagneticCursor, useCustomCursor, useHoverSound, `.custom-cursor-active` | New sections |
| Simplify MagneticButton to styled button. Strip magnetic from Contact | i18n copy (except new UI strings) |
| Hero: asymmetric, text ~60% left. 3D removed or small accent | Photo/video assets |
| Color restraint: #CCFF00 only impact numbers + 1/section | Backend, auth |
| Body type: 11–13px → 14–16px | New deps beyond `@react-three/postprocessing` |
| Photo: remove hover filter. Evaluate profile images | |

## Capabilities

- **New**: `editorial-hero` (asymmetric, no full-viewport 3D); `editorial-color-restraint` (#CCFF00 rules)
- **Modified**: `hero-section` (layout + 3D role), `about-stack-section` (photo, body size), `contact-section` (no magnetic)

## Approach

1. Delete 5 files, strip imports/JSX from App.tsx + globals.css
2. Convert MagneticButton→plain button. Remove magnetic from Contact
3. Rewrite Hero — asymmetric grid. 3D removed or small accent slot
4. (Conditional) `@react-three/postprocessing` + Line2 + Bloom
5. Audit #CCFF00. Bump body font-size tokens
6. `npm run build` verify

## Affected Areas

| Area | Δ | |
|------|---|-|
| `src/effects/BootSequence.tsx` | ✕ | |
| `src/effects/CustomCursor.tsx` | ✕ | |
| `src/effects/MagneticButton.tsx` | ∼ | To styled button |
| `src/hooks/useMagneticCursor.ts` | ✕ | |
| `src/hooks/useCustomCursor.ts` | ✕ | |
| `src/hooks/useHoverSound.ts` | ✕ | |
| `src/sections/Hero.tsx` | ∼ | Asymmetric, 3D decision |
| `src/sections/AboutStack.tsx` | ∼ | Remove filter, bump body |
| `src/sections/Contact.tsx` | ∼ | Strip magnetic |
| `src/three/WireframeCentroide.tsx` | ∼/✕ | Accent or remove |
| `src/styles/globals.css` | ∼ | Remove cursor rules |
| `src/App.tsx` | ∼ | Remove boot+cursor |

## Risks

| Risk | L | Mitigation |
|------|---|------------|
| 3D upgrade → bundle bloat | Med | Prototype first; fallback = delete 3D |
| Body bump breaks layouts | Low | clamp() everywhere, regression test |
| No magnetic = dead buttons | Low | CSS hover is fine for editorial |
| Color restraint flattens site | Med | Keep #CCFF00 on key numbers + 1/section |

## Rollback

`git revert` delete commits. Hero + style revert file-by-file.

## Dependencies

- Optional: `@react-three/postprocessing`, three/examples/jsm/lines

## Success Criteria

- [ ] No boot sequence — content visible on load
- [ ] Native cursor only
- [ ] Buttons use CSS hover, no magnetic
- [ ] Hero asymmetric, no full-viewport 3D
- [ ] Body text 14–16px everywhere
- [ ] #CCFF00 only on impact numbers + 1/section
- [ ] Photo has no hover filter
- [ ] `npm run build` passes
