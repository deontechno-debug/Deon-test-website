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
  if (!D || !ARCH) { console.warn('DEON chrome: data/architecture not loaded'); return; }
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  var CTX_ARROW = '<span class="ctx-arrow"><svg width="9" height="14" viewBox="0 0 9 14" fill="none"><path d="M2 1.5L7.5 7L2 12.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  var PRIM_ARROW = '<span class="prim-arrow"><svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1.25 1L6 6L1.25 11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  var SUB_ARROW = '<span class="sub-arrow"><svg width="6.5" height="11" viewBox="0 0 7 12" fill="none"><path d="M1.25 1L6 6L1.25 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
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
        ? '<li><a href="#" data-open-panel="'+esc(it.panel)+'" data-section="'+esc(sec)+'" aria-haspopup="true">'+esc(it.label)+'</a></li>'
        : '<li><a href="'+esc(it.href)+'" data-section="'+esc(sec)+'">'+esc(it.label)+'</a></li>';
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
          '<button class="nav-icon-btn" aria-label="Search" onclick="location.href=\'search.html\'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>' +
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
      '<aside class="nav-sidebar" id="navSidebar" aria-hidden="true"><div class="nav-sidebar-panels" id="navPanels">' +
        main + panels.join('') + '</div></aside>';
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
    function frameLeftPx(){ var f=document.querySelector('footer'); if(f){var pl=parseFloat(getComputedStyle(f).paddingLeft); if(pl)return pl;} var base=parseFloat(getComputedStyle(document.documentElement).fontSize)||16, g=Math.max(2.5*base,(window.innerWidth-1280)/2); return window.innerWidth<=768?g:g+30+1.5*base; }
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
      sidebar.style.width=Math.min(panelStack.length*colW(), Math.max(colW(), avail))+'px';
      sidebar.classList.toggle('is-multicol', panelStack.length>1);
      requestAnimationFrame(function(){ if(navPanels.scrollWidth>navPanels.clientWidth+1) navPanels.scrollLeft=navPanels.scrollWidth; });
      if(resetScroll){ var last=panelEls[panelStack[panelStack.length-1]]; var sc=last&&last.querySelector('.nav-panel-scroll, .nav-sidebar-body'); if(sc)sc.scrollTop=0; }
    }
    function pushPanel(name){ if(!panelEls[name]||panelStack[panelStack.length-1]===name)return; panelStack.push(name); renderPanels(true); }
    function popPanel(){ if(panelStack.length>1){panelStack.pop(); renderPanels(false);} }
    function setPanelsInstant(name){ panelStack=(name&&name!=='main'&&panelEls[name])?['main',name]:['main']; renderPanels(true); }
    window.addEventListener('resize',function(){ if(sidebar.classList.contains('open')) renderPanels(false); });
    function openSidebar(target){
      target=target||'main';
      var navEl=document.querySelector('nav'); var navBottom=navEl?navEl.getBoundingClientRect().bottom:72;
      sidebar.style.top=Math.max(0,navBottom)+'px';
      var wasOpen=sidebar.classList.contains('open');
      if(!wasOpen) setPanelsInstant(target);
      hamburger.classList.add('is-open'); sidebar.classList.add('open'); overlay.classList.add('open');
      sidebar.setAttribute('aria-hidden','false'); hamburger.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; document.body.classList.add('nav-open');
      if(wasOpen){ if(target==='main'){ while(panelStack.length>1)panelStack.pop(); renderPanels(false);} else if(panelStack[panelStack.length-1]!==target){ panelStack=['main']; renderPanels(false); requestAnimationFrame(function(){pushPanel(target);}); } }
    }
    function closeSidebar(){ hamburger.classList.remove('is-open'); sidebar.classList.remove('open'); overlay.classList.remove('open'); sidebar.setAttribute('aria-hidden','true'); hamburger.setAttribute('aria-expanded','false'); document.body.style.overflow=''; document.body.classList.remove('nav-open'); }
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
    // Favicon — flat-vector DEON tape-roll symbol (SVG primary + PNG fallbacks).
    if(!document.querySelector('link[rel="icon"][href*="favicon.svg"]')){
      document.head.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]').forEach(function(l){l.remove();});
      [['icon','image/svg+xml','brand_assets/favicon.svg?v=4',null],['icon','image/png','brand_assets/favicon-64.png?v=4','64x64'],['icon','image/png','brand_assets/favicon-48.png?v=4','48x48'],['icon','image/png','brand_assets/favicon-32.png?v=4','32x32'],['icon','image/png','brand_assets/favicon-16.png?v=4','16x16'],['apple-touch-icon',null,'brand_assets/favicon-180.png?v=4','180x180']].forEach(function(s){var l=document.createElement('link');l.rel=s[0];if(s[1])l.type=s[1];l.href=s[2];if(s[3])l.setAttribute('sizes',s[3]);document.head.appendChild(l);});
    }
    var anchor=document.getElementById('deon-main')||document.body.firstChild;
    var head=document.createElement('div'); head.innerHTML=headerHTML();
    while(head.firstChild) document.body.insertBefore(head.firstChild, anchor);
    var foot=document.createElement('div'); foot.innerHTML=footerHTML()+sidebarHTML();
    while(foot.firstChild) document.body.appendChild(foot.firstChild);
    document.documentElement.classList.add('-loaded');
    wire();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount);
  else mount();
  window.DEONChrome={ mount: mount };
})();
