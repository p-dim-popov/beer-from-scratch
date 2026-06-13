# 🍺 МАЛЦ & МАШИНА — Beer From Scratch

A single-page app for brewing **2 litres of home beer from your own malt and dry
hops**, styled as a **steampunk / neo-brutalist** broadsheet. Built with
**React + Bun** (Bun's built-in bundler — no Vite/webpack) and deployed to
**GitHub Pages on every push to `main`**.

The recipe itself (in Bulgarian) walks you from optional home-malting through
mash, sparge, boil, fermentation, priming and conditioning.

## ✨ Features

- **Batch scaler** (×1 / ×2 / ×3) — every quantity on the page recomputes
  automatically, ranges included (e.g. `7–9 г` → `14–18 г`).
- **Brew-day timers** for the 60-minute mash and 60-minute boil, with an
  audible end-of-timer beep.
- **Step checklist** with a live progress bar; progress is saved to
  `localStorage`, so it survives a reload.
- **FAQ accordion**, ingredient table (responsive card layout on mobile), and
  procedural CSS/SVG gears + rivets for the steampunk chrome.
- Respects `prefers-reduced-motion`.

## 🛠 Tech guide — React + Bun

| Concern        | Choice                                                       |
| -------------- | ------------------------------------------------------------ |
| Runtime / PM   | [Bun](https://bun.sh) (`bun install`, `bun run`)             |
| UI library     | React 18 + TypeScript                                        |
| Bundler        | Bun's built-in bundler (`bun build ./index.html`) — no Vite  |
| Dev server     | Bun's HTML dev server with hot reload (`bun ./index.html`)   |
| Type-checking  | `tsc --noEmit` (TypeScript is used for types only)           |
| Styling        | Hand-written CSS (no framework) in `src/index.css`           |
| Hosting        | GitHub Pages via GitHub Actions                              |

Bun bundles the app straight from `index.html` as the entrypoint: it follows the
`<script type="module" src="src/main.tsx">` tag, bundles the React/TSX, hashes
the assets and rewrites the paths. Two flags matter for the production build:

- `--public-path /beer-from-scratch/` — rewrites asset URLs for the GitHub Pages
  sub-path (the equivalent of Vite's `base`).
- `--define process.env.NODE_ENV='"production"'` — without this, React ships its
  larger development build (~350 KB instead of ~160 KB) and logs dev warnings.

### Local development

```bash
bun install        # install dependencies
bun run dev        # Bun dev server with hot reload (http://localhost:3000)
bun run typecheck  # type-check only
bun run build      # type-check + production build into dist/
```

### Project layout

```
src/
  App.tsx              # page composition, batch scaler, checklist, FAQ
  main.tsx             # React entry point
  index.css            # the entire steampunk / neo-brutalist theme
  data/recipe.ts       # all recipe content (ingredients, steps, FAQ…)
  components/
    Gear.tsx           # procedural SVG gear
    Timer.tsx          # countdown timer with beep
```

All recipe content lives in `src/data/recipe.ts`, so editing the recipe never
means touching layout code.

## 🚀 Deployment (GitHub Pages on push to `main`)

`.github/workflows/deploy.yml` builds with Bun and publishes `dist/` to Pages on
every push to `main` (and via manual `workflow_dispatch`).

**One-time setup:** in the repo, go to **Settings → Pages → Build and
deployment → Source** and select **GitHub Actions**.

The production build passes `--public-path /beer-from-scratch/` (matching the
repo name) so assets resolve under the Pages sub-path; local dev serves from `/`.
The site will be served at:

```
https://<owner>.github.io/beer-from-scratch/
```

---

Наздраве и приятно варене! 🍻
