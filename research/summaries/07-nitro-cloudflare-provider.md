# Summary — Nitro: Cloudflare deployment provider

- **Source:** [#7 in sources.md](../sources.md) · https://nitro.build/deploy/providers/cloudflare
- **Type:** Docs (official Nitro) · living docs

## TL;DR

The deploy engine under **Analog** (source [#4](04-cloudflare-workers-analog-guide.md)).
Documents the Cloudflare **presets** and how server routes reach Cloudflare
bindings. For our Workers-only target, the relevant preset is **`cloudflare_module`**
(Pages is deprecated in favor of Workers).

## Presets

- **`cloudflare_module`** — targets **Cloudflare Workers**, zero-config worker build. ← use this.
- **`cloudflare_pages`** — targets Pages (deprecated in favor of Workers).
- **`cloudflare_durable`** — extends `cloudflare_module` with Durable Objects (stateful / WebSockets).

```ts
// nitro.config.ts
export default defineConfig({ preset: "cloudflare_module" })
```

## Wrangler & runtime

- Preview: `wrangler dev`; deploy: `wrangler login` then `wrangler deploy`. Config via `wrangler.toml`/`wrangler.json` or inline in Nitro.
- **Bindings** (KV, D1, R2…) in server routes via `event.req.runtime.cloudflare.env.BINDING_NAME`; local dev uses Miniflare emulation from the wrangler/nitro config.
- **Env vars** via `process.env` / `import.meta.env` **only within the request lifecycle**, not global scope. Dev `.env` → preview `.dev.vars` → prod dashboard / `wrangler secret`.
- Workers runtime hooks available: `cloudflare:scheduled`, `cloudflare:email`, `cloudflare:queue`, `cloudflare:tail`, plus Durable Object hooks.

## Why it's here

- Primary reference for **how Analog actually deploys to Workers** — the Cloudflare guide (#4) shows the C3 shortcut, this shows the underlying preset + bindings model.
- **Workers-relevant:** use `cloudflare_module`, ignore the `cloudflare_pages` preset for our purposes.
