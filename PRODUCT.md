# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences on the same surface, both served by the same interface:

1. **Moviegoers** — someone browsing for something to watch. They arrive without a
   specific title in mind, scan posters, narrow by category or genre, search when they
   do have a title, and open a detail page to decide. Session is short and visual.
   Mobile and desktop both matter; the same person uses both.
2. **Angular / edge developers** evaluating the stack. They came from the README or a
   talk to see whether Angular SSR on Cloudflare Workers is viable. They read code, open
   devtools, and judge the approach partly by how the rendered app feels — hydration,
   paint, scroll, perceived speed.

The interface is designed for audience 1 and is the proof for audience 2. It must stand
on its own as a polished consumer movie app; "it's only a demo" is not a defense.

## Product Purpose

A movie discovery app on top of The Movie Database: browse popular, top-rated and
upcoming titles, browse by genre, full-text search, and read detail pages for movies,
cast, crew and person filmographies. Signed-in TMDB users can view, create and edit
their own lists.

Success is a visitor who finds something worth watching without friction, on either
form factor — and a developer who comes away believing the rendering stack holds up.

## Positioning

Every route is server-rendered with `RenderMode.Server` and hydrated on the client with
event replay, running on Angular's platform-neutral SSR build directly on the Cloudflare
Workers runtime — no Node compatibility layer, no `fs`, no Node globals. Static assets
are served by Cloudflare's `ASSETS` binding; only misses fall through to the rendering
Worker. That combination is the thing a neighboring project cannot truthfully claim.

## Operating Context

- Content is live TMDB data: poster and backdrop images at several widths, vote averages,
  genres, cast/crew, and person filmographies. Image quality and aspect are not under our
  control; posters are 2:3 and are the dominant visual element on nearly every surface.
- Lists paginate by infinite scroll, triggered by an element-visibility sentinel.
- Routes: `/list/category/:category`, `/list/genre/:id`, `/list/search/:query`,
  `/detail/movie/:id`, `/detail/person/:id`, account/list routes, and a not-found page.
- Account features require a TMDB v4 read access token with write scope; without one the
  account surfaces are unauthenticated and must degrade honestly.
- The app ships a light and a dark theme, toggled in the toolbar.

## Capabilities and Constraints

- Angular 22, standalone, zoneless, signal-based APIs; `@rx-angular/state` for state;
  `@push-based/ngx-fast-svg` for icons; `NgOptimizedImage` for posters.
- SSR target is the Workers runtime. No `window`/`document` access outside of
  browser-guarded code; failures surface at the edge at runtime, not at build time.
- **Bundle size is a first-class product constraint.** This app is also a performance
  argument. CSS and JS added for the redesign must be justified; no UI component library,
  no CSS framework, no icon-font or runtime-CSS-in-JS dependency.
- **Responsive behavior must be expressed in CSS only.** No viewport-size checks in
  TypeScript, no `isMobile`/`isDesktop` branching in templates, no JS media-query
  listeners deciding layout. Container queries, media queries, fluid type and intrinsic
  grid layout do the work. This keeps SSR output identical for every device, which is
  required for correct hydration at the edge.
- Images are TMDB-hosted and must keep `NgOptimizedImage` with explicit width/height,
  srcset and sizes, and priority on above-the-fold posters.
- Icons are SVG, loaded through `fast-svg`; new iconography should reuse that pipeline
  rather than introduce a second one.

## Brand Commitments

- TMDB attribution and the TMDB logo must remain visible and linked, per TMDB's terms of
  use. The data source is not optional branding.
- The app has an existing movies wordmark/logo (`assets/svg-icons/movies-logo.svg`) and
  the document title `angular-stream`. Neither has been confirmed as a locked brand; both
  are open to replacement if the redesign calls for it.
- Dark theme is the default and carries the primary design intent — posters read best on
  dark. The light theme stays fully supported and must meet the same accessibility bar.

## Evidence on Hand

- Live deployment: <https://angular-ssr-cloudflare.toholderandrews-4c2.workers.dev>
- Real TMDB content; no fabricated titles, ratings, counts or copy.
- Existing SVG icon set in `src/assets/svg-icons/`, app icons in `src/assets/icons/`,
  and `no_poster_available.jpg` / `nothing.svg` fallbacks.
- No testimonials, customers, benchmarks, pricing or press exist for this project. Do not
  invent any.

## Product Principles

1. **The poster is the interface.** Content leads; chrome recedes. Anything that competes
   with the artwork for attention has to earn it.
2. **Scanning beats reading.** The primary act is scanning a grid and deciding. Density,
   rhythm and legibility at a glance outrank decoration.
3. **Weight is a feature.** Every kilobyte of CSS or JS is spent against the argument this
   repo exists to make. Prefer a platform feature over a dependency, and a token over a
   one-off.
4. **One layout, every screen.** The same markup must serve phone and desktop; CSS adapts
   it. No device branching anywhere in TypeScript or templates.
5. **Honest states.** Loading, empty, error, unauthenticated and no-poster states are
   designed, not afterthoughts — the app renders live third-party data and all of them
   happen.

## Accessibility & Inclusion

WCAG 2.1 AA minimum, and the project requires passing automated AXE checks. This covers
color contrast in both themes, visible focus management (the app has keyboard-reachable
nav, search, infinite-scroll lists and a dropdown menu), correct ARIA on the drawer and
menu, and respecting `prefers-reduced-motion` for any added motion.
