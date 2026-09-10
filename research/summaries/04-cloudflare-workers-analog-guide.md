# Summary — Analog · Cloudflare Workers Framework Guides

- **Source:** [#4 in sources.md](../sources.md) · https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/analog/
- **Type:** Docs (official Cloudflare) · **Last updated:** 2026-04-23

## What is Analog?

**Analog** is a fullstack **meta-framework for Angular**, powered by **Vite** and
**Nitro**. It brings file-based routing, server routes/API endpoints, and SSR/SSG
to Angular — an alternative to wiring up `@angular/ssr` by hand. Because it builds
on Nitro, it inherits Nitro's Cloudflare deployment preset and bindings support.

## TL;DR

Cloudflare's official guide for deploying Analog to **Workers**. Scaffold with C3
(`--framework=analog`); Nitro's Cloudflare preset produces the Workers bundle and
Wrangler auto-detects it. Dev with `npm run dev`, deploy with `npm run deploy`.

## Quick setup (C3)

```bash
npm create cloudflare@latest -- my-analog-app --framework=analog
cd my-analog-app
```

## Dev & deploy

```bash
npm run dev      # local development
npm run deploy   # build + deploy to Workers
```

## Auto-generated Wrangler config

Wrangler detects Analog and generates:

- **Main entry:** `.output/server/index.mjs`  ← Nitro server build output
- **Assets directory:** `.output/public`
- **Compatibility flags:** `nodejs_compat`
- **Observability:** enabled by default

If a project has no Wrangler config, `npx wrangler deploy` still works.

## Bindings & integration

Analog apps integrate fully with the Cloudflare Developer Platform via product
**bindings** (KV, R2, D1, etc.) in both dev and production. Binding configuration
for API routes is handled through **Nitro** (see Nitro docs).

Deploys to `*.workers.dev` or a custom domain via CI/CD.

## Our notes / caveats — how this differs from plain Angular SSR (#1–#3)

- **Different build system & output.** Analog uses **Vite + Nitro**, so the build output is `.output/server/index.mjs` + `.output/public` — *not* the Angular CLI's `dist/browser` + `dist/server/server.mjs` from sources [#1](01-deploy-angular-ssr-on-cloudflare.md)/[#2](02-cloudflare-workers-angular-guide.md). Don't mix the two Wrangler configs.
- **`nodejs_compat` required** — unlike the CLI's `platform: "neutral"` approach (which *removes* Node APIs), Analog/Nitro's Cloudflare target relies on the `nodejs_compat` flag.
- **Decision point:** use plain `@angular/ssr` on Workers (#1/#2) for a thin, CLI-native SSR app; reach for **Analog** when you want a full meta-framework (file-based routing, server routes, SSG) and are happy on the Vite/Nitro stack.
- Nitro also targets Cloudflare **Pages**; this guide specifically covers the **Workers** target.
