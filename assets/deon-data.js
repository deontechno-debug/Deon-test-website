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

  var C = window.DEON_CATALOG || { markets: [], segments: [], applications: [], productFamilies: [], products: [], resources: [] };

  // id → entity indexes
  function index(arr) { var m = {}; (arr || []).forEach(function (e) { m[e.id] = e; }); return m; }
  var iMarket = index(C.markets), iSegment = index(C.segments), iApp = index(C.applications),
      iFamily = index(C.productFamilies), iProduct = index(C.products), iResource = index(C.resources);

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
    marketsForApplication: function (id) { var a = iApp[id]; return a ? map(a.markets, iMarket) : []; },
    segmentsForApplication: function (id) { var a = iApp[id]; return a ? map(a.segments, iSegment) : []; },
    productFamiliesForApplication: function (id) { var a = iApp[id]; return a ? map(a.productFamilies, iFamily) : []; },
    resourcesForApplication: function (id) { var a = iApp[id]; return a ? map(a.resources, iResource) : []; },
    resourcesForMarket: function (id) { return C.resources.filter(function (r) { return (r.markets || []).indexOf(id) >= 0; }); },

    applicationsForFamily: function (id) {
      return C.applications.filter(function (a) { return (a.productFamilies || []).indexOf(id) >= 0; });
    },
    productsForFamily: function (id) { return C.products.filter(function (p) { return p.familyId === id; }); },
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

    // ---- canonical URL builders (one place to change routing) ----
    url: {
      market: function (id) { var m = iMarket[id]; if (!m) return '#'; return (m.page && m.page !== '#') ? m.page : ('market.html?m=' + encodeURIComponent(id)); },
      application: function (id) { return 'application.html?app=' + encodeURIComponent(id); },
      productFamily: function (id) { return 'products.html?family=' + encodeURIComponent(id); },
      products: function () { return 'products.html'; }
    }
  };

  window.DEON = DEON;
})();
