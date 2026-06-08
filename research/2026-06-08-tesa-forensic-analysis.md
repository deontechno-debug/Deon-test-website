# Tesa vs DEON — Header / Layout / Sidebar Forensic Analysis & Frame Refinement

*2026-06-08. Forensic comparison of the live Tesa industry site against DEON, the
root-cause it surfaced, and the design-system changes that followed. Data was
captured from real DOM (computed CSS + `getBoundingClientRect`) via headless
Chrome at 1440 / 1920 / 2560, not from screenshots.*

## 1. The single root cause

**Tesa locks every surface to one centered, fixed-width container**
(`div.container`, `max-width:1280px`, `padding:0 32px`, `margin:auto`) — reused
**14× on one page** plus the header. The *width* is the invariant (inner content
a constant **1216px** at every width); only the side margin grows (80→320→640).
The page is a rigid object the browser merely re-centers, so every headline,
card, nav link and footer column snaps to the same two vertical rules.

**DEON had no max-width container at all.** It bounded full-width bands with
*gutter padding* (`padding:0 var(--gutter)`, `--gutter = max(40px,(100%−1460)/2)`).
Because the floor is 40px, below ~1540px the gutter pinned at 40 and the content
column became viewport-fluid (1360px @1440) — only capping at 1460 above ~1540.
So in the common 1280–1540 laptop band DEON's edges slid on every resize, the
column ran ~144px wider and ~72px closer to each edge than Tesa's, the header nav
centre drifted (−50px @1440 → −100px @1920), and the drawer's leading white
gutter ballooned (40→550px @2560). **Tesa feels composed because it has one
invariant — the container — that everything inherits; DEON's only invariant was a
viewport formula, so nothing on the page agreed on a shared edge.**

## 2. Findings (captured numbers)

| Domain | Tesa | DEON (before) | Consequence |
|---|---|---|---|
| Header container | `max-width:1280` centered, flex | `.nav-inner` full-width + gutter pad, **no max-width** | DEON had no rigid object to inherit |
| Content column | constant **1216px** | **1360 @1440 → 1460 @1920** (fluid <1540) | column changed width on laptop resize |
| Nav centre vs header centre | constant **−27px** | **−50 → −100px** (doubles then settles) | visible left-slide as the window grows |
| Logo→nav gap | 56px (`margin-left` on nav segment) | 48px | comparable; both anchor nav to identity |
| Section grid | one `.container` ×14 | **zero** max-width containers (≥500px) | no shared line for sections to agree on |
| Desktop menu | full-width portal flyout (`#main-navigation`) — **not a left drawer** | left off-canvas drawer | DEON's drawer balloons; Tesa sidesteps it |
| Drawer leading white @2560 | n/a | **~550px** (drawer 1030px, 53% empty white) | undimmed empty band reads as "broken panel" |

The Tesa desktop hamburger opens a **full-bleed portal mega-flyout**, confirmed
structurally (`#main-navigation`, 0→viewport, Vue `v-portal`); it could not be
force-opened headlessly (lazy portal needs a trusted event). So "Tesa's sidebar
feels integrated at large widths" is achieved by *not using a narrow drawer at
all* — there is no viewport-vs-container tension to resolve.

## 3. What was implemented (this session)

1. **One authoritative content frame — `--content-max: 1460 → 1280px`.** The
   keystone. The gutter math now caps-and-centres at a **constant 1280px column
   for every width ≥1366** (verified 80→1360 @1440, 320→1600 @1920, 640→1920
   @2560 — identical on all 11 page templates). Header and body are now both
   container-locked: nav→utilities gap is a constant 123px (was 204→304), no
   drift. Hero `h1 { max-width:880px }`, copy `{ max-width:56ch }` so headlines
   and intro read as a column inside the frame rather than spanning it.
   Backgrounds stay full-bleed; only content is framed.

2. **Sidebar = one continuous panel.** Removed the `padding-left:var(--vw-gutter)`
   filler strip; panels now span the full width and the content inset is the
   panel's own padding (`--nav-pad: var(--edge)`). Fixes (a) the back-arrow /
   hover / focus-ring **clipping** at the inset overflow boundary (worst-case
   left extent now clears the x=0 clip by 35px at zoom 50–125%) and (b) the
   **ballooning** white gutter — the drawer is a constant **520px** at all widths
   (was 1030px @2560).

3. **IA cleanup.** Removed redundant overview nodes — "All markets / All
   applications / All products", per-market "Overview", per-family "All <Family>"
   — and the duplicated "Industry" context block. Each section's overview is the
   parent panel heading (also reachable via top-nav + breadcrumb). Not an
   e-commerce category tree.

4. **Top-nav active-section indicator.** IA-derived (page *template* → section
   id), so the underline persists across overview / group / detail / segment /
   datasheet, and survives deep links, direct URL, sidebar and breadcrumb. A
   persistent blue underline sits just above the brand accent stripe.

## 4. Validation

Three audit→refine cycles, all green:
- Frame constant 1280px and **identical nav/body edges on all 11 templates**.
- No header overlap and **no horizontal scroll** at 1152 / 1366 / 1440 / 1920 /
  2560 (zoom 75–125% equivalent).
- Hero headline a clean 2 lines (was spanning the full frame).
- Sidebar continuous, non-clipping, constant 520px; active-section correct on
  every section, absent on non-section pages.

## 5. Open items / judgement calls

- Frame width set to **1280** (Tesa's container value) rather than Tesa's exact
  inner **1216** — 1280 comfortably fits DEON's 6-item nav with a healthy
  nav→utilities gap; 1216 would tighten that to ~60px. Revisit if an even
  tighter body is wanted.
- Tesa's desktop flyout internals could not be measured headlessly (portal);
  the structural identity (full-width, not a left drawer) is nonetheless certain.
