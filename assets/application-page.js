/* Application page renderer — renders ANY application from the catalog
   via ?app=<id>. Connects the application to its markets, segments,
   product families, related applications, resources, and contact. */
(function () {
  'use strict';
  var D = window.DEON;
  var ARROW = '<svg width="16" height="10" viewBox="0 0 24 16" fill="none" aria-hidden="true"><path d="M0 8H21M12 1L21 8L12 15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qs(k){return new URLSearchParams(location.search).get(k);}

  function card(href, kicker, title, desc, cta){
    return '<a class="ent-card" href="'+esc(href)+'">'+
      (kicker?'<span class="kicker">'+esc(kicker)+'</span>':'')+
      '<span class="t">'+esc(title)+'</span>'+
      (desc?'<span class="d">'+esc(desc)+'</span>':'')+
      '<span class="more">'+esc(cta||'View')+' '+ARROW+'</span></a>';
  }
  function section(cls, inner){return '<section class="section'+(cls?' '+cls:'')+'"><div class="container">'+inner+'</div></section>';}

  function renderNotFound(root){
    var apps = D.raw.applications;
    document.title = 'Applications | DEON';
    root.innerHTML =
      '<section class="page-hero"><div class="container">'+
        '<nav class="breadcrumb"><a href="index.html">Home</a><span class="sep">›</span><span class="current">Applications</span></nav>'+
        '<div class="eyebrow">Application Library</div><h1>Applications</h1>'+
        '<p class="lead">Browse DEON\'s adhesive applications. Each application connects the manufacturing challenge to the product families and resources that solve it.</p>'+
      '</div></section>'+
      section('', '<div class="card-grid">'+apps.map(function(a){
        return card(D.url.application(a.id), (D.marketsForApplication(a.id)[0]||{}).name||'Application', a.name, a.summary, 'Explore');
      }).join('')+'</div>')+
      '<section class="cta-band"><div class="container"><div><h2>Have an application in mind?</h2><p>Tell DEON about your bonding, sealing or insulation challenge.</p></div><a class="btn" href="contact.html">Get technical advice</a></div></section>';
  }

  function render(){
    var root = document.getElementById('deon-main');
    var id = qs('app');
    var a = id && D.application(id);
    if (!a) { renderNotFound(root); return; }

    document.title = a.name + ' | DEON Applications';
    var markets = D.marketsForApplication(a.id);
    var segs = D.segmentsForApplication(a.id);
    var families = D.productFamiliesForApplication(a.id);
    var related = D.relatedApplications(a.id, 3);
    var resources = D.resourcesForApplication(a.id);
    var m0 = markets[0], s0 = segs[0];

    var crumb = '<nav class="breadcrumb"><a href="index.html">Home</a>'+
      (m0?'<span class="sep">›</span><a href="'+esc(D.url.market(m0.id))+'">'+esc(m0.name)+'</a>':'')+
      (s0?'<span class="sep">›</span><span>'+esc(s0.name)+'</span>':'')+
      '<span class="sep">›</span><span class="current">'+esc(a.name)+'</span></nav>';

    var hero = '<section class="page-hero"><div class="container">'+crumb+
      '<div class="eyebrow">Application</div><h1>'+esc(a.name)+'</h1>'+
      '<p class="lead">'+esc(a.summary)+'</p>'+
      '<div class="hero-cta"><a class="btn" href="contact.html?topic='+encodeURIComponent(a.slug)+'">Request technical consultation</a>'+
      '<a class="btn-outline" href="products.html">Browse products</a></div>'+
      '</div></section>';

    var challenges = (a.challenges&&a.challenges.length)? section('',
      '<div class="block-head"><h2>Engineering challenges</h2></div><ul class="tick-list">'+
      a.challenges.map(function(c){return '<li>'+esc(c)+'</li>';}).join('')+'</ul>') : '';

    var fams = families.length? section('section--grey',
      '<div class="block-head"><h2>Recommended product families</h2></div><div class="card-grid">'+
      families.map(function(f){return card(D.url.productFamily(f.id),'Product family',f.name,f.note,'View family');}).join('')+'</div>') : '';

    var mk = markets.length? section('',
      '<div class="block-head"><h2>Used across these markets</h2><p class="block-sub" style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--text-mid)">The same application reused wherever the challenge appears.</p></div>'+
      '<div class="chip-row">'+markets.map(function(m){return '<a class="chip" href="'+esc(D.url.market(m.id))+'">'+esc(m.name)+'</a>';}).join('')+'</div>') : '';

    var rel = related.length? section('section--grey',
      '<div class="block-head"><h2>Related applications</h2></div><div class="card-grid">'+
      related.map(function(r){return card(D.url.application(r.id),'Application',r.name,r.summary,'Explore');}).join('')+'</div>') : '';

    var res = resources.length? section('',
      '<div class="block-head"><h2>Resources</h2></div><ul class="res-list">'+
      resources.map(function(r){return '<li class="res-item"><span class="res-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>'+
        '<span class="res-meta"><a href="'+esc(r.url||'#')+'"><span class="res-title">'+esc(r.title)+'</span></a><span class="res-sub">'+esc(r.type)+' · '+esc(r.format)+' · '+esc(r.size)+'</span></span>'+
        '<a class="btn-outline" href="'+esc(r.url||'#')+'" style="padding:.5rem 1rem">Download</a></li>';}).join('')+'</ul>') : '';

    var cta = '<section class="cta-band"><div class="container"><div><h2>Solving '+esc(a.name.toLowerCase())+' for your line?</h2>'+
      '<p>Talk to a DEON application engineer for samples, datasheets and on-site support.</p></div>'+
      '<a class="btn" href="contact.html?topic='+encodeURIComponent(a.slug)+'">Get in touch</a></div></section>';

    root.innerHTML = hero + challenges + fams + mk + rel + res + cta;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
