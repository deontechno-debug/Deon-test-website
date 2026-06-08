# Tesa Industry — IA Reverse-Engineering

A complete information-architecture map of `tesa.com/en/industry`, reverse-engineered to let DEON reproduce Tesa's **navigation logic, content hierarchy, knowledge architecture, and content relationships** without further reference to the Tesa site.

This is a **content & navigation audit** (structure only) — no Tesa copy, code, or proprietary markup is reproduced.

## Deliverables

| File | What it answers |
|---|---|
| [`tesa-sitemap.md`](tesa-sitemap.md) | **Full sitemap** — tree of every page (title · template · URL), depth/parent/children, + 134-page SKU appendix |
| [`tesa-navigation-map.md`](tesa-navigation-map.md) | **Navigation structure** — top nav, mega-menu, breadcrumbs, in-page anchor nav, teaser cross-links, footer; reach-matrix + route model |
| [`tesa-content-model.md`](tesa-content-model.md) | **Content model** — every page template's section order, recurring modules, CTA/downloads/resource patterns + module library |
| [`tesa-relationship-graph.md`](tesa-relationship-graph.md) | **Relationship graph** — Markets ↔ Applications ↔ Products ↔ Families ↔ Technologies ↔ Resources ↔ Downloads ↔ Insights ↔ Careers ↔ Sustainability (Mermaid + typed edge table) |
| [`tesa-design-patterns.md`](tesa-design-patterns.md) | **IA / design patterns** — the hub→category→detail spine, module composition, faceted taxonomy, CTA/downloads/feed patterns, URL conventions, + DEON mapping |
| [`tesa-wireframes.md`](tesa-wireframes.md) | **Low-fi wireframe trees** for all 14 major page types (module stacks) |

## The tool

- **`tesa-ia-crawler.mjs`** — bounded, polite crawler (domcontentloaded, asset-blocking, single-concurrency, inter-request delay). Discovers the URL inventory and deep-extracts per-page IA data (title, modules, module sequence, H2s, CTAs, downloads, in-page links). Writes `data/{inventory,pages,nav}.json`.
- **`gen-sitemap.mjs`** — builds `tesa-sitemap.md` deterministically from `data/` (URL nesting → tree, titles from crawled pages).
- **`data/`** — the captured evidence: `inventory.json` (313 `/en/industry` paths), `pages.json` (60 deep-extracted pages), `nav.json` (top/footer nav + located corporate hubs).

Run: `node research/tesa-ia/tesa-ia-crawler.mjs` then `node research/tesa-ia/gen-sitemap.mjs` (the analytical reports were synthesised from `data/` via a multi-agent workflow + completeness review).

## Headline findings

- **One spine, reused 3×:** `hub → category → detail` for Markets (17), Applications (13 categories), Products (24 categories + finder).
- **Module composition:** every page is a stack from a ~25-module library; hero first (58/60 content pages), contact closer near the end (49/60), `page-teasers` for lateral discovery.
- **Faceted IA:** 3 parallel taxonomies (by market / application / product) all resolve to **134 flat SKU pages** (`/en/industry/tesa-<code>.html`) — a graph with three roots, not a tree.
- **No central Resources/Downloads/Technologies section:** downloads are embedded per page (`downloads` module, 80 files); technologies are implicit in product categories/adhesive types; knowledge = the corporate Press & Insights feed.
- **Corporate adjacency:** Sustainability / Press & Insights / Careers live under `/en/about-tesa`, linked from the industry top nav/footer (outside the 313 industry-subtree inventory).
