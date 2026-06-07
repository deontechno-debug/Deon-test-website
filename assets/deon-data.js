/* ============================================================
   DEON DATA API  (window.DEON)
   The single access layer over window.DEON_CATALOG. Every page/
   component reads relationships through here — never by reaching
   into raw arrays. Provides lookups, reverse lookups, derived
   relations, and canonical URL builders.
   Load order: deon-catalog.js BEFORE deon-data.js.
   ============================================================ */
(function () {
  'use strict';

  var C = window.DEON_CATALOG || { markets: [], segments: [], applications: [], productFamilies: [], products: [], resources: [], insights: [], technologies: [] };
  C.insights = C.insights || []; C.technologies = C.technologies || [];

  // id → entity indexes
  function index(arr) { var m = {}; (arr || []).forEach(function (e) { m[e.id] = e; }); return m; }
  var iMarket = index(C.markets), iSegment = index(C.segments), iApp = index(C.applications),
      iFamily = index(C.productFamilies), iProduct = index(C.products), iResource = index(C.resources),
      iInsight = index(C.insights), iTechnology = index(C.technologies);

  function map(ids, idx) { return (ids || []).map(function (id) { return idx[id]; }).filter(Boolean); }
  function uniq(arr) { var s = [], seen = {}; arr.forEach(function (e) { if (e && !seen[e.id]) { seen[e.id] = 1; s.push(e); } }); return s; }

  var DEON = {
    raw: C,

    // ---- direct lookups ----
    market: function (id) { return iMarket[id] || null; },
    segment: function (id) { return iSegment[id] || null; },
    application: function (id) { return iApp[id] || null; },
    productFamily: function (id) { return iFamily[id] || null; },
    product: function (id) { return iProduct[id] || null; },
    resource: function (id) { return iResource[id] || null; },

    // ---- collections ----
    markets: function () { return C.markets.slice(); },
    liveMarkets: function () { return C.markets.filter(function (m) { return m.status === 'live'; }); },

    // ---- relationship traversal ----
    segmentsForMarket: function (id) { var m = iMarket[id]; return m ? map(m.segments, iSegment) : []; },
    applicationsForSegment: function (id) { var s = iSegment[id]; return s ? map(s.applications, iApp) : []; },
    applicationsForMarket: function (id) {
      var m = iMarket[id], bySeg = [];
      if (m) (m.segments || []).forEach(function (sid) {
        var s = iSegment[sid];
        if (s) (s.applications || []).forEach(function (aid) { if (iApp[aid]) bySeg.push(iApp[aid]); });
      });
      var byTag = C.applications.filter(function (a) { return (a.markets || []).indexOf(id) >= 0; });
      return uniq(bySeg.concat(byTag));
    },
    segmentsForApplication: function (id) { return C.segments.filter(function (s) { return (s.applications || []).indexOf(id) >= 0; }); },
    marketsForApplication: function (id) {
      var seen = {}, out = [];
      this.segmentsForApplication(id).forEach(function (s) { var m = iMarket[s.marketId]; if (m && !seen[m.id]) { seen[m.id] = 1; out.push(m); } });
      return out;
    },
    productFamiliesForApplication: function (id) { var a = iApp[id]; return a ? map(a.productFamilies, iFamily) : []; },
    resourcesForApplication: function (id) { return C.resources.filter(function (r) { return (r.applications || []).indexOf(id) >= 0; }); },
    resourcesForMarket: function (id) { return C.resources.filter(function (r) { return (r.markets || []).indexOf(id) >= 0; }); },

    applicationsForFamily: function (id) {
      return C.applications.filter(function (a) { return (a.productFamilies || []).indexOf(id) >= 0; });
    },
    productsForFamily: function (id) { return C.products.filter(function (p) { return p.familyId === id; }); },
    productsForMarket: function (id) {
      var fams = {};
      this.applicationsForMarket(id).forEach(function (a) { (a.productFamilies || []).forEach(function (f) { fams[f] = 1; }); });
      return C.products.filter(function (p) { return fams[p.familyId]; });
    },
    familyForProduct: function (id) { var p = iProduct[id]; return p ? iFamily[p.familyId] || null : null; },

    // Applications related by shared segment or shared product family (derived).
    relatedApplications: function (id, limit) {
      var a = iApp[id]; if (!a) return [];
      var segs = a.segments || [], fams = a.productFamilies || [];
      var scored = C.applications
        .filter(function (x) { return x.id !== id; })
        .map(function (x) {
          var s = 0;
          (x.segments || []).forEach(function (g) { if (segs.indexOf(g) >= 0) s += 2; });
          (x.productFamilies || []).forEach(function (f) { if (fams.indexOf(f) >= 0) s += 1; });
          return { app: x, score: s };
        })
        .filter(function (o) { return o.score > 0; })
        .sort(function (p, q) { return q.score - p.score; })
        .map(function (o) { return o.app; });
      return limit ? scored.slice(0, limit) : scored;
    },

    // ---- extended entities (segments, products, knowledge, insights, technologies) ----
    insight: function (id) { return iInsight[id] || null; },
    technology: function (id) { return iTechnology[id] || null; },
    insights: function () { return C.insights.slice(); },
    technologies: function () { return C.technologies.slice(); },
    marketForSegment: function (id) { var s = iSegment[id]; return s ? iMarket[s.marketId] || null : null; },
    productFamiliesForSegment: function (id) {
      var s = iSegment[id]; if (!s) return [];
      var seen = {}, out = [];
      (s.applications || []).forEach(function (aid) { var a = iApp[aid]; if (a) (a.productFamilies || []).forEach(function (f) { if (iFamily[f] && !seen[f]) { seen[f] = 1; out.push(iFamily[f]); } }); });
      return out;
    },
    productsForSegment: function (id) { var fams = {}; this.productFamiliesForSegment(id).forEach(function (f) { fams[f.id] = 1; }); return C.products.filter(function (p) { return fams[p.familyId]; }); },
    technologiesForApplication: function (id) { return C.technologies.filter(function (t) { return (t.applications || []).indexOf(id) >= 0; }); },
    technologiesForSegment: function (id) {
      var s = iSegment[id]; if (!s) return [];
      var seen = {}, out = [];
      (s.applications || []).forEach(function (aid) { C.technologies.forEach(function (t) { if ((t.applications || []).indexOf(aid) >= 0 && !seen[t.id]) { seen[t.id] = 1; out.push(t); } }); });
      return out;
    },
    technologiesForMarket: function (id) { return C.technologies.filter(function (t) { return (t.markets || []).indexOf(id) >= 0; }); },
    insightsForMarket: function (id) { return C.insights.filter(function (x) { return (x.markets || []).indexOf(id) >= 0; }); },
    insightsForApplication: function (id) { return C.insights.filter(function (x) { return (x.applications || []).indexOf(id) >= 0; }); },
    insightsByCategory: function (cat) { return C.insights.filter(function (x) { return x.category === cat; }); },
    relatedProducts: function (id) { var p = iProduct[id]; if (!p) return []; return C.products.filter(function (x) { return x.familyId === p.familyId && x.id !== id; }); },
    resourcesByCategory: function (cat) { return C.resources.filter(function (r) { return r.category === cat; }); },
    resourcesForSegment: function (id) {
      var s = iSegment[id]; if (!s) return [];
      var seen = {}, out = [];
      (s.applications || []).forEach(function (aid) { (this.resourcesForApplication(aid) || []).forEach(function (r) { if (!seen[r.id]) { seen[r.id] = 1; out.push(r); } }); }, this);
      return out;
    },

    // ---- canonical URL builders (one place to change routing) ----
    url: {
      market: function (id) { var m = iMarket[id]; if (!m) return '#'; return (m.page && m.page !== '#') ? m.page : ('market.html?m=' + encodeURIComponent(id)); },
      segment: function (id) { return 'segment.html?seg=' + encodeURIComponent(id); },
      application: function (id) { return 'application.html?app=' + encodeURIComponent(id); },
      productFamily: function (id) { return 'products.html?family=' + encodeURIComponent(id); },
      product: function (id) { return 'product.html?p=' + encodeURIComponent(id); },
      products: function () { return 'products.html'; },
      technology: function (id) { return 'manufacturing-technology.html#' + encodeURIComponent(id); }
    }
  };

  // ---- Breadcrumb component (functional nav generated from the content model) ----
  // Renders an array of {label, href?}. The LAST item (or any without href) is the
  // current page: not a link, visually distinguished, aria-current="page".
  function cesc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  DEON.crumbs = function (items) {
    return '<nav class="crumb" aria-label="Breadcrumb">' + items.map(function (it, i) {
      var sep = i ? '<span class="sep" aria-hidden="true">›</span>' : '';
      return it.href
        ? sep + '<a href="' + cesc(it.href) + '">' + cesc(it.label) + '</a>'
        : sep + '<span class="crumb-current" aria-current="page">' + cesc(it.label) + '</span>';
    }).join('') + '</nav>';
  };
  var HOME = { label: 'Home', href: 'index.html' };
  var HUB = {
    markets: { label: 'Markets', href: 'market.html' },
    products: { label: 'Products', href: 'products.html' },
    applications: { label: 'Applications', href: 'applications.html' },
    resources: { label: 'Resources', href: 'resources.html' }
  };
  // Trail builders — derive the hierarchy from the catalog so links are automatic.
  DEON.trail = {
    hub: function (label) { return DEON.crumbs([HOME, { label: label }]); },
    market: function (id) { var m = iMarket[id]; return DEON.crumbs([HOME, HUB.markets, { label: m ? m.name : id }]); },
    application: function (id) {
      var a = iApp[id], m = DEON.marketsForApplication(id)[0];
      var items = [HOME, HUB.markets];
      if (m) items.push({ label: m.name, href: DEON.url.market(m.id) });
      items.push({ label: a ? a.name : id });
      return DEON.crumbs(items);
    },
    productFamily: function (id) { var f = iFamily[id]; return DEON.crumbs([HOME, HUB.products, { label: f ? f.name : id }]); },
    segment: function (id) {
      var s = iSegment[id], m = s ? iMarket[s.marketId] : null;
      var items = [HOME, HUB.markets];
      if (m) items.push({ label: m.name, href: DEON.url.market(m.id) });
      items.push({ label: s ? s.name : id });
      return DEON.crumbs(items);
    },
    product: function (id) {
      var p = iProduct[id], f = p ? iFamily[p.familyId] : null;
      var items = [HOME, HUB.products];
      if (f) items.push({ label: f.name, href: DEON.url.productFamily(f.id) });
      items.push({ label: p ? p.name : id });
      return DEON.crumbs(items);
    }
  };

  window.DEON = DEON;
})();
