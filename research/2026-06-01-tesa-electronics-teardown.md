# Site Teardown: tesa® Electronics Market Page

**URL:** https://www.tesa.com/en/industry/markets/electronics
**Built by:** tesa SE (Beiersdorf company) — in-house / agency, not identifiable from public markup
**Platform:** Custom CMS (responsive `<picture>` image strategy with crop4x3 / canvas16x9 / crop3x1 variants)
**Date analyzed:** 2026-06-01
**Method:** WebFetch teardown of rendered HTML structure, then corrected against the **raw page source** the user pasted (2026-06-01). Items below marked *(confirmed from source)* come from the raw HTML; others are measured estimates calibrated against our existing tesa-derived design system in `index.html`.

## Confirmed from raw source (2026-06-01)
- **Platform:** Custom "relaunch2020" build — Vue.js front end (`v-cloak`, `portal-target`, custom elements `<header2022-segment-switch>`, `<redirect-layer>`, `<media-wrapper>`), Webpack-bundled CSS/JS under `/relaunch2020/build/`. NOT WordPress.
- **Typography:** `ProximaNova` — a **variable font**, `font-weight: 100 1000`, `font-stretch: 25% 151%`, `font-display: swap`, served as `proxima_vara-*.woff2` (latin, latin-ext, cyrillic subsets). System-ui fallback stack defined. *(Our clone substitutes Open Sans — acceptable visual stand-in; swap to a Proxima-like face later if exact match wanted.)*
- **Colors (confirmed):** brand blue `#0097D4` (= our `--blue`), brand red `#E3000F` (≈ our `--red #e3000b`), status yellow `#ffd733`, text/black `#333333` (= our `--text`), lazy-load placeholder grey `#ececed`.
- **Key images (real asset slugs):** hero = `electronics-key-visual,50516`; helpdesk = `we-help-our-customers,8559466_crop4x3`; product back-cover = `tesa-electronics-backcover-mounting`; application illustration = `e-ect-applikationsillustrationen-foam-...fpc` (exploded-view FPC cross-section — this is the "component diagram" style in Devices cards). Responsive variants: `_crop4x3`, `canvas16x9`, `_fixedwidth`.
- **Interactions (confirmed patterns):** `.fade-in-loaded` opacity fade once `html.-loaded`; `.lazy-loading-placeholder` shimmer (`@keyframes shine` translateX sweep); consent manager (consentmanager.net); GTM `GTM-K8ZBC2`; segment switch stored in `localStorage.activeHeaderSegment`.
- **Page meta:** title "Innovative and Versatile Electronic Adhesives | tesa®"; `ga_area: markets`, `ga_masterTitle: 442-Electronics`.

## Original WebFetch findings (structure — still valid)

## Purpose of this teardown
Grounding reference for rebuilding `electronics.html` so it reads as an *unfinished clone* of the Tesa market page rather than a simplified wireframe. Focus: section sequence, layout, content density, proportions.

## Section sequence (top → bottom)

| # | Section | Heading | Layout |
|---|---|---|---|
| 1 | Hero | "Electronic Adhesive Solutions: The Future of Consumer Electronics" | Full-bleed image, text overlay/card, large H1 + intro paragraph |
| 2 | Overview | "Electronic Adhesive Solutions" intro | Narrative band, multi-paragraph, ~860px reading column |
| 3 | Devices & Applications | "Devices and Typical Applications of Electronic Adhesives" | Intro paragraph + **9-card grid** (3-up desktop), each card = component image + title + caption; one card has "Read more" |
| 4 | Features | "Key Features of Our Electronic Adhesives" | Narrative intro (4–5 sentences) + **12-item** feature list |
| 5 | Product Assortment | "Electronic Adhesives: Our Product Range" | **Narrative single-column band only** — describes product diversity + support services (global key accounts, technical experts, on-site support). NO search, NO filters, NO product table. (Those live on the separate Products hub.) |
| 6 | Downloads | "Downloads" | **Single horizontal card**: thumbnail left (~300×200), title + "PDF 10.6 MB" right, whole card clickable |
| 7 | Contact / Helpdesk | "Electronics Helpdesk" | Two-column: 4:3 image left + text panel right (3–4 sentences) + "Get in touch" button |
| 8 | Footer CTA | "Didn't find what you are looking for?" | Centered callout band + search + Get in touch |
| 9 | Footer | — | Multi-column: brand, Headquarter, Plants, Regions, social, legal bar |

## Devices & Applications — the strongest visual section (detail)
9 device categories, each an exploded-view/cross-section component illustration (red/gray/white) showing where tape solutions integrate:
1. Smartphones — "Tape solutions for compact and light smartphones"
2. Tablets — "Tape solutions for tomorrow's tablets"
3. Displays — "Tape solutions for any type of display"
4. OLED — "Advanced solutions for OLED displays and lighting"
5. Notebooks — "Tape solutions for lighter and smarter notebooks"
6. TVs / Monitors — "Tape solutions for even bigger TVs"
7. Wearables — has "Read more" link; dual image assets (crop4x3 + canvas16x9)
8. Accessories / Speakers — "right solution for any kind of accessory from speakers to soft goods"
9. Smart Home — "Adhesive solutions for networked smart home devices"

Grid: ~3 columns desktop / 2 tablet / 1 mobile. Gutters ~20–30px. Section padding ~40–60px.

## Features — 12 items (confirmed from source)
Bonding performance · Impact resistance · Residue-free removal · Anti-repulsion · LSE performance · Reliability · Chemical resistance · Conformability · Electrical conductivity · Thermal management · Moisture blocking · Outgassing resistance

## Design tokens (from our existing tesa-calibrated system in index.html)
- Colors: `--blue #0097d4`, `--red #e3000b`, `--navy #0f377f`, `--text #333`, `--text-mid #666`, `--light-grey #f0f0f0`, `--white #fff`
- H2: 52px / weight 300 / line-height 56px (40px @≤1200, 1.75rem @≤768)
- H3 (card/feature): 26px / 400
- Body: 18px / 1.5–1.6; secondary 16–17px
- Section bands: ~3rem 2.5rem padding; alternate white / `--light-grey`
- Buttons: `.outline-btn` (blue outline, uppercase) and `.cta-btn` (white outline on blue)
- Reading column max-width ~860px; wide content ~980px

## Effects / interactions
| Effect | Implementation | Cloneable? |
|---|---|---|
| Card image zoom on hover | `transform: scale(1.04)` transition (already in our system) | Yes |
| Responsive `<picture>` crops | Multiple aspect-ratio image variants | Yes (single placeholder ok for clone) |
| No tabs/accordion/JS filtering in market page | Static layout | n/a |

## Build notes / deviations
- **Products section:** brief requested a search/filter/table, but the real reference has none on this page. Decision (user-confirmed 2026-06-01): match the real reference — narrative band + compact product-family teaser. The searchable database belongs to the separate Products hub, a later phase.
- Downloads on reference is a *single* card; we may include 2–3 placeholder cards but keep the horizontal thumbnail+meta structure and weight.
- Hero on reference uses a large H1 + intro; our system's `.hero` (600px, bottom white card) already matches this pattern.
