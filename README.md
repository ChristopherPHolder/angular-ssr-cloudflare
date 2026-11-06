# Angular SSR on Cloudflare Workers

A real Angular application — a TMDB-backed movie browser — server-side rendered
on the Cloudflare Workers runtime, with no Node.js compatibility layer.

**🌐 Live: <https://angular-ssr-cloudflare.toholderandrews-4c2.workers.dev>**

Most Angular SSR guides target a Node server. This repo takes the other path:
Angular compiled by Vite and rendered inside `workerd`, with static assets served
by Cloudflare's `ASSETS` binding and only the misses falling through to the
rendering Worker.

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

Every route is server-rendered and hydrated on the client with event replay.

## Stack

| Concern   | Choice                                                                            |
| --------- | --------------------------------------------------------------------------------- |
| Framework | Angular 22 (standalone, zoneless, signal-based APIs)                              |
| Build     | Vite 8 + [`@push-based/vite-plugin-ngp`](https://push-based.github.io/vite-plugin-ngp/) |
| SSR       | `@angular/platform-server`, rendered in `workerd`                                 |
| Host      | Cloudflare Workers via [`@cloudflare/vite-plugin`](https://developers.cloudflare.com/workers/vite-plugin/) |
| State     | [`@rx-angular/state`](https://www.rx-angular.io/)                                 |
| Icons     | [`@push-based/ngx-fast-svg`](https://github.com/push-based/ngx-fast-svg)          |
| Data      | TMDB REST API (v3 + v4)                                                           |
| Tooling   | Vite, Wrangler, Prettier                                                          |

### A note on the Angular version

`vite-plugin-ngp` compiles Angular with **ngp**, Angular's Rust-and-TypeScript
preprocessor, and the plugin carries its own build of it made from a specific
Angular commit. ngp uses private APIs of the compiler it was built against, so
every `@angular/*` package is pinned to exactly `22.3.0-next.2`. Bumping Angular
on its own will break the build; it moves when the plugin moves.

npm's semver rules never match a prerelease against a plain range, so the Angular
libraries' peer ranges (`>=22.0.0`, `>17.1.0`) fail to resolve against a `-next`
version even though nothing is actually incompatible. [`.npmrc`](.npmrc) sets
`legacy-peer-deps=true` for that reason alone.

## Getting started

Requires Node.js 26 and npm 11.

```bash
npm install
npm start
```

The dev server runs on <http://localhost:4200/>. Your Worker runs in `workerd`,
so SSR in development behaves the way it does in production. Template, stylesheet
and inline-style edits update in place; other edits reload the page.

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

The dev server already runs the Worker in `workerd`. To exercise the *built*
output as it will be deployed:

```bash
npm run preview
```

This builds into `dist/` (`dist/client` for assets, `dist/ssr` for the Worker)
and serves it through the same runtime Cloudflare runs in production.

## Bundle output

A lazy-routed Angular app splits into a lot of chunks, and how many of them the
browser has to fetch before the app runs is a build-tool decision rather than an
application one.

This repo previously ran [`@rx-angular/rebundle`](https://www.rx-angular.io/docs/packages/rebundle)
to fix that for esbuild, whose code splitting optimises for the least code per
entry point and leaves a long tail of tiny initial chunks. rebundle is an esbuild
plugin and does not apply to Rolldown, so it came out with the Angular CLI.

Rolldown does not produce esbuild's long tail, but it does not consolidate to a
single file either:

| Production build        | `ng build` + rebundle | `vite build` |
| ----------------------- | --------------------- | ------------ |
| Initial JS requests     | 1                     | 16           |
| Initial transfer (gzip) | 113 kB                | 118 kB       |
| Browser JS/CSS files    | 35                    | 46           |

Same bytes, more requests. On HTTP/2 those 16 modules are preloaded from one
connection, so this is a different trade-off rather than a straight regression —
but if it shows up in field data, `build.rolldownOptions.output.advancedChunks`
in [`vite.config.ts`](vite.config.ts) is where to consolidate them.

## Deploying

Deploys are automated. Merging to `main` ships to production; opening a pull
request ships an isolated Preview of that branch.

| Trigger                    | Workflow                                          | Result                                               |
| -------------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| Push to `main`             | [`deploy.yml`](.github/workflows/deploy.yml)      | `wrangler deploy` to production                      |
| Pull request opened/pushed | [`preview.yml`](.github/workflows/preview.yml)    | `wrangler preview` into `pr-<n>`, URL posted on the PR |
| Pull request closed        | [`preview.yml`](.github/workflows/preview.yml)    | Preview deleted                                      |

Previews are Cloudflare [Previews](https://developers.cloudflare.com/workers/previews/),
not Version URLs — each gets its own settings from the `previews` block in
[`wrangler.jsonc`](wrangler.jsonc), empty here because this Worker has no
bindings a Preview needs to point elsewhere. Both workflows curl the deployed
URL afterwards, so an SSR failure behind a green build still fails the run.

Fork pull requests do not receive repository secrets, so the Preview job skips
them rather than failing.

### Repository secrets

```bash
gh secret set CLOUDFLARE_API_TOKEN   # "Edit Cloudflare Workers" template
gh secret set CLOUDFLARE_ACCOUNT_ID
```

### Deploying by hand

```bash
npx wrangler login
npm run deploy
```

`vite build` writes a deployment config to `dist/ssr/wrangler.json`, derived from
[`wrangler.jsonc`](wrangler.jsonc), with `assets.directory` pointed at the client
build for you.

Two settings in `wrangler.jsonc` matter:

- **`assets.binding: "ASSETS"`** — lets Cloudflare serve static files before the
  Worker is invoked, and lets the Worker read `/index.html` as the template it
  renders into.
- **`assets.html_handling: "none"`** — without it the asset server answers `/`
  with the unrendered `index.html` and the Worker never runs. With it, only exact
  file paths match an asset, so every navigation falls through to SSR.

> **Deploying under your own hostname?** Angular's SSR host guard rejects any
> request whose `Host` header isn't allow-listed. Add the new hostname to
> `allowedHosts` in [`src/main.server.ts`](src/main.server.ts) or every request
> will fail with `NG05706`. Preview hostnames are already covered by the
> `*.toholderandrews-4c2.workers.dev` entry.

## Scripts

| Script               | What it does                                                  |
| -------------------- | ------------------------------------------------------------- |
| `npm start`          | Dev server at `localhost:4200`, Worker running in `workerd`   |
| `npm run dev`        | Same as `npm start`                                           |
| `npm run build`      | Production build into `dist/client` and `dist/ssr`            |
| `npm run preview`    | Build, then serve the built Worker locally                    |
| `npm run deploy`     | Build, then deploy to Cloudflare Workers                      |
| `npm run cf-typegen` | Regenerate `worker-configuration.d.ts` from Wrangler bindings |

Template and TypeScript type-checking runs as part of both the dev server and
`npm run build`, which fails on any error.

## Project layout

```
index.html                         # Vite's entry: loads /src/main.ts
vite.config.ts                     # ngp + Cloudflare plugins, budgets, linker
public/                            # Served as-is (favicon, assets/)
src/
├── worker.ts                      # Worker entry: ASSETS lookup + render()
├── main.ts / main.server.ts       # Browser bootstrap and the render() contract
└── app/
    ├── routes.ts                  # Lazy-loaded route tree
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

- **No `@angular/ssr`** — `vite-plugin-ngp` doesn't support `AngularAppEngine`,
  per-route render modes or the app shell. The SSR contract is a single
  `render(url, document)` function in
  [`src/main.server.ts`](src/main.server.ts), and the server around it is
  [`src/worker.ts`](src/worker.ts), written by hand. One consequence: router
  `redirectTo` routes used to come back as HTTP 302s and now render in place.
- **Angular's linker in the Worker environment** — Angular libraries ship
  partially compiled and must pass through the linker. ngp links them for the
  browser, but not in the Cloudflare plugin's Worker environment, where an
  unlinked `@angular/common` asks for the JIT compiler and the server never
  boots. [`vite.config.ts`](vite.config.ts) runs the linker there.
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
  [`src/main.server.ts`](src/main.server.ts).

## Research

[`research/sources.md`](research/sources.md) tracks the material surveyed while
building this — official docs, guides, and CLI history — each with a summary in
[`research/summaries/`](research/summaries/). It is reference material, not the
design of this repo: nothing there is the blueprint, and no code was copied from
it.

## Conventions

Coding standards for this repo — Angular v22+ idioms, signal-first state,
accessibility minimums — live in [`AGENTS.md`](AGENTS.md).
