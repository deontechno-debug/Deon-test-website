# DEON Ecosystem — Strategic Architecture Audit
_2026-06-09 · multi-agent audit (repo inspection + 6-competitor analysis + 9 specialist workstreams)_

## Executive Summary — Top 20 Improvements (ranked by ROI)

| Rank | Improvement | System | Priority | ROI | Effort | Why it matters (one line) |
|---|---|---|---|---|---|---|
| 1 | Extend product schema with typed engineering specs + lifecycle status | Product | Critical | 10 | M | Today only 3 of 7 fields are filterable; PDPs fabricate specs — locks credible, filterable data before 60→600 SKUs harden |
| 2 | Wire a real lead-capture backend (routing, honeypot, region hook) | Lead Gen | Critical | 10 | M | The form is demo-only ("no message was sent") — at launch that is 100% lead leakage |
| 3 | Build a faceted product finder over real catalog attributes | Search/Discovery | High | 10 | L | The single clearest gap to beat Tesa/Scapa/Lohmann; the primary discovery + lead surface every premium peer ships |
| 4 | Add a desktop hover/focus mega-menu generated from `DEON_ARCH` | Navigation | Critical | 10 | L | No desktop deep-browse exists; Tesa's mega-menu is "mandatory" — IA legibility is what authoring + SEO depend on |
| 5 | Extract one shared UI/module library (primitives + CTA closer) | Design System | Critical | 10 | M | `esc` copied 15×, CTA pasted 20× — centralize before content turns a many-file edit into one |
| 6 | Normalize product facets into a controlled-vocabulary enum table | Product/Search | Critical | 9 | M | 10 near-dup adhesives + 28 backings (16 singletons) make a filter rail unusable until normalized |
| 7 | Model the datasheet (TDS/SDS) as a first-class catalog entity | Resource/Product | Critical | 9 | M | The atomic per-product anchor in 3M/Avery/Nitto is entirely absent; PDP downloads are dead `#` links |
| 8 | Add explicit `markets[]`/`segments[]` to applications; fix `[0]` ancestry | Application | Critical | 9 | S | Revives dead recommender code + fixes false single-parent breadcrumbs for 17 cross-market apps |
| 9 | Add load-time referential-integrity + spec/catalog/IA drift validator | All | Critical | 9 | S | The graph is whole today only by hand-curation; a typo silently orphans a node once content scales |
| 10 | Promote product families to first-class nodes (stored outbound edges) | Internal Linking | Critical | 9 | M | Families own zero edges; thin lines (packaging/mopp/filament) reach only 2 markets and are near-invisible |
| 11 | Promote Technologies to a first-class LEVEL1 browse axis | IA/Market | High | 9 | M | Data already exists (14 techs); every premium peer ships a chemistry axis, a genuine improvement over Tesa |
| 12 | Build a guided "Find-your-tape" need→product selector | Search/Discovery | High | 9 | L | Top conversion + lead-capture surface for a tape catalog (3M VHB/Scotch-Weld); captures buyers who think in jobs |
| 13 | Fix contact `ctx()` to read product/segment/role; centralize link builder | Lead Gen | Critical | 9 | S | The two highest-intent CTAs (PDP sample, segment helpdesk) silently drop all context — pure bug |
| 14 | Freeze a 7-node canonical LEVEL1 enum; generate every nav surface from it | IA/Navigation | Critical | 8 | S | Top-level node set is ambiguous (8 in ARCH, 6 in nav, hard-coded footer) — the thing that must be right first |
| 15 | Resolve Capabilities spec-vs-code contradiction (promote or retire) | IA | Critical | 9 | M | Named differentiator is a grep-confirmed orphan rendering broken (`ARCH.capabilities` undefined) |
| 16 | Add structured sample/quote intake + 3-CTA PDP layer + analytics | Lead Gen | High | 9 | M | Sample/quote collapse to free-text; zero tracking means demand by market/app/product is unmeasured |
| 17 | Render application hub by its 9 groups + group landing pages/routes | Application | Critical | 9 | S | The most valuable IA asset (job-family taxonomy) is hidden in a hamburger; hub renders a flat 35-grid |
| 18 | Add an ordered template manifest + render engine | Design System | High | 9 | L | A new page type is a new hand-written renderer; manifest turns authoring into config with placeholders |
| 19 | Add a generic lateral teaser/`relatedTo` edge module (catalog-driven) | Internal Linking | High | 8 | M | Cross-links follow only the spine; teaser edges turn the URL tree into the faceted graph peers rely on |
| 20 | Fix tablet (768–1120px) primary-nav dead zone | Navigation | Critical | 8 | S | `.nav-links{display:none}` removes the top nav with no working replacement across the iPad/landscape band |

## The Thesis

DEON already owns the hardest-to-retrofit asset in this category: a single catalog-driven content graph with three co-equal browse spines (market × application × product) resolving to one flat SKU pool — the exact model Tesa, 3M, Avery and Nitto all converged on, and DEON has it *before* content exists. The single biggest strategic gap is not architecture, it is **expressivity and discoverability at the data layer**: the product node is the thinnest in the entire competitive set (3 filterable fields, no specs, no datasheet, no status, no facet enum), so the two highest-leverage surfaces every premium peer ships — a faceted finder and a guided need→product selector — cannot yet be built, and the conversion engine that should harvest that intent is a non-functional demo. The through-line of every recommendation: **deepen the catalog node and lock its shape now (while there are 60 SKUs, not 600), then expose it through faceted/guided discovery, a real mega-menu, and a working context-aware lead funnel** — muscle on a best-in-class skeleton, not a rebuild.

## Critical — before content population

These are data-model and IA shape decisions that are cheap to encode in 60 products / 35 applications and brutally expensive to retrofit across 600 SKUs of authored content.

- **Deepen + lock the product schema (ROI 10).** Add typed `specs{tempMin/Max, peel, tack, shear, dielectric, elongation, liner, color, uvRating, chemistrySubtype}`, `status{live|coming-soon|discontinued|oem-only}`, and `certs[]`. *Why now:* content authors must populate against this shape, not after. *Unblocks:* faceted finder, guided selector, credible non-fabricated PDPs, phased launch + OEM gating, compare.
- **Normalize facets into an enum registry (ROI 9).** Lift adhesive/backing/liner/chemistry into first-class enum tables with grouped parents (collapse rubber/natural/synthetic/rubber-resin/self-amalgamating into a "Rubber" group; fix aluminium spelling). *Why now:* 28 near-unique backings will fossilize into an unusable one-item-checkbox filter rail. *Unblocks:* every downstream discovery surface reads O(1) enums, not `uniq()` scans.
- **Model the datasheet as a catalog entity (ROI 9).** A `documents[]` array `{id,type,productId|familyId,url}` + `DEON.documentsForProduct()`. *Why now:* attaching real TDS/SDS/cert files during authoring beats retrofitting 60 dead `#` links. *Unblocks:* real PDP downloads, a future searchable SDS surface, generate-PDF-from-data (Avery's explicit best practice).
- **Make application↔market edges bidirectional + fix `[0]` ancestry (ROI 9).** Add `markets[]`/`segments[]` to each application; render all parents (or anchor to the Applications hub). *Why now:* 17/35 cross-market apps currently claim one false parent, and `relatedApplications`/`applicationsForMarket-byTag` are silent dead code reading fields that don't exist. *Unblocks:* correct breadcrumbs/SEO + a working lateral recommender.
- **Promote families to first-class nodes (ROI 9).** Add stored `applications[]`, `markets[]`, `relatedFamilies[]`, `resources[]`. *Why now:* families own zero edges and derive everything through a fragile 3-hop reverse chain — thin lines are near-invisible. *Unblocks:* the convergence-hub PDP every competitor makes their *richest* node.
- **Freeze the LEVEL1 enum + resolve Capabilities (ROI 8–9).** Lock a 7-node canonical set `[Markets, Applications, Products, Technologies, Capabilities, Resources, Contact]` generated from one ordered enum; decide promote-or-retire on Capabilities (spec calls it a differentiator; code orphans it and renders broken). *Why now:* every URL, breadcrumb root, and SEO hub derives from this set; spec and code must not contradict when content lands.
- **Add a load-time validator (ROI 9).** Assert `DEON_ARCH == catalog == spec` (counts, IDs, taxonomy names) AND referential integrity (no dangling `familyId`, no family-less application, no untagged resource, no unknown facet value) — fail loudly. *Why now:* converts today's lucky 0-orphan state into an enforced invariant before volume makes manual checking impossible. *Unblocks:* safe bulk population; kills the Knowledge (5-vs-10), Press-naming, and Capabilities drift permanently.
- **Extract the shared module library (ROI 10).** Centralize `esc` (copied 15×), palette (9×), arrow (10×), section wrapper (11×), and the CTA closer (pasted 20×, also the root cause of the dropped-segment-context bug). *Why now:* content multiplies the duplication; this is the precondition for a manifest-driven template engine.

## High Priority — during production

- **Faceted product finder (ROI 10, L).** Config-driven (`facetConfig`), URL-encoded shareable/SEO state, sort, compare (2–4 SKUs → spec table), pagination/virtualization. Reads the new spec schema + facet registry. This is the clearest competitive *win* — Tesa's weakest area.
- **Desktop mega-menu (ROI 10, L).** Multi-column hover/focus overlay from `DEON_ARCH`; sidebar demoted to mobile/touch fallback. Fix the tablet dead-band in the same effort.
- **Guided "Find-your-tape" selector (ROI 9, L).** One config-driven engine (avoid 3M's selector sprawl) mapping substrate A + substrate B + environment + duty → ranked shortlist over the facet schema.
- **Application hub by groups + group landing pages (ROI 9, S/M).** Render 9 group sections; add `?group=` routes with catalog-derived family/market rollups. Surface group rollups inside market/segment pages too.
- **Ranked search over all 8 entity types + header typeahead (ROI 9, M).** Replace substring `indexOf` with a pre-computed field-weighted index (Applications weighted highest); add known-item SKU jump; group order from `DEON_ARCH.level1`; products link to `product.html`, not family pages.
- **Lead-gen muscle (ROI 8–9, S–M).** Fix `ctx()` to read product/segment/role + centralize `DEON.contactUrl()`; allowlist/escape params; structured sample/quote line-item intake; 3-CTA PDP layer (Request Sample / Download Datasheet / Talk to an Expert) with real datasheet hrefs; conversion analytics + attribution `{source_page, market, application, product, intent}`.
- **Template manifest + render engine (ROI 9, L).** Ordered `moduleSeq` per page type, hero first / CTA last, walked by one engine with placeholders instead of silent blanks.
- **Lateral teaser edges + auto anchor-nav (ROI 7–8, S–M).** One generic `relatedTo` module (used-in/solved-by/adjacent/relatedFamilies) on all templates; auto-derive in-page anchor-nav from section count.

## Future Enhancements

- **Distributor / where-to-buy path** modeled as `distributors[]` with region tags — beats Tesa's documented dead-end; pairs with a distinct converter/OEM partner-onboarding funnel (replace generic `?market=` contact).
- **Variant/SKU sub-model** (`variants[]` for width/length/color/core) so one construction yields an orderable table without exploding the catalog into thousands of near-duplicate records.
- **Sibling-segment affinity edges** (`relatedSegments[]`) for the dense EV/energy/battery lateral journeys across markets.
- **Region-aware contact routing + office locator** beyond the single India inbox (hook designed in from day one).
- **Collapse single-segment markets** (hvacr) by allowing a market to skip the segment level; raise/paginate the `apps.slice(0,8)` explorer limit.
- **Pre-computed reverse-relationship indexes** (`resourcesByApplication`, `marketsByApplication`) — fine at 351 items, the load-time bottleneck at 10×.
- **Typed Documents/SDS search surface** reusing the ranked-search engine.

## Things to Leave Alone

- **The catalog-graph foundation.** One source (`deon-catalog.js`) → one API (`window.DEON`) → thin templates, with ID-array edges and reverse lookups. This is the 1:1 Tesa/3M/Avery model, in code, before content — the rarest and hardest-won asset. Extend it; do not refactor it.
- **The shared-application-pool decision.** 49% of applications are genuinely cross-market (bonding/thermal→7, mounting/surface-protection→6). This is the single most important taxonomy call and it is already correct.
- **Applications as a first-class LEVEL1 spine.** Already ahead of Scapa/Lohmann (who bury apps in markets); the 9-group progressive disclosure matches the densest-router pattern. Only its *presentation* needs work, not the model.
- **Ungated datasheets / no end-buyer store / single contact endpoint.** Correct B2B-engineer posture (beats 3M/Avery form-walls) and the right conversion architecture (one renderer to harden). Keep.
- **The off-canvas panel-stack sidebar — as the mobile/touch tier.** Genuinely well-built (back/forward, Escape-to-pop, scroll-reset). Demote it from "only navigator" to "mobile fallback"; do not replace it.
- **`ProductFinder` as a component contract.** The encapsulation is the model for the whole library — widen the `{name,t,adhesive,backing,desc,href}` seam, don't rewrite it.

## Per-System Audit

### Information Architecture
**Current State:** Single-source IA — `DEON_SITE_ARCHITECTURE.md` mirrored to `deon-architecture.js` drives all nav. 8 LEVEL1 nodes (6 in top nav). 12 markets / 35 segments / 35 apps (9 groups) / 12 families / 60 SKUs.
**Strengths:** No structural drift across chrome surfaces; three co-equal spines; catalog-extensible thin shells; partner programs in-model via `special:true`.
**Weaknesses:** Capabilities specced LEVEL1 but unimplemented + orphaned + broken; no Technologies axis; ambiguous top-level node count (8/6/hard-coded footer); Knowledge 5-vs-10 + Press-name drift; no faceted-search or where-to-buy node.
**Comparison:** Matches Tesa's three-spine graph 1:1 but copied its *thin top nav* without its *mega-menu*; lacks the Technology axis 3M/Avery/Nitto treat as table stakes.
**Recommendation:** **modify** — freeze a 7-node enum, generate all surfaces from it, add a drift validator, resolve Capabilities.
**Priority:** Critical.

### Market Architecture
**Current State:** 5-level Market→Segment→Application→Family→Product; 12 markets, 35 segments, fully connected, 0 orphans. Application is a shared pool (49% cross-market).
**Strengths:** Shared-pool done right; clean nesting; content-ready segments (overview/challenges/requirements) beat Tesa's stub leaves; partners in-model.
**Weaknesses:** Lossy `[0]` application ancestry; dead `a.segments`/`a.markets` branches; name-string app grouping (not ID); no product/family lifecycle; implicit facets; hvacr redundant single segment; `slice(0,8)` truncation; no sibling-segment edges.
**Comparison:** Matches Tesa's densest-router model and beats it on segment depth + SKU URL ancestry; lags 3M/Avery on a Technology axis + enumerated facets.
**Recommendation:** **modify** — keep the skeleton; add app back-edges, status enum, facet table, ID-based grouping, validator.
**Priority:** Critical.

### Application Architecture
**Current State:** 35 first-class cross-market apps with rich editorial fields; 9 nav-only groups; strong 11-section detail template. Hub renders a flat 35-grid.
**Strengths:** First-class spine (densest router, 104 family edges); genuinely cross-market; data-driven need→product bridge; contextual `?topic=` CTA.
**Weaknesses:** Groups invisible on-page (hidden in sidebar, no landing pages/route); `relatedApplications` half-dead → wrong neighbors; one-directional market edge; `[0]` breadcrumb; overloaded "Protection" bucket (10 apps); no app filtering.
**Comparison:** Has the catalog Tesa exposes as a 13-category browse hub but renders flat where Tesa renders grouped; ahead of Scapa/Lohmann (who lack the axis entirely).
**Recommendation:** **modify** — group the hub, add group routes, fix scoring + breadcrumb root, add an app facet panel.
**Priority:** Critical.

### Product Architecture
**Current State:** 12 families × 5 = 60 SKUs; flat 7-field record `{id,name,familyId,t,adhesive,backing,desc}`; PDP synthesizes specs/certs from 3 fields; 3-facet finder.
**Strengths:** Clean canonical record + data-access layer; perfect integrity; a *real* finder (beats Tesa/Scapa/Lohmann/Nitto); 3 engineering facets are structured data, not PDF-locked.
**Weaknesses:** Thinnest node in the comparison set — no temp/peel/tack/shear/dielectric/liner/color/width/status; no facet enum; no datasheet entity; no variant model; no compare/selector; no schema/validation.
**Comparison:** Plumbing more modern than most peers, but the *node* is behind every spec-led leader (3M/Avery/Nitto store specs as data and anchor a TDS per product).
**Recommendation:** **modify** — typed specs + status + facet registry + datasheet entity + compare; config-driven finder.
**Priority:** Critical.

### Resource Architecture
**Current State:** Correct hybrid — central Knowledge Center (10 categories, 34 resources) + embedded `resourcesFor*` on market/segment/app/family pages.
**Strengths:** Hybrid model already in place (beats Scapa/Lohmann's scattered PDFs, matches Avery/3M); all 34 resources tagged/discoverable; typed categories enable filtering.
**Weaknesses:** No per-SKU datasheet — `product-page.js` is the one template with zero resource embedding, so all 60 SKUs are document dead-ends; no `downloads[]` field on catalog entries (resources are a disconnected center, not context-embedded); Knowledge 5-vs-10 taxonomy drift.
**Comparison:** Ahead of Scapa/Lohmann, matches Avery/3M's hybrid — except it misses the one thing all of them nail: the per-product TDS as the atomic anchor.
**Recommendation:** **modify** — keep the hub; add `documents[]`/`downloads[]` so the same datasheet renders embedded *and* in the hub (Tesa's many:many shared leaf).
**Priority:** High.

### Contact Architecture
**Current State:** One `.cta-strip` module closes ~14 templates → single `contact.html` endpoint; 5 emitted context params; intent typing (sample/quote/consultation); demo-only form.
**Strengths:** Conversion-as-a-module funneling to one endpoint (Tesa's best pattern); context-passing scaffold wired; intent typed; ungated downloads; single file to harden.
**Weaknesses:** `ctx()` reads only family/topic/market — drops product/segment/role (3 of 5 params lost); demo-only (no backend); zero analytics; no spam defense/param allowlist; sample/quote are free-text, not structured.
**Comparison:** Already *beats* Tesa on context-carrying; matches its ungated/no-store decisions; lacks 3M/Avery structured intake + region routing.
**Recommendation:** **modify** — fix `ctx()`, centralize `contactUrl()`, allowlist/escape, real backend, structured intake, analytics.
**Priority:** Critical (the dropped-context bug + demo form).

### Sidebar / Navigation Architecture
**Current State:** Single off-canvas panel-stack sidebar (from `DEON_ARCH`) is the only deep navigator at all breakpoints; slim top nav opens panels (no hover reveal); no mega-menu.
**Strengths:** Single-source generation; one behaviour model; full-depth reach in one surface; catalog-accurate breadcrumbs (market/segment/product); template-keyed section highlight.
**Weaknesses:** No desktop deep-browse without a click; tablet 768–1120px has *no* primary nav (dead `.nav-links.is-open` CSS); inert top nav; no Technology axis / faceted finder in nav; `[0]` app breadcrumb; orphaned Capabilities; `currentSection()` gaps; hard-coded footer.
**Comparison:** Copied Tesa's *weakness* (thin top nav) without its *strength* (mega-menu, which Tesa calls "mandatory"); behind 3M/Avery multi-axis menus.
**Recommendation:** **add** mega-menu (desktop) + fix tablet band; **keep** sidebar as mobile/touch tier.
**Priority:** Critical.

### Search Architecture
**Current State:** Substring-only global search over ~351 records of 5 types; no ranking/typeahead/facets; product hits land on family pages; finder has 3 unnormalized facets.
**Strengths:** Single-graph index; federates 5 types with counts; reusable finder engine; rich latent text; multi-axis relationship API for a recommender.
**Weaknesses:** No structured specs (prose, unfilterable); unnormalized facet values; no ranking/typeahead/known-item jump; segments/techs/insights unindexed; index rebuilt every load; no URL/SEO state; no guided selector.
**Comparison:** Can *leapfrog* Tesa's weak search once specs are modeled; 3M (typeahead + on-results facets + searchable TDS + selectors) is the target end-state. Gap is data-modeling + execution, not architecture.
**Recommendation:** **replace** substring with a ranked weighted index; **add** typeahead, faceted finder, guided selector.
**Priority:** High (depends on the Critical spec/facet work).

### Internal Linking Graph
**Current State:** True content graph, provably whole (0 orphans/dangling), but only forward edges are stored; every reverse edge is O(n) computed. Families own zero outbound edges.
**Strengths:** Same node renders from any axis; whole at audit; correct hybrid resources; applications the densest router; generated routing/breadcrumbs can't drift.
**Weaknesses:** Product axis second-class (3-hop derived family surface → thin families invisible); SKUs absent from resource graph; no stored back-refs (O(n)/O(n²) per load); dead relatedness/byTag code; no schema/validation; no lateral teaser edges.
**Comparison:** Foundation ahead of most peers; but every strong competitor makes the family/PDP the *richest* node where DEON makes it the weakest, and all carry lateral teaser edges DEON lacks.
**Recommendation:** **modify** — store family/app back-edges + lateral `relatedTo`; **add** validator + precomputed indexes + per-SKU datasheet.
**Priority:** Critical.

### Lead Generation Architecture
**Current State:** Best-in-class skeleton (module closer → one endpoint, context-carrying), but non-functional (demo), partially broken (dropped context), unmeasured (no analytics).
**Strengths:** Conversion-as-a-module; context scaffold wired; intent typed; ungated docs; single endpoint to harden; persistent footer conversion chrome.
**Weaknesses:** `ctx()` drops the 2 highest-intent contexts; demo-only = 100% leakage; zero tracking; no spam defense; free-text sample/quote; no where-to-buy; undifferentiated partner conversion; no region routing.
**Comparison:** *Beats* Tesa on context-carrying; shares its no-locator gap; lacks 3M/Avery structured intake + region routing. Strong bones, no muscle.
**Recommendation:** **modify** (architecture) + **replace** (the demo handler) — backend, fixed `ctx()`, structured intake, analytics, distributor path.
**Priority:** Critical.

### Design System
**Current State:** 14 vanilla-JS renderers over one catalog; consistent visual vocabulary but no shared builder; primitives copied 9–15×; CTA pasted 20×; only `ProductFinder` is truly encapsulated.
**Strengths:** Uniform design language, no orphans; right module vocabulary already exists; `ProductFinder` is the model component; chrome generated from architecture; pure-function renderers.
**Weaknesses:** No shared builder (a card/CTA change = 9–15 files); CTA closer pasted 20× (drops segment context); no manifest (new page type = new renderer); no anchor-nav/teaser/compare/selector modules; datasheets are placeholders.
**Comparison:** Beats Tesa on data-driven finder + unified graph; behind Tesa on *templating discipline* (Tesa composes registered modules by data; DEON concatenates strings with copied helpers).
**Recommendation:** **add** a shared library + ordered manifest/render engine + missing modules.
**Priority:** Critical (the extraction; manifest is High).

### Missing Opportunities
**Current State:** No Technology browse axis, no faceted finder, no guided selector, no compare, no datasheet entity, no where-to-buy, no analytics — all absent despite the data/graph being ready for them.
**Strengths:** DEON is *uniquely positioned* to ship all of these because its data is structured-first, not PDF-locked — the exact precondition competitors lack.
**Weaknesses:** Every one of these is a table-stakes peer feature (or a clear beat-Tesa win) currently unbuilt.
**Comparison:** Technology axis = Nitto's signature + Tesa's acknowledged gap; faceted finder/guided selector = 3M/Avery's primary engines + Tesa's weakest area; where-to-buy = 3M/Avery/Nitto have it, Tesa doesn't.
**Recommendation:** **add** — sequence after the Critical schema/facet/IA foundation.
**Priority:** High.

## Competitive Synthesis

**Tesa** (closest twin) — *Steal:* the mega-menu that jumps N levels deep in one click (Tesa calls it "mandatory"); conversion-as-a-droppable-module funneling to one endpoint; ordered `moduleSeq` per template. *Avoid:* flat SKU URLs that orphan breadcrumbs; running a half-built standalone resource hub with no embedded downloads; weak faceted search (its clearest beatable gap).

**3M** — *Steal:* the guided need-based selector (substrate + environment → ranked shortlist); the PDP-as-convergence-hub with compare + where-to-buy. *Avoid:* brand-house fragmentation and selector-tool sprawl — ship *one* config-driven selector engine, not many bespoke tools.

**Nitto** — *Steal:* technology-first browse (engineers entering by adhesive science); product-family pages with grade/variant comparison tables + per-variant TDS. *Avoid:* region-gateway friction; discovery that dead-ends at "inquiry only" with no spec/sample exit.

**Avery Dennison** — *Steal:* the TDS as the atomic per-product anchor; specs stored as structured data first, PDF generated from it (DEON's exact gap). *Avoid:* federated/siloed subdomains that fragment search — keep one unified graph and one search scope.

**Scapa** — *Steal:* Capabilities/Technology elevated to a first-class nav axis (signals custom-engineering value); bidirectional market↔product cross-links from data. *Avoid:* over-reliance on PDF PDS as the only spec source; weak/absent multi-attribute faceting.

**Lohmann** — *Steal:* application/use-case pages as first-class connective nodes (market→application→product→capability) with contextual sample/contact CTAs; branded product-platform families as memorable anchors. *Avoid:* "contact an expert" as the only path forward — pair consultative CTAs with self-serve specs/datasheets/selectors.

**Patterns to adopt, ranked:**
1. Faceted product finder over structured specs — beats Tesa/Scapa/Lohmann outright (3M/Avery).
2. Datasheet as first-class per-product entity, specs-as-data → PDF (Avery/3M/Nitto).
3. Real deep-browse mega-menu (Tesa "mandatory"; 3M/Avery multi-axis).
4. Guided need→product selector, one engine (3M).
5. Technology/chemistry as a first-class browse axis (Nitto signature; Tesa gap).
6. Capabilities/converting as a first-class axis (Scapa/Lohmann differentiator).
7. Lateral teaser edges (used-in/solved-by/adjacent) turning tree → graph (Tesa/3M/Nitto).
8. Where-to-buy/distributor exit (3M/Avery/Nitto; beats Tesa).

## Recommended Build Sequence

**Phase 0 — Pre-content (data-model + IA shape; blocks everything).**
Lock these before authoring a single SKU of real content.
1. Extend product schema (typed specs + `status` + `certs`) — *Rank 1.*
2. Facet enum registry + normalization — *Rank 6.* (depends on 1)
3. Datasheet `documents[]` entity — *Rank 7.*
4. Application `markets[]`/`segments[]` back-edges + `[0]` fix — *Rank 8.*
5. Family first-class outbound edges — *Rank 10.*
6. Freeze LEVEL1 enum + resolve Capabilities — *Ranks 14, 15.*
7. Load-time integrity + drift validator — *Rank 9.* (validates 1–6)
8. Extract shared module library (incl. centralized `contactUrl()` + CTA closer) — *Rank 5, 13.*

**Phase 1 — Discovery + conversion go live (depends on Phase 0 data).**
9. Faceted product finder (config-driven, URL state, compare) — *Rank 3.*
10. Real lead backend + fixed `ctx()` + structured intake + analytics — *Ranks 2, 13, 16.*
11. Desktop mega-menu + tablet dead-band fix — *Ranks 4, 20.*
12. Application hub by groups + group routes — *Rank 17.*
13. Ranked search + typeahead + known-item SKU jump — *(High-priority search).*

**Phase 2 — Differentiate beyond table stakes.**
14. Technologies promoted to LEVEL1 browse axis — *Rank 11.*
15. Guided "Find-your-tape" selector over the facet schema — *Rank 12.*
16. Template manifest + render engine — *Rank 18.*
17. Lateral teaser edges + auto anchor-nav — *Rank 19.*
18. 3-CTA PDP layer with real datasheet hrefs — *Rank 16.*

**Phase 3 — Scale + reach.**
19. Distributor / where-to-buy path + partner-onboarding funnel.
20. Variant/SKU sub-model; sibling-segment affinity edges.
21. Region-aware contact routing; pre-computed reverse indexes; typed SDS search; collapse single-segment markets + paginate the app explorer.
