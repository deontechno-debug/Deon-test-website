/* Application page renderer — electronics vocabulary (hero + white card,
   market-section bands, feature-list challenges, segment-grid families/related,
   tag-row markets, download-grid resources, cta-strip helpdesk). */
(function () {
  'use strict';
  var D = window.DEON;
  var BG = ['3a4a6a','394970','445586','4f6090','2f3f5f','47588a','13284a','0e2a44'];
  var ARROW = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DLICON='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qs(k){return new URLSearchParams(location.search).get(k);}
  function hero(crumb,h1,intro,bg){return (crumb?'<div class="context-bar">'+crumb+'</div>':'')+'<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/'+bg+'/8ea0c8?text=" alt="'+esc(h1)+'" /></div><div class="hero-card"><h1>'+esc(h1)+'</h1><p>'+esc(intro)+'</p></div></div>';}
  function segCard(href,bg,title,caption,cta){return '<a class="segment-card" href="'+esc(href)+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div><div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div><div class="segment-card-caption">'+esc(caption)+'</div><span class="segment-card-link">'+esc(cta||'Read more')+' '+ARROW+'</span></div></a>';}
  function sect(cls,inner){return '<section class="market-section'+(cls?' '+cls:'')+'">'+inner+'</section>';}
  function dlCard(href,title,sub){return '<a href="'+esc(href)+'" class="download-card"><img class="download-thumb" src="https://placehold.co/264x184/dfe4ec/8ea0c8?text=" alt="" /><div class="download-meta"><div class="download-title">'+esc(title)+'</div><div class="download-sub">'+esc(sub)+'</div><span class="download-action">Download '+DLICON+'</span></div></a>';}

  function renderIndex(root){
    document.title='Applications | DEON';
    var apps=D.raw.applications;
    root.innerHTML=hero(D.trail.hub('Applications'),'Applications','DEON adhesive applications across industrial markets. Each connects a manufacturing challenge to the product families and resources that solve it.','2f3f5f')+
      sect('', '<div class="market-eyebrow">Application library</div><h2>Browse applications</h2><div class="segment-grid">'+
        apps.map(function(a,i){return segCard(D.url.application(a.id),BG[i%BG.length],a.name,a.summary,'Explore');}).join('')+'</div>');
  }

  function render(){
    var root=document.getElementById('deon-main');
    var id=qs('app'); var a=id&&D.application(id);
    if(!a){ renderIndex(root); return; }
    document.title=a.name+' | DEON Applications';
    var markets=D.marketsForApplication(a.id), segs=D.segmentsForApplication(a.id);
    var families=D.productFamiliesForApplication(a.id), related=D.relatedApplications(a.id,3), resources=D.resourcesForApplication(a.id);
    var m0=markets[0], s0=segs[0];

    var out = hero(D.trail.application(a.id), a.name, a.summary, '3a4a6a');

    // Challenges — feature-layout (electronics Features pattern)
    if(a.challenges&&a.challenges.length){
      out += sect('', '<div class="feature-layout"><div><div class="market-eyebrow">Application</div><h2>Engineering challenges</h2>'+
        '<div class="market-intro"><p>What makes '+esc(a.name.toLowerCase())+' demanding — and where DEON tapes earn their place on the line. [Placeholder copy.]</p></div></div>'+
        '<ul class="feature-list">'+a.challenges.map(function(c){return '<li>'+esc(c)+'</li>';}).join('')+'</ul></div>');
    }
    // Recommended product families
    if(families.length){
      out += sect('is-grey', '<div class="market-eyebrow">Product families</div><h2>Recommended DEON product families</h2>'+
        '<div class="segment-grid">'+families.map(function(f,i){return segCard(D.url.productFamily(f.id),BG[i%BG.length],f.name,f.note,'View family');}).join('')+'</div>');
    }
    // Used across markets — tags
    if(markets.length){
      out += sect('', '<div class="market-eyebrow">Markets</div><h2>Used across these markets</h2>'+
        '<div class="market-intro"><p>The same application, reused wherever the challenge appears.</p></div>'+
        '<div class="tag-row">'+markets.map(function(m){return '<a class="tag" href="'+esc(D.url.market(m.id))+'">'+esc(m.name)+'</a>';}).join('')+'</div>');
    }
    // Related applications
    if(related.length){
      out += sect('is-grey', '<div class="market-eyebrow">Related</div><h2>Related applications</h2>'+
        '<div class="segment-grid">'+related.map(function(r,i){return segCard(D.url.application(r.id),BG[i%BG.length],r.name,r.summary,'Explore');}).join('')+'</div>');
    }
    // Resources
    if(resources.length){
      out += sect('', '<div class="market-eyebrow">Downloads</div><h2>Resources</h2>'+
        '<div class="download-grid">'+resources.map(function(r){return dlCard(r.url||'#',r.title,r.format+' · '+r.size);}).join('')+'</div>');
    }
    // Helpdesk
    out += '<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/3a4a6a/8ea0c8?text=" alt="DEON application engineering support" /></div><div class="cta-body"><h2>Solving '+esc(a.name.toLowerCase())+'?</h2><p>Talk to a DEON application engineer for samples, datasheets and on-site support. [Placeholder copy.]</p><a href="contact.html?topic='+encodeURIComponent(a.slug)+'" class="cta-btn">Get in touch</a></div></div>';

    root.innerHTML=out;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
