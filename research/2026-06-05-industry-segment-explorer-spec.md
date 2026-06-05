# Industry Segment Explorer — Platform Component Spec

**Status:** v1 (2026-06-05)
**Type:** Core design-system primitive. Market-agnostic, config-driven. Consumed by every market page with different data only.
**Files:**
- `assets/segment-explorer.css` — all component styles (scoped `.segexp-*`)
- `assets/segment-explorer.js` — the engine (`window.SegmentExplorer`)
- Per-market **config object** lives inline in each market page (content belongs to the page)

> Design rule: the engine never contains market-specific logic. Adding a market = adding a config object + a `<div class="segexp" data-explorer="…">`. No engine edits, ever.

---

## 1. Data model

The page exposes one global config object and points a mount element at it:

```html
<div class="segexp" data-explorer="DEON_EXPLORER_ELECTRONICS"></div>
<script>
window.DEON_EXPLORER_ELECTRONICS = { /* MarketExplorerConfig */ };
</script>
```

`MarketExplorerConfig`
| Field | Type | Required | Notes |
|---|---|---|---|
| `market` | string | yes | Market id — used as the `localStorage` state key + analytics hook |
| `eyebrow` | string | no | Small kicker above the title |
| `title` | string | yes | Section H2 |
| `intro` | string | no | Lead paragraph |
| `variant` | `"rail-top"` \| `"rail-side"` | no | Layout variant. Default `rail-top` |
| `accent` | CSS color | no | Overrides `--segexp-accent`. Default `var(--blue)` |
| `segments` | `Segment[]` | yes | 2–6 recommended |

`Segment`
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Stable slug; used for deep-link `#segexp=<id>` + state |
| `label` | string | yes | Rail button text |
| `icon` | SVG string | no | Small inline glyph for the rail |
| `summary` | string | yes | One-line description shown at top of the stage |
| `diagram` | `{ src, alt, caption? }` | yes | The visual that swaps per segment |
| `challenges` | `string[]` | no | "Manufacturing challenges" bullet list |
| `applications` | `{ name, desc }[]` | no | "Typical applications" |
| `products` | `{ family, note?, href? }[]` | no | "Recommended DEON product families" — the conversion bridge to Product → Family |
| `resource` | `{ label, meta?, href }` | no | Supporting download/link chip |

The schema maps directly onto the site's information architecture:
**Market → Segment → Application → Product Family → Product.** `segments[]` = Segment, `applications[]` = Application, `products[]` = Product Family.

## 2. Component architecture

- **Engine:** `SegmentExplorer` (IIFE exposing `window.SegmentExplorer`).
  - Auto-init on `DOMContentLoaded`: every `.segexp[data-explorer]` reads `window[attr]` and mounts.
  - Programmatic: `SegmentExplorer.mount(el, config)`.
- **Render once, toggle state.** All panels are pre-rendered; switching sets `.is-active` and updates `aria-selected` / `tabindex`. No re-render, no layout thrash; transitions are pure `opacity`/`transform`.
- **DOM regions** built by the engine: header (eyebrow/title/intro) → rail (the segment switcher, `role="tablist"`) → stage (diagram panel + content panel, one `role="tabpanel"` per segment).
- **State:** active index held in closure; persisted to `localStorage["segexp:"+market]` and reflected in the URL hash so a segment is deep-linkable.

## 3. Responsive behavior

| Breakpoint | Rail | Stage |
|---|---|---|
| ≥ 980px | horizontal, wraps (or vertical left column if `rail-side`) | 2-col: diagram ~44% / content ~56% |
| 768–979px | horizontal, scrolls if overflow | stacked: diagram on top, content below |
| < 768px | horizontal pill strip, scroll-snap | fully stacked, single-column lists |

Only `transform`/`opacity` animate. Reduced-motion users get instant swaps (`prefers-reduced-motion`).

## 4. Content schema authoring rules

- 2–6 segments per market (4 is the sweet spot, matching the brief's examples).
- `summary`, `challenges`, `applications`, `products` should be *segment-specific* — switching a segment must visibly change every region, or the component adds no value over a static grid.
- `products[].family` points at Product Family pages (Product hub, later phase) via `href`.
- Diagrams: until real exploded-view illustrations exist, use `https://placehold.co/720x540/<bg>/<fg>?text=<Segment>` so each segment reads distinctly.

## 5. Variant support

- `variant: "rail-top"` (default) — switcher across the top.
- `variant: "rail-side"` — switcher as a vertical rail on the left (desktop); collapses to top strip < 980px.
- `accent` — per-market accent via `--segexp-accent` (active tab underline, list bullets, product arrows, links). Lets a market lean blue (technical) or red (DEON primary) without engine changes.
- Future variants slot in as `.segexp--<name>` modifier classes; the engine only adds the class from `config.variant`.

## 6. Rollout

Electronics is the first consumer (segments: PCB Assembly, Displays, Battery Packs, Consumer Electronics). The remaining markets reuse the identical engine with their own config:
- Automotive → Wire Harnessing, Interior Components, Surface Protection, EV Battery Systems
- Electrical & Insulation → Cable Harnessing, Transformer Insulation, Motor Winding, Electrical Assembly
- …Packaging, Appliance, HVAC/Metal, Construction, Renewable Energy.
