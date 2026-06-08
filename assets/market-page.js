/* Market page renderer (market.html?m=<id>) — frozen Market IA, presented as an
   industrial solution JOURNEY rather than a stack of card grids:
     Hero · Overview+Challenges (feature) · Segments (carousel) ·
     Applications (interactive explorer) · Technology (band) ·
     Products (showcase) · Resources (downloads) · Insights (carousel) · CTA.
   Content, relationships and links are unchanged — only presentation varies.
   Electronics vocabulary. */
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

  // ---- presentation builders (each renders the SAME data, varied layout) ----

  // Overview narrative beside the market's industry challenges (feature layout).
  function overviewSection(m){
    var left = '<div class="market-intro"><div class="market-eyebrow">Overview</div><h2>'+esc(m.name)+' adhesive solutions</h2><p>'+esc(m.intro||'')+'</p></div>';
    var ch = m.challenges || [];
    if(!ch.length) return sect('', left);
    var right = '<div><div class="market-eyebrow">Industry challenges</div><ul class="feature-list">'+ch.map(function(c){return '<li>'+esc(c)+'</li>';}).join('')+'</ul></div>';
    return sect('', '<div class="feature-layout">'+left+right+'</div>');
  }

  // Horizontal carousel of cards (segments / insights).
  function carouselSection(grey, eyebrow, title, itemsHtml, peritem){
    return '<section class="market-section'+(grey?' is-grey':'')+'">'+
      '<div class="carousel'+(peritem===3?' peritem-3':'')+'">'+
        '<div class="mx-head"><div><div class="market-eyebrow">'+esc(eyebrow)+'</div><h2>'+esc(title)+'</h2></div>'+
          '<div class="arrow-group"><button class="arrow-btn" type="button" data-dir="prev" aria-label="Previous">&#8249;</button><button class="arrow-btn" type="button" data-dir="next" aria-label="Next">&#8250;</button></div>'+
        '</div>'+
        '<div class="carousel-viewport"><div class="carousel-track">'+itemsHtml+'</div></div>'+
      '</div></section>';
  }

  // Interactive application explorer: vertical tab list + detail pane.
  function explorerSection(apps, m){
    apps = apps.slice(0, 8);
    var tabs = apps.map(function(a,i){
      return '<button class="appx-tab'+(i===0?' is-active':'')+'" type="button" data-i="'+i+'"><span>'+esc(a.name)+'</span>'+ARROW+'</button>';
    }).join('');
    var panels = apps.map(function(a,i){
      var fams = D.productFamiliesForApplication(a.id);
      var tags = fams.map(function(f){return '<a class="tag" href="'+esc(D.url.productFamily(f.id))+'">'+esc(f.name)+'</a>';}).join('');
      var bg = BG[i%BG.length];
      return '<div class="appx-panel'+(i===0?' is-active':'')+'" data-i="'+i+'">'+
        '<div class="appx-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/720x540/'+bg+'/9eb0d8?text=" alt="'+esc(a.name)+'" /></div>'+
        '<div class="appx-body"><h3>'+esc(a.name)+'</h3><p>'+esc(a.summary||'')+'</p>'+
        (tags?'<div class="tag-row">'+tags+'</div>':'')+
        '<a class="segment-card-link" href="'+esc(D.url.application(a.id))+'">Explore application '+ARROW+'</a></div></div>';
    }).join('');
    return sect('', '<div class="market-eyebrow">Applications</div><h2>Key applications in '+esc(m.name)+'</h2>'+
      '<div class="appx"><div class="appx-list" role="tablist">'+tabs+'</div><div class="appx-panels">'+panels+'</div></div>');
  }

  // Technology band — adhesive technologies behind the market (spec-style cells).
  function techSection(techs, m, grey){
    var items = techs.slice(0, 6).map(function(t){
      return '<div class="tech-item"><div class="tech-cat">'+esc(t.category||'Technology')+'</div>'+
        '<h3 class="tech-name">'+esc(t.name)+'</h3><p class="tech-summary">'+esc(t.summary||'')+'</p>'+
        '<a class="tech-link" href="'+esc(D.url.technology(t.id))+'">Learn more '+ARROW+'</a></div>';
    }).join('');
    return sect(grey?'is-grey':'', '<div class="market-eyebrow">Technology</div><h2>Adhesive technologies behind '+esc(m.name)+'</h2><div class="tech-grid">'+items+'</div>');
  }

  // Product showcase — lead image beside a recommended-family rail.
  function showcaseSection(fams, m, grey){
    var items = fams.slice(0, 6).map(function(f){
      return '<a class="showcase-item" href="'+esc(D.url.productFamily(f.id))+'"><span class="showcase-item-text"><span class="showcase-item-name">'+esc(f.name)+'</span>'+(f.note?'<span class="showcase-item-note">'+esc(f.note)+'</span>':'')+'</span>'+ARROW+'</a>';
    }).join('');
    return sect(grey?'is-grey':'', '<div class="market-eyebrow">Products</div><h2>Recommended product families</h2>'+
      '<div class="showcase"><div class="showcase-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/720x540/'+BG[2]+'/9eb0d8?text=" alt="'+esc(m.name)+' product families" /></div>'+
      '<div class="showcase-list">'+items+'<a class="outline-btn" href="products.html">View all products</a></div></div>');
  }

  function ctaSection(m, heroBg, nm){
    return '<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/'+heroBg+'/8ea0c8?text=" alt="'+esc(m.name)+' application engineering support" /></div>'+
      '<div class="cta-body"><h2>'+esc(m.name)+' helpdesk</h2><p>Talk to DEON’s application engineers about bonding, sealing, insulation and protection challenges in '+esc(nm)+' — samples, datasheets and on-site support.</p>'+
      '<a href="contact.html?market='+encodeURIComponent(m.id)+'" class="cta-btn">Get in touch</a></div></div>';
  }

  // ---- interaction wiring ----
  function initCarousels(root){
    root.querySelectorAll('.carousel').forEach(function(car){
      var vp = car.querySelector('.carousel-viewport');
      var track = car.querySelector('.carousel-track');
      if(!vp || !track) return;
      var items = [].slice.call(track.children);
      if(!items.length) return;
      var prev = car.querySelector('[data-dir="prev"]');
      var next = car.querySelector('[data-dir="next"]');
      var idx = 0;
      function gap(){ return parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24; }
      function unit(){ return items[0].getBoundingClientRect().width + gap(); }
      function perView(){ return Math.max(1, Math.round((vp.getBoundingClientRect().width + gap()) / unit())); }
      function maxIdx(){ return Math.max(0, items.length - perView()); }
      function update(){ idx = Math.min(idx, maxIdx()); track.style.transform = 'translateX(-' + (idx * unit()) + 'px)'; if(prev) prev.disabled = idx <= 0; if(next) next.disabled = idx >= maxIdx(); }
      if(next) next.addEventListener('click', function(){ idx = Math.min(maxIdx(), idx + perView()); update(); });
      if(prev) prev.addEventListener('click', function(){ idx = Math.max(0, idx - perView()); update(); });
      window.addEventListener('resize', update);
      update();
    });
  }
  function initExplorers(root){
    root.querySelectorAll('.appx').forEach(function(ex){
      var tabs = [].slice.call(ex.querySelectorAll('.appx-tab'));
      var panels = [].slice.call(ex.querySelectorAll('.appx-panel'));
      tabs.forEach(function(tab){
        tab.addEventListener('click', function(){
          var i = tab.getAttribute('data-i');
          tabs.forEach(function(t){ t.classList.toggle('is-active', t === tab); });
          panels.forEach(function(p){ p.classList.toggle('is-active', p.getAttribute('data-i') === i); });
        });
      });
    });
  }

  function renderIndex(){
    // Home = Markets landing: the Industry homepage IS the markets landing page
    // (single canonical experience). market.html with no ?m= resolves there.
    location.replace('index.html');
  }

  function render(){
    var root=document.getElementById('deon-main');
    var id=qs('m'); var m=id&&D.market(id);
    if(!m){ renderIndex(); return; }
    if(m.special && m.page && m.page.indexOf('market.html')<0){ location.replace(m.page); return; }

    document.title=m.name+' | DEON Markets';
    var nm=m.name.toLowerCase();
    var segs=D.segmentsForMarket(m.id);
    var apps=D.applicationsForMarket(m.id);
    var fams=uniqBy([].concat.apply([],apps.map(function(a){return D.productFamiliesForApplication(a.id);})));
    var techs=D.technologiesForMarket(m.id);
    var resources=D.resourcesForMarket(m.id).slice(0,6);
    var insights=D.insightsForMarket(m.id).slice(0,8);
    var heroBg=BG[D.markets().findIndex(function(x){return x.id===m.id;})%BG.length];

    var out='<div class="context-bar">'+D.trail.market(m.id)+'</div>'+
      '<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/'+heroBg+'/8ea0c8?text=" alt="'+esc(m.name)+' market" /></div>'+
      '<div class="hero-card"><h1>'+esc(m.tagline||m.name)+'</h1></div></div>';

    // 1 · Overview + challenges (explanation)
    out+=overviewSection(m);
    // 2 · Segments (carousel — discovery)
    if(segs.length) out+=carouselSection(true,'Segments','Industry segments',
      segs.map(function(s,i){return '<div class="carousel-item">'+card(D.url.segment(s.id),BG[i%BG.length],s.name,s.summary,'View segment')+'</div>';}).join(''), 4);
    // 3 · Applications (interactive explorer)
    if(apps.length) out+=explorerSection(apps, m);
    // 4 · Technology band
    if(techs.length) out+=techSection(techs, m, true);
    // 5 · Products (showcase)
    if(fams.length) out+=showcaseSection(fams, m, false);
    // 6 · Resources (downloads)
    if(resources.length) out+=sect('is-grey','<div class="market-eyebrow">Resources</div><h2>'+esc(m.name)+' resources</h2><div class="download-grid">'+resources.map(dlItem).join('')+'</div>');
    // 7 · Insights (carousel — editorial)
    if(insights.length) out+=carouselSection(false,'Press & Insights','Related insights',
      insights.map(function(x,i){return '<div class="carousel-item">'+insightCard(x,BG[i%BG.length])+'</div>';}).join(''), 3);
    // 8 · Helpdesk (support)
    out+=ctaSection(m, heroBg, nm);

    root.innerHTML=out;
    initCarousels(root);
    initExplorers(root);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
