# Asset drop-in

The prototype renders **fully without any of these files.** Each is an
enhancement layer wired in with graceful fallback, so dropping files in is
enough — no code changes required.

| Path | Used by | Fallback if missing |
| --- | --- | --- |
| `public/favicon.svg` | browser tab | — (committed) |
| `public/og-image.png` | `<meta property="og:image">` link social preview | meta tag simply points at a 404 asset, harmless |
| `public/assets/images/profile/portfolio.jpg` | Contact portrait frame | `YA` monogram plate on the accent gradient |
| `public/assets/images/projects/machine-translation.png` | Project 01 visual backdrop | live token-flow diagram at full opacity |
| `public/assets/images/projects/ticketing-system.png` | Project 02 visual backdrop | live pipeline + seat-lock diagram |
| `public/assets/images/projects/hieemien.png` | Project 03 visual backdrop | live commerce storefront diagram |
| `public/assets/images/projects/roadguard-ai.png` | Project 04 visual backdrop | live geospatial hazard diagram |
| `public/assets/images/projects/negarit-ai.png` | Project 05 visual backdrop | live signal-triage + risk-gauge diagram |
| `public/assets/images/projects/EAII.jpg` | Experience — Ethiopian AI Institute mark | name renders alone, tile omitted |
| `public/assets/images/projects/atlas.jpg` | Experience — Atlas Computer Technology mark | name renders alone, tile omitted |
| `public/assets/images/projects/yodahie.jpg` | Experience — YODAHIE mark | name renders alone, tile omitted |

## Sizing guidance

- **Profile** — portrait, ≥ 1200px wide recommended. Displayed inside a 4:5
  frame with `object-cover`, desaturated and tinted toward the accent on hover.
  The current file is 853×1280 (2:3), so the frame crops ~12% off the top and
  bottom — fine for a centred subject, but a wider export would sit sharper on
  retina displays.
- **Project backdrops** — 3:2 or 16:10, ≥ 1600px wide. Rendered at ~14% opacity
  beneath the live diagram with `mix-blend-mode: luminosity`, so the diagram
  stays the readable layer and the image adds texture rather than noise.
- **Organisation marks** — square or near-square, ≥ 200px wide. Rendered at
  48px (56px ≥ md) inside a bordered tile with `object-contain`, at full
  opacity, next to the org name.
- **OG image** — 1200×630 exactly. Text-safe area: keep it inside the middle
  1000×500.

> Put assets in `public/`, never in `dist/`. Vite empties `dist` on every
> build, so anything placed there is deleted silently on the next `npm run build`.

## Adding another project

Project backdrops are resolved by convention in
`src/data/projects.ts` → each project carries an optional `image` path. No
component changes needed for the asset; the `ProjectVisual` component switches
on `visual`, so a genuinely new diagram does need a new key in that union, a new
component in `src/components/projects/`, and a branch in `ProjectVisual.tsx`.