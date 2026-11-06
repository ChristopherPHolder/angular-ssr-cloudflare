---
name: The Contact Sheet
description: A film archive's light table — one continuous ruled strip of frames, one grease-pencil hue, no elevation.
colors:
  ply-0: "light-dark(#eef1f2, #0a0c0d)"
  ply-1: "light-dark(#ffffff, #15181a)"
  ply-2: "light-dark(#f7f9fa, #1d2124)"
  rule: "light-dark(#919da4, #454e55)"
  rule-strong: "light-dark(#717e88, #68727a)"
  ink: "light-dark(#14181a, #f2f4f5)"
  ink-dim: "light-dark(#4d5559, #9ba2a7)"
  ink-faint: "light-dark(#5e6569, #8b9398)"
  mark: "light-dark(#b82d00, #ff4a14)"
  mark-ink: "light-dark(#ffffff, #0a0c0d)"
  backdrop: "light-dark(rgb(20 24 26 / 0.55), rgb(0 0 0 / 0.68))"
typography:
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.375rem, 1.05rem + 1.4vw, 2.125rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "{typography.headline.fontFamily}"
    fontSize: "clamp(1.0625rem, 0.97rem + 0.42vw, 1.3125rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  frame:
    fontFamily: "{typography.headline.fontFamily}"
    fontSize: "clamp(0.875rem, 0.84rem + 0.17vw, 0.9375rem)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "{typography.headline.fontFamily}"
    fontSize: "clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  fine:
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0.12em"
  label:
    fontFamily: "{typography.fine.fontFamily}"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0.14em"
    fontFeature: "tnum"
rounded:
  none: "0"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  s-8: "64px"
components:
  button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.fine}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "40px"
  button-hover:
    backgroundColor: "{colors.ply-2}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.mark-ink}"
    typography: "{typography.fine}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "40px"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink-faint}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "42px"
  tab-active:
    textColor: "{colors.ink}"
  select:
    backgroundColor: "{colors.ply-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "40px"
  search-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 0"
  frame:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.frame}"
    rounded: "{rounded.none}"
    padding: "0"
  frame-hover:
    backgroundColor: "{colors.ply-1}"
    textColor: "{colors.ink}"
  index-entry:
    backgroundColor: "transparent"
    textColor: "{colors.ink-dim}"
    typography: "{typography.frame}"
    rounded: "{rounded.none}"
    padding: "8px 24px"
  index-entry-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  account-menu:
    backgroundColor: "{colors.ply-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 0"
    width: "200px"
  genre-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-dim}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
---

# Design System: The Contact Sheet

## Overview

**Creative North Star: "The Contact Sheet"**

This is a film archive's own material: the vault dark, the backlit light table, the grease
pencil. The catalogue is not a storefront of cards — it is one continuous ruled strip of
frames on a sheet, each with its accession code and year written in the gutter beneath it.
Nothing floats, nothing lifts, nothing rounds. The only hue in the entire interface is the
grease pencil; every other value is a cool achromatic neutral, so the poster artwork is the
only other colour the page paints.

Density and legibility outrank decoration. The chrome is hairlines and mono labels; the
content is the posters. The system is deliberately built out of platform features rather
than dependencies — system type stacks, `light-dark()`, intrinsic grid, `content-visibility`
— because weight is spent against the argument this app exists to make. Every token is
declared once; a value that appears twice is a token that is missing.

The test the world has to pass is the empty-frames test: with every poster removed, the
field still has to read as a ruled grid of frames with codes in the gutters. It does — that
is what the hairline rules and the gutter mono are for, and it is why the frames carry
their own rules rather than relying on a grid gap.

**Key Characteristics:**
- One chromatic hue in the whole system; everything else achromatic and cool.
- Zero border-radius and zero box-shadow, anywhere, without exception.
- Rank is ply — which sheet a thing sits on — plus a 1px hairline.
- A grotesk/mono split where the mono carries codes, years, figures and labels, never prose.
- Two-frame step motion at 90ms with no easing curve anywhere.
- Column count is intrinsic; the responsive system has exactly two breakpoint values.

## Colors

A cool achromatic archive — three plies of neutral paper, two weights of rule, three weights
of ink — interrupted by exactly one chromatic mark.

Both themes are declared once per token with `light-dark()`. The theme is selected by
`color-scheme` on the root, which follows the OS until the visitor overrides it with
`[data-theme='light'|'dark']`. There is no second set of declarations and no inversion
filter. Dark is the default intent; light is the light box, cool near-white, never cream.

### Primary
- **Chinagraph** (`{colors.mark}`): the grease pencil. The signature mark around a hovered or
  focused frame, the active index bar, the focus ring, the loader's advancing segment, the
  caret, the selection fill, the `accent-color`, and the hover state of a link underline, a
  genre chip or a cast control. Nothing decorative ever takes it. Measured against the three
  plies it runs 5.83 / 5.30 / 4.82 (dark) and 5.42 / 6.15 / 5.83 (light).
- **Mark Ink** (`{colors.mark-ink}`): the only colour placed *on* chinagraph — the primary
  button's label and the selection text.

### Neutral
- **Ground / Ply 0** (`{colors.ply-0}`): the room. The page, the strip, and the wide-viewport
  index all sit on it, divided from each other by hairline only.
- **Table / Ply 1** (`{colors.ply-1}`): the light table. A hovered or focused frame, the
  narrow-viewport drawer, the trailer dialog, and the ground a poster has not arrived on yet.
- **Leaf / Ply 2** (`{colors.ply-2}`): a leaf lifted off the table. The account menu and the
  button hover fill. This is the highest rank in the system.
- **Rule** (`{colors.rule}`): the frame line. Every structural division on the sheet — the
  grid's hairlines, the section tops, the strip's underline. At 2.31 / 2.10 / 1.91 (dark)
  and 2.45 / 2.78 / 2.63 (light) it sits deliberately below 3:1: it is structure, not text
  and not a control boundary.
- **Rule Strong** (`{colors.rule-strong}`): the control line. Every border that bounds an
  interactive control — button, select, search underline, menu, drawer edge, scrollbar
  thumb. 3.99 / 3.63 / 3.30 (dark) and 3.67 / 4.17 / 3.94 (light): clears the 3:1
  non-text bar on every ply in both themes.
- **Ink** (`{colors.ink}`): headings, titles, links, active entries. 17.77 / 16.17 / 14.70
  (dark), 15.74 / 17.87 / 16.92 (light).
- **Ink Dim** (`{colors.ink-dim}`): body prose, index entries at rest, the rating bar's fill
  and figure, TMDB attribution. 7.58 / 6.90 / 6.27 (dark), 6.70 / 7.61 / 7.21 (light).
- **Ink Faint** (`{colors.ink-faint}`): accession codes, tabs, section labels, the search
  placeholder, icon glyphs at rest. It carries real text, so it is held to the body-text
  bar, not the 3:1 one: 6.28 / 5.71 / 5.19 (dark), 5.22 / 5.93 / 5.62 (light).
- **Backdrop** (`{colors.backdrop}`): the wash behind the drawer and the trailer dialog.

### Named Rules

**The One Hue Rule.** `--mark` is the only non-achromatic token in the system. If a new
surface needs a second colour, it needs a reason that outranks the law — and it will not
find one, because poster artwork is the colour. Audit test: grep the stylesheets for a
literal colour; everything that is not `--mark` must be grey.

**The Two Rules Rule.** A hairline is either structure (`--rule`) or a control boundary
(`--rule-strong`). Structure may sit under 3:1 because nothing is read from it; anything
that bounds something clickable takes `--rule-strong` and clears 3:1 on every ply.

**The Faint-Is-Text Rule.** `--ink-faint` is used for small mono labels people actually
read, so it is held to 4.5:1 against every ply in both themes — not to the 3:1 bar its
visual weight suggests.

## Typography

**Display / Body Font:** the platform grotesk stack (`ui-sans-serif, system-ui,
-apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`)
**Label / Mono Font:** the platform mono stack (`ui-monospace, SFMono-Regular, 'SF Mono',
Menlo, Consolas, 'Liberation Mono', monospace`)

**Character:** the system stacks are a cited constraint, not an accident. Bundle size is a
first-class product constraint here, and a webfont would erase the measured saving the rest
of the build spent effort on — so character is bought with tracking, scale and the
grotesk/mono split instead of with a sourced face. The grotesk is tight and slightly
negative-tracked for titles; the mono is wide-tracked and uppercase, and it reads as the
typewriter that filled in the accession card.

### Hierarchy
- **Headline** (500, `clamp(1.375rem, 1.05rem + 1.4vw, 2.125rem)`, 1.15, -0.015em): the page
  title at the top of every article header.
- **Title** (500, `clamp(1.0625rem, 0.97rem + 0.42vw, 1.3125rem)`, 1.15, -0.015em): section
  headings inside a detail card.
- **Frame** (500, `clamp(0.875rem, 0.84rem + 0.17vw, 0.9375rem)`, 1.3, -0.01em): the movie
  title in a frame's gutter and the index entries. Clamped to two lines, then clipped, so one
  long title cannot break the strip's rhythm.
- **Body** (400, `clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem)`, 1.55): prose, capped at
  `--measure` (68ch).
- **Fine** (mono, 400, `0.8125rem`, 0.12em, uppercase): button and chip labels.
- **Label** (mono, 400, `0.6875rem`, 0.14em, uppercase, tabular): accession codes, years,
  rating figures, tabs, section labels, the search field's own text. `font-variant-numeric:
  tabular-nums` so codes and figures align down a column.

### Named Rules

**The Mono-Is-Data Rule.** The mono face carries accession codes, years, figures, counts and
short uppercase labels — never body copy, never a heading, never a sentence. If it would be
read as prose, it is set in the grotesk.

**The No-Webfont Rule.** No `@font-face`, no font CDN, no icon font. The type ramp is fluid
`clamp()` with no `html { font-size }` hack and no breakpoint ladder, so size is continuous
across every viewport.

## Layout

The shell is a CSS grid of a sticky top strip over a two-column body: a `--rail` (232px)
index beside the `.sheet`. Below 64rem the rail leaves the grid and becomes a fixed drawer
over the sheet with a backdrop; above it, the same component and the same markup become the
left column. The strip is `--strip`, 100px while it wraps the search onto a second row and
56px once the row fits (the value is redeclared at 48rem in the token layer, so the switch
costs one line).

The catalogue grid is `repeat(auto-fill, minmax(var(--frame-min), 1fr))` with `--frame-min:
clamp(8.5rem, 13vw, 11.5rem)`. Column count therefore has **no breakpoint at all** — it is
intrinsic. The grid has no gap: the frames draw their own right and bottom hairlines and the
container draws the top and left, so the field reads as one continuous ruled sheet instead of
a set of tiles.

Spacing is one rhythm: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px. Page rhythm is defined once
globally — `.sheet article > header` and `.sheet section` carry the padding and the
hairline top rule, so a new route inherits the rhythm rather than restating it.

Responsive behaviour is CSS-only, as a product constraint: no viewport check in TypeScript,
no `isMobile` in a template, no media-query listener. The whole system uses exactly two
breakpoint values, 48rem and 64rem, plus `prefers-reduced-motion`.

### Named Rules

**The Intrinsic Column Rule.** Column count is never set by a breakpoint. New grids use
`auto-fill` over a fluid `minmax()` track; if a layout seems to need a third breakpoint, it
needs an intrinsic track instead.

**The One Markup Rule.** The same DOM serves phone and desktop. A responsive change is a CSS
rule, never a branch — this keeps the SSR payload identical for every device, which is what
makes hydration at the edge correct.

**The Two Breakpoints Rule.** 48rem (the strip returns to one row; page padding and the
detail card go two-column) and 64rem (the index sits beside the field). Adding a third
breakpoint value is a system change, not a local fix.

## Elevation & Depth

**There is no `box-shadow` anywhere in this system, and there is no shadow vocabulary to
quote.** Depth is ply: `--ply-0` is the room, `--ply-1` the light table, `--ply-2` a leaf
lifted off it, each separated from its neighbour by a 1px hairline rather than by a cast
shadow. The account menu, the drawer and the trailer dialog — the three things that would
conventionally be "elevated" — are all a ply change plus a `--rule-strong` border, nothing
more. The modal wash (`--backdrop`) is the only atmospheric device in the system.

### Named Rules

**The Ply Rule.** A thing is never *above* another thing; it is *on* a ply. Rank is
expressed by moving to the next ply and drawing a hairline. A new surface that reaches for a
shadow is asking for a ply it has not been given.

**The No-Shadow Rule.** `box-shadow` is not used for elevation, for hover, for focus, or for
glow. Focus is a ring and a drawn mark; hover is a ply change.

## Shapes

Zero border-radius, everywhere, without exception: buttons, selects, menus, dialogs, chips,
posters and the drawer are all square. `border-radius: 0` is set explicitly on `.btn` and
`.select` purely to override the user-agent default; no non-zero radius exists in the
codebase.

The recurring geometry is the rule and the frame: a 1px hairline (`--hair`) dividing
everything from everything else, and a 2:3 plate. Posters are always 2:3 and `object-fit:
cover`; backdrops and video are always 16:9; both are declared as reusable aspect-ratio
classes so the shape is never restated. Controls are drawn as lines rather than boxes
wherever they can be — the search field is a single underline, the tab is a 2px bottom bar,
the rating is a 2px track, the active index entry is a 3px left bar in a gutter every entry
reserves so nothing shifts when it appears.

The one organic form in an otherwise ruled system is the chinagraph ellipse, and it is
deliberately hand-drawn and irregular.

## Components

### Buttons
- **Shape:** square (0 radius), 40px minimum height, 16px horizontal padding.
- **Default:** transparent fill, `--rule-strong` hairline border, `--ink` label in uppercase
  mono at 0.12em tracking.
- **Hover:** fill lifts to `--ply-2` and the border lightens to `--ink-faint`; 90ms
  two-frame step on background and border only.
- **Primary:** `--mark` fill, `--mark-ink` label, same square silhouette; hover brightens
  by 1.12 rather than changing hue.
- **Functionality-only:** when a button exists purely to make a region activatable it is
  stripped of all chrome (no border, no background, left-aligned) and the surrounding
  element carries the whole visual treatment.

### Chips (genre links)
- **Style:** transparent, `--rule-strong` hairline, `--ink-dim` uppercase mono label,
  4px/12px padding, square.
- **Hover:** both the label and the border go to `--mark`. Chips are never filled.

### Cards / Containers
There are no cards. The equivalent container is a **section on the sheet**: 24px padding
(32px horizontal above 48rem), a `--rule` hairline on top, no fill, no border on the other
three sides, and a mono uppercase `--ink-faint` section label as its heading. The detail page
is an accession card — a sticky 2:3 plate column beside the written record, divided by the
same hairline, collapsing to one column below 48rem.

### Inputs / Fields
- **Search:** a hairline underline (`--rule-strong`), not a box — no fill, no border, no
  radius. The input is uppercase mono at label size with an `--ink-faint` placeholder.
- **Focus:** the underline turns `--mark` and the magnifier glyph turns with it; the field
  itself suppresses the global outline because the underline *is* the indicator.
- **Select:** `--ply-1` fill, `--rule-strong` hairline, square, native appearance removed and
  the caret redrawn as a rotated two-border chevron.

### Navigation
- **Index rail:** a typed accession index — `--ink-faint` mono uppercase group labels
  (DISCOVER, GENRES) separated by a hairline, then entries at frame size in `--ink-dim`.
- **States:** hover raises the entry to `--ink` on a `--ply-1` fill; the active entry takes
  `--ink` plus a 3px `--mark` left bar and turns its icon `--mark`.
- **Mobile:** below 64rem the same component is a fixed drawer that translates in over a
  backdrop. It sets `visibility: hidden` alongside the transform — translating alone leaves
  its links focusable and in the accessibility tree while the drawer reads as closed.
- **Attribution:** the TMDB source line is pinned to the foot of the index and held at
  `--ink-dim`, not dimmed into the rule colour. It stays visible and linked.

### The Frame (signature)
The unit of the catalogue. A 2:3 poster plate with the gutter written beneath it: accession
code and year on one tabular mono line pushed to opposite edges, the title below at frame
size clamped to two lines, and the rating bar last. Its borders are the grid's hairlines.
Hover and focus both raise it to `--ply-1` and turn its accession line `--mark`.

Frames carry `content-visibility: auto` with `contain-intrinsic-size: auto 320px` for
off-screen work.

### The Chinagraph Mark (signature)
The one authored motion moment and the only use of the hue in the field. A hovered or focused
frame is circled by an irregular open ellipse drawn in `--mark`, inset `-5%` so the stroke
crosses the frame's edge onto the sheet — it has to read as drawn *on* the contact sheet, not
as an inset UI border. It draws via `stroke-dashoffset` over 420ms linear. A wider
`--ply-0` halo pass sits under the stroke so it stays readable over a pale poster without
introducing a second hue. The ellipse path is declared once as an SVG `<symbol>` and
referenced per frame, so a hundred frames cost one path.

Because the mark is drawn over arbitrary artwork — where `#ff4a14` can measure as little as
1.2:1 — it does not carry focus alone. `:focus-visible` additionally draws a two-tone ring:
a 2px `--ply-0` band at the frame edge with a 2px `--ink` outline inset just inside it, so
one of the two always contrasts with whatever the poster happens to be. No shadow is used.

### The Rating Bar (signature)
Magnitude is measured, never iconic. A 2px `--rule` track with an `--ink-dim` fill whose
width is exactly the value as a percentage, and the figure beside it in tabular mono to one
decimal. The bar is `aria-hidden`; the host carries `role="img"` with a "Rated X out of 10"
label. There is no five-star widget and there will not be one.

### The Loader
A frame line advancing, not a spinner: a full-width 2px `--rule` track with a 28% `--mark`
segment stepping across it at 900ms with `steps(2, end)`. Under `prefers-reduced-motion` it
stops and becomes a static 40%-opacity full-width line.

## Do's and Don'ts

### Do:
- **Do** take every colour from the token layer, and declare both themes in a single
  `light-dark()` pair at the point the token is defined.
- **Do** carry rank with a ply change plus a hairline (`--ply-0` → `--ply-1` → `--ply-2`).
- **Do** use `--rule` for structure and `--rule-strong` for anything that bounds a control.
- **Do** set codes, years, figures and short uppercase labels in the mono stack with
  `tabular-nums`, and prose in the grotesk.
- **Do** express every responsive change in CSS — intrinsic grid first, then one of the two
  existing breakpoints.
- **Do** animate with `var(--step) var(--step-fn)` (90ms, `steps(2, end)`) and nothing else.
- **Do** release `content-visibility` to `visible` on the hovered or focused frame. The frame
  carries `content-visibility: auto` for off-screen work, and that applies paint containment
  which clips the chinagraph's overhang; releasing it only on interaction keeps the saving
  where it actually pays, since the interacted frame is on screen by definition.
- **Do** recolour injected brand SVGs globally by id (`#movies-logo .st0`, `#tmdb-logo
  .cls-1`) and apply transforms to the `<fast-svg>` host, never to the inner `<svg>`. The
  injected SVG lives in that component's own view and carries no encapsulation attribute from
  the parent, so a parent's scoped descendant selector cannot reach it.
- **Do** keep TMDB attribution visible, linked, and at a legible ink in both themes.
- **Do** reach for a platform feature before a dependency, and a token before a one-off.

### Don't:
- **Don't** introduce a second chromatic hue. Poster artwork is the colour.
- **Don't** use `box-shadow` — not for elevation, hover, focus or glow.
- **Don't** use a non-zero `border-radius` anywhere.
- **Don't** add an easing curve. There is no `cubic-bezier`, `ease-in` or `ease-out` in this
  project and the step function is the grammar, not a default.
- **Don't** add a webfont, an icon font, a CSS framework or a UI component library. Bundle
  size is a product constraint and every one of these spends it.
- **Don't** branch on viewport size in TypeScript or in a template, and don't add a
  JavaScript media-query listener. It breaks SSR/hydration parity at the edge.
- **Don't** make magnitude iconic — no star rows, no filled/empty glyph repeats.
- **Don't** let the chinagraph mark be the sole focus indicator on any surface where it is
  drawn over uncontrolled imagery; pair it with the two-tone ring.
- **Don't** separate frames with a grid `gap`. The strip is continuous; the frames draw
  their own rules.
- **Don't** put a short invented word above a heading as a kicker or eyebrow. The accession
  label beside a page title is for real catalogue data (a tagline, a year, a source count).
