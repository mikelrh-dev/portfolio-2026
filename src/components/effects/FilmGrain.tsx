'use client';

/**
 * Film grain overlay.
 * Applied via CSS `#root::before` pseudo-element in film-grain.css.
 * This component is a thin no-op wrapper — the heavy lifting is in CSS.
 * Kept as a component so it can be conditionally mounted if needed.
 */
export default function FilmGrain() {
  return null;
}
