---
version: 1
slug: "src-app-app-shell-app-shell-component-ts"
primary_target: "src/app/app-shell/app-shell.component.ts"
related_targets: ["src/app/pages/movie-list-page","src/app/pages/movie-detail-page","src/app/pages/person-detail-page","src/app/ui"]
---

Scope: the whole application — app shell, movie list, movie detail, person detail, account lists, not-found. Visitor mode: Operate.

Audience: a moviegoer scanning for something to watch, on phone or desktop, plus a developer judging whether Angular SSR on Cloudflare Workers holds up. Job: scan a grid of posters and decide. Constraints: bundle size is a product constraint; all responsive behaviour is CSS-only, with no viewport branching in TypeScript or templates; WCAG AA and AXE must pass; TMDB attribution stays.

## Direction contract

THESIS: The catalogue is a contact sheet. Every title is a frame on a light table, read in one continuous ruled strip rather than picked out of floating cards. It refuses the category-default arrangement — a full-bleed hero banner over horizontal scroll rails of rounded, shadowed, hover-scaling cards — because that arrangement spends its first viewport on one title the visitor did not ask for and then hides the rest behind horizontal scroll.

OWN-WORLD: A film archive's own material: the vault dark, the backlit light table, the grease pencil. Ground #0A0C0D, panel #15181A, hairlines #272C30, ink #F2F4F5, dim #9BA2A7, and one chromatic hue in the entire interface — chinagraph #FF4A14 (#B82D00 on the light box). Light theme is the light box, cool near-white, never cream, never an inversion. One grotesk plus one monospace; the mono carries accession codes, years, figures and labels only, never body copy. Zero border-radius anywhere. Zero box-shadow anywhere — rank is carried by ply (ground, panel, rule), not elevation. Frames are divided by 1px hairlines into one continuous strip; nothing is a card. Recognisable with every poster removed: a ruled grid of empty frames with codes in the gutters.

STORY: The visitor understands within one viewport that this is a complete archive they can scan, not a storefront pushing one title. They believe it is fast because it is already drawn before they can look away. They scan the strip, mark the frame they want with their eye, and open it.

FIRST VIEWPORT: A 56px top strip divided from the page by a single hairline — wordmark left, a hairline-underline search field and a mono LIGHT/DARK switch right. No bar fill, no shadow. A 232px left index, divided by one vertical hairline, listing DISCOVER (Popular / Top Rated / Upcoming) and GENRES as a typed accession index; the active entry carries a 2px chinagraph bar at its left edge. The rest is the strip grid: posters at 2:3 divided by hairlines, each with its accession code and year in mono in the gutter beneath, the title below that, and a measured rating bar — a 2px track with the fill at exactly the rating's percentage and the figure beside it. Second row clipped by the fold, so the strip reads as continuous. The primary action is the frame itself.

FORM: The Contact Sheet — a film archive's contact sheet, light table and accession card. Position 7 of 7 on my ordered grounded list; the roll assigned it over my own top-ranked Repertory Programme. seed:fe78c915171b775a

RAISES (each named for the challenger that donated it):
- from ikeda-datamatics: palette law — exactly one chromatic hue in the entire interface, every other value achromatic, so poster artwork is the only other colour on screen.
- from notation-diagram-systems-labanotation: every magnitude is measured, never iconic — the rating is a bar whose length is the value with the figure beside it; the five-star widget is deleted.
- from rw-manual-acetate-tab-board: motion is a two-frame step at 90ms with no easing curve anywhere, and one single ply rank replaces every ad-hoc box-shadow and z-index in the app.

SIGNATURE INTERACTION: the chinagraph mark. The focused or hovered frame is circled by a drawn grease-pencil stroke — an irregular open ellipse in chinagraph, overlapping the frame's edges so it reads as drawn on the sheet rather than as a UI border. It is the keyboard focus indicator and the hover state, one mark doing both jobs, and it is the app's only authored motion moment.

MOTION GRAMMAR: two-frame steps, 90ms, `steps(2)`; no easing curve anywhere in the project. The chinagraph stroke is the one exception and draws via stroke-dashoffset. Everything respects prefers-reduced-motion.

Unresolved: whether the incumbent movies wordmark and the `angular-stream` document title survive; both are open per PRODUCT.md.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
