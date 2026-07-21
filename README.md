# 💚 VitalMap — habits, made visible

An interactive, single-page React app that shows how swapping **unhealthy habits for healthy ones** lights up the human body — brain, heart, lungs, muscles and metabolic organs shift from **gray (at risk)** to **glowing green (thriving)** in real time. Every impact is backed by a **peer-reviewed source**.

Built to be a compelling demo for **enterprise employee-health / wellbeing programs**: no login, no data collection, runs anywhere, and every health claim is audit-ready.

![Concept: a body figure whose organs recolor as habit cards are swapped](https://img.shields.io/badge/status-demo-16c06a)

---

## What it does

- **A live body figure.** Five systems are individually colored by a 0–100 health score using a computed gray→green ramp; healthy organs glow.
- **Seven habit levers.** Movement, strength, nutrition, sleep, connection, smoking and stress — each a card you can *swap* between its healthy and unhealthy face.
- **Instant feedback.** Swapping a card recomputes every system score and the overall health index, and the figure animates to match.
- **The science, inline.** Tap a habit to read plain-language claims, each linking to its primary source. Tap an organ to see which habits are lifting it up or holding it back.

## The evidence

All effects trace to verified, primary sources — meta-analyses, large cohort studies and national health authorities (e.g. Paluch 2022 on daily steps, Momma 2022 on strength training, Aune 2017 on fruit & vegetables, Holt‑Lunstad 2010 on social connection, the 2020 U.S. Surgeon General report on smoking cessation). Full list with links appears in-app and in [`src/data/model.js`](src/data/model.js).

> **Not medical advice.** Impact magnitudes are a transparent, defensible *ranking* of effect drawn from the cited research — not a personalized clinical risk score.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for production:

```bash
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In [Vercel](https://vercel.com/new), **Import** the repo.
3. Framework preset is auto-detected as **Vite** (`vercel.json` is included). Click **Deploy** — no environment variables needed.

That's it — you get a public URL anyone can open.

## Customize

Everything lives in a single, readable data file — **[`src/data/model.js`](src/data/model.js)**:

- `SYSTEMS` — the body systems drawn on the figure.
- `DIMENSIONS` — the habit levers: their good/bad faces, per-system impact numbers, claims and reference ids.
- `REFERENCES` — the bibliography (author, title, journal, link).
- `DEFAULT_STATE` — the starting habit mix.

Tune the colors in [`src/lib/color.js`](src/lib/color.js), the scoring in [`src/lib/scoring.js`](src/lib/scoring.js), and the figure geometry in [`src/components/HumanFigure.jsx`](src/components/HumanFigure.jsx). To white-label for a client, swap the brand block in [`src/App.jsx`](src/App.jsx) and the accent variables at the top of [`src/styles.css`](src/styles.css).

## Tech

React 18 + Vite. No backend, no auth, no tracking — pure client-side. ~zero dependencies beyond React.

## License

MIT — use it, fork it, ship it.
