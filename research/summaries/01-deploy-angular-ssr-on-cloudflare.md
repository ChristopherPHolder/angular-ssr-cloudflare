# Summary — Deploy Angular SSR on Cloudflare

- **Source:** [#1 in sources.md](../sources.md) · https://santoshyadav.dev/blog/2026-09-02-deploy-angular-ssr-on-cloudflare/
- **Type:** Blog · **Published:** 2026-09-02

## TL;DR

Deploys Angular SSR to **Cloudflare Workers** (not Pages) by replacing the
default Node/Express server entry with a **platform-neutral** Web-standard
handler, then wiring it up with a `wrangler.jsonc`. The load-bearing idea is
using `@angular/ssr`'s `AngularAppEngine` + `createRequestHandler` (Web
`Request`/`Response`) instead of `@angular/ssr/node`, and building with
`ssr.platform: "neutral"` so no Node-only APIs leak into the bundle.

## Prerequisites

- Node 22+
- pnpm
- Free Cloudflare account

## Steps

1. **Scaffold** — `pnpm dlx @angular/cli@latest new <app> --package-manager pnpm`, enable SSR when prompted.
2. **Rewrite `src/server.ts`** — use `AngularAppEngine` + `createRequestHandler` from `@angular/ssr`; export `default { fetch: reqHandler }` (the Workers entry shape). Custom API routes (e.g. `GET /api/data`) are handled before falling back to `angularApp.handle(request)`.
3. **`angular.json`** — set `ssr.platform: "neutral"` to drop Node API dependencies.
4. **Install Wrangler** — `pnpm add -D wrangler@latest`.
5. **`wrangler.jsonc`** — point `main` at the built server bundle (`dist/server/server.mjs`) and serve static files via an `ASSETS` binding pointing at `dist/browser`; set a recent `compatibility_date`.
6. **(Optional) Prerendering** — `src/app/app.routes.server.ts` with `RenderMode.Prerender` for static routes and `RenderMode.Server` for the `**` fallback.
7. **Build & deploy** — `pnpm build`, then `wrangler deploy`. Alternatively deploy via GitHub integration from the Cloudflare dashboard (Workers & Pages → Create Application → Continue with GitHub).

## Key config points

- **`platform: "neutral"`** removes Node.js API dependencies from the SSR bundle.
- Use **`@angular/ssr`** (not `@angular/ssr/node`) for Workers compatibility.
- **`wrangler.jsonc`** defines the server entry (`main`) and the static `ASSETS` binding.
- **Prerendering** produces static HTML; dynamic routes fall through to server rendering.

## Shortcut

`pnpm create cloudflare@latest <app>` → **Framework Starter → Angular** scaffolds
a Workers-ready project with the neutral server and Wrangler config already set
up, skipping the manual edits above.

## Our notes / caveats

- Targets **Workers**, not Pages — be deliberate about the choice (different bindings, limits, deploy flow).
- The article omits **`provideHttpClient(withFetch())`**. Without it, Angular's HTTP client tries to use `xhr2` during SSR, which surfaces a bundling warning and can break server-side fetches on the Workers runtime. Add it if the app makes HTTP calls during SSR.
- `compatibility_date` and the exact `wrangler.jsonc` schema drift with versions — set them to current values rather than copying verbatim.
