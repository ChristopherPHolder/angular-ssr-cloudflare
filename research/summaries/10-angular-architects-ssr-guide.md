# Summary — Angular Architects: Guide for SSR

- **Source:** [#10 in sources.md](../sources.md) · https://www.angulararchitects.io/blog/guide-for-ssr/
- **Type:** Blog · **Updated:** 2025-03-23 (for Angular v19.2)

## TL;DR

A deep, reputable Angular SSR guide — conceptually stronger than the official
docs in places (hydration internals, incremental hydration, per-route render
modes). **No Cloudflare/edge content** — it's Node/static-hosting only — so it's
a *concepts* reference, complementing source [#3](03-angular-ssr-guide.md).

## Covers

- SSR/SSG fundamentals and hydration mechanics.
- Setup via `ng add @angular/ssr`.
- v19 per-route render modes (Server / Prerender / Client).
- **Incremental hydration** (experimental in v19) — partial, trigger-based hydration.
- Application Builder (esbuild/Vite) build pipeline.
- Deployment: Node server vs static hosting (nginx/Apache).
- Debugging with Angular DevTools; SEO, deferred components, i18n.

## Our notes / caveats

- **No edge/Workers coverage** — do not treat as a deployment reference for our target. Its value is the *why/how* of SSR + hydration.
- Audience: intermediate→advanced. Pin to v19.2; confirm details against your installed Angular version.
