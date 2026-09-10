# Summary — AnalogJS: Deployment / Providers

- **Source:** [#8 in sources.md](../sources.md) · https://analogjs.org/docs/features/deployment/providers
- **Type:** Docs (official Analog) · living docs

## TL;DR

Analog's own deployment reference. **Caveat for us:** this page's Cloudflare
section is written around **Cloudflare Pages** (`cloudflare-pages` preset,
output `dist/analog/public`), not Workers. Since we're **not using Pages**, the
Workers path for Analog is better taken from Nitro's `cloudflare_module` preset
(source [#7](07-nitro-cloudflare-provider.md)) and Cloudflare's C3 guide
(source [#4](04-cloudflare-workers-analog-guide.md)).

## What the page says (Pages-oriented)

- **Nitro preset:** `cloudflare-pages`.
- **Build output:** `dist/analog/public` (or `dist/<project>/analog/public` in Nx).
- **Deploy:** dashboard → Workers & Pages → Create application → Pages → Connect to Git; build command `npm run build`, set the output dir; auto-deploys on push.
- No explicit `vite.config.ts` change needed; if preset auto-detection fails, set `BUILD_PRESET=cloudflare-pages` or configure `nitro` in `vite.config.ts`.
- Local preview: `BUILD_PRESET=cloudflare-pages npx nx build <project>` then `npx wrangler pages dev ./dist/analog/public`.

## Our notes / caveats

- **Pages-focused; keep for reference only.** For Analog **on Workers**, use `cloudflare_module` (Nitro #7) — that's the preset behind the `.output/server/index.mjs` bundle Cloudflare's guide (#4) deploys.
- Consider dropping this source if we commit fully to Workers and want the source list Pages-free.
- Analog builds on Nitro, so Nitro's provider docs (#7) are the more current/authoritative Cloudflare reference.
