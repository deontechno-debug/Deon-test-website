/* ============================================================
   DEON CHROME  — shared top bar + header + mega menu + footer
   Injected into every NEW page type (application, market,
   products, resources, contact, search). Data-driven from the
   catalog so navigation is consistent and never a dead end.
   Load order: deon-catalog.js → deon-data.js → deon-chrome.js
   (index.html / electronics.html keep their own bespoke chrome.)
   ============================================================ */
(function () {
  'use strict';
  var D = window.DEON;
  if (!D) { console.warn('DEON chrome: data API not loaded'); return; }

  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function li(href,label){return '<li><a href="'+esc(href)+'">'+esc(label)+'</a></li>';}

  // ---- mega-menu panel contents (built from catalog) ----
  function marketsPanel(){
    return '<div class="mega-grid">'+ D.markets().map(function(m){
      return '<a class="mega-card" href="'+esc(D.url.market(m.id))+'"><span class="mega-card-t">'+esc(m.name)+
        '</span><span class="mega-card-d">'+esc(m.tagline)+'</span></a>';
    }).join('')+'</div>';
  }
  function applicationsPanel(){
    var apps = D.raw.applications.slice(0,12);
    return '<div class="mega-cols">'+ apps.map(function(a){
      return '<a class="mega-link" href="'+esc(D.url.application(a.id))+'">'+esc(a.name)+'</a>';
    }).join('')+'</div><div class="mega-foot"><a href="applications.html">View all applications →</a></div>';
  }
  function productsPanel(){
    return '<div class="mega-cols">'+ D.raw.productFamilies.map(function(f){
      return '<a class="mega-link" href="'+esc(D.url.productFamily(f.id))+'">'+esc(f.name)+'</a>';
    }).join('')+'</div><div class="mega-foot"><a href="products.html">Browse all products →</a></div>';
  }
  function resourcesPanel(){
    var types=[['Technical Guides','resources.html#guides'],['Application Guides','resources.html#guides'],
      ['Downloads','resources.html#downloads'],['FAQs','resources.html#faqs'],['Industry Insights','resources.html#insights']];
    return '<div class="mega-cols">'+types.map(function(t){return '<a class="mega-link" href="'+t[1]+'">'+esc(t[0])+'</a>';}).join('')+
      '</div><div class="mega-foot"><a href="resources.html">Open Resource Center →</a></div>';
  }

  var NAV = [
    { label:'Markets', href:'index.html#markets', panel:marketsPanel },
    { label:'Applications', href:'applications.html', panel:applicationsPanel },
    { label:'Products', href:'products.html', panel:productsPanel },
    { label:'Resources', href:'resources.html', panel:resourcesPanel },
    { label:'Contact', href:'contact.html', panel:null }
  ];

  // ---- header markup ----
  function buildHeader(){
    var navHtml = NAV.map(function(n,i){
      if(!n.panel) return '<div class="nav-item"><a href="'+esc(n.href)+'">'+esc(n.label)+'</a></div>';
      return '<div class="nav-item has-mega" data-mega="'+i+'">'+
        '<button type="button" class="nav-trigger" aria-expanded="false" aria-haspopup="true">'+esc(n.label)+
        '<svg width="10" height="6" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'+
        '<div class="mega-panel" role="region">'+n.panel()+'</div></div>';
    }).join('');

    var header = document.createElement('div');
    header.innerHTML =
      '<div class="top-bar"><div class="container"><a href="contact.html">Contact</a><a href="resources.html">Resources</a><span>EN</span></div></div>'+
      '<header class="site-header"><div class="container">'+
        '<a class="site-logo" href="index.html" aria-label="DEON home"><img src="brand_assets/Deon_Logo.png" alt="DEON — It\'s Power-Strong"></a>'+
        '<nav class="site-nav" aria-label="Primary">'+navHtml+'</nav>'+
        '<div class="header-tools">'+
          '<a href="search.html" aria-label="Search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></a>'+
          '<button class="nav-burger" aria-label="Menu" aria-expanded="false"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>'+
        '</div>'+
      '</div></header>';
    return header;
  }

  function buildFooter(){
    var marketCols = D.markets().map(function(m){return li(D.url.market(m.id), m.name);}).join('');
    var famCols = D.raw.productFamilies.slice(0,6).map(function(f){return li(D.url.productFamily(f.id), f.name);}).join('');
    var f = document.createElement('footer');
    f.className='site-footer';
    f.innerHTML='<div class="container">'+
      '<div class="f-top">'+
        '<div class="f-brand"><img class="f-logo" src="brand_assets/Deon_Logo.png" alt="DEON"><div class="f-tagline">Holding the<br>world together</div>'+
          '<p style="margin-top:1rem"><a class="btn-outline" href="contact.html">Contact us</a></p></div>'+
        '<div><h4>Markets</h4><ul>'+marketCols+'</ul></div>'+
        '<div><h4>Products</h4><ul>'+famCols+li('products.html','All products')+'</ul></div>'+
        '<div><h4>Company</h4><ul>'+li('resources.html','Resource Center')+li('applications.html','Applications')+li('contact.html','Contact')+li('index.html','Home')+'</ul></div>'+
      '</div>'+
      '<div class="f-bottom"><span>&copy; DEON Technology — It\'s Power-Strong</span>'+
        '<span class="f-legal"><a href="#">Imprint</a><a href="#">Privacy</a><a href="#">Terms &amp; Conditions</a></span></div>'+
    '</div>';
    return f;
  }

  // ---- styles (mega menu + mobile drawer specifics) ----
  function injectStyles(){
    var css =
    '.nav-item{position:relative;display:flex;align-items:center;height:var(--nav-h)}'+
    '.nav-item>a,.nav-trigger{display:inline-flex;align-items:center;gap:.35rem;font-family:inherit;font-size:15px;font-weight:600;color:var(--text);background:none;border:0;cursor:pointer;height:100%;padding:0}'+
    '.nav-trigger svg{transition:transform .2s ease}'+
    '.nav-item.open .nav-trigger svg{transform:rotate(180deg)}'+
    '.nav-item>a:hover,.nav-trigger:hover,.nav-item.open .nav-trigger{color:var(--blue)}'+
    '.mega-panel{position:absolute;top:var(--nav-h);left:0;min-width:560px;background:var(--white);border:1px solid var(--line);border-top:3px solid var(--blue);box-shadow:0 24px 48px -24px rgba(0,40,80,.45);padding:1.5rem;opacity:0;visibility:hidden;transform:translateY(6px);transition:opacity .18s ease,transform .18s ease;z-index:1100}'+
    '.nav-item.open .mega-panel{opacity:1;visibility:visible;transform:translateY(0)}'+
    '.mega-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}'+
    '.mega-card{display:block;padding:.7rem .8rem;border-radius:5px;transition:background-color .15s ease}'+
    '.mega-card:hover{background:var(--light-grey)}'+
    '.mega-card-t{display:block;font-weight:600;color:var(--text)}'+
    '.mega-card-d{display:block;font-size:13px;color:var(--text-mid);line-height:1.4;margin-top:.15rem}'+
    '.mega-cols{display:grid;grid-template-columns:1fr 1fr;gap:.25rem .75rem;min-width:480px}'+
    '.mega-link{padding:.5rem .6rem;border-radius:5px;font-size:14px;font-weight:600;color:var(--text);transition:background-color .15s ease,color .15s ease}'+
    '.mega-link:hover{background:var(--light-grey);color:var(--blue)}'+
    '.mega-foot{margin-top:1rem;padding-top:.85rem;border-top:1px solid var(--line)}'+
    '.mega-foot a{font-size:14px;font-weight:700;color:var(--blue)}'+
    '.nav-burger{display:none;background:none;border:0;cursor:pointer;color:var(--text)}'+
    '@media(max-width:980px){.site-nav{position:fixed;top:calc(var(--nav-h) + 34px);left:0;right:0;bottom:0;background:var(--white);flex-direction:column;align-items:stretch;gap:0;padding:1rem 1.5rem;overflow-y:auto;transform:translateX(-100%);transition:transform .25s ease;display:flex!important;z-index:1090}'+
    '.site-nav.open{transform:translateX(0)}'+
    '.nav-item{height:auto;flex-direction:column;align-items:stretch;border-bottom:1px solid var(--line)}'+
    '.nav-item>a,.nav-trigger{height:auto;padding:1rem 0;justify-content:space-between;width:100%}'+
    '.mega-panel{position:static;min-width:0;border:0;box-shadow:none;padding:0 0 1rem;opacity:1;visibility:hidden;height:0;overflow:hidden;transform:none;transition:none}'+
    '.nav-item.open .mega-panel{visibility:visible;height:auto}'+
    '.mega-cols,.mega-grid{min-width:0;grid-template-columns:1fr}'+
    '.nav-burger{display:inline-flex}}';
    var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
  }

  function wire(headerEl){
    var items = headerEl.querySelectorAll('.nav-item.has-mega');
    items.forEach(function(it){
      var trig=it.querySelector('.nav-trigger');
      trig.addEventListener('click',function(e){
        e.preventDefault();
        var willOpen=!it.classList.contains('open');
        items.forEach(function(o){o.classList.remove('open');o.querySelector('.nav-trigger').setAttribute('aria-expanded','false');});
        if(willOpen){it.classList.add('open');trig.setAttribute('aria-expanded','true');}
      });
      it.addEventListener('mouseenter',function(){ if(window.innerWidth>980){items.forEach(function(o){o.classList.remove('open');});it.classList.add('open');}});
      it.addEventListener('mouseleave',function(){ if(window.innerWidth>980){it.classList.remove('open');}});
    });
    document.addEventListener('click',function(e){ if(!e.target.closest('.nav-item.has-mega')){items.forEach(function(o){o.classList.remove('open');});}});
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'){items.forEach(function(o){o.classList.remove('open');});}});
    var burger=headerEl.querySelector('.nav-burger'), nav=headerEl.querySelector('.site-nav');
    burger.addEventListener('click',function(){var open=nav.classList.toggle('open');burger.setAttribute('aria-expanded',open?'true':'false');});
  }

  function mount(){
    if(!document.querySelector('link[rel="icon"]')){var fi=document.createElement('link');fi.rel='icon';fi.href='brand_assets/Deon_Logo.png';document.head.appendChild(fi);}
    injectStyles();
    var wrap=buildHeader();
    var headerEl=document.createElement('div');
    headerEl.className='deon-chrome';
    while(wrap.firstChild){ headerEl.appendChild(wrap.firstChild); }
    document.body.insertBefore(headerEl, document.body.firstChild);
    document.body.appendChild(buildFooter());
    wire(headerEl);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount);
  else mount();
})();
