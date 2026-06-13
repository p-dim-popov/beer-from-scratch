# 🍺 МАЛЦ & МАШИНА — Beer From Scratch

A single-page app for brewing **2 litres of home beer from your own malt and dry
hops**, styled as a **steampunk / neo-brutalist** broadsheet. Built with
**React + Bun + Vite** and deployed to **GitHub Pages on every push to `main`**.

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

| Concern        | Choice                                              |
| -------------- | --------------------------------------------------- |
| Runtime / PM   | [Bun](https://bun.sh) (`bun install`, `bun run`)    |
| UI library     | React 18 + TypeScript                               |
| Bundler        | Vite 5 (`@vitejs/plugin-react`)                     |
| Styling        | Hand-written CSS (no framework) in `src/index.css`  |
| Hosting        | GitHub Pages via GitHub Actions                     |

### Local development

```bash
bun install      # install dependencies
bun run dev      # start the dev server (http://localhost:5173)
bun run build    # type-check + production build into dist/
bun run preview  # preview the production build locally
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

The Vite `base` is set to `/beer-from-scratch/` for production builds (matching
the repo name) and `/` for local dev — see `vite.config.ts`. The site will be
served at:

```
https://<owner>.github.io/beer-from-scratch/
```

---

Наздраве и приятно варене! 🍻
