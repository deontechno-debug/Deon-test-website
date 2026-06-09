/* ============================================================
   DEON NAVIGATION ARCHITECTURE  (window.DEON_ARCH)
   Machine-readable mirror of DEON_SITE_ARCHITECTURE.md — the
   authoritative, FROZEN IA. Navigation (sidebar drill-down, mega
   menu, breadcrumb hubs) is generated from this. Do not flatten.
   ============================================================ */
(function () {
  'use strict';
  function slug(s){return String(s).toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
  // Build segment descriptors {id, name} namespaced by market so ids are unique.
  function segs(marketId, names){ return names.map(function(n){ return { id: marketId + '-' + slug(n), name: n }; }); }

  // Level-1 sections. The SIDE panel is the master tree (all items below, in
  // this array order). `top:<n>` marks items shown in the slim top nav and sets
  // their left-to-right order there (so the top nav can order independently of
  // the side tree). Exploratory top items (those with a `panel`) OPEN that side
  // panel; items without a panel navigate directly — one behaviour model.
  // "Resources" is the navigation label for the Knowledge Center section
  // (panel/href unchanged — only the label differs).
  var LEVEL1 = [
    { label: 'Markets', panel: 'markets', href: 'market.html', top: 1 },
    { label: 'Applications', panel: 'applications', href: 'applications.html', top: 2 },
    { label: 'Products', panel: 'products', href: 'products.html', top: 3 },
    { label: 'Resources', panel: 'knowledge', href: 'knowledge-center.html', top: 5 },
    { label: 'Press & Insights', panel: 'press', href: 'press.html', top: 4 },
    { label: 'About DEON', panel: 'about', href: 'about.html' },
    { label: 'Career', href: 'careers.html' },
    { label: 'Contact us', href: 'contact.html', top: 6 }
  ];

  // 12 markets. `special:true` = single-page market (no child segment pages).
  var MARKETS = [
    { id: 'packaging',   name: 'Packaging & Logistics',          segments: segs('packaging',   ['Carton Sealing','Bundling','Protective Packaging']) },
    { id: 'electrical',  name: 'Electrical',                     segments: segs('electrical',  ['Electrical Installation','Cable Harnessing','Transformers','Motors & Generators','Switchgear','Energy Storage']) },
    { id: 'electronics', name: 'Electronics',                    segments: segs('electronics', ['PCB Assembly','Displays','Battery Packs','Consumer Electronics']) },
    { id: 'automotive',  name: 'Automotive',                     segments: segs('automotive',  ['Wire Harnessing','Interior Components','EV Battery Systems']) },
    { id: 'transportation', name: 'Transportation',              segments: segs('transportation', ['Aerospace','Railway','Marine','Commercial Vehicles','Recreational Vehicles']) },
    { id: 'appliance',   name: 'Appliance Manufacturing',        segments: segs('appliance',   ['Refrigeration Appliances','Washing Appliances','Climate Control Appliances']) },
    { id: 'hvacr',       name: 'HVACR',                          segments: segs('hvacr',       ['HVACR Systems']) },
    { id: 'metal',       name: 'Metal Manufacturing',            segments: segs('metal',       ['Surface Protection','Fabrication & Processing']) },
    { id: 'building',    name: 'Building Components',             segments: segs('building',    ['Facade Systems','Doors & Windows','Insulation Systems','Interior Components']) },
    { id: 'renewable',   name: 'Renewable Energy',               segments: segs('renewable',   ['Solar Modules','Energy Storage','Power Electronics','EV Infrastructure']) },
    { id: 'converter-partners', name: 'Industrial Converter Partners', special: true, segments: [] },
    { id: 'oem-partners',       name: 'OEM & Private Label Partners',  special: true, segments: [] }
  ];

  // First-class applications (cross-market). Full set; ids are slugs.
  var APPLICATIONS = ['Electrical Insulation','Repair & Maintenance','Wire Splicing','Cable Repair','Terminal Protection',
    'Wire Bundling','Wire Protection','Harness Wrapping','Wire Harnessing','Cable Management','Coil Wrapping','Phase Insulation',
    'Layer Insulation','Slot Insulation','Coil Protection','Cell Insulation','Pack Assembly','Component Fixation','Component Mounting',
    'Component Protection','Component Assembly','Masking','Mounting','Bonding','Thermal Management','Duct Sealing','Carton Sealing',
    'Bundling','Temporary Fixation','Transit Protection','Surface Protection','Part Holding','Component Stabilization','Identification','Protection']
    .map(function (n) { return { id: slug(n), name: n }; });

  // Application GROUPS — progressive-disclosure layer for navigation only
  // (Applications → group → application). The applications and their pages are
  // unchanged; every first-class application is assigned to exactly one group.
  var APPLICATION_GROUPS = [
    { name: 'Insulation',         apps: ['Electrical Insulation','Phase Insulation','Layer Insulation','Slot Insulation','Cell Insulation'] },
    { name: 'Protection',         apps: ['Terminal Protection','Wire Protection','Coil Protection','Component Protection','Surface Protection','Transit Protection','Protection','Cable Repair','Repair & Maintenance','Identification'] },
    { name: 'Bundling',           apps: ['Wire Bundling','Bundling','Harness Wrapping','Wire Harnessing','Cable Management','Coil Wrapping'] },
    { name: 'Assembly',           apps: ['Pack Assembly','Component Assembly','Component Stabilization'] },
    { name: 'Bonding',            apps: ['Bonding','Wire Splicing'] },
    { name: 'Mounting',           apps: ['Component Mounting','Mounting','Component Fixation','Temporary Fixation','Part Holding'] },
    { name: 'Masking',            apps: ['Masking'] },
    { name: 'Packaging',          apps: ['Carton Sealing','Duct Sealing'] },
    { name: 'Thermal Management', apps: ['Thermal Management'] }
  ].map(function (g) { return { name: g.name, slug: slug(g.name), apps: g.apps.map(function (n) { return { id: slug(n), name: n }; }) }; });

  // 12 product families. slug = catalog family id.
  var PRODUCT_FAMILIES = ['Electrical Tapes','Packaging Tapes','Double-Sided Tapes','Foam Tapes','PET Tapes','Cloth Tapes',
    'Foil Tapes','MOPP Tapes','Filament Tapes','Masking Tapes','Holding Tapes','Protective Tapes']
    .map(function (n) { return { name: n, slug: slug(n) }; });

  var KNOWLEDGE = ['Product Catalogues','Technical Datasheets','Certifications & Compliance','Application Guides','Industry Guides',
    'Videos & Tutorials','FAQs','Case Studies','White Papers','Downloads']
    .map(function (n) { return { name: n, href: 'knowledge-center.html#' + slug(n) }; });

  var PRESS = ['Industry Insights','Application Stories','Product Updates','Company News','Events & Exhibitions']
    .map(function (n) { return { name: n, href: 'press.html#' + slug(n) }; });

  var ABOUT = ['Company Overview','Our Story','Leadership','Manufacturing & Technology','Quality & Certifications','Locations']
    .map(function (n) { return { name: n, href: (n === 'Manufacturing & Technology' ? 'manufacturing-technology.html' : 'about.html#' + slug(n)) }; });

  var MANUFACTURING = ['Adhesive Technologies','Backing Materials','Manufacturing Capabilities','Testing & Validation',
    'Custom Product Development','R&D & Innovation','Sustainability & Compliance']
    .map(function (n) { return { name: n, href: 'manufacturing-technology.html#' + slug(n) }; });

  window.DEON_ARCH = {
    level1: LEVEL1, markets: MARKETS, applications: APPLICATIONS, applicationGroups: APPLICATION_GROUPS,
    productFamilies: PRODUCT_FAMILIES, knowledge: KNOWLEDGE, press: PRESS, about: ABOUT, manufacturing: MANUFACTURING, slug: slug
  };
})();

/* ============================================================
   LOAD-TIME INTEGRITY VALIDATOR — asserts the catalog graph, the IA, and the
   facet registry are mutually consistent and fails LOUDLY (console.error) on any
   drift, so a typo can't silently orphan a node or break the filter rail once
   content scales. Runs once on load (all data globals are defined by now);
   read-only and wrapped so it can never break a page. Re-run: DEON_VALIDATE().
   ============================================================ */
(function () {
  function run() {
    var errs = [], warns = [];
    try {
      var C = window.DEON_CATALOG, D = window.DEON, A = window.DEON_ARCH, F = window.DEON_FACETS;
      if (!C || !D || !A) return { errors: ['core globals missing'], warnings: [] };
      var fam = {}; (C.productFamilies || []).forEach(function (f) { fam[f.id] = f; });
      var appIds = {}; (C.applications || []).forEach(function (a) { appIds[a.id] = true; });
      var mkt = {}; (C.markets || []).forEach(function (m) { mkt[m.id] = m; });

      var famHasProduct = {};
      (C.products || []).forEach(function (p) {
        if (!fam[p.familyId]) errs.push('product "' + p.id + '" -> unknown family "' + p.familyId + '"');
        famHasProduct[p.familyId] = true;
        if (F && D.facets) ['adhesive', 'backing'].forEach(function (field) {
          if (p[field] != null && !D.facets.groupOf(field, p[field]))
            errs.push('product "' + p.id + '": ' + field + ' value "' + p[field] + '" is not in the facet registry');
        });
      });
      (C.productFamilies || []).forEach(function (f) { if (!famHasProduct[f.id]) warns.push('family "' + f.id + '" has 0 products'); });
      (C.segments || []).forEach(function (s) { if (!mkt[s.marketId]) errs.push('segment "' + s.id + '" -> unknown market "' + s.marketId + '"'); });

      var grpCount = {};
      (A.applicationGroups || []).forEach(function (g) {
        g.apps.forEach(function (a) {
          grpCount[a.id] = (grpCount[a.id] || 0) + 1;
          if (!appIds[a.id]) errs.push('application group "' + g.name + '" -> unknown application "' + a.id + '"');
        });
      });
      (C.applications || []).forEach(function (a) {
        var n = grpCount[a.id] || 0;
        if (n === 0) errs.push('application "' + a.id + '" is in NO application group');
        else if (n > 1) warns.push('application "' + a.id + '" is in ' + n + ' application groups');
      });
    } catch (e) { errs.push('validator threw: ' + e); }

    if (errs.length) console.error('[DEON integrity] ' + errs.length + ' ERROR(S):\n  ' + errs.join('\n  '));
    if (warns.length) console.warn('[DEON integrity] ' + warns.length + ' warning(s):\n  ' + warns.join('\n  '));
    if (!errs.length && !warns.length) console.debug('[DEON integrity] OK — catalog, IA and facet registry consistent.');
    return { errors: errs, warnings: warns };
  }
  window.DEON_VALIDATE = run;
  run();
})();
