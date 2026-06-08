/* Application page renderer (application.html?app=<id>) — frozen Application
   template: Hero · Overview · Technical Requirements · Common Challenges ·
   Recommended Product Families · Used Across Markets · Related Technologies ·
   Knowledge Assets · Related Insights · Related Applications · CTA. */
(function () {
  'use strict';
  var D = window.DEON;
  var BG = ['3a4a6a','394970','445586','4f6090','2f3f5f','47588a','13284a','0e2a44'];
  var ARROW = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DLICON='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qs(k){return new URLSearchParams(location.search).get(k);}
  function sect(cls,inner){return '<section class="market-section'+(cls?' '+cls:'')+'">'+inner+'</section>';}
  function card(href,bg,title,caption,cta){return '<a class="segment-card" href="'+esc(href)+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div><div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div>'+(caption?'<div class="segment-card-caption">'+esc(caption)+'</div>':'')+'<span class="segment-card-link">'+esc(cta||'View')+' '+ARROW+'</span></div></a>';}
  function dlItem(r){return '<a href="'+esc(r.url||'#')+'" class="download-card"><img class="download-thumb" src="https://placehold.co/264x184/dfe4ec/8ea0c8?text=" alt="" /><div class="download-meta"><div class="download-title">'+esc(r.title)+'</div><div class="download-sub">'+esc([r.category,r.format,r.size].filter(Boolean).join(' · '))+'</div><span class="download-action">View '+DLICON+'</span></div></a>';}
  function hero(crumb,h1,lead,bg){return '<div class="context-bar">'+crumb+'</div><div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/'+bg+'/8ea0c8?text=" alt="'+esc(h1)+'" /></div><div class="hero-card"><h1>'+esc(h1)+'</h1>'+(lead?'<p>'+esc(lead)+'</p>':'')+'</div></div>';}

  function renderIndex(root){
    document.title='Applications | DEON';
    var apps=D.raw.applications;
    root.innerHTML=hero(D.trail.hub('Applications'),'Applications','First-class DEON adhesive applications across industrial markets — each connecting a manufacturing challenge to the product families, technologies and knowledge that solve it.','2f3f5f')+
      sect('','<div class="market-eyebrow">Application library</div><h2>Browse applications</h2><div class="segment-grid">'+
        apps.map(function(a,i){return card(D.url.application(a.id),BG[i%BG.length],a.name,a.summary,'Explore');}).join('')+'</div>');
  }

  function render(){
    var root=document.getElementById('deon-main');
    var id=qs('app'); var a=id&&D.application(id);
    if(!a){ renderIndex(root); return; }
    document.title=a.name+' | DEON Applications';
    var markets=D.marketsForApplication(a.id);
    var families=D.productFamiliesForApplication(a.id);
    var techs=D.technologiesForApplication(a.id);
    var resources=D.resourcesForApplication(a.id).slice(0,6);
    var insights=D.insightsForApplication(a.id).slice(0,3);
    var related=D.relatedApplications(a.id,3);

    var out=hero(D.trail.application(a.id), a.name, a.summary, '3a4a6a');
    // Overview
    out+=sect('','<div class="market-eyebrow">Application</div><h2>About '+esc(a.name.toLowerCase())+'</h2><div class="market-intro"><p>'+esc(a.overview||a.summary)+'</p></div>');
    // Technical Requirements
    if(a.technicalRequirements&&a.technicalRequirements.length){
      out+=sect('is-grey','<div class="market-eyebrow">Technical requirements</div><h2>What the application demands</h2><ul class="feature-list">'+
        a.technicalRequirements.map(function(c){return '<li>'+esc(c)+'</li>';}).join('')+'</ul>');
    }
    // Common Challenges
    if(a.challenges&&a.challenges.length){
      out+=sect('','<div class="market-eyebrow">Challenges</div><h2>Common challenges</h2><ul class="feature-list">'+
        a.challenges.map(function(c){return '<li>'+esc(c)+'</li>';}).join('')+'</ul>');
    }
    // Recommended Product Families
    if(families.length){
      out+=sect('is-grey','<div class="market-eyebrow">Products</div><h2>Recommended DEON product families</h2><div class="segment-grid">'+
        families.map(function(f,i){return card(D.url.productFamily(f.id),BG[i%BG.length],f.name,f.note,'View family');}).join('')+'</div>');
    }
    // Used Across Markets
    if(markets.length){
      out+=sect('','<div class="market-eyebrow">Markets</div><h2>Used across these markets</h2><div class="market-intro"><p>The same application, reused wherever the challenge appears.</p></div><div class="tag-row">'+
        markets.map(function(m){return '<a class="tag" href="'+esc(D.url.market(m.id))+'">'+esc(m.name)+'</a>';}).join('')+'</div>');
    }
    // Related Technologies (incl. materials)
    if(techs.length){
      out+=sect('is-grey','<div class="market-eyebrow">Technologies &amp; materials</div><h2>Related technologies</h2><div class="segment-grid">'+
        techs.map(function(t,i){return card('manufacturing-technology.html#'+esc(t.id),BG[i%BG.length],t.name,t.summary,'Learn more');}).join('')+'</div>');
    }
    // Knowledge Assets
    if(resources.length){
      out+=sect('','<div class="market-eyebrow">Knowledge Center</div><h2>Knowledge assets</h2><div class="download-grid">'+resources.map(dlItem).join('')+'</div>');
    }
    // Related Insights
    if(insights.length){
      out+=sect('is-grey','<div class="market-eyebrow">Press & Insights</div><h2>Related insights</h2><div class="segment-grid">'+
        insights.map(function(x,i){var meta=[x.category,x.date].filter(Boolean).join(' · ');return '<a class="segment-card" href="'+esc(x.url||'#')+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+BG[i%BG.length]+'/9eb0d8?text=" alt="'+esc(x.title)+'" /></div><div class="segment-card-body"><div class="market-eyebrow" style="margin-bottom:.4rem">'+esc(meta)+'</div><div class="segment-card-title">'+esc(x.title)+'</div>'+(x.excerpt?'<div class="segment-card-caption">'+esc(x.excerpt)+'</div>':'')+'<span class="segment-card-link">Read more '+ARROW+'</span></div></a>';}).join('')+'</div>');
    }
    // Related Applications
    if(related.length){
      out+=sect('','<div class="market-eyebrow">Related</div><h2>Related applications</h2><div class="segment-grid">'+
        related.map(function(r,i){return card(D.url.application(r.id),BG[i%BG.length],r.name,r.summary,'Explore');}).join('')+'</div>');
    }
    // CTA
    out+='<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/3a4a6a/8ea0c8?text=" alt="DEON application engineering support" /></div><div class="cta-body"><h2>Solving '+esc(a.name.toLowerCase())+'?</h2><p>Talk to a DEON application engineer for samples, datasheets, custom converting and on-site support.</p><a href="contact.html?topic='+encodeURIComponent(a.slug||a.id)+'" class="cta-btn">Get in touch</a></div></div>';

    root.innerHTML=out;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
