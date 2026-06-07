/* Segment page renderer — electronics vocabulary (hero + white card,
   market-section bands, feature-layout for challenges/requirements,
   segment-grid for applications/families/insights, tag-row for technologies,
   download-grid for knowledge assets, cta-strip helpdesk).
   Reads ?seg=<id>; all relations via the window.DEON API. Sections whose
   data is empty are hidden. Unknown/missing seg → index grouped by market. */
(function () {
  'use strict';
  var D = window.DEON;
  var BG = ['3a4a6a','394970','445586','4f6090','2f3f5f','47588a','13284a','0e2a44'];
  var ARROW = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DLICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qs(k){return new URLSearchParams(location.search).get(k);}
  function hero(crumb,h1,intro,bg){return (crumb?'<div class="context-bar">'+crumb+'</div>':'')+'<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/'+bg+'/8ea0c8?text=" alt="'+esc(h1)+'" /></div><div class="hero-card"><h1>'+esc(h1)+'</h1><p>'+esc(intro)+'</p></div></div>';}
  function segCard(href,bg,title,caption,cta){return '<a class="segment-card" href="'+esc(href)+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div><div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div>'+(caption?'<div class="segment-card-caption">'+esc(caption)+'</div>':'')+'<span class="segment-card-link">'+esc(cta||'Read more')+' '+ARROW+'</span></div></a>';}
  function insightCard(href,bg,kicker,title,caption){return '<a class="segment-card" href="'+esc(href)+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div><div class="segment-card-body">'+(kicker?'<div class="market-eyebrow" style="margin-bottom:.4rem">'+esc(kicker)+'</div>':'')+'<div class="segment-card-title">'+esc(title)+'</div>'+(caption?'<div class="segment-card-caption">'+esc(caption)+'</div>':'')+'<span class="segment-card-link">Read more '+ARROW+'</span></div></a>';}
  function sect(cls,inner){return '<section class="market-section'+(cls?' '+cls:'')+'">'+inner+'</section>';}
  function dlCard(href,title,sub){return '<a href="'+esc(href)+'" class="download-card"><img class="download-thumb" src="https://placehold.co/264x184/dfe4ec/8ea0c8?text=" alt="" /><div class="download-meta"><div class="download-title">'+esc(title)+'</div><div class="download-sub">'+esc(sub)+'</div><span class="download-action">Download '+DLICON+'</span></div></a>';}

  function renderIndex(root){
    document.title='Segments | DEON';
    var markets=D.markets();
    var out=hero(D.trail.hub('Segments'),'Segments','DEON serves industrial markets through focused manufacturing segments. Each segment connects an assembly context to its typical applications, the engineering requirements involved, and the DEON product families built to solve them.','2f3f5f');
    var groups='';
    markets.forEach(function(m,mi){
      var segs=D.segmentsForMarket(m.id);
      if(!segs.length) return;
      groups+=sect(mi%2?'is-grey':'', '<div class="market-eyebrow">'+esc(m.name)+'</div><h2>'+esc(m.name)+' segments</h2>'+
        '<div class="segment-grid">'+segs.map(function(s,i){return segCard(D.url.segment(s.id),BG[i%BG.length],s.name,s.summary,'Explore');}).join('')+'</div>');
    });
    root.innerHTML=out+(groups||sect('', '<div class="market-eyebrow">Segments</div><h2>No segments available</h2>'));
  }

  function render(){
    var root=document.getElementById('deon-main');
    var id=qs('seg'); var s=id&&D.segment(id);
    if(!s){ renderIndex(root); return; }
    document.title=s.name+' | DEON Segments';
    var nm=s.name.toLowerCase();
    var market=D.marketForSegment(s.id);
    var apps=D.applicationsForSegment(s.id);
    var families=D.productFamiliesForSegment(s.id);
    var techs=D.technologiesForSegment(s.id);
    var resources=D.resourcesForSegment(s.id);
    var insights=market?D.insightsForMarket(market.id):[];
    var heroBg=BG[D.segmentsForMarket(s.marketId).findIndex(function(x){return x.id===s.id;})%BG.length];
    if(heroBg===undefined) heroBg=BG[0];

    // 1. HERO
    var out=hero(D.trail.segment(s.id), s.name, s.summary, heroBg);

    // 2. OVERVIEW
    if(s.overview){
      out+=sect('', '<div class="market-eyebrow">'+esc(market?market.name:'Segment')+'</div><h2>'+esc(s.name)+' overview</h2>'+
        '<div class="market-intro"><p>'+esc(s.overview)+'</p></div>');
    }

    // 3. INDUSTRY CHALLENGES & REQUIREMENTS (feature-layout: challenges list + requirements list)
    var hasCh=s.challenges&&s.challenges.length, hasReq=s.requirements&&s.requirements.length;
    if(hasCh){
      out+=sect('is-grey', '<div class="feature-layout"><div><div class="market-eyebrow">Industry challenges</div><h2>What makes '+esc(nm)+' demanding</h2>'+
        '<div class="market-intro"><p>The conditions a '+esc(nm)+' assembly must survive — and where DEON tapes earn their place on the line. [Placeholder copy.]</p></div></div>'+
        '<ul class="feature-list">'+s.challenges.map(function(c){return '<li>'+esc(c)+'</li>';}).join('')+'</ul></div>');
    }
    if(hasReq){
      out+=sect(hasCh?'':'is-grey', '<div class="feature-layout"><div><div class="market-eyebrow">Requirements</div><h2>Performance requirements</h2>'+
        '<div class="market-intro"><p>The properties a tape must deliver to qualify for '+esc(nm)+' production. [Placeholder copy.]</p></div></div>'+
        '<ul class="feature-list">'+s.requirements.map(function(r){return '<li>'+esc(r)+'</li>';}).join('')+'</ul></div>');
    }

    // 4. TYPICAL APPLICATIONS
    if(apps.length){
      out+=sect('', '<div class="market-eyebrow">Applications</div><h2>Typical '+esc(nm)+' applications</h2>'+
        '<div class="market-intro"><p>The manufacturing tasks where DEON tapes bond, seal, insulate, mask and protect across '+esc(nm)+'.</p></div>'+
        '<div class="segment-grid">'+apps.map(function(a,i){return segCard(D.url.application(a.id),BG[i%BG.length],a.name,a.summary,'Explore');}).join('')+'</div>');
    }

    // 5. RECOMMENDED PRODUCT FAMILIES
    if(families.length){
      out+=sect('is-grey', '<div class="market-eyebrow">Product families</div><h2>Recommended DEON product families</h2>'+
        '<div class="segment-grid">'+families.map(function(f,i){return segCard(D.url.productFamily(f.id),BG[i%BG.length],f.name,f.note,'View family');}).join('')+'</div>');
    }

    // 6. RELATED TECHNOLOGIES (tag-row)
    if(techs.length){
      out+=sect('', '<div class="market-eyebrow">Technologies</div><h2>Related manufacturing technologies</h2>'+
        '<div class="market-intro"><p>The adhesive, backing and converting technologies behind DEON\'s '+esc(nm)+' solutions.</p></div>'+
        '<div class="tag-row">'+techs.map(function(t){return '<a class="tag" href="'+esc(D.url.technology(t.id))+'">'+esc(t.name)+'</a>';}).join('')+'</div>');
    }

    // 7. KNOWLEDGE ASSETS (download-grid)
    if(resources.length){
      out+=sect(techs.length?'is-grey':'', '<div class="market-eyebrow">Knowledge assets</div><h2>Knowledge assets</h2>'+
        '<div class="download-grid">'+resources.map(function(r){return dlCard(r.url||'#',r.title,r.format+' · '+r.size);}).join('')+'</div>');
    }

    // 8. RELATED INSIGHTS
    if(insights.length){
      out+=sect('', '<div class="market-eyebrow">Insights</div><h2>Related insights</h2>'+
        '<div class="segment-grid">'+insights.map(function(x,i){return insightCard(x.url||'#',BG[i%BG.length],x.category,x.title,x.excerpt);}).join('')+'</div>');
    }

    // 9. CTA (ends with a cta-strip linking to contact.html)
    out+='<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/'+heroBg+'/8ea0c8?text=" alt="DEON '+esc(nm)+' application engineering support" /></div><div class="cta-body"><h2>'+esc(s.name)+' helpdesk</h2><p>Have a bonding, sealing, insulation, masking or protection challenge in '+esc(nm)+'? A DEON application engineer can recommend the right tape, supply samples and test candidate solutions. [Placeholder copy.]</p><a href="contact.html?segment='+encodeURIComponent(s.id)+'" class="cta-btn">Get in touch</a></div></div>';

    root.innerHTML=out;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
