# Summary — Angular · Cloudflare Workers Framework Guides

- **Source:** [#2 in sources.md](../sources.md) · https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/angular/
- **Type:** Docs (official Cloudflare) · **Last updated:** 2026-04-23

## TL;DR

Cloudflare's official guide for running Angular on **Workers**. It steers you to
scaffold with **C3** (`create-cloudflare`) using the `--framework=angular` flag,
which produces an Angular project with Wrangler already configured for Workers —
no manual `server.ts`/`angular.json` edits. Deploy with `npm run deploy`.

## Quick start (C3)

```bash
npm create cloudflare@latest -- my-angular-app --framework=angular
cd my-angular-app
```

Other package managers:

```bash
yarn create cloudflare my-angular-app --framework=angular
pnpm create cloudflare@latest my-angular-app --framework=angular
```

## What C3 sets up

- A new Angular project via Angular's official tooling.
- Pre-configured Wrangler settings for Workers deployment.
- Automatic detection/configuration of Angular so it builds and deploys without manual wiring.

## Configuration (generated `wrangler.jsonc`)

- `assets.directory: dist/browser` — Angular's production browser build output.
- `observability.enabled: true` — monitoring on by default.

## Dev & deploy

```bash
npm run start    # local development
npm run deploy   # deploy to Cloudflare Workers
```

Deploys to a `*.workers.dev` subdomain, or a custom domain via CI/CD.

## Static asset routing

The platform first tries to match the request path against a **static asset** in
the assets directory; if none matches, it invokes the **Worker**, then falls back
to the configured `not_found_handling` behavior.

## Our notes / caveats

- This is the **official, maintained** path — prefer it over hand-editing when starting fresh. It's the same `create-cloudflare` shortcut that source [#1](01-deploy-angular-ssr-on-cloudflare.md) mentions at the end, documented properly.
- The page is light on the internals (no explicit `server.ts` / `platform: "neutral"` walkthrough) — source #1 is the better reference for *understanding what the neutral SSR entry does*; this doc is the better reference for *the canonical scaffold + deploy flow*.
- Docs are a living page ("last updated" April 2026); re-check commands and the generated `wrangler.jsonc` shape against the live page before relying on them.
