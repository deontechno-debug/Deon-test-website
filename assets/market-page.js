/* Market page renderer — renders ANY market from the catalog via ?m=<id>.
   Sections: hero, overview, Segment Explorer (config derived from the
   catalog), applications, product mapping, resources, CTA.
   Requires: deon-data.js, segment-explorer.js (window.SegmentExplorer). */
(function () {
  'use strict';
  var D = window.DEON;
  var ARROW = '<svg width="16" height="10" viewBox="0 0 24 16" fill="none" aria-hidden="true"><path d="M0 8H21M12 1L21 8L12 15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SEG_BG = ['0f2748','142a4d','0e2a44','13284a','10314f','17304d'];
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qs(k){return new URLSearchParams(location.search).get(k);}
  function uniqBy(arr){var s=[],seen={};arr.forEach(function(e){if(e&&!seen[e.id]){seen[e.id]=1;s.push(e);}});return s;}
  function card(href,kicker,title,desc,cta){return '<a class="ent-card" href="'+esc(href)+'">'+(kicker?'<span class="kicker">'+esc(kicker)+'</span>':'')+'<span class="t">'+esc(title)+'</span>'+(desc?'<span class="d">'+esc(desc)+'</span>':'')+'<span class="more">'+esc(cta||'View')+' '+ARROW+'</span></a>';}
  function section(cls,inner,id){return '<section class="section'+(cls?' '+cls:'')+'"'+(id?' id="'+id+'"':'')+'><div class="container">'+inner+'</div></section>';}

  // Build a Segment Explorer config object straight from catalog relationships.
  function explorerConfig(market){
    var segs = D.segmentsForMarket(market.id);
    return {
      market: market.id,
      eyebrow: 'Explore by segment',
      title: 'Find your ' + market.name.toLowerCase().replace(/ &.*/,'') + ' application',
      intro: 'Select a manufacturing segment to see its typical applications, the engineering challenges involved, and the DEON product families built to solve them.',
      segments: segs.map(function(s, i){
        var apps = D.applicationsForSegment(s.id);
        var challenges = [];
        apps.forEach(function(a){ (a.challenges||[]).forEach(function(c){ if(challenges.indexOf(c)<0) challenges.push(c); }); });
        var fams = uniqBy([].concat.apply([], apps.map(function(a){ return D.productFamiliesForApplication(a.id); })));
        var resId = null;
        apps.some(function(a){ var r=D.resourcesForApplication(a.id); if(r.length){ resId=r[0]; return true; } return false; });
        return {
          id: s.id, label: s.name, summary: s.summary,
          diagram: { src:'https://placehold.co/720x540/'+SEG_BG[i%SEG_BG.length]+'/5a86bd?text='+encodeURIComponent(s.name),
                     alt:s.name+' assembly', caption:'Where DEON tapes integrate across '+s.name.toLowerCase()+'.' },
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
    root.innerHTML='<section class="page-hero"><div class="container">'+
      '<nav class="breadcrumb"><a href="index.html">Home</a><span class="sep">›</span><span class="current">Markets</span></nav>'+
      '<div class="eyebrow">Industry</div><h1>Markets</h1><p class="lead">DEON adhesive solutions organised by the industries we serve.</p></div></section>'+
      section('', '<div class="card-grid">'+D.markets().map(function(m){return card(D.url.market(m.id),'Market',m.name,m.tagline,'Explore market');}).join('')+'</div>');
  }

  function render(){
    var root=document.getElementById('deon-main');
    var id=qs('m');
    var m=id&&D.market(id);
    if(!m){ renderIndex(root); return; }
    // Electronics has a bespoke page — send there.
    if(m.page && m.page!=='#' && m.page.indexOf('market.html')<0){ location.replace(m.page); return; }

    document.title=m.name+' | DEON Markets';
    var apps=D.applicationsForMarket(m.id);
    var fams=uniqBy([].concat.apply([], apps.map(function(a){return D.productFamiliesForApplication(a.id);})));
    var resources=D.resourcesForMarket(m.id);

    var hero='<section class="page-hero"><div class="container">'+
      '<nav class="breadcrumb"><a href="index.html">Home</a><span class="sep">›</span><a href="market.html">Markets</a><span class="sep">›</span><span class="current">'+esc(m.name)+'</span></nav>'+
      '<div class="eyebrow">Market</div><h1>'+esc(m.tagline)+'</h1>'+
      '<p class="lead">DEON partners with '+esc(m.name.toLowerCase())+' manufacturers from application engineering to series supply — bonding, sealing, insulating and protecting across the assembly.</p>'+
      '<div class="hero-cta"><a class="btn" href="contact.html?market='+encodeURIComponent(m.id)+'">Talk to an expert</a>'+
      '<a class="btn-outline" href="products.html">Explore products</a></div></div></section>';

    var overview=section('',
      '<div class="block-head"><div class="eyebrow">Overview</div><h2>'+esc(m.name)+' adhesive solutions</h2></div>'+
      '<p class="lead" style="max-width:860px">From first prototype to high-volume production, DEON supplies the adhesive tapes that hold '+esc(m.name.toLowerCase())+' products together — engineered for the temperatures, surfaces and reliability demands of your line. Explore the segments below to map your challenge to the right solution. [Placeholder narrative.]</p>');

    var explorerSection=section('section--grey','<div id="mkt-explorer"></div>');

    var appsSection = apps.length? section('',
      '<div class="block-head"><div class="eyebrow">Applications</div><h2>Applications in '+esc(m.name)+'</h2></div><div class="card-grid">'+
      apps.map(function(a){return card(D.url.application(a.id),'Application',a.name,a.summary,'Explore');}).join('')+'</div>') : '';

    var mapSection = fams.length? section('section--grey',
      '<div class="block-head"><div class="eyebrow">Product mapping</div><h2>Product families for '+esc(m.name)+'</h2></div><div class="card-grid">'+
      fams.map(function(f){return card(D.url.productFamily(f.id),'Product family',f.name,f.note,'View family');}).join('')+'</div>') : '';

    var resSection = resources.length? section('',
      '<div class="block-head"><div class="eyebrow">Related content</div><h2>Resources</h2></div><ul class="res-list">'+
      resources.map(function(r){return '<li class="res-item"><span class="res-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span><span class="res-meta"><a href="'+esc(r.url||'#')+'"><span class="res-title">'+esc(r.title)+'</span></a><span class="res-sub">'+esc(r.type)+' · '+esc(r.format)+' · '+esc(r.size)+'</span></span><a class="btn-outline" href="'+esc(r.url||'#')+'" style="padding:.5rem 1rem">Download</a></li>';}).join('')+'</ul>') : '';

    var cta='<section class="cta-band"><div class="container"><div><h2>Building for '+esc(m.name.toLowerCase())+'?</h2><p>Get application engineering, samples and datasheets from DEON\'s technical team.</p></div><a class="btn" href="contact.html?market='+encodeURIComponent(m.id)+'">Get in touch</a></div></section>';

    root.innerHTML=hero+overview+explorerSection+appsSection+mapSection+resSection+cta;

    // Mount the Segment Explorer with the catalog-derived config.
    if(window.SegmentExplorer && D.segmentsForMarket(m.id).length){
      window.SegmentExplorer.mount(document.getElementById('mkt-explorer'), explorerConfig(m));
    } else {
      var ex=document.getElementById('mkt-explorer');
      if(ex) ex.innerHTML='<div class="eyebrow">Segment Explorer</div><p class="lead">Segment coverage for this market is being built out.</p>';
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
