

# Forno — Premium Personal Portfolio Template

A warm, editorial, Italian-inspired portfolio template. All structure, layout, animation,
and interaction is fully built — every piece of text content is left as a clearly marked
placeholder (`[ like this ]`) for you to replace with your own information.

## Structure

```
portfolio/
├── index.html       Landing / hero page
├── about.html        Biography, timeline, skills, experience, education, interests
├── projects.html      Featured showcase, full project archive (filter + search), featured products
├── blog.html          Featured article, article grid, newsletter signup
├── contact.html        Contact form, contact cards, calendar booking, map
├── css/style.css      All design tokens, components, animations
├── js/main.js         Cursor, scroll reveals, nav, filters, form handling
└── assets/            Drop your images here
```

## Design tokens — an illuminated codex

The site is treated as a painted manuscript, not a website. The colour system is
the historical **pigment cabinet of Europe**, orchestrated so each plate/entry takes
its own pigment as you scroll (rather than one flat accent):

- **Grounds**: aged vellum `#E7E3D6` (paper), fresco intonaco `#ECE3CB` (warm plate),
  Prussian night `#0B1622` + Spanish tenebrist brown `#211812` (dark plates),
  iron-gall `#171712` (ink).
- **Pigments**: oltremare/lapis `#1F3A93` (IT), Klein/Sèvres blue `#0E2FA0` (FR),
  cinnabar vermilion `#C6362B` (RU/IT), cochineal carmín `#97243F` (ES),
  malachite `#1E6B57` (RU), Spanish ochre `#B27A28` + Naples yellow `#E0BE6B`,
  Pompadour rose `#C08497` (FR), imperial purple `#5C2A50`, burnished gold
  `#A6853B` / `#D6B45E`.
- **Type**: Bodoni Moda (display, optical sizing), EB Garamond (body/text serif),
  Marcellus (lapidary capitals — labels, nav, buttons), Fragment Mono (archival metadata).
- **Signature elements**: painted illumination bloom (conic-gradient rose-window) in
  the hero, fresco-plaster and marbled-endpaper textures (SVG turbulence), gilded top
  edge (tranche dorée) + Scotch rules, gold-tooled rectangular buttons, illuminated
  lapis versal (drop-cap on a gold shadow), and per-section pigment cycling on folio
  numbers, essay numbers, index leaves, and rule accents.

## Founder-credibility components (new)

To make the technical depth of your work legible to founders and engineering
managers at a glance, three new component types were added:

- **`.impact-strip`** — the metrics band on `index.html` and the top of
  `projects.html`. Replace each `—` with a real number and each
  `[ ... ]` context line with what it means (e.g. "40%" / "Performance gain" /
  "p95 API latency, before → after caching"). To animate the number counting
  up on scroll, add `data-count="40"` (the target number) and optionally
  `data-suffix="%"` to the `.impact-num` element — `js/main.js` picks this up
  automatically via `IntersectionObserver` and respects
  `prefers-reduced-motion`.
- **`.stack-strip`** — the row of chips (Frontend / Backend / Database / …)
  under each featured project. Edit the `<h6>` tier labels and `<span>` tech
  names to match your actual stack. Add or remove `.stack-chip` elements
  freely; the arrow connector is CSS-generated.
- **`.arch-box`** — the inline SVG system-architecture diagram under the
  flagship project on `projects.html`. It's plain SVG, not an image, so you
  can edit node labels, add/remove boxes, or change the flow directly in the
  markup. Colors are pulled from the existing CSS variables (`--terracotta`,
  `--olive`, `--blue-deep`, `--gold`) so it stays on-brand automatically.
- **`.decision-list`** — a numbered list of engineering decisions and their
  trade-offs. Numbering is used deliberately here because these are genuinely
  sequential build decisions, not decorative. Replace each `[ Decision ]`,
  `[ Why ]`, and `[ Trade-off ]` with the real call you made — this is the
  single highest-signal section for engineering-manager readers, so it's
  worth writing in your own voice rather than leaving generic.

## Replacing content

1. Search for `[ ... ]` across the HTML files — these are your placeholders.
2. Swap any `.media-placeholder` block with a real `<img>` tag once you have photography.
3. Update the social/contact links (currently `#` / `[ ... ]`) with your real handles.
4. Project cards use `data-category` and `data-title` attributes for the filter/search
   logic in `projects.html` — keep these in sync if you add or remove cards.

## Running it

No build step needed — it's plain HTML/CSS/JS. Just open `index.html` in a browser,
or serve the folder with any static server (e.g. `npx serve .`).

Everything (animations, filtering, mobile menu, scroll reveals, form interactions) works
out of the box without a framework or backend.
