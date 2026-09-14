# Angular SSR on Cloudflare Workers

A real Angular application — a TMDB-backed movie browser — server-side rendered
on the Cloudflare Workers runtime, with no Node.js compatibility layer.

**🌐 Live: <https://angular-ssr-cloudflare.toholderandrews-4c2.workers.dev>**

Most Angular SSR guides target a Node server. This repo takes the other path:
Angular's platform-neutral SSR build (`ssr.platform: "neutral"`) running directly
on the Workers runtime, with static assets served by Cloudflare's `ASSETS`
binding and only the misses falling through to the rendering Worker.

## Why this repo exists

Running Angular SSR on Workers means giving up everything the Node build takes
for granted — no `fs`, no `window`, no Node globals — and the failures show up at
runtime, in the edge, not at build time. This repo is the worked example: a
non-trivial app (lazy routes, rx-angular state, HTTP interceptors, hydration with
event replay) taken all the way to a deployed Worker, with each workaround
documented where it lives in the code.

## What the app does

A movie discovery app on top of [The Movie Database](https://www.themoviedb.org/) API:

- **Discover** — popular, top-rated and upcoming lists, plus browsing by genre
- **Search** — full-text movie search
- **Detail pages** — movies, cast and crew, and person filmographies
- **Account** — TMDB lists: view, create, and edit their contents

Every route is server-rendered (`RenderMode.Server`) and hydrated on the client
with event replay.

## Stack

| Concern   | Choice                                                                     |
| --------- | -------------------------------------------------------------------------- |
| Framework | Angular 22 (standalone, zoneless, signal-based APIs)                       |
| SSR       | `@angular/ssr` with `platform: "neutral"`                                  |
| Host      | Cloudflare Workers (static assets + SSR fallback)                          |
| State     | [`@rx-angular/state`](https://www.rx-angular.io/)                          |
| Icons     | [`@push-based/ngx-fast-svg`](https://github.com/push-based/ngx-fast-svg)   |
| Bundling  | [`@rx-angular/rebundle`](https://www.rx-angular.io/docs/packages/rebundle) |
| Data      | TMDB REST API (v3 + v4)                                                    |
| Tooling   | Angular CLI, Wrangler, Vitest, Prettier                                    |

## Getting started

Requires Node.js 20+ (developed on 24) and npm 11.

```bash
npm install
npm start
```

The dev server runs on <http://localhost:4200/> with SSR enabled, and reloads on
source changes.

### TMDB credentials

The app ships with a public read-only TMDB key in
[`src/environments/environment.ts`](src/environments/environment.ts), so it runs
out of the box. To use your own, copy the example and fill in your keys from
[TMDB → Settings → API](https://www.themoviedb.org/settings/api):

```bash
cp src/environments/environment.local.example.ts src/environments/environment.ts
```

Account features (creating and editing lists) need a TMDB v4 read access token
with write scope.

## Running it like production

`ng serve` uses the Angular dev server; to exercise the actual Worker, build and
run it under Wrangler's local runtime:

```bash
npm run preview
```

This builds into `dist/` (`dist/browser` for assets, `dist/server/server.mjs` for
the Worker) and serves it through `workerd` — the same runtime Cloudflare runs in
production, so Node-API leaks surface here rather than after deploy.

## Bundle output

esbuild's code splitting optimises for the least code per entry point, not for
the fewest requests, so a lazy-routed app like this one ends up with a long tail
of tiny initial chunks. [`@rx-angular/rebundle`](https://www.rx-angular.io/docs/packages/rebundle)
runs as an esbuild plugin, reads the emitted module graph, and merges chunks in
memory before they are written to disk — no source changes.

It is wired into the production build only, via
[`rebundle.plugin.ts`](rebundle.plugin.ts) and the `plugins` option on the
`@angular-builders/custom-esbuild:application` builder. The plugin skips the
server bundle and non-optimised builds, so `ng serve` is untouched.

On this app:

| Production build       | Before | After  |
| ---------------------- | ------ | ------ |
| Initial JS requests    | 6      | 1      |
| Initial transfer size  | 109 kB | 101 kB |
| Browser JS files total | 39     | 34     |

The whole initial payload is now a single `main-*.js`; the lazy route chunks are
still split per route.

## Deploying

```bash
npx wrangler login
npm run deploy
```

Wrangler reads [`wrangler.jsonc`](wrangler.jsonc): `main` points at the SSR
bundle, `assets.directory` at the browser build, and `assets.binding` (`ASSETS`)
lets Cloudflare serve static files before the Worker is ever invoked.

> **Deploying under your own hostname?** Angular's SSR host guard rejects any
> request whose `Host` header isn't allow-listed. Add the new hostname to
> `allowedHosts` in [`src/server.ts`](src/server.ts) or every request will 400.

## Scripts

| Script               | What it does                                                  |
| -------------------- | ------------------------------------------------------------- |
| `npm start`          | Angular dev server with SSR at `localhost:4200`               |
| `npm run build`      | Production build into `dist/`, rebundled                      |
| `npm run watch`      | Development build in watch mode                               |
| `npm run preview`    | Build, then serve the Worker locally via Wrangler             |
| `npm run deploy`     | Build, then deploy to Cloudflare Workers                      |
| `npm test`           | Vitest via the Angular CLI unit-test builder                  |
| `npm run cf-typegen` | Regenerate `worker-configuration.d.ts` from Wrangler bindings |

There are no unit tests checked in yet — `npm test` runs the configured runner
against an empty suite.

## Project layout

```
src/
├── server.ts                      # Worker entry: AngularAppEngine + fetch handler
├── main.ts / main.server.ts       # Browser and server bootstraps
└── app/
    ├── routes.ts                  # Lazy-loaded route tree
    ├── app.routes.server.ts       # Render modes (Server for every route)
    ├── app.config.ts              # Shared providers
    ├── app.config.server.ts       # SSR-only providers and overrides
    ├── rx-server-render-strategy.ts
    ├── auth/                      # TMDB token handling and interceptors
    ├── state/                     # rx-angular state per domain
    ├── data-access/               # TMDB API resources and image loader
    ├── pages/                     # Route-level components
    ├── ui/                        # Reusable components, patterns, design tokens
    └── shared/                    # CDK-style utilities
research/                          # Source list and per-source notes (reference only)
```

## Notes from making SSR work on Workers

The interesting parts of this repo are the places where "it works on Node"
stopped being true. Each is documented in the file it affects:

- **Platform-neutral server bundle** — `ssr.platform: "neutral"` in
  [`angular.json`](angular.json) makes Angular emit a bundle built on Web
  `Request`/`Response` instead of Node's `http` module, so `AngularAppEngine`
  (not `AngularNodeAppEngine`) is the entry point.
- **SVG icons without a filesystem or `window`** — `ngx-fast-svg`'s default load
  strategy reads `window` in its constructor and fetches icons over HTTP; the
  Node variant reads them from disk. Neither exists here, so icons are inlined
  into the server bundle at build time and resolved synchronously. See
  `ServerSvgLoadStrategy` in
  [`app.config.server.ts`](src/app/app.config.server.ts).
- **No hydration flicker** — rx-angular's concurrent strategies schedule change
  detection via `requestAnimationFrame`/`postMessage`, which never flush
  deterministically during SSR, so rendered views dropped back to their loading
  templates after hydration. Every strategy is remapped onto the synchronous
  `native` strategy on the server:
  [`rx-server-render-strategy.ts`](src/app/rx-server-render-strategy.ts).
- **Host allow-listing** — the SSR host guard is a deliberate SSRF defence; the
  deployed hostname has to be listed explicitly in
  [`src/server.ts`](src/server.ts).

## Research

[`research/sources.md`](research/sources.md) tracks the material surveyed while
building this — official docs, guides, and CLI history — each with a summary in
[`research/summaries/`](research/summaries/). It is reference material, not the
design of this repo: nothing there is the blueprint, and no code was copied from
it.

## Conventions

Coding standards for this repo — Angular v22+ idioms, signal-first state,
accessibility minimums — live in [`AGENTS.md`](AGENTS.md).
