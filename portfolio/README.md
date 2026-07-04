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

## Design tokens

- **Colors**: cream `#FAF3E6`, terracotta `#C8633C`, Mediterranean orange `#E59257`,
  olive `#6E7A4A`, deep blue `#1F394C`, gold `#C9A24B`.
- **Type**: Fraunces (display/serif), Sora (body), Space Mono (labels & captions).
- **Signature element**: the soft painterly hero blobs + dashed "upload here" media
  placeholders that double as an elegant empty state until you add real photography.

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
