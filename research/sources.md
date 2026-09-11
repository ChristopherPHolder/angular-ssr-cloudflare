# Research Sources

> **Status: research only.** Everything in `research/` is **reference material**,
> not the design we will ship. We are building our **own custom implementation**
> of Angular SSR on Cloudflare Workers — these sources inform our decisions but no
> single guide is the blueprint, and none of their code should be copied verbatim.
> **Target is Cloudflare Workers, not Pages** — treat Pages-only material as
> background only (see prune candidates below).

Running list of sources for deploying **Angular SSR on Cloudflare**. Add new
entries at the bottom of the table, incrementing the ID. Keep the description to
one or two sentences covering what the source actually contains.

| #  | Title | Type | Published | Link | Summary | Description |
|----|-------|------|-----------|------|---------|-------------|
| 1  | Deploy Angular SSR on Cloudflare | Blog | 2026-09-02 | https://santoshyadav.dev/blog/2026-09-02-deploy-angular-ssr-on-cloudflare/ | [01](summaries/01-deploy-angular-ssr-on-cloudflare.md) | Step-by-step guide to deploying Angular SSR to Cloudflare Workers. Covers making `src/server.ts` platform-neutral with `@angular/ssr`'s `AngularAppEngine`/`createRequestHandler`, setting `ssr.platform: "neutral"` in `angular.json`, and configuring `wrangler.jsonc` with the `ASSETS` binding. Also mentions the `create-cloudflare` shortcut. |
| 2  | Angular · Cloudflare Workers Framework Guides | Docs | 2026-04-23 (updated) | https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/angular/ | [02](summaries/02-cloudflare-workers-angular-guide.md) | Official Cloudflare guide for deploying Angular to Workers. Recommends scaffolding with C3 (`npm create cloudflare@latest -- my-app --framework=angular`), which auto-configures Wrangler (`assets.directory: dist/browser`, `observability.enabled: true`). Covers `npm run start`/`npm run deploy` and static-asset-first routing with Worker fallback. |
| 3  | Angular Server-Side Rendering (SSR) Guide | Docs | v22.1.5 (living) | https://angular.dev/guide/ssr | [03](summaries/03-angular-ssr-guide.md) | Official Angular SSR docs. Covers enabling SSR (`ng new --ssr` / `ng add @angular/ssr`), the generated files, `RenderMode` options (Server/Client/Prerender), and the key API split: `AngularNodeAppEngine` (`@angular/ssr/node`) for Node vs `AngularAppEngine` (`@angular/ssr`, Web `Request`/`Response`) for non-Node platforms like Workers. Also hydration, transfer-cache, and `REQUEST`/`RESPONSE_INIT` tokens. |
| 4  | Analog · Cloudflare Workers Framework Guides | Docs | 2026-04-23 (updated) | https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/analog/ | [04](summaries/04-cloudflare-workers-analog-guide.md) | Official Cloudflare guide for deploying **Analog** (the Angular meta-framework, powered by Vite + Nitro) to Workers. Scaffold with C3 (`--framework=analog`); Wrangler auto-detects it and points `main` at `.output/server/index.mjs`, assets at `.output/public`, with `nodejs_compat`. Dev via `npm run dev`, ship via `npm run deploy`; supports Cloudflare product bindings through Nitro. |
| 5  | Angular CLI — `ssr.platform` option (PR #28598 + commits) | Repo | 2024-10-09 (merged) | https://github.com/angular/angular-cli/pull/28598 | [05](summaries/05-angular-cli-ssr-platform-flag.md) | Primary source for the flag the whole neutral-SSR approach depends on. PR #28598 introduced `ssr.experimentalPlatform` (values `node` / `neutral`) to generate platform-neutral server bundles for edge/serverless runtimes; a later commit renamed it to `ssr.platform`, promoting it out of experimental. Note: no Node polyfills included. |
| 6  | cloudflare-docs Issue #23230 — "Add Angular SSR for Cloudflare Workers" | Discussion | 2025-06-25 (opened) | https://github.com/cloudflare/cloudflare-docs/issues/23230 | [06](summaries/06-cloudflare-docs-issue-23230.md) | Tracking issue requesting official Cloudflare SSR-on-Workers docs for Angular. Confirms a gap: existing docs covered basic Angular deploy but not SSR at the time. Open, assigned to 7 team members, marked stale — useful for gauging what's officially supported vs. community-driven, and for known gaps/issues. |
| 7  | Nitro — Cloudflare deployment provider | Docs | living | https://nitro.build/deploy/providers/cloudflare | [07](summaries/07-nitro-cloudflare-provider.md) | Nitro's Cloudflare docs — the engine under Analog (#4). Documents the presets (`cloudflare_module` = Workers, `cloudflare_pages` deprecated, `cloudflare_durable` = Durable Objects), Wrangler setup, bindings access in server routes (`event.req.runtime.cloudflare.env.*`), and env-var lifecycle. Use `cloudflare_module` for Workers. |
| 8  | AnalogJS — Deployment / Providers | Docs | living | https://analogjs.org/docs/features/deployment/providers | [08](summaries/08-analogjs-deployment-providers.md) | Analog's official deploy reference. ⚠️ Its Cloudflare section is **Pages-focused** (`cloudflare-pages` preset, output `dist/analog/public`) — for Workers use Nitro's `cloudflare_module` (#7) / the CF guide (#4). Keep for reference; candidate to prune given the no-Pages decision. |
| 9  | LaunchFast — Deploy SSR Angular 20+ to Cloudflare Workers | Blog | 2026-07-03 | https://www.launchfa.st/blog/angular-cloudflare-workers | [09](summaries/09-launchfast-angular-ssr-workers.md) | Detailed 2026 guide for the plain `@angular/ssr`-on-Workers path (Angular 20+). Uses a separate `cloudflare/worker.ts` entry + `nodejs_compat` (vs #1's `platform: neutral`), and adds production detail: `allowedHosts`/`NG_ALLOWED_HOSTS` SSRF guard, browser/server build split, live demo. |
| 10 | Angular Architects — Guide for SSR | Blog | 2025-03-23 (v19.2) | https://www.angulararchitects.io/blog/guide-for-ssr/ | [10](summaries/10-angular-architects-ssr-guide.md) | Deep, reputable SSR *concepts* reference — hydration internals, incremental hydration, per-route render modes, Application Builder. **No Cloudflare/edge content** (Node/static hosting only); complements the Angular docs (#3). |
| 11 | Cloudflare Community — "Angular SSR" | Discussion | unknown (likely dated) | https://community.cloudflare.com/t/angular-ssr/37067 | [11](summaries/11-cloudflare-community-angular-ssr.md) | Community forum thread on Angular SSR. ⚠️ 403 on fetch (metadata only); low topic id suggests an older thread predating the modern Workers-assets approach. Real-world-problems pointer; verify age before trusting. Prune candidate. |
| 12 | AnalogJS Discussion #963 — API for Cloudflare Functions | Discussion | 2024-03 (resolved) | https://github.com/analogjs/analog/discussions/963 | [12](summaries/12-analogjs-discussion-963-cf-functions.md) | Troubleshooting Analog API routes 405'ing on deploy — fix was Nitro output/`serverDir` config. ⚠️ **Cloudflare Pages, early 2024** — low relevance to our Workers path; prune candidate. |
| 13 | YouTube (ES) — Angular SSR en Cloudflare Workers (2026) | Video | 2026 | https://www.youtube.com/watch?v=8C5Pt8bCVqE | [13](summaries/13-youtube-angular-ssr-cloudflare-es.md) | Spanish-language step-by-step video of the neutral-SSR + Wrangler Workers flow. ⚠️ Not transcribed (metadata only). Supplementary walkthrough; redundant with #1/#9 unless Spanish is preferred. |
| 14 | Deploying Modern JS Frameworks to CF Workers in 2026 | Blog | 2026 | https://lalatenduswain.medium.com/deploying-modern-javascript-frameworks-to-cloudflare-workers-in-2026-a-complete-developer-guide-25d33e5b6d4c | [14](summaries/14-swain-modern-js-frameworks-workers.md) | Broad overview of deploying JS frameworks to Workers (C3/Wrangler/assets/bindings). ⚠️ 403 on fetch (metadata only); **not Angular-specific** — general context, low priority. |
| 15 | Deploying Angular in 2026: An Architect's Guide | Blog | 2025-12-31 | https://dev.to/kafeel-ahmad/deploying-angular-in-2026-an-architects-guide-to-build-once-run-everywhere-34eh | [15](summaries/15-kafeel-deploying-angular-2026.md) | Architectural survey of Angular deploy targets (Firebase/Netlify/Vercel, Docker+Nginx, Node SSR, edge). **Cloudflare Workers is a one-line mention only** — high-level framing, not a how-to. |
| 16 | A Beginner's Guide to Serverless Angular using CF Workers | Blog | unknown | https://bijayshrestha.medium.com/a-beginners-guide-to-serverless-angular-using-cloudflare-workers-2549a8fb59b5 | [16](summaries/16-shrestha-serverless-angular-workers.md) | Entry-level "serverless Angular on Workers" primer. ⚠️ 403 on fetch (metadata only); unclear if SSR or static. Relevance unconfirmed — lowest priority. |

---

## Notes

- **Type** — one of: Blog, Docs, Video, Repo, Discussion, Other.
- **Published** — publish date as `YYYY-MM-DD`; use `YYYY-MM-DD (updated)` for
  living docs that show a "last updated" date rather than a publish date.
- **Summary** — link to a per-source deep-dive in [`summaries/`](summaries/), named
  `NN-<slug>.md` matching the source's ID. Leave blank if no summary exists yet.
- Prefer primary/official sources (Angular docs, Cloudflare docs) where possible;
  flag blog posts with their publish date since the SSR/Wrangler APIs move fast.
- **Prune candidates** (kept for now, low value for our Workers-only custom build):
  #8 and #12 (Cloudflare **Pages**-oriented), #11 (dated + unreadable). Revisit and
  drop when we tidy the list.

## Key takeaways for our custom build

Distilled from the sources — decisions/context to carry into the implementation,
**not** a spec to copy:

- **Two runtime strategies exist** for `@angular/ssr` on Workers: `platform: "neutral"`
  (strip Node APIs — sources #1, #3, #5) vs. `nodejs_compat` (shim Node APIs — source #9).
  We will choose deliberately; not yet decided.
- **The load-bearing pieces** are `AngularAppEngine` + `createRequestHandler` from
  `@angular/ssr` (Web `Request`/`Response`) and the `ssr.platform` build flag (#5).
- **Static/asset split**: browser build served via the Workers `assets` binding;
  server build is the Worker entry — routing tries assets first, then the Worker.
- **Analog is the alternative path** (Vite + Nitro `cloudflare_module`, #4/#7) if we
  ever want a meta-framework instead of CLI-native SSR.
- **Production detail worth stealing (as ideas, not code)**: `allowedHosts` /
  `NG_ALLOWED_HOSTS` SSRF guard (#9); `provideHttpClient(withFetch())` to avoid the
  `xhr2` path during SSR (our note on #1).
