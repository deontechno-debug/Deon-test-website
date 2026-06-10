/* ============================================================
   DEON CHROME — shared top bar + section tabs + nav + full-depth
   off-canvas ecosystem explorer + footer. Injected into every page.
   The sidebar drill-down is generated entirely from DEON_ARCH
   (DEON_SITE_ARCHITECTURE.md) so it never flattens the hierarchy:
     Markets → <market> → Overview + segments
     Applications / Products / Resources / Press & Insights / Capabilities
   Load order: deon-catalog.js → deon-data.js → deon-architecture.js → deon-chrome.js
   ============================================================ */
(function () {
  'use strict';
  var D = window.DEON, ARCH = window.DEON_ARCH;
  // The shared search ENGINE only needs the data layer (D); the chrome RENDERING
  // (header / sidebar / footer) additionally needs the IA (ARCH) and is guarded in
  // mount(). Bailing here only when D is missing keeps window.DEON_SEARCH — and thus
  // the /search results page — alive even if architecture.js fails to load.
  if (!D) { console.warn('DEON chrome: data not loaded'); return; }
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function slugify(s){ return (ARCH && ARCH.slug) ? ARCH.slug(s) : String(s==null?'':s).toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

  var CTX_ARROW = '<span class="ctx-arrow"><svg width="9" height="14" viewBox="0 0 9 14" fill="none"><path d="M2 1.5L7.5 7L2 12.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  // Tesa-style small chevron (›) on drillable rows — lighter affordance than a long arrow.
  var PRIM_ARROW = '<span class="prim-arrow"><svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1.5L6.5 7L1 12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  var SUB_ARROW = '<span class="sub-arrow"><svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1.5L6.5 7L1 12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  var BACK = '<svg width="9" height="15" viewBox="0 0 9 15" fill="none"><path d="M7 1.5L1.5 7.5L7 13.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ---------- HEADER ----------
  function headerHTML(){
    // Top nav shows only top-flagged items. Exploratory items (with a panel) OPEN
    // that side panel (no overview navigation); others navigate directly. This
    // mirrors the side-panel behaviour exactly — one navigation model.
    var links = ARCH.level1.filter(function(it){ return it.top; })
      .sort(function(a,b){ return a.top - b.top; })
      .map(function(it){
      // Section id = the IA section this top-nav item heads (its panel key, or
      // the bare page name for direct items like Contact). The active-section
      // highlight is keyed on this, NOT on per-page URLs.
      var sec = it.panel || (it.href || '').replace(/\.html.*$/, '');
      return it.panel
        ? '<li><a href="#" data-open-panel="'+esc(it.panel)+'" data-section="'+esc(sec)+'" aria-haspopup="true"><span class="nav-link-label">'+esc(it.label)+'</span></a></li>'
        : '<li><a href="'+esc(it.href)+'" data-section="'+esc(sec)+'"><span class="nav-link-label">'+esc(it.label)+'</span></a></li>';
    }).join('');
    return '' +
    '<div class="top-bar" id="topBar"><span>This page is also available in a language that may suit you better: &nbsp;🇮🇳 India &nbsp;<a href="#">English</a></span><button class="top-bar-close" id="topBarClose">Close &times;</button></div>' +
    '<div class="section-tabs"><a href="index.html" class="section-tab" aria-label="Home">&#8962;</a><a href="index.html" class="section-tab active" aria-label="Tapes material platform" aria-current="true">Tapes</a><a href="#" class="section-tab" aria-label="Films material platform">Films</a></div>' +
    '<nav>' +
      '<div class="nav-inner">' +
        '<div class="nav-left">' +
          '<button class="nav-hamburger" id="navHamburger" aria-label="Toggle menu" aria-expanded="false"><span class="hb-bar"></span><span class="hb-bar"></span><span class="hb-bar"></span></button>' +
          '<div class="nav-logo"><a href="index.html" aria-label="DEON — Home"><img src="brand_assets/Deon_Logo.png" alt="DEON — It\'s Power-Strong" /></a></div>' +
        '</div>' +
        '<ul class="nav-links" id="navLinks">' + links + '</ul>' +
        '<div class="nav-right">' +
          '<button class="nav-icon-btn" id="searchBtn" type="button" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>' +
          '<button class="nav-icon-btn" aria-label="Language">EN<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></button>' +
        '</div>' +
      '</div>' +
    '</nav>';
  }

  // ---------- FOOTER ----------
  function footerHTML(){
    var marketCol = D.markets().map(function(m){return '<li><a href="'+esc(D.url.market(m.id))+'">'+esc(m.name)+'</a></li>';}).join('');
    return '' +
    '<div class="footer-search-strip"><div class="footer-search-text"><h3>Didn\'t find what you are<br>looking for?</h3></div>' +
      '<form class="footer-search-form" action="search.html" method="get" role="search"><input type="text" name="q" placeholder="Search DEON" aria-label="Footer search" /><button type="submit" aria-label="Search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button></form>' +
      '<div class="footer-search-image"><svg width="200" height="160" viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="rgba(255,255,255,0.12)" rx="4"/><circle cx="130" cy="100" r="42" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="18"/><circle cx="130" cy="100" r="16" fill="rgba(255,255,255,0.18)"/><circle cx="56" cy="116" r="28" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="12"/><circle cx="56" cy="116" r="10" fill="rgba(255,255,255,0.15)"/><circle cx="170" cy="38" r="22" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="6"/><circle cx="170" cy="38" r="8" fill="rgba(255,255,255,0.15)"/><circle cx="75" cy="40" r="10" fill="rgba(255,255,255,0.22)"/><rect x="67" y="52" width="16" height="22" rx="4" fill="rgba(255,255,255,0.2)"/></svg></div></div>' +
    '<footer><div class="footer-scroll-top"><button class="scroll-top-btn" aria-label="Back to top" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">&#8743;</button></div>' +
      '<div class="footer-top">' +
        '<div class="footer-brand"><img class="footer-logo" src="brand_assets/Deon_Logo.png" alt="DEON — It\'s Power-Strong" /><div class="footer-tagline">Holding the<br>world together</div><a href="contact.html" class="footer-contact-link">Contact us</a><div class="footer-social"><a href="#" class="social-link" aria-label="LinkedIn">in</a><a href="#" class="social-link" aria-label="YouTube">▶</a></div></div>' +
        '<div class="footer-divider"></div>' +
        '<div class="footer-col"><h4>Markets</h4><ul>' + marketCol + '</ul></div>' +
        '<div class="footer-col"><h4>Explore</h4><ul><li><a href="applications.html">Applications</a></li><li><a href="products.html">Products</a></li><li><a href="knowledge-center.html">Resources</a></li><li><a href="press.html">Press &amp; Insights</a></li><li><a href="about.html">About DEON</a></li><li><a href="careers.html">Career</a></li><li><a href="contact.html">Contact us</a></li></ul></div>' +
        '<div class="footer-col"><h4>Regions</h4><ul><li><a href="#">India — Headquarters</a></li><li><a href="#">Middle East</a></li><li><a href="#">South East Asia</a></li><li><a href="#">Europe</a></li><li><a href="#">Africa</a></li><li><a href="#">North America</a></li></ul></div>' +
      '</div>' +
      '<div class="footer-bottom"><div class="footer-legal-links"><a href="#">Imprint</a><a href="#">Privacy Statement</a><a href="#">Accessibility Statement</a><a href="#">Cookie Settings</a><a href="#">Terms &amp; Conditions</a></div><span>&#169; DEON Technology</span></div>' +
    '</footer>';
  }

  // ---------- SIDEBAR (generated from DEON_ARCH) ----------
  function panel(key, title, titleHref, itemsHtml, back){
    return '<div class="nav-panel" data-panel="'+esc(key)+'" aria-hidden="true">' +
      '<div class="nav-panel-header"><button class="nav-panel-back" data-panel-back aria-label="'+esc(back||'Back')+'">'+BACK+'</button>' +
      '<a href="'+esc(titleHref||'#')+'" class="nav-panel-title">'+esc(title)+'</a></div>' +
      '<div class="nav-panel-scroll"><ul class="nav-sub-list">'+itemsHtml+'</ul></div></div>';
  }
  function subLink(label, href, drill){
    if (drill) return '<li><a href="#" data-drill="'+esc(drill)+'"><span>'+esc(label)+'</span>'+SUB_ARROW+'</a></li>';
    return '<li><a href="'+esc(href)+'"><span>'+esc(label)+'</span></a></li>';
  }

  function sidebarHTML(){
    // main — the "Tapes" root node + ONE primary navigation list (no duplicated
    // context block). Items with a child panel show a chevron; leaves do not.
    var heading = '<div class="nav-sidebar-context-heading">Tapes</div>';
    var primary = '<ul class="nav-sidebar-primary">' + ARCH.level1.map(function(it){
      return it.panel
        ? '<li><a href="#" data-drill="'+it.panel+'"><span>'+esc(it.label)+'</span>'+PRIM_ARROW+'</a></li>'
        : '<li><a href="'+esc(it.href)+'"><span>'+esc(it.label)+'</span></a></li>';
    }).join('') + '</ul>';
    var main = '<div class="nav-panel is-current" data-panel="main"><div class="nav-sidebar-body">' + heading + primary + '</div></div>';

    var panels = [];
    // markets → market list (drill into each; special single-page markets link straight to their page)
    panels.push(panel('markets', 'Markets', 'market.html',
      subLink('Overview', 'market.html') +
      ARCH.markets.map(function(m){ return m.special ? subLink(m.name, D.url.market(m.id)) : subLink(m.name, null, 'market-'+m.id); }).join(''),
      'Back to menu'));
    // each non-special market → Overview + segment pages
    ARCH.markets.forEach(function(m){
      if (m.special) return;
      var href = D.url.market(m.id);
      var items = subLink('Overview', href) + m.segments.map(function(s){ return subLink(s.name, D.url.segment(s.id)); }).join('');
      panels.push(panel('market-'+m.id, m.name, href, items, 'Back to Markets'));
    });
    // applications → grouped (progressive disclosure: group → applications)
    panels.push(panel('applications', 'Applications', 'applications.html',
      subLink('Overview', 'applications.html') +
      ARCH.applicationGroups.map(function(g){ return subLink(g.name, null, 'appgroup-'+g.slug); }).join(''), 'Back to menu'));
    ARCH.applicationGroups.forEach(function(g){
      panels.push(panel('appgroup-'+g.slug, g.name, 'applications.html',
        g.apps.map(function(a){ return subLink(a.name, D.url.application(a.id)); }).join(''), 'Back to Applications'));
    });
    // products → families → products (drill into a family to reveal its products)
    panels.push(panel('products', 'Products', 'products.html',
      subLink('Overview', 'products.html') +
      ARCH.productFamilies.map(function(f){
        var prods = D.productsForFamily(f.slug);
        return prods.length ? subLink(f.name, null, 'family-'+f.slug) : subLink(f.name, D.url.productFamily(f.slug));
      }).join(''), 'Back to menu'));
    ARCH.productFamilies.forEach(function(f){
      var prods = D.productsForFamily(f.slug);
      if(!prods.length) return;
      panels.push(panel('family-'+f.slug, f.name, D.url.productFamily(f.slug),
        subLink('Overview', D.url.productFamily(f.slug)) +
        prods.map(function(p){ return subLink(p.name, D.url.product(p.id)); }).join(''), 'Back to Products'));
    });
    // resources (Knowledge Center section — "Resources" is the nav label)
    panels.push(panel('knowledge', 'Resources', 'knowledge-center.html',
      subLink('Overview', 'knowledge-center.html') +
      ARCH.knowledge.map(function(r){ return subLink(r.name, r.href); }).join(''), 'Back to menu'));
    // press & insights
    panels.push(panel('press', 'Press & Insights', 'press.html',
      subLink('Overview', 'press.html') +
      ARCH.press.map(function(r){ return subLink(r.name, r.href); }).join(''), 'Back to menu'));
    // about deon
    panels.push(panel('about', 'About DEON', 'about.html',
      subLink('Overview', 'about.html') +
      ARCH.about.map(function(r){ return subLink(r.name, r.href); }).join(''), 'Back to menu'));

    return '<div class="nav-overlay" id="navOverlay"></div>' +
      '<aside class="nav-sidebar" id="navSidebar" aria-hidden="true">' +
        '<button class="nav-stack-back" data-stack-back type="button" aria-label="Back one level">'+BACK+'</button>' +
        '<div class="nav-sidebar-panels" id="navPanels">' +
        main + panels.join('') + '</div></aside>';
  }

  // ---------- SEARCH ENGINE (shared) ----------
  // ONE index + matcher over the whole content graph, exposed as window.DEON_SEARCH
  // so BOTH the header overlay (discovery) and the /search results page (refinement)
  // read the same source of truth. Records carry the type-specific attributes the
  // results page filters on (products: thickness / adhesive / backing / family;
  // resources: resource type) so the adaptive facet rail needs no second index.
  var SEARCH_TYPES = ['Markets','Applications','Products','Resources','Press & Insights'];
  var SEARCH_INDEX = null;
  function buildSearchIndex(){
    var R = D.raw, U = D.url, idx = [];
    function add(rec){ rec.s = (rec.title + ' ' + (rec.sub||'') + ' ' + (rec._extra||'')).toLowerCase(); delete rec._extra; idx.push(rec); }
    (R.markets||[]).forEach(function(m){ add({ type:'Markets', title:m.name, sub:m.tagline, href:U.market(m.id), id:m.id, _extra:m.intro }); });
    (R.applications||[]).forEach(function(a){ add({ type:'Applications', title:a.name, sub:a.summary, href:U.application(a.id), id:a.id, _extra:a.overview }); });
    (R.productFamilies||[]).forEach(function(f){ add({ type:'Products', kind:'family', title:f.name, sub:'Product family', href:U.productFamily(f.id), id:f.id, familyId:f.id, familyName:f.name, _extra:f.overview }); });
    (R.products||[]).forEach(function(p){ var f=D.productFamily(p.familyId); add({ type:'Products', kind:'product', title:p.name, sub:p.desc, href:U.product(p.id), id:p.id, familyId:p.familyId, familyName:f?f.name:'', t:p.t, adhesive:p.adhesive, backing:p.backing, _extra:(p.adhesive||'')+' '+(p.backing||'')+' '+(f?f.name:'') }); });
    (R.resources||[]).forEach(function(r){ add({ type:'Resources', title:r.title, sub:[r.type,r.format].filter(Boolean).join(' · '), href:(r.url&&r.url!=='#')?r.url:('knowledge-center.html#'+slugify(r.category||'')), id:r.id, resType:r.type, _extra:(r.category||'')+' '+(r.type||'') }); });
    (R.insights||[]).forEach(function(n){ add({ type:'Press & Insights', title:n.title, sub:n.category, href:(n.url&&n.url!=='#')?n.url:('press.html#'+slugify(n.category||'')), id:n.id, _extra:n.excerpt }); });
    return idx;
  }
  function searchIndexAll(){ return SEARCH_INDEX || (SEARCH_INDEX = buildSearchIndex()); }
  function searchMatch(raw){
    var q = String(raw==null?'':raw).trim().toLowerCase();
    if (q.length < 3) return [];
    var toks = q.split(/\s+/).filter(Boolean);                       // token AND — every word must appear
    return searchIndexAll().filter(function(r){ return toks.every(function(t){ return r.s.indexOf(t) >= 0; }); });
  }
  function searchGroup(hits){ var g={}; hits.forEach(function(h){ (g[h.type]=g[h.type]||[]).push(h); }); return g; }
  window.DEON_SEARCH = {
    TYPES: SEARCH_TYPES, MIN_CHARS: 3, GROUP_MAX: 5,
    index: searchIndexAll, match: searchMatch, group: searchGroup,
    resultsUrl: function(q){ return 'search.html?q=' + encodeURIComponent(String(q==null?'':q).trim()); }
  };

  // ---------- SEARCH OVERLAY (DISCOVERY — a minimal panel beneath the header) ----------
  // Default state shows ONLY the field + the scope hint; no suggested destinations,
  // chips, shortcuts or region filters. Live grouped previews begin at 3 characters
  // (max 5 per group). Enter hands off to the /search results page for refinement.
  function searchHTML(){
    return '<div class="search-overlay" id="searchOverlay" aria-hidden="true">' +
      '<div class="search-backdrop" id="searchBackdrop"></div>' +
      '<div class="search-panel" role="dialog" aria-modal="true" aria-label="Search DEON">' +
        '<form class="search-field" id="searchForm" role="search">' +
          '<svg class="search-field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<input type="search" id="searchInput" autocomplete="off" spellcheck="false" placeholder="Search deontapes.com" aria-label="Search the DEON ecosystem" />' +
          '<button type="button" class="search-close" id="searchClose" aria-label="Close search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg></button>' +
        '</form>' +
        '<div class="search-results" id="searchResults"></div>' +
      '</div></div>';
  }
  function wireSearch(){
    var DS = window.DEON_SEARCH;
    var ov = document.getElementById('searchOverlay'); if(!ov) return;
    var input = document.getElementById('searchInput'), results = document.getElementById('searchResults'),
        backdrop = document.getElementById('searchBackdrop'), closeBtn = document.getElementById('searchClose'),
        form = document.getElementById('searchForm');
    function hitHTML(h){
      return '<a class="search-hit" href="'+esc(h.href)+'">' +
        '<span class="search-hit-main"><span class="search-hit-title">'+esc(h.title)+'</span>' +
        (h.sub?'<span class="search-hit-sub">'+esc(h.sub)+'</span>':'') + '</span>' +
        '<span class="search-hit-type">'+esc(h.type)+'</span></a>';
    }
    function render(){
      var raw = input.value;
      if(raw.trim().length < DS.MIN_CHARS){ results.innerHTML = ''; return; }   // minimal default: field only
      var hits = DS.match(raw);
      if(!hits.length){ results.innerHTML = '<div class="search-empty">No matches for “'+esc(raw.trim())+'”. Press Enter to search the full catalogue.</div>'; return; }
      var g = DS.group(hits);
      results.innerHTML = DS.TYPES.filter(function(t){ return g[t]; }).map(function(t){
        var list = g[t], shown = list.slice(0, DS.GROUP_MAX);
        return '<div class="search-group"><div class="search-group-label">'+esc(t)+'<span class="search-group-count">'+list.length+'</span></div>' +
          shown.map(hitHTML).join('') +
          (list.length>shown.length ? '<a class="search-more" href="'+esc(DS.resultsUrl(raw))+'">View all '+list.length+' in '+esc(t)+' &rarr;</a>' : '') + '</div>';
      }).join('');
    }
    var panel = ov.querySelector('.search-panel'), prevFocus = null;
    function position(){ var navEl=document.querySelector('nav'); var b=navEl?navEl.getBoundingClientRect().bottom:72; ov.style.top=Math.max(0,b)+'px'; }
    // Reopen always starts from the minimal default (field + scope hint): the input is
    // cleared unless an explicit prefill is passed. Honours the aria-modal contract:
    // background scroll is locked, focus moves in, and is restored to the trigger on close.
    function open(prefill){ prevFocus = document.activeElement; position(); ov.classList.add('open'); ov.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; input.value = (prefill!=null ? prefill : ''); render(); requestAnimationFrame(function(){ input.focus(); }); }
    function close(){ ov.classList.remove('open'); ov.setAttribute('aria-hidden','true'); document.body.style.overflow=''; input.value=''; if(prevFocus && prevFocus.focus) prevFocus.focus(); }
    // Hand off to the /search results page. A blank query still goes there (the page
    // opens in its empty "search the ecosystem" state) — Enter / a second icon click
    // never dead-ends in the overlay.
    function go(){ var q=input.value.trim(); location.href = q ? DS.resultsUrl(q) : 'search.html'; }
    input.addEventListener('input', render);
    form.addEventListener('submit', function(e){ e.preventDefault(); go(); });        // Enter -> /search?q=
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);                                        // click outside
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && ov.classList.contains('open')) close(); });
    // Focus trap — keep Tab / Shift+Tab within the panel while the modal is open.
    ov.addEventListener('keydown', function(e){
      if(e.key!=='Tab' || !ov.classList.contains('open')) return;
      var f = Array.prototype.filter.call(panel.querySelectorAll('input,button,a[href]'), function(el){ return el.offsetParent!==null && !el.disabled; });
      if(!f.length) return;
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    });
    window.addEventListener('resize', function(){ if(ov.classList.contains('open')) position(); });
    // Header search icon: first click opens the overlay (discovery); clicking it again
    // while open hands off to the /search results page (with the current query, if any).
    var btn = document.getElementById('searchBtn');
    if(btn) btn.addEventListener('click', function(){ ov.classList.contains('open') ? go() : open(); });
    // legacy query forms (footer strip / hero) hand off straight to the refinement page
    document.querySelectorAll('form.footer-search-form, form.hero-search, form[action="search.html"]').forEach(function(f){
      f.addEventListener('submit', function(e){ e.preventDefault(); var i=f.querySelector('input'); var q=i?i.value.trim():''; if(q) location.href=DS.resultsUrl(q); else open(); });
    });
    window.DEONSearch = { open: open, close: close };
  }

  // ---------- BEHAVIOUR (panel-stack, ported from electronics) ----------
  function wire(){
    var topClose=document.getElementById('topBarClose');
    if(topClose) topClose.addEventListener('click',function(){var t=document.getElementById('topBar'); if(t)t.style.display='none';});
    var sidebar=document.getElementById('navSidebar'), overlay=document.getElementById('navOverlay'),
        hamburger=document.getElementById('navHamburger'), navPanels=document.getElementById('navPanels');
    if(!sidebar||!navPanels) return;
    var panelEls={}; navPanels.querySelectorAll('.nav-panel').forEach(function(p){panelEls[p.dataset.panel]=p;});
    var panelStack=['main'];
    // MULTI-COLUMN: render the open path as columns side by side. Show the deepest
    // N panels that fit the viewport (>=1); on narrow screens N collapses to 1.
    function colW(){ var raw=getComputedStyle(sidebar).getPropertyValue('--nav-colw').trim(), n=parseFloat(raw)||18, base=parseFloat(getComputedStyle(document.documentElement).fontSize)||16; return /px/.test(raw)?n:n*base; }
    // logoStart (= --frame-inset, the DEON frame's left guide); measured off the footer's
    // framed padding, with a fallback mirroring the CSS tokens.
    function frameLeftPx(){ var base=parseFloat(getComputedStyle(document.documentElement).fontSize)||16, g=Math.max(2.5*base,(window.innerWidth-1280)/2); return window.innerWidth<=768?g:g+30+1.5*base; }
    // PERSISTENT HIERARCHICAL EXPLORER (Tesa model): render the ENTIRE open path as
    // columns side by side — every parent level stays visible, none is ever replaced or
    // hidden, so the user always sees where they are / came from / can go without a back
    // button. The drawer grows with the path, anchored at logoStart and capped at the
    // viewport; a path deeper than fits scrolls horizontally to reveal the newest level.
    function renderPanels(resetScroll){
      Object.keys(panelEls).forEach(function(name){
        var el=panelEls[name], idx=panelStack.indexOf(name);
        el.classList.remove('is-col','is-last');
        if(idx!==-1){ el.classList.add('is-col'); if(idx===panelStack.length-1)el.classList.add('is-last'); el.style.order=idx; el.setAttribute('aria-hidden','false'); }
        else { el.style.order=''; el.setAttribute('aria-hidden','true'); }
      });
      // trail: in each column, highlight the item whose child column is open
      panelStack.forEach(function(name,i){ var el=panelEls[name]; if(!el)return; el.querySelectorAll('[data-drill]').forEach(function(a){ a.classList.toggle('is-trail', a.getAttribute('data-drill')===panelStack[i+1]); }); });
      var avail=window.innerWidth - frameLeftPx() - 8;   // logoStart -> viewport edge
      var W=Math.min(panelStack.length*colW(), Math.max(colW(), avail));
      // Full-bleed left (Tesa): the panel runs to x=0; its content is inset (padding-left)
      // so the first column aligns to the DEON frame. Total width = that inset + columns.
      // From the 3rd column on, the panel takes FULL-PAGE COVERAGE (white fills the
      // viewport) with the columns CENTERED; shallower levels stay sized to their open
      // columns over the dimmed page, anchored to the frame.
      var full = panelStack.length >= 3;
      var padL=parseFloat(getComputedStyle(sidebar).paddingLeft)||0;
      sidebar.style.width = full ? '100vw' : (padL+W)+'px';
      document.documentElement.style.setProperty('--nav-region', W+'px');
      sidebar.classList.toggle('is-multicol', panelStack.length>1);
      sidebar.classList.toggle('is-drilled', panelStack.length>1);   // shows the single gutter back arrow
      requestAnimationFrame(function(){ if(navPanels.scrollWidth>navPanels.clientWidth+1) navPanels.scrollLeft=navPanels.scrollWidth; });
      if(resetScroll){ var last=panelEls[panelStack[panelStack.length-1]]; var sc=last&&last.querySelector('.nav-panel-scroll, .nav-sidebar-body'); if(sc)sc.scrollTop=0; }
    }
    function pushPanel(name){ if(!panelEls[name]||panelStack[panelStack.length-1]===name)return; panelStack.push(name); renderPanels(true); }
    function popPanel(){ if(panelStack.length>1){panelStack.pop(); renderPanels(false);} }
    function setPanelsInstant(name){ panelStack=(name&&name!=='main'&&panelEls[name])?['main',name]:['main']; renderPanels(true); }
    var resizeAnimTimer;
    window.addEventListener('resize',function(){
      if(!sidebar.classList.contains('open')) return;
      // SNAP the width while the viewport changes (zoom/resize). A width:100vw panel otherwise
      // transitions to each new resolved width — a ~380ms "push to fill" wiggle on every zoom.
      // Kill the transition for the duration of the gesture; restore it 200ms after the last
      // resize event so drilling still animates.
      sidebar.classList.add('is-resizing');
      clearTimeout(resizeAnimTimer);
      resizeAnimTimer=setTimeout(function(){ sidebar.classList.remove('is-resizing'); }, 200);
      var navEl=document.querySelector('nav'); var nt=Math.max(0, navEl?navEl.getBoundingClientRect().top:0);
      sidebar.style.top=nt+'px';
      renderPanels(false);
    });
    function openSidebar(target){
      target=target||'main';
      var navEl=document.querySelector('nav'); var navTop=Math.max(0, navEl?navEl.getBoundingClientRect().top:0);
      sidebar.style.top=navTop+'px';   // covers the nav bar too (CSS bottom:0); logo + hamburger float on top
      var wasOpen=sidebar.classList.contains('open');
      if(!wasOpen) setPanelsInstant(target);
      hamburger.classList.add('is-open'); sidebar.classList.add('open'); overlay.classList.add('open');
      sidebar.setAttribute('aria-hidden','false'); hamburger.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; document.body.classList.add('nav-open');
      if(wasOpen){ if(target==='main'){ while(panelStack.length>1)panelStack.pop(); renderPanels(false);} else if(panelStack[panelStack.length-1]!==target){ panelStack=['main']; renderPanels(false); requestAnimationFrame(function(){pushPanel(target);}); } }
    }
    function closeSidebar(){ hamburger.classList.remove('is-open'); sidebar.classList.remove('open'); overlay.classList.remove('open'); sidebar.setAttribute('aria-hidden','true'); hamburger.setAttribute('aria-expanded','false'); document.body.style.overflow=''; document.body.classList.remove('nav-open'); document.documentElement.style.setProperty('--nav-region','0px'); }
    // Open to a 2-column state (root + first section) so the navigation reads as a
    // meaningful region capable of the explorer, not a single narrow column.
    hamburger.addEventListener('click',function(){ sidebar.classList.contains('open')?closeSidebar():openSidebar('main'); });
    overlay.addEventListener('click',closeSidebar);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape' && sidebar.classList.contains('open')) closeSidebar(); });
    navPanels.querySelectorAll('[data-drill]').forEach(function(el){ el.addEventListener('click',function(e){
      e.preventDefault();
      // drilling from a PARENT column truncates the path to that column, then opens
      // the child as the next column (replacing any deeper columns).
      var panelEl=el.closest('.nav-panel'), pname=panelEl?panelEl.getAttribute('data-panel'):'main';
      var idx=panelStack.indexOf(pname); if(idx!==-1) panelStack=panelStack.slice(0,idx+1);
      pushPanel(el.getAttribute('data-drill'));
    }); });
    navPanels.querySelectorAll('[data-panel-back]').forEach(function(el){ el.addEventListener('click',function(e){e.preventDefault();popPanel();}); });
    var stackBack=sidebar.querySelector('[data-stack-back]'); if(stackBack) stackBack.addEventListener('click',function(e){e.preventDefault();popPanel();});
    document.querySelectorAll('[data-open-panel]').forEach(function(el){ el.addEventListener('click',function(e){e.preventDefault();openSidebar(el.getAttribute('data-open-panel'));}); });
    // Wayfinding: mark the sidebar link matching the current page as active.
    var here = (location.pathname.split('/').pop() || 'index.html') + location.search;
    navPanels.querySelectorAll('a[href]').forEach(function(a){
      var h = a.getAttribute('href');
      if (h && h !== '#' && h === here) a.classList.add('is-active');
    });

    // Section-level top-nav indicator: derive which IA section the current page
    // belongs to (by page TEMPLATE, not per-page URL) so the underline persists
    // across every page within a section — overview, group, detail, segment,
    // datasheet, etc. Works for deep links / direct URL / sidebar / breadcrumb
    // because it is recomputed from the current document on every load.
    var sec = currentSection();
    var navLinks = document.getElementById('navLinks');
    if (sec && navLinks) {
      navLinks.querySelectorAll('a[data-section]').forEach(function(a){
        if (a.getAttribute('data-section') === sec) a.classList.add('is-active-section');
      });
    }

    // Scroll progress = full-width BLUE and RED materials split by a travelling
    // white GAP. Blue/red always run edge-to-edge; ONLY the gap's travel is
    // constrained to the symmetric brand frame [logoStart, viewportWidth -
    // logoStart] (logoStart = the visual start of the DEON logo). wire() reads
    // logoStart on init+resize and sets --gap-left (the gap's left x) per scroll
    // frame: at load the gap sits at logoStart; at max it reaches the mirrored
    // right boundary, leaving a full-width red remainder. The blue ::after runs
    // from the viewport-left to the gap (width = --gap-left + 5px white border);
    // the red ::before is full viewport width behind it.
    var docEl = document.documentElement;
    var navEl = document.querySelector('nav:not(.crumb)');
    var navLogo = navEl && navEl.querySelector('.nav-logo');
    var spTicking = false, logoStart = 0, travel = 0;
    var GAP = 5;   // constant white separation gap
    function measureRegion(){
      if (!navLogo) return;
      logoStart = navLogo.getBoundingClientRect().left;                 // visual start of the DEON logo
      travel = Math.max(0, window.innerWidth - 2 * logoStart - GAP);    // gap rides [logoStart, vw-logoStart-GAP]
    }
    function setNavFill(){
      spTicking = false;
      var max = docEl.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      p = p < 0 ? 0 : (p > 1 ? 1 : p);
      docEl.style.setProperty('--gap-left', (logoStart + p * travel).toFixed(1) + 'px');
    }
    function onScroll(){ if(!spTicking){ spTicking = true; requestAnimationFrame(setNavFill); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function(){ measureRegion(); setNavFill(); }, { passive: true });
    measureRegion(); setNavFill();
  }

  // Map a page template → its IA section id (matches the top-nav data-section).
  // This is the IA hierarchy, not a per-URL list: any page rendered by a given
  // section's templates resolves to that section.
  function currentSection(){
    var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var SECTION = {
      'index.html':'markets', 'market.html':'markets', 'segment.html':'markets',
      'electronics.html':'markets', 'converter-partners.html':'markets', 'oem-partners.html':'markets',
      'applications.html':'applications', 'application.html':'applications',
      'products.html':'products', 'product.html':'products',
      'knowledge-center.html':'knowledge', 'resources.html':'knowledge',
      'press.html':'press',
      'contact.html':'contact'
    };
    return SECTION[file] || null;
  }

  function mount(){
    if (!ARCH) { console.warn('DEON chrome: architecture not loaded — header/sidebar not rendered'); return; }
    // Favicon — flat-vector DEON tape-roll symbol (SVG primary + PNG fallbacks).
    if(!document.querySelector('link[rel="icon"][href*="favicon.svg"]')){
      document.head.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]').forEach(function(l){l.remove();});
      [['icon','image/svg+xml','brand_assets/favicon.svg?v=4',null],['icon','image/png','brand_assets/favicon-64.png?v=4','64x64'],['icon','image/png','brand_assets/favicon-48.png?v=4','48x48'],['icon','image/png','brand_assets/favicon-32.png?v=4','32x32'],['icon','image/png','brand_assets/favicon-16.png?v=4','16x16'],['apple-touch-icon',null,'brand_assets/favicon-180.png?v=4','180x180']].forEach(function(s){var l=document.createElement('link');l.rel=s[0];if(s[1])l.type=s[1];l.href=s[2];if(s[3])l.setAttribute('sizes',s[3]);document.head.appendChild(l);});
    }
    var anchor=document.getElementById('deon-main')||document.body.firstChild;
    var head=document.createElement('div'); head.innerHTML=headerHTML();
    while(head.firstChild) document.body.insertBefore(head.firstChild, anchor);
    var foot=document.createElement('div'); foot.innerHTML=footerHTML()+sidebarHTML()+searchHTML();
    while(foot.firstChild) document.body.appendChild(foot.firstChild);
    // Reparent the veil AND the white panel INTO <nav> so page/links/veil/sheet/controls share
    // ONE stacking context: the nav's sticky stacking context otherwise traps every nav child on
    // a single plane, so a body-level veil (behind the nav) could never dim the nav links. Inside
    // <nav>, plain z-index orders them — page+links UNDER the veil (z1), white sheet OVER it (z2),
    // logo+×+search+EN OVER everything (z3). The veil (fixed, inset:0) sits in the nav's z-band so
    // it dims the page too; the tabs/language bar (z1300) stay above it. nav has no transform, so
    // both fixed children keep the viewport as their containing block.
    (function(){ var nv=document.querySelector('nav:not(.crumb)'), ov=document.getElementById('navOverlay'), pnl=document.getElementById('navSidebar'); if(nv){ if(ov) nv.appendChild(ov); if(pnl) nv.appendChild(pnl); } })();
    document.documentElement.classList.add('-loaded');
    wire();
    wireSearch();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount);
  else mount();
  window.DEONChrome={ mount: mount };
})();
