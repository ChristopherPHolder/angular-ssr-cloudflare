# Summary — LaunchFast: Deploy SSR Angular 20+ to Cloudflare Workers

- **Source:** [#9 in sources.md](../sources.md) · https://www.launchfa.st/blog/angular-cloudflare-workers
- **Type:** Blog · **Published:** 2026-07-03

## TL;DR

A thorough, current (Angular 20+) walkthrough of the **plain `@angular/ssr` on
Workers** approach — the same lane as sources [#1](01-deploy-angular-ssr-on-cloudflare.md)/[#3](03-angular-ssr-guide.md),
with extra production detail (security via `allowedHosts`, `nodejs_compat`, live
demo). Notably it uses a **separate `cloudflare/worker.ts`** entry and enables
`nodejs_compat` rather than relying purely on `platform: "neutral"`.

## Architecture

- **Browser build** (`dist/<app>/browser/*`) — static assets served by Cloudflare.
- **Server build** (`dist/<app>/server/*`) — bundled into the Worker for SSR.

## Key config

- **Worker entry `cloudflare/worker.ts`** — inits `AngularAppEngine`, wraps it with `createRequestHandler` to match Cloudflare's fetch handler signature.
- **Wrangler** — `compatibility_flags: ["nodejs_compat"]` (for Angular's Node deps) + `assets.directory` → browser build.
- **Security** — `allowedHosts` in `angular.json` guards against SSRF (which hosts may be SSR'd); extra hosts via `NG_ALLOWED_HOSTS` env var at deploy time (no rebuild).
- **Deploy** — `npm run build` → `wrangler deploy` (esbuild bundles server, uploads assets, deploys globally).
- Live demo: https://angular-ssr-app.launchfast.workers.dev/posts

## Our notes / caveats

- **Differs from source #1 on the compat strategy:** #1 uses `platform: "neutral"` (strip Node APIs); this guide keeps `nodejs_compat` (shim Node APIs on Workers). Both are valid; the choice affects which server-side deps work. Worth deciding deliberately.
- The **`allowedHosts` / `NG_ALLOWED_HOSTS`** SSRF tip is a production detail the other sources omit — useful.
- Most detailed 2026 blog source for the CLI-native (non-Analog) Workers path.
