# Summary — AnalogJS Discussion #963: API for Cloudflare Functions

- **Source:** [#12 in sources.md](../sources.md) · https://github.com/analogjs/analog/discussions/963
- **Type:** Discussion (GitHub, analogjs/analog) · **Dated:** March 2024 · **Resolved**

## TL;DR

Troubleshooting thread: Analog API routes worked locally but returned **405 /
"No functions dir found"** when deployed to **Cloudflare Pages**. Fix was to set
Nitro's output dirs so Cloudflare picks up the `_worker.js`. **Pages-specific and
dated** — marginal for a Workers-only project.

## Problem → solution

- Symptom: endpoints 405 in prod; `wrangler` reports no `/functions` dir.
- Fix (maintainer `brandonroberts`): configure Nitro output in `vite.config.ts`:
  ```ts
  nitro: {
    output: {
      dir: './dist/analog/public',
      serverDir: './dist/analog/public/_worker.js',
    },
  }
  ```
- Confirmed working in production (2026-03-27); local `wrangler` still didn't recognize the `_worker.js` structure.

## Our notes / caveats

- **Cloudflare Pages, not Workers**, and from early 2024 — Analog/Nitro's Cloudflare targets have moved on since (see Nitro #7 `cloudflare_module`). Low relevance to our Workers path.
- Kept only per "add the rest"; a candidate to prune given the no-Pages decision.
