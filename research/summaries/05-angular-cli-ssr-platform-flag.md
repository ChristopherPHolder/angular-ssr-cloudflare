# Summary — Angular CLI: `ssr.platform` option (PR #28598 + commits)

- **Source:** [#5 in sources.md](../sources.md)
- **Type:** Repo (angular/angular-cli) · **Merged:** 2024-10-09
- **Links:**
  - PR: https://github.com/angular/angular-cli/pull/28598
  - Introduce `ssr.experimentalPlatform`: https://github.com/angular/angular-cli/commit/7d883a152e978112245a98f2f737764caa76ec0f
  - Rename `experimentalPlatform` → `platform`: https://github.com/angular/angular-cli/commit/af2c7e9444fba81d3b1fd2d37dc4412f8305b5ed

## TL;DR

The primary evidence for the flag every source in this research relies on. PR
#28598 added an `ssr.experimentalPlatform` option to the `@angular/build`
application builder so Angular can emit a **platform-neutral** server bundle for
non-Node runtimes (Cloudflare Workers, Deno Deploy, other WinterCG/edge targets).
A later commit **renamed it to `ssr.platform`**, promoting it from experimental.

## What it changes

- New builder option under `ssr`:
  - `platform: "node"` (default) — Node-optimized bundle.
  - `platform: "neutral"` — Web-standard, platform-agnostic bundle with no Node-only APIs.
- Landed via `experimentalPlatform`, then renamed to `platform` (drops the experimental prefix).

## Why it matters here

This is exactly the `angular.json` setting sources
[#1](01-deploy-angular-ssr-on-cloudflare.md) and
[#3](03-angular-ssr-guide.md) use to make the SSR bundle Workers-compatible.
Without `neutral`, the server build pulls in Node APIs that don't exist on the
Workers runtime.

## Key limitation (called out in the PR)

> "This feature does not include polyfills for Node.js modules and is experimental, subject to future changes."

So `neutral` **removes** Node APIs rather than shimming them — any code (or
dependency) that reaches for a Node built-in during SSR must be replaced with a
Web-standard equivalent (e.g. `fetch` instead of `xhr2`; see the caveat in
summary [#1](01-deploy-angular-ssr-on-cloudflare.md)).

## Metadata

- Merged 2024-10-09 by `alan-agius4`; approved by `dgp1130` and `clydin`.
- Labeled `target: major` — shipped in the following Angular major (v19), where
  the neutral-platform SSR build became available.
