/* ============================================================
   DEON SEARCH RESULTS — refinement page (search.html?q=…).
   Discovery lives in the header overlay; REFINEMENT lives here.
   Reads ?q=, queries the shared engine (window.DEON_SEARCH) and renders:
     · a persistent CONTENT TYPE rail (always shown), and
     · an ADAPTIVE facet rail — product attributes when products dominate
       the result set, resource types when resources dominate.
   All matching + records come from DEON_SEARCH, so this page and the
   overlay never drift. Catalog attributes ride on each record, so the
   facet rail needs no second index.
   ============================================================ */
(function () {
  'use strict';
  var D = window.DEON, DS = window.DEON_SEARCH, FA = D && D.facets;
  if (!D || !DS) { console.warn('DEON search: engine not loaded'); return; }
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function fmt(n){return Number(n).toLocaleString('en-US');}

  var THUMB = '<span class="srp-thumb" aria-hidden="true"><svg viewBox="0 0 60 60" fill="none">' +
    '<rect width="60" height="60" fill="#eef2f7"/>' +
    '<circle cx="30" cy="30" r="17" fill="#fff" stroke="#b6c2d4" stroke-width="2.5"/>' +
    '<circle cx="30" cy="30" r="7" fill="#dfe6ef" stroke="#b6c2d4" stroke-width="2"/>' +
    '<path d="M30 13a17 17 0 0 1 14.7 8.5" stroke="#0072ce" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M16.5 38.5 A17 17 0 0 0 30 47" stroke="#e3000b" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/></svg></span>';
  var ARROW = '<svg class="srp-arrow" width="7" height="11" viewBox="0 0 7 11" fill="none"><path d="M1 1l4.5 4.5L1 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  // Resource-type display order (spec canonical). Types present in the catalog are
  // rendered in this order; any not listed are appended alphabetically.
  var RESTYPE_ORDER = ['Datasheet','Technical Data Sheet','Application Guide','Industry Guide','Case Study',
    'White Paper','Certificate','Certification','Compliance Report','Declaration','Test Report','Reference Chart',
    'Reference Table','Line Card','Brochure','Product Catalogue','Press Release','Video','FAQ'];

  // A content type "leads" the result set — and so earns its adaptive facet rail —
  // when it is a top group (count == the max, so genuine ties surface BOTH rails),
  // carries a meaningful share, and has enough items to be worth refining. This keeps
  // stray product/resource hits inside an unrelated search from surfacing a rail,
  // while still exposing the rail for product-led-but-diffuse searches (e.g. "foam").
  var MIN_LEAD_SHARE = 0.33;
  var MIN_LEAD_COUNT = 3;

  var DEFAULT_TYPES = function(){ var o={}; DS.TYPES.forEach(function(t){o[t]=true;}); return o; };

  var state = {
    q: '', hits: [], opts: null, showProduct: false, showResource: false,
    types: DEFAULT_TYPES(), fam: {}, adh: {}, bak: {}, tlo: null, thi: null, restype: {}
  };

  // Tolerate malformed percent-encoding (truncated UTF-8, hand-edited URLs):
  // decodeURIComponent throws URIError on bad escapes — fall back to the raw token
  // rather than letting render() abort and leave a blank page.
  function getQ(){
    var m = /[?&]q=([^&]*)/.exec(location.search); if (!m) return '';
    var raw = (m[1] || '').replace(/\+/g, ' ');
    try { return decodeURIComponent(raw); } catch (e) { return raw; }
  }

  function matchGroup(field, val, sel){
    if (!sel.length) return true;
    if (FA && FA.field(field)) { var g = FA.groupOf(field, val); return g ? sel.indexOf(g.id) >= 0 : false; }
    return sel.indexOf(val) >= 0;
  }

  // ---- compute facet option sets + dominance for the current query result set ----
  function computeOpts(hits){
    var counts = {}; hits.forEach(function(h){ counts[h.type] = (counts[h.type]||0) + 1; });
    var total = hits.length, bn = 0;
    DS.TYPES.forEach(function(t){ if ((counts[t]||0) > bn) { bn = counts[t]; } });
    // count == bn keeps ALL top groups (a 50/50 product/resource split leads on both).
    function leads(t){ var n = counts[t] || 0; return n >= MIN_LEAD_COUNT && n >= total * MIN_LEAD_SHARE && n >= bn; }

    var products = hits.filter(function(h){ return h.type==='Products' && h.kind==='product'; });
    var prodAll  = hits.filter(function(h){ return h.type==='Products'; });
    // Product families present (families + products carry familyName), with live counts.
    var famMap = {}; prodAll.forEach(function(h){ if(h.familyName){ famMap[h.familyName] = (famMap[h.familyName]||0)+1; } });
    var families = Object.keys(famMap).sort().map(function(n){ return { name:n, count:famMap[n] }; });
    var adh = FA ? FA.groupsPresent('adhesive', products) : [];
    var bak = FA ? FA.groupsPresent('backing', products) : [];
    var ts = products.map(function(p){ return p.t; }).filter(function(t){ return typeof t==='number'; });
    var tmin = ts.length ? Math.min.apply(null, ts) : 0, tmax = ts.length ? Math.max.apply(null, ts) : 0;

    var resources = hits.filter(function(h){ return h.type==='Resources'; });
    var rtMap = {}; resources.forEach(function(h){ if(h.resType){ rtMap[h.resType]=(rtMap[h.resType]||0)+1; } });
    var restypes = Object.keys(rtMap).sort(function(a,b){
      var ia=RESTYPE_ORDER.indexOf(a), ib=RESTYPE_ORDER.indexOf(b);
      if(ia<0&&ib<0) return a.localeCompare(b);
      if(ia<0) return 1; if(ib<0) return -1; return ia-ib;
    }).map(function(t){ return { type:t, count:rtMap[t] }; });

    return {
      counts: counts, leadProducts: leads('Products'), leadResources: leads('Resources'),
      families: families, adh: adh, bak: bak, tmin: tmin, tmax: tmax,
      hasProductAttrs: !!products.length, restypes: restypes
    };
  }

  // Does a product SKU pass the active attribute facets (adhesive / backing / thickness)?
  function skuPassesAttrs(h, attrAdh, attrBak){
    if (!matchGroup('adhesive', h.adhesive, attrAdh)) return false;
    if (!matchGroup('backing',  h.backing,  attrBak)) return false;
    if (typeof h.t === 'number') {
      if (state.tlo != null && h.t < state.tlo) return false;
      if (state.thi != null && h.t > state.thi) return false;
    } else if (thicknessNarrowed()) {
      return false;                                                  // unknown thickness excluded once a range is set
    }
    return true;
  }
  function thicknessNarrowed(){
    return (state.tlo != null && state.tlo > state.opts.tmin) || (state.thi != null && state.thi < state.opts.tmax);
  }

  // ---- which records survive the active filters ----
  function visibleHits(){
    var attrAdh = Object.keys(state.adh), attrBak = Object.keys(state.bak);
    // When a SKU-level facet (adhesive/backing/thickness) is active, a product-FAMILY
    // card survives only if at least one of its SKUs in the result set still passes —
    // otherwise narrowing to an attribute no SKU has would leave orphan family tiles.
    var attrActive = state.showProduct && (attrAdh.length || attrBak.length || thicknessNarrowed());
    var familyHasSku = null;
    if (attrActive) {
      familyHasSku = {};
      state.hits.forEach(function(h){
        if (h.type==='Products' && h.kind==='product' && skuPassesAttrs(h, attrAdh, attrBak)) familyHasSku[h.familyName] = true;
      });
    }
    return state.hits.filter(function(h){
      if (!state.types[h.type]) return false;
      if (h.type === 'Products' && state.showProduct) {
        var fsel = Object.keys(state.fam);
        if (fsel.length && fsel.indexOf(h.familyName) < 0) return false;
        if (h.kind === 'product') {
          if (!skuPassesAttrs(h, attrAdh, attrBak)) return false;
        } else if (attrActive && !familyHasSku[h.familyName]) {       // family card with no surviving SKU
          return false;
        }
      }
      if (h.type === 'Resources' && state.showResource) {
        var rsel = Object.keys(state.restype);
        if (rsel.length && rsel.indexOf(h.resType) < 0) return false;
      }
      return true;
    });
  }

  // ---------- filter rail ----------
  function checkRow(group, value, label, count, checked, disabled){
    return '<label class="srp-check'+(disabled?' is-empty':'')+'">' +
      '<input type="checkbox" data-srp="'+esc(group)+'" value="'+esc(value)+'"'+(checked?' checked':'')+(disabled?' disabled':'')+' />' +
      '<span class="srp-check-label">'+esc(label)+'</span><span class="srp-check-count">'+count+'</span></label>';
  }
  function railGroup(title, body, note){
    return '<div class="srp-fgroup"><div class="srp-fgroup-head">'+esc(title)+'</div>' +
      (note?'<div class="srp-fgroup-note">'+esc(note)+'</div>':'') + body + '</div>';
  }
  function railHTML(){
    var o = state.opts, html = '';

    // Content Type — ALWAYS shown (all five), counts from the query result set.
    // Checked reflects state.types (default all on) even at zero count, so the box
    // never disagrees with the internal filter state; zero-count rows are disabled.
    var ct = DS.TYPES.map(function(t){
      var c = o.counts[t] || 0;
      return checkRow('type', t, t, c, !!state.types[t], c===0);
    }).join('');
    html += railGroup('Content Type', ct);

    // Adaptive PRODUCT rail — only when products dominate.
    if (state.showProduct) {
      var fam = o.families.length
        ? o.families.map(function(f){ return checkRow('fam', f.name, f.name, f.count, !!state.fam[f.name], false); }).join('')
        : '<div class="srp-fgroup-empty">No product families in results.</div>';
      var pbody = '<div class="srp-subhead">Product Family</div>' + fam;
      if (o.adh.length) pbody += '<div class="srp-subhead">Adhesive</div>' + o.adh.map(function(g){ return checkRow('adh', g.id, g.label, g.count, !!state.adh[g.id], false); }).join('');
      if (o.bak.length) pbody += '<div class="srp-subhead">Backing</div>' + o.bak.map(function(g){ return checkRow('bak', g.id, g.label, g.count, !!state.bak[g.id], false); }).join('');
      if (o.hasProductAttrs) {
        pbody += '<div class="srp-subhead">Thickness</div>' +
          '<div class="srp-range"><label>Min<input type="number" data-srp="tlo" value="'+state.tlo+'" min="'+o.tmin+'" max="'+o.tmax+'" /><span>µm</span></label>' +
          '<label>Max<input type="number" data-srp="thi" value="'+state.thi+'" min="'+o.tmin+'" max="'+o.tmax+'" /><span>µm</span></label></div>';
      }
      html += railGroup('Refine products', pbody, 'These filters appear because products lead these results.');
    }

    // Adaptive RESOURCE rail — only when resources dominate.
    if (state.showResource) {
      var rt = o.restypes.length
        ? o.restypes.map(function(r){ return checkRow('restype', r.type, r.type, r.count, !!state.restype[r.type], false); }).join('')
        : '<div class="srp-fgroup-empty">No resource types in results.</div>';
      html += railGroup('Resource Type', rt, 'These filters appear because resources lead these results.');
    }

    return '<div class="srp-rail-head"><span class="srp-rail-title">Filter</span><button type="button" class="srp-clear" data-srp-clear>Clear all</button></div>' + html;
  }

  // ---------- results ----------
  function attrLine(h){
    if (h.type==='Products' && h.kind==='product') {
      var bits = [];
      if (typeof h.t==='number') bits.push(fmt(h.t)+' µm');
      if (h.adhesive) bits.push(h.adhesive);
      if (h.backing) bits.push(h.backing);
      return bits.length ? '<span class="srp-card-attrs">'+bits.map(function(b){return '<span class="srp-chip">'+esc(b)+'</span>';}).join('')+'</span>' : '';
    }
    return '';
  }
  function cardHTML(h){
    var lead = (h.type==='Products' && h.kind==='product') ? THUMB : '';
    return '<a class="srp-card'+(lead?' has-thumb':'')+'" href="'+esc(h.href)+'">' + lead +
      '<span class="srp-card-body"><span class="srp-card-title">'+esc(h.title)+ARROW+'</span>' +
      (h.sub ? '<span class="srp-card-sub">'+esc(h.sub)+'</span>' : '') + attrLine(h) +
      '</span><span class="srp-card-type">'+esc(h.type)+'</span></a>';
  }
  function resultsHTML(){
    var vis = visibleHits();
    var g = DS.group(vis);
    var summary = '<div class="srp-summary"><strong>'+fmt(vis.length)+'</strong> '+(vis.length===1?'result':'results')+
      ' for &ldquo;'+esc(state.q)+'&rdquo;</div>';
    if (!vis.length) {
      return summary + '<div class="srp-empty"><h3>No results match your filters</h3><p>Try removing a filter, or search a different term — a market, application, product or resource.</p></div>';
    }
    var groups = DS.TYPES.filter(function(t){ return g[t] && g[t].length; }).map(function(t){
      return '<section class="srp-group"><h2 class="srp-group-head">'+esc(t)+'<span class="srp-group-count">'+g[t].length+'</span></h2>' +
        '<div class="srp-list">'+g[t].map(cardHTML).join('')+'</div></section>';
    }).join('');
    return summary + groups;
  }

  // ---------- state sync from DOM ----------
  function readChecks(group){
    var o = {}, root = document.getElementById('srpRail'); if(!root) return o;
    root.querySelectorAll('input[data-srp="'+group+'"]:checked:not(:disabled)').forEach(function(i){ o[i.value] = true; });
    return o;
  }

  // ---------- render orchestration ----------
  function paintResults(){ var m=document.getElementById('srpResults'); if(m) m.innerHTML = resultsHTML(); }
  function paintRail(){ var r=document.getElementById('srpRail'); if(r) r.innerHTML = railHTML(); }

  function run(q){
    state.q = q;
    state.hits = DS.match(q);
    state.opts = computeOpts(state.hits);
    state.showProduct  = state.opts.leadProducts;
    state.showResource = state.opts.leadResources;
    // reset filters to defaults for the new query
    state.types = DEFAULT_TYPES(); state.fam = {}; state.adh = {}; state.bak = {}; state.restype = {};
    state.tlo = state.opts.tmin; state.thi = state.opts.tmax;     // numeric bounds (computeOpts always returns numbers)
    document.title = 'Search: ' + (q || '') + ' | DEON';
    paintRail(); paintResults();
  }

  function clearAll(){
    state.types = DEFAULT_TYPES(); state.fam = {}; state.adh = {}; state.bak = {}; state.restype = {};
    state.tlo = state.opts.tmin; state.thi = state.opts.tmax;
    paintRail(); paintResults();
  }

  // ---------- page shell ----------
  function render(){
    var root = document.getElementById('deon-main');
    var q = getQ();
    var out = '<div class="context-bar">'+D.trail.hub('Search')+'</div>';
    out += '<section class="srp-head">' +
        '<div class="srp-eyebrow">Search the DEON ecosystem</div>' +
        '<h1>Search</h1>' +
        '<form class="srp-searchbox" id="srpForm" role="search">' +
          '<span class="srp-searchbox-icon">'+SICON+'</span>' +
          '<input type="search" id="srpInput" autocomplete="off" placeholder="Search markets, applications, products and resources" aria-label="Search the DEON ecosystem" value="'+esc(q)+'" />' +
          '<button type="submit" class="srp-search-btn">Search</button>' +
        '</form></section>';
    out += '<section class="srp"><aside class="srp-rail" id="srpRail"></aside><div class="srp-main" id="srpResults"></div></section>';
    root.innerHTML = out;
    wire(root);
    if (q) run(q); else emptyState();
  }

  function emptyState(){
    var rail = document.getElementById('srpRail'), res = document.getElementById('srpResults');
    if (rail) rail.innerHTML = '';
    if (res) res.innerHTML = '<div class="srp-empty"><h3>Search the DEON ecosystem</h3><p>Enter a term to find markets, applications, products, resources and press &amp; insights. Use the filters on the left to refine.</p></div>';
    var i = document.getElementById('srpInput'); if (i) i.focus();
  }

  function wire(root){
    var form = root.querySelector('#srpForm'), input = root.querySelector('#srpInput');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var q = input.value.trim();
      var url = q ? DS.resultsUrl(q) : 'search.html';
      if (history.replaceState) history.replaceState({}, '', url); else location.search = q ? '?q='+encodeURIComponent(q) : '';
      if (q) run(q); else emptyState();
    });

    var rail = root.querySelector('#srpRail');
    rail.addEventListener('change', function(e){
      var t = e.target; if (!t.matches('input[data-srp]')) return;
      var g = t.getAttribute('data-srp');
      if (g === 'type')     { state.types = (function(){ var o={}; DS.TYPES.forEach(function(ty){o[ty]=false;}); readCheckedInto(o,'type'); return o; })(); }
      else if (g === 'fam') { state.fam = readChecks('fam'); }
      else if (g === 'adh') { state.adh = readChecks('adh'); }
      else if (g === 'bak') { state.bak = readChecks('bak'); }
      else if (g === 'restype') { state.restype = readChecks('restype'); }
      else if (g === 'tlo' || g === 'thi') { syncThickness(); }
      paintResults();
    });
    // While typing, filter on the RAW values without clamping or rewriting the field
    // (clamping mid-keystroke makes the min bound un-typeable). Clamp + writeback happen
    // on 'change' (blur / Enter) via syncThickness in the handler above.
    rail.addEventListener('input', function(e){
      if (!e.target.matches('input[data-srp="tlo"],input[data-srp="thi"]')) return;
      readThicknessRaw(); paintResults();
    });
    rail.addEventListener('click', function(e){ if (e.target.closest('[data-srp-clear]')) { e.preventDefault(); clearAll(); } });
  }

  function readCheckedInto(o, group){
    var root = document.getElementById('srpRail'); if(!root) return;
    root.querySelectorAll('input[data-srp="'+group+'"]:checked:not(:disabled)').forEach(function(i){ o[i.value] = true; });
  }
  function readThicknessRaw(){
    var root = document.getElementById('srpRail'); if(!root) return;
    var lo = root.querySelector('input[data-srp="tlo"]'), hi = root.querySelector('input[data-srp="thi"]');
    var o = state.opts;
    state.tlo = (lo && lo.value !== '' && isFinite(+lo.value)) ? +lo.value : o.tmin;
    state.thi = (hi && hi.value !== '' && isFinite(+hi.value)) ? +hi.value : o.tmax;
  }
  function syncThickness(){
    var root = document.getElementById('srpRail'); if(!root) return;
    var lo = root.querySelector('input[data-srp="tlo"]'), hi = root.querySelector('input[data-srp="thi"]');
    var o = state.opts;
    var l = lo ? Math.max(o.tmin, Math.min(+lo.value || o.tmin, o.tmax)) : o.tmin;
    var h = hi ? Math.max(o.tmin, Math.min(+hi.value || o.tmax, o.tmax)) : o.tmax;
    if (l > h) l = h;
    state.tlo = l; state.thi = h;
    if (lo) lo.value = l; if (hi) hi.value = h;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
