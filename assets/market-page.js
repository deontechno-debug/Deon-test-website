/* Market page renderer (market.html?m=<id>) — frozen Market template:
   Hero · Overview · Industry Challenges · Market Segments · Key Applications ·
   Recommended Product Families · Knowledge Center Resources · Related Insights · CTA.
   Segments are first-class (link to segment.html). Electronics vocabulary. */
(function () {
  'use strict';
  var D = window.DEON;
  var BG = ['3a4a6a','394970','445586','4f6090','2f3f5f','47588a','13284a','0e2a44'];
  var ARROW = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DLICON='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qs(k){return new URLSearchParams(location.search).get(k);}
  function uniqBy(a){var s=[],seen={};a.forEach(function(e){if(e&&!seen[e.id]){seen[e.id]=1;s.push(e);}});return s;}
  function sect(cls,inner){return '<section class="market-section'+(cls?' '+cls:'')+'">'+inner+'</section>';}
  function card(href,bg,title,caption,cta){return '<a class="segment-card" href="'+esc(href)+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div><div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div>'+(caption?'<div class="segment-card-caption">'+esc(caption)+'</div>':'')+'<span class="segment-card-link">'+esc(cta||'Explore')+' '+ARROW+'</span></div></a>';}
  function dlItem(r){return '<a href="'+esc(r.url||'#')+'" class="download-card"><img class="download-thumb" src="https://placehold.co/264x184/dfe4ec/8ea0c8?text=" alt="" /><div class="download-meta"><div class="download-title">'+esc(r.title)+'</div><div class="download-sub">'+esc([r.category,r.format,r.size].filter(Boolean).join(' · '))+'</div><span class="download-action">View '+DLICON+'</span></div></a>';}
  function insightCard(x,bg){var meta=[x.category,x.date].filter(Boolean).join(' · ');return '<a class="segment-card" href="'+esc(x.url||'#')+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(x.title)+'" /></div><div class="segment-card-body"><div class="market-eyebrow" style="margin-bottom:.4rem">'+esc(meta)+'</div><div class="segment-card-title">'+esc(x.title)+'</div>'+(x.excerpt?'<div class="segment-card-caption">'+esc(x.excerpt)+'</div>':'')+'<span class="segment-card-link">Read more '+ARROW+'</span></div></a>';}

  function renderIndex(root){
    document.title='Markets | DEON';
    var cards=D.markets().map(function(m,i){return card(D.url.market(m.id),BG[i%BG.length],m.name,m.tagline,'Explore market');}).join('');
    root.innerHTML='<div class="context-bar">'+D.trail.hub('Markets')+'</div>'+
      '<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/2f3f5f/8ea0c8?text=" alt="DEON industrial markets" /></div>'+
      '<div class="hero-card"><h1>Adhesive solutions for industrial markets</h1><p>DEON manufactures, coats and converts industrial adhesive tapes for the industries below — engineered for each market’s assembly, bonding, insulation and protection demands.</p></div></div>'+
      sect('','<div class="market-eyebrow">Industry</div><h2>Select your market</h2><div class="segment-grid">'+cards+'</div>');
  }

  function render(){
    var root=document.getElementById('deon-main');
    var id=qs('m'); var m=id&&D.market(id);
    if(!m){ renderIndex(root); return; }
    if(m.special && m.page && m.page.indexOf('market.html')<0){ location.replace(m.page); return; }

    document.title=m.name+' | DEON Markets';
    var nm=m.name.toLowerCase();
    var segs=D.segmentsForMarket(m.id);
    var apps=D.applicationsForMarket(m.id);
    var fams=uniqBy([].concat.apply([],apps.map(function(a){return D.productFamiliesForApplication(a.id);})));
    var resources=D.resourcesForMarket(m.id).slice(0,6);
    var insights=D.insightsForMarket(m.id).slice(0,3);
    var heroBg=BG[D.markets().findIndex(function(x){return x.id===m.id;})%BG.length];

    var out='<div class="context-bar">'+D.trail.market(m.id)+'</div>'+
      '<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/'+heroBg+'/8ea0c8?text=" alt="'+esc(m.name)+' market" /></div>'+
      '<div class="hero-card"><h1>'+esc(m.tagline||m.name)+'</h1><p>'+esc(m.intro||'')+'</p></div></div>';

    // Overview
    out+=sect('','<div class="market-eyebrow">Overview</div><h2>'+esc(m.name)+' adhesive solutions</h2><div class="market-intro"><p>'+esc(m.intro||'')+'</p></div>');

    // Industry Challenges
    if(m.challenges&&m.challenges.length){
      out+=sect('is-grey','<div class="market-eyebrow">Industry challenges</div><h2>What '+esc(nm)+' manufacturers face</h2><ul class="feature-list">'+
        m.challenges.map(function(c){return '<li>'+esc(c)+'</li>';}).join('')+'</ul>');
    }
    // Market Segments
    if(segs.length){
      out+=sect('','<div class="market-eyebrow">Segments</div><h2>'+esc(m.name)+' segments</h2><div class="segment-grid">'+
        segs.map(function(s,i){return card(D.url.segment(s.id),BG[i%BG.length],s.name,s.summary,'View segment');}).join('')+'</div>');
    }
    // Key Applications
    if(apps.length){
      out+=sect('is-grey','<div class="market-eyebrow">Applications</div><h2>Key applications in '+esc(m.name)+'</h2><div class="segment-grid">'+
        apps.slice(0,9).map(function(a,i){return card(D.url.application(a.id),BG[i%BG.length],a.name,a.summary,'Explore');}).join('')+'</div>');
    }
    // Recommended Product Families
    if(fams.length){
      out+=sect('','<div class="market-eyebrow">Products</div><h2>Recommended product families</h2><div class="segment-grid">'+
        fams.map(function(f,i){return card(D.url.productFamily(f.id),BG[i%BG.length],f.name,f.note,'View family');}).join('')+'</div>');
    }
    // Knowledge Center Resources
    if(resources.length){
      out+=sect('is-grey','<div class="market-eyebrow">Knowledge Center</div><h2>'+esc(m.name)+' resources</h2><div class="download-grid">'+
        resources.map(dlItem).join('')+'</div>');
    }
    // Related Insights
    if(insights.length){
      out+=sect('','<div class="market-eyebrow">Press & Insights</div><h2>Related insights</h2><div class="segment-grid">'+
        insights.map(function(x,i){return insightCard(x,BG[i%BG.length]);}).join('')+'</div>');
    }
    // CTA
    out+='<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/'+heroBg+'/8ea0c8?text=" alt="'+esc(m.name)+' application engineering support" /></div>'+
      '<div class="cta-body"><h2>'+esc(m.name)+' helpdesk</h2><p>Talk to DEON’s application engineers about bonding, sealing, insulation and protection challenges in '+esc(nm)+' — samples, datasheets and on-site support.</p>'+
      '<a href="contact.html?market='+encodeURIComponent(m.id)+'" class="cta-btn">Get in touch</a></div></div>';

    root.innerHTML=out;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
