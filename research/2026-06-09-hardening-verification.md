# DEON Ecosystem — Hardening & Verification Sprint Report
_2026-06-09 · architecture/design/content-model frozen · objective: find and fix implementation defects, correctness over change._

This sprint was run against the **live, rendered site** (localhost:3000) with a purpose-built
headless-Chromium harness, not by static inspection — because every page renders client-side
from the catalog, so only the rendered DOM tells the truth. Four reusable verification scripts
were written and live in the repo root: `crawl.mjs` (full link/JS-error/orphan crawl),
`relationships.mjs` (catalog graph integrity), `responsive.mjs` (overflow at 6 widths),
`consistency.mjs` (per-template structure + sidebar active states).

---

## Headline result

| Check | Result |
|---|---|
| Internal links (423 → after fix) | **0 broken** across 371 rendered routes |
| Orphan routes | **0** |
| Real JS errors (page exceptions) | **0** |
| Empty / failed renders | **0** |
| Placeholder text markers (lorem/TODO/{{}}/[object Object]) | **0** |
| Catalog relationship integrity | **0 errors, 0 warnings** |
| Horizontal overflow (17 templates × 390/768/1024/1440/1920/2560) | **0 uncontained** |
| Breadcrumb / h1 / footer presence | **consistent on all pages** |
| Redirect stubs | 4, all intentional & correct |

The ecosystem is structurally sound. The sprint found **one real link defect (fixed)**, **one
dead-code cleanup (done)**, and a short list of **minor, intentionally-deferred** items.

---

## Issues found & FIXED

### 1. 12 broken technology deep-link anchors (PASS 1) — FIXED ✅
- **Found:** 10 market pages + `electronics.html` deep-link to `manufacturing-technology.html#<technology-id>` via `DEON.url.technology()`, but the page only rendered id anchors for the 7 *category* slugs. 12 of the 14 technology ids (`acrylic-psa-systems`, `silicone-adhesive-systems`, `pet-and-polyimide-film-backings`, `precision-coating-and-lamination`, `validation-and-reliability-testing`, `r-and-d-and-innovation`, …) had **no target** → 423 broken-link instances across the crawl.
- **Fix:** `manufacturing-page.js` now emits a hidden per-technology anchor (`.tech-anchor`, id = technology id) inside each technology's category section, skipping any whose id already equals the section id (avoids duplicate ids). All 14 technology ids now resolve; no duplicate ids.
- **Plus:** `.market-section` and `.tech-anchor` now carry `scroll-margin-top: var(--nav-h)` so in-page jumps clear the sticky 90px nav instead of landing under it — a uniform, layout-neutral correction for every section/tag/technology anchor.
- **Verified:** full crawl re-run → site-wide broken links **423 → 0**.
- Commit: _Fix 12 broken technology deep-link anchors on manufacturing page_.

### 2. Two dead renderers (PASS 8) — REMOVED ✅
- **Found:** `assets/capabilities-page.js` and `assets/resources-page.js` had **zero references** — `capabilities.html` and `resources.html` are now pure meta-refresh redirect stubs (→ `manufacturing-technology.html` / `knowledge-center.html`) and never load their old renderers. Confirmed by exhaustive grep across all HTML/JS.
- **Fix:** deleted both files (low-risk, git-reversible). Every remaining `*-page.js` maps cleanly to exactly its HTML shell.

---

## Issues intentionally LEFT UNCHANGED (documented)

Per the sprint's "prioritize correctness over change; when uncertain, leave unchanged and document":

1. **Chrome placeholder `href="#"` links (footer Regions, footer legal — Imprint/Privacy/Accessibility/Cookie/Terms, the language "English" switcher, the "Home & Office" section tab).** These are deliberate stubs awaiting content/pages that don't exist yet. "Fixing" them means inventing pages (out of scope: "do not introduce new features"). **Recommend** wiring them during content population. They are *not* counted as broken links (they're `#`, not dangling destinations).

2. **Design-token color drift (PASS 7).** The CSS uses 10+ near-identical light-grey hex values for borders/hairlines: `#e0e0e0` (×17), `#dcdcdc`, `#ededed`, `#ececec`, `#ececed` (likely a 1-digit typo of `#ececec`), `#e4e4e4`, `#e8e8e8`, `#e6e6e6`, `#ddd`, `#d8d8d8`, `#d0d0d0`, … Consolidating them would *shift* border shades (a visual change) — unsafe under a frozen design system. **Recommend** introducing a small border-grey token scale (e.g. `--line`, `--line-strong`) and migrating during production; do **not** bulk-replace now. The brand palette itself (`--blue #0072ce`, `--red #ed1c24`, `--navy #00457c`, text/grey tokens) is clean and consistently used.

3. **Products hub & Applications hub lack a closing CTA (PASS 3).** Every other content page ends with a `.cta-strip`; the two list-hubs do not. Adding one would modify those templates (the sprint forbids template changes / new sections). **Recommend** adding the standard CTA to both hubs for consistency during production. (Contact and Search correctly have no CTA — Contact *is* the conversion page; Search is a utility.)

4. **Applications-hub sidebar over-highlights groups (PASS 5, cosmetic).** On `applications.html`, all 9 application-group panel *titles* match the active-URL test and render active, because groups have no dedicated page so their panel title links to the hub. Only visible when drilling into a group while already on the hub. Families don't exhibit this (they link to their own pages). **Recommend** (low priority) giving group-panel titles a non-link or a distinct href so the active match is scoped; deferred because it touches the shared panel component.

5. **`segment-explorer.css` is a second stylesheet** (loaded only by `market.html`). Not a defect — the segment-explorer component legitimately ships its own styles. Noted for awareness (the rest of the site is single-stylesheet `deon-site.css`).

---

## PASS-by-PASS

- **PASS 1 — Link integrity:** 423 → **0** broken. All internal links, breadcrumbs, sidebar links, top-nav, related-content, and CTA destinations resolve. `href="#"` chrome stubs documented above.
- **PASS 2 — Content relationships:** `relationships.mjs` validated 10 edge classes over the full graph (12 markets, 35 segments, 35 applications, 12 families, 60 products): every product → valid family; every family has ≥1 product; every segment → parent market; every market → segments + applications (or is special/single-page); every application → ≥1 market and **exactly one** application group; groups reference only real applications. **0 errors, 0 warnings, no dead-ends, no duplicate/dangling relationships.**
- **PASS 3 — Consistency:** breadcrumb present on every page except home (correct), h1 on every page, footer on every page, breadcrumb trails hierarchically correct and current node non-linked. CTA present on all content pages except the two hubs (documented) + Contact/Search (intentional).
- **PASS 4 — Responsive:** 17 templates × 6 widths → **0 uncontained horizontal overflow / 0 page-level horizontal scroll**. (Carousels/rails extend beyond the viewport *inside* `overflow-x` scroll containers — correct, not clipping.)
- **PASS 5 — Sidebar:** drilldowns, Overview links, back paths, and active states function. Active `.is-active` correctly tracks the current URL; `.is-active-section` correctly tracks the top-nav section (absent only on About/Manufacturing/Career/Search, which aren't top-nav sections — correct). Minor cosmetic over-highlight on the applications hub documented above.
- **PASS 6 — Content frame:** the `--frame-inset` logo-start frame and `.breakout` full-bleed system render consistently; the 0-overflow responsive result + the recently-corrected sidebar reframe confirm frame integrity across breakpoints.
- **PASS 7 — Design tokens:** brand palette + spacing/typography tokens consistent; light-grey border drift documented (defer).
- **PASS 8 — Code health:** 2 dead renderers removed; no other unused renderers (every `*-page.js` → its HTML); deleted `deon-base.css` has 0 lingering references; `segment-explorer.js/.css` legitimately used by `market.html`.
- **PASS 9 — Final crawl:** 371 routes crawled. **0 broken links · 0 orphan routes · 0 JS errors · 0 empty pages · 0 placeholder-text pages · 4 intentional redirect stubs** (`capabilities→manufacturing-technology`, `electronics→market?m=electronics`, `market(no ?m=)→index`, `resources→knowledge-center`).

---

## Inventories (PASS 9)

**Page inventory (19 HTML):** index, market, segment, application, applications, products, product, knowledge-center, press, about, manufacturing-technology, careers, contact, search, converter-partners, oem-partners, electronics*, capabilities*, resources* (`*` = redirect stub).

**Template/renderer inventory (17 active):** market, segment, application(+applications hub), products(+family), product, knowledge, press, about, manufacturing, careers, contact, search, partner (converter/oem) page renderers; shared: `deon-chrome`, `deon-data`, `deon-catalog`, `deon-architecture`, `product-finder`, `segment-explorer`. (Removed: capabilities-page, resources-page.)

**Relationship inventory:** 12 markets → 35 segments; 35 applications → 9 groups; 12 families → 60 products; 34 resources; 14 technologies; 18 insights — all edges verified resolvable.

---

## Remaining risks

- **Content-population stubs** (footer regions/legal, language switch, "Home & Office", download `#` links, `placehold.co` imagery, `[size]/[placeholder]` datasheet labels) are expected pre-content and must be wired/replaced before launch. They are intentional, not regressions.
- **Anchor-jump offset** now corrected via `scroll-margin-top`; if future sticky elements change the header height, the token `--nav-h` keeps it correct automatically.
- No automated test harness is committed beyond these four scripts; recommend wiring `crawl.mjs` + `relationships.mjs` into a pre-deploy check so link/relationship regressions can't ship.

## Recommendations for future work (ranked)
1. Wire `crawl.mjs` + `relationships.mjs` as a CI/pre-deploy gate (0-broken-link guarantee).
2. Add the standard closing CTA to the Products and Applications hubs (consistency).
3. Introduce a border-grey token scale and migrate the ~10 ad-hoc light greys (during production).
4. Wire footer legal/region links + language switcher as real destinations during content population.
5. Scope the applications-group active-state (low priority, cosmetic).
