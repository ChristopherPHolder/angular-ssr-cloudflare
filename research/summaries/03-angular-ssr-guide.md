# Summary — Angular Server-Side Rendering (SSR) Guide

- **Source:** [#3 in sources.md](../sources.md) · https://angular.dev/guide/ssr
- **Type:** Docs (official Angular) · **Version shown:** v22.1.5 (living docs)

## TL;DR

The canonical reference for how Angular SSR works. Angular is CSR by default;
enabling SSR generates a small set of server files and lets you pick a render
mode **per route**. The detail most relevant to Cloudflare: the API splits into
`AngularNodeAppEngine` (Node) and **`AngularAppEngine`** (non-Node, Web-standard
`Request`/`Response`) — the latter is what makes Workers deployment possible.

## Enabling SSR

```bash
ng new --ssr            # new project
ng add @angular/ssr     # existing project
```

By default Angular prerenders the whole app and emits a server file. For a fully
static site with no server, set `outputMode: "static"` in `angular.json`.

## Generated files

- `server.ts` — server entry / request handler.
- `main.server.ts` — server bootstrap.
- `app.config.server.ts` — server-specific providers.
- `app.routes.server.ts` — per-route server rendering config.

## Render modes (`ServerRoute[]` in `app.routes.server.ts`)

| Mode | Acronym | Behavior |
|------|---------|----------|
| `RenderMode.Server` | SSR | Renders on the server per request; sends fully populated HTML. |
| `RenderMode.Client` | CSR | Default browser rendering. |
| `RenderMode.Prerender` | SSG | Static HTML generated at build time. |

```typescript
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Client },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'profile', renderMode: RenderMode.Server },
];
```

## The engine APIs

- **Node environments:** `AngularNodeAppEngine` from `@angular/ssr/node` (the default `ng new` server, Express-based).
- **Non-Node platforms (e.g. Cloudflare Workers):** `AngularAppEngine` from `@angular/ssr`, working with standard Web `Request`/`Response`.

Both give platform-agnostic SSR; the non-Node one is what sources
[#1](01-deploy-angular-ssr-on-cloudflare.md) and
[#2](02-cloudflare-workers-angular-guide.md) rely on for Workers.

## Other key points

- Runtime request/response access via the `REQUEST`, `RESPONSE_INIT`, and `REQUEST_CONTEXT` injection tokens.
- Use `afterNextRender()` for browser-only code; avoid `isPlatformBrowser` checks inside templates.
- `HttpClient` caches GET/HEAD responses during SSR (transfer cache); tune with `withHttpTransferCacheOptions`.
- Prerendering needs data at build time; use `getPrerenderParams()` for parameterized routes and set a fallback strategy (Server/Client/None) for unprerendered paths.

## Our notes / caveats

- This is the **source of truth** for the concepts the other two sources apply. Read it to understand *why* `platform: "neutral"` + `AngularAppEngine` is required on Workers.
- Living, version-pinned docs (v22.1.5 at capture) — APIs like render modes and `outputMode` have evolved across recent majors, so match guidance to your installed Angular version.
