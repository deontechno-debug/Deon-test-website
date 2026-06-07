/* Market page renderer — renders ANY market in the EXACT electronics.html
   vocabulary so a visitor cannot tell it is data-driven. Section sequence
   mirrors electronics: Hero → Overview → Segment Explorer → Features →
   Product range → Downloads → Helpdesk. (Chrome adds the top bar/nav,
   footer-search strip and footer.) Requires deon-data.js + segment-explorer.js. */
(function () {
  'use strict';
  var D = window.DEON;
  var SEG_BG = ['3a4a6a','394970','445586','4f6090','2f3f5f','47588a','13284a','0e2a44'];
  var FEATURES = ['Bonding performance','Temperature resistance','Residue-free removal','Low-surface-energy (LSE) performance','Chemical resistance','Conformability','Electrical insulation','Thermal management','Moisture & ingress protection','Vibration & shock damping','Long-term reliability','Clean, repeatable converting'];
  var ARROW = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DLICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qs(k){return new URLSearchParams(location.search).get(k);}
  function uniqBy(a){var s=[],seen={};a.forEach(function(e){if(e&&!seen[e.id]){seen[e.id]=1;s.push(e);}});return s;}

  function segCard(href, bg, title, caption){
    return '<a class="segment-card" href="'+esc(href)+'">'+
      '<div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div>'+
      '<div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div>'+
      '<div class="segment-card-caption">'+esc(caption)+'</div>'+
      '<span class="segment-card-link">View family '+ARROW+'</span></div></a>';
  }
  function downloadCard(href, title, sub){
    return '<a href="'+esc(href)+'" class="download-card"><img class="download-thumb" src="https://placehold.co/264x184/dfe4ec/8ea0c8?text=" alt="" />'+
      '<div class="download-meta"><div class="download-title">'+esc(title)+'</div><div class="download-sub">'+esc(sub)+'</div>'+
      '<span class="download-action">Download '+DLICON+'</span></div></a>';
  }

  function explorerConfig(market){
    var segs = D.segmentsForMarket(market.id);
    return {
      market: market.id, eyebrow: 'Explore by segment',
      title: 'Find your ' + market.name.toLowerCase().replace(/ &.*/,'').replace(/ manufacturing/,'') + ' application',
      intro: 'Select a manufacturing segment to see its typical applications, the engineering challenges involved, and the DEON product families built to solve them. [Placeholder content — final technical copy to follow.]',
      segments: segs.map(function(s, i){
        var apps = D.applicationsForSegment(s.id);
        var challenges = [];
        apps.forEach(function(a){ (a.challenges||[]).forEach(function(c){ if(challenges.indexOf(c)<0) challenges.push(c); }); });
        var fams = uniqBy([].concat.apply([], apps.map(function(a){ return D.productFamiliesForApplication(a.id); })));
        var resId=null; apps.some(function(a){ var r=D.resourcesForApplication(a.id); if(r.length){resId=r[0];return true;} return false; });
        return {
          id: s.id, label: s.name, summary: s.summary,
          diagram: { src:'https://placehold.co/720x540/'+SEG_BG[i%SEG_BG.length]+'/5a86bd?text='+encodeURIComponent(s.name), alt:s.name+' assembly', caption:'Where DEON tapes integrate across '+s.name.toLowerCase()+'.' },
          challenges: challenges.slice(0,4),
          applications: apps.map(function(a){ return { name:a.name, desc:a.summary }; }),
          products: fams.slice(0,4).map(function(f){ return { family:f.name, note:f.note, href:D.url.productFamily(f.id) }; }),
          resource: resId ? { label:resId.title, meta:resId.format+' · '+resId.size, href:resId.url||'#' } : null
        };
      })
    };
  }

  function renderIndex(root){
    document.title='Markets | DEON';
    var cards = D.markets().map(function(m,i){ return segCard(D.url.market(m.id), SEG_BG[i%SEG_BG.length], m.name, m.tagline); }).join('');
    root.innerHTML =
      '<div class="context-bar">'+D.trail.hub('Markets')+'</div><div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/2f3f5f/8ea0c8?text=" alt="DEON industrial markets" /></div>'+
      '<div class="hero-card"><h1>Adhesive solutions for industrial markets</h1><p>DEON serves eight industrial markets with bonding, sealing, insulating, masking and protection tapes — engineered and converted for each industry\'s assembly demands.</p></div></div>'+
      '<section class="market-section"><div class="market-eyebrow">Industry</div><h2>Select your market</h2>'+
      '<div class="segment-grid">'+cards+'</div></section>';
  }

  function render(){
    var root=document.getElementById('deon-main');
    var id=qs('m'); var m=id&&D.market(id);
    if(!m){ renderIndex(root); return; }
    if(m.page && m.page!=='#' && m.page.indexOf('market.html')<0){ location.replace(m.page); return; }

    document.title=m.name+' | DEON Markets';
    var nm=m.name.toLowerCase();
    var segs=D.segmentsForMarket(m.id);
    var segNames=segs.map(function(s){return s.name;});
    var apps=D.applicationsForMarket(m.id);
    var fams=uniqBy([].concat.apply([], apps.map(function(a){return D.productFamiliesForApplication(a.id);})));
    var resources=D.resourcesForMarket(m.id);
    var heroBg=SEG_BG[D.markets().findIndex(function(x){return x.id===m.id;})%SEG_BG.length];
    var segList = segNames.length>1 ? (segNames.slice(0,-1).join(', ')+' and '+segNames[segNames.length-1]) : (segNames[0]||'');

    // 1. HERO (full-bleed image + white card)
    var hero='<div class="context-bar">'+D.trail.market(m.id)+'</div><div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/'+heroBg+'/8ea0c8?text=" alt="'+esc(m.name)+' market" /></div>'+
      '<div class="hero-card"><h1>'+esc(m.tagline)+'</h1>'+
      '<p>From '+esc(segList.toLowerCase())+', DEON\'s adhesive tapes bond, seal, insulate and protect across '+esc(nm)+' assembly — engineered for the surfaces, temperatures and reliability your line demands. [Placeholder intro — DEON copy to be added.]</p></div></div>';

    // hero search (parity with electronics)
    var heroSearch='<div class="hero-search-section"><form class="hero-search" action="search.html" method="get" role="search">'+
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'+
      '<input type="search" name="q" placeholder="Search DEON" aria-label="Search" /></form></div>';

    // 2. OVERVIEW
    var overview='<section class="market-section"><div class="market-eyebrow">'+esc(m.name)+'</div>'+
      '<h2>'+esc(m.name)+' adhesive solutions</h2><div class="market-intro">'+
      '<p>'+esc(m.name)+' manufacturing places exacting demands on every joint, seal and surface. Across '+esc(segList.toLowerCase())+', adhesive tapes have replaced screws, rivets and liquid glues with thin, precise, high-performance bonds — saving weight, speeding assembly and improving reliability. [Placeholder copy — DEON narrative to be added.]</p>'+
      '<p>As a manufacturer and converter, DEON participates across the '+esc(nm)+' value chain: from base-tape formulation through die-cutting and converting into application-ready parts, supplied to the exact geometry each line requires. The result is a single supplier for bonding, sealing, insulating, masking and protection — backed by application engineering and reliable availability. [Placeholder copy — DEON narrative to be added.]</p>'+
      '</div></section>';

    // 3. SEGMENT EXPLORER
    var explorer='<section class="market-section is-grey"><div id="mkt-explorer"></div></section>';

    // 4. FEATURES
    var features='<section class="market-section"><div class="feature-layout"><div>'+
      '<div class="market-eyebrow">Features</div><h2>Key features of our '+esc(nm)+' adhesives</h2>'+
      '<div class="market-intro"><p>A single application often demands several properties at once — a bond that also insulates, seals or dissipates heat, and still performs through the life of the product. DEON\'s portfolio is engineered around these competing requirements. [Placeholder copy.]</p></div></div>'+
      '<ul class="feature-list">'+FEATURES.map(function(f){return '<li>'+esc(f)+'</li>';}).join('')+'</ul></div></section>';

    // 5. PRODUCT RANGE (filterable product finder, identical to electronics)
    var productRange='<section class="market-section is-grey"><div class="market-eyebrow">Product assortment</div>'+
      '<h2>'+esc(m.name)+' adhesives: our product range</h2><div class="market-intro"><p>Filter the DEON '+esc(nm)+' assortment by construction attributes to find the right solution. [Placeholder dataset — DEON product data to be added.]</p></div>'+
      '<div data-market-finder></div></section>';

    // 6. DOWNLOADS
    var dlCards = resources.map(function(r){return downloadCard(r.url||'#', r.title, r.format+' · '+r.size);}).join('')
      + downloadCard('#','Technical Data Sheets — '+m.name,'PDF · [size] · [placeholder]')
      + downloadCard('#','Company Profile','PDF · [size] · [placeholder]');
    var downloads='<section class="market-section"><div class="market-eyebrow">Downloads</div><h2>Downloads</h2>'+
      '<div class="download-grid">'+dlCards+'</div></section>';

    // 7. HELPDESK (cta-strip)
    var helpdesk='<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/'+heroBg+'/8ea0c8?text=" alt="'+esc(m.name)+' application engineering support" /></div>'+
      '<div class="cta-body"><h2>'+esc(m.name)+' helpdesk</h2>'+
      '<p>Have a specific bonding, sealing, insulation or masking challenge in '+esc(nm)+'? Our application engineers evaluate your requirements, recommend the right tape and can test candidate solutions. Tell us about your application and a specialist will get in touch. [Placeholder copy.]</p>'+
      '<a href="contact.html?market='+encodeURIComponent(m.id)+'" class="cta-btn">Get in touch</a></div></div>';

    root.innerHTML = hero + heroSearch + overview + explorer + features + productRange + downloads + helpdesk;

    if(window.SegmentExplorer && segs.length){
      window.SegmentExplorer.mount(document.getElementById('mkt-explorer'), explorerConfig(m));
    } else {
      var ex=document.getElementById('mkt-explorer'); if(ex) ex.innerHTML='<div class="market-eyebrow">Segment Explorer</div><h2>Segments</h2>';
    }

    if(window.ProductFinder){
      var pf=root.querySelector('[data-market-finder]');
      if(pf) window.ProductFinder.mount(pf, D.productsForMarket(m.id).map(function(p){
        return { name:p.name, t:p.t, adhesive:p.adhesive, backing:p.backing, desc:p.desc, href:D.url.productFamily(p.familyId) };
      }));
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
