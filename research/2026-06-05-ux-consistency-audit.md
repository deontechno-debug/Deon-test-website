# UX Consistency Audit — Electronics as benchmark

**Date:** 2026-06-05 · **Benchmark:** `electronics.html` (closest to intended Tesa-inspired industrial experience). Every other page must inherit from it; implementation method (bespoke / data-driven) must be invisible.

## Why Electronics works (reverse-engineered)
- **Editorial, not card-grid.** Content lives in full-width `.market-section` bands (alternating white / `--light-grey`), each = small uppercase eyebrow → light 44px/300 H2 → an 820px multi-paragraph `.market-intro`. Reads like a technical publication, not a SaaS landing page.
- **Section sequence has intent:** Hero → Overview (narrative) → Segment Explorer (interactive) → Features (dense 2-col property list) → Product range → Downloads → Helpdesk. Educate → explore → specify → support. Mirrors the Tesa buyer journey.
- **High content density.** Three-paragraph intros, 12-item feature lists, real technical vocabulary. Generous whitespace but information-rich.
- **Industrial chrome.** Blue top language bar, section-tabs (Home & Office / Industry), horizontal nav, and a **slide-out drill-down sidebar** (not a hover mega-menu). Full-bleed hero image with an overlapping white card.
- **CTAs are contextual bands**, not floating buttons: `.cta-strip` helpdesk (image + blue panel) and the `.footer-search-strip` ("Didn't find what you are looking for?").

## Divergence table (data-driven pages vs Electronics)
| Axis | Electronics (benchmark) | Generated pages | Class |
|---|---|---|---|
| Header / nav | top-bar + section-tabs + horizontal nav + **slide-out drill sidebar** | injected **hover mega-menu**, no top-bar/section-tabs | **Accidental divergence** |
| Hero | full-bleed image + overlapping **white card**, dark H1 | **navy-gradient** hero, white text, buttons | **AI-template behavior** |
| Breadcrumbs | none | added on every page | **Necessary variation** (deep pages only) — keep subtle |
| Section system | `.market-section` eyebrow + 44/300 H2 + 820px intro | `.section` + `.block-head` + generic grids | **Accidental divergence** |
| Cards | `.segment-card` (image-top, caption, read-more) | `.ent-card` rounded, hover-lift, kicker | **AI-template behavior** |
| CTA | `.cta-strip` / `.footer-search-strip` bands | navy `.cta-band` strip | **AI-template behavior** |
| Content density | dense, multi-paragraph, technical | sparse one-line cards | **Accidental divergence** |
| Applications | inside Segment Explorer | extra generic card grid | **Accidental divergence** (fold into Explorer) |
| Products | in-page filterable DB | generic card grid | **Accidental divergence** |
| Typography | H2 44/300, eyebrow 13/700 | mixed (30px block-heads, etc.) | **Accidental divergence** |
| Filler language | concrete technical copy | "Secure, efficient and sustainable…" tagline-as-H1 | **AI-template / slop** — remove |

## Corrections (applied this pass)
1. Extract Electronics' `<style>` → shared `assets/deon-site.css`; every page links it.
2. Rebuild `deon-chrome.js` to inject Electronics' **exact** chrome (top-bar, section-tabs, nav, slide-out drill sidebar, footer-search-strip, footer) + the panel-stack JS — data-driven. Retire the mega-menu.
3. Refactor `market-page.js` to Electronics' section sequence + classes (hero / market-section / feature-list / segment-grid product range / download-cards / cta-strip). Remove navy hero, ent-card grids, cta-band, tagline-as-H1.
4. Refactor application/products/resources/contact/search renderers to the same vocabulary.
5. Anti-slop: H1 = real market name (not "Secure, efficient…"); intros are concrete; reuse Electronics' technical feature vocabulary.

## Result target
Homepage → Electronics → Packaging → Electrical → Automotive → Applications → Products → Resources read as one product. No page reveals whether it is bespoke or data-driven.
