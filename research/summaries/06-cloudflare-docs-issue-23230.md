# Summary — cloudflare-docs Issue #23230: "Add Angular SSR for Cloudflare Workers"

- **Source:** [#6 in sources.md](../sources.md) · https://github.com/cloudflare/cloudflare-docs/issues/23230
- **Type:** Discussion (GitHub issue, cloudflare/cloudflare-docs) · **Opened:** 2025-06-25 · **Status:** Open (stale)

## TL;DR

A docs-tracking issue asking Cloudflare to add an **Angular SSR** guide for
Workers. It's the paper trail showing that, as of mid-2025, Cloudflare's official
docs covered *basic* Angular deployment (Workers/Pages) but **not** SSR — the gap
that the community blog posts (source [#1](01-deploy-angular-ssr-on-cloudflare.md))
filled in the meantime.

## What's requested

- Add guidance for deploying Angular apps **with SSR** to Cloudflare Workers.
- Points at Angular's official SSR docs as the reference for the feature.

## Status / signals

- **Open**, labeled `content request` / documentation / product-specific (Pages/Workers), and marked **stale**.
- Assigned to 7 Cloudflare team members (incl. GregBrimble, IgorMinar, WalshyDev).
- No linked PRs or comments at capture — i.e. not yet resolved with dedicated SSR docs.

## Why it's in the research

- **Provenance / recency check.** Explains why the official Cloudflare Angular guide (source [#2](02-cloudflare-workers-angular-guide.md)) is light on SSR internals — the deeper SSR coverage was still an open request.
- **Watch item.** Worth checking periodically: if this closes, official first-party SSR-on-Workers docs likely exist and should be added as a new source.
- **Known-gaps radar.** Any follow-up comments here are a good place to surface official caveats or supported-vs-unsupported specifics.
