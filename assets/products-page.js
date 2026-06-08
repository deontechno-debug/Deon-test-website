/* Products renderer — electronics vocabulary. Hub (families segment-grid +
   full product finder) and product family pages (?family=) with overview,
   benefits, markets, applications, finder, CTA. Uses the shared ProductFinder. */
(function () {
  'use strict';
  var D = window.DEON;
  var BG = ['3a4a6a','394970','445586','4f6090','2f3f5f','47588a','13284a','0e2a44'];
  var ARROW='<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qs(k){return new URLSearchParams(location.search).get(k);}
  function uniqBy(a){var s=[],seen={};a.forEach(function(e){if(e&&!seen[e.id]){seen[e.id]=1;s.push(e);}});return s;}
  function pmap(arr,href){return arr.map(function(p){return {name:p.name,t:p.t,adhesive:p.adhesive,backing:p.backing,desc:p.desc,href:href?href(p):'#'};});}
  function hero(crumb,h1,intro,bg){return (crumb?'<div class="context-bar">'+crumb+'</div>':'')+'<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/'+bg+'/8ea0c8?text=" alt="'+esc(h1)+'" /></div><div class="hero-card"><h1>'+esc(h1)+'</h1><p>'+esc(intro)+'</p></div></div>';}
  function segCard(href,bg,title,caption,cta){return '<a class="segment-card" href="'+esc(href)+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div><div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div><div class="segment-card-caption">'+esc(caption)+'</div><span class="segment-card-link">'+esc(cta||'Read more')+' '+ARROW+'</span></div></a>';}
  function sect(cls,inner){return '<section class="market-section'+(cls?' '+cls:'')+'">'+inner+'</section>';}
  function finder(el,products,hrefFn){ if(window.ProductFinder&&el) window.ProductFinder.mount(el, pmap(products,hrefFn)); }
  var DLICON='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/></svg>';
  function dlItem(r){return '<a href="'+esc(r.url||'#')+'" class="download-card"><img class="download-thumb" src="https://placehold.co/264x184/dfe4ec/8ea0c8?text=" alt="" /><div class="download-meta"><div class="download-title">'+esc(r.title)+'</div><div class="download-sub">'+esc([r.category,r.format,r.size].filter(Boolean).join(" · "))+'</div><span class="download-action">View '+DLICON+'</span></div></a>';}

  function renderFamily(root,f){
    document.title=f.name+' | DEON Products';
    var apps=D.applicationsForFamily(f.id);
    var markets=uniqBy([].concat.apply([],apps.map(function(a){return D.marketsForApplication(a.id);})));
    var products=D.productsForFamily(f.id);
    var techs=uniqBy([].concat.apply([],apps.map(function(a){return D.technologiesForApplication(a.id);})));
    var resources=uniqBy([].concat.apply([],apps.map(function(a){return D.resourcesForApplication(a.id);}))).slice(0,6);
    var benefits=(f.benefits&&f.benefits.length)?f.benefits:['Engineered for '+f.note.toLowerCase()+'.','Consistent, repeatable performance in series production.','Available die-cut and converted to your geometry.','Backed by DEON application engineering and support.'];

    var out=hero(D.trail.productFamily(f.id),f.name,f.note+'.','445586');
    out+=sect('', '<div class="feature-layout"><div><div class="market-eyebrow">Product family</div><h2>About '+esc(f.name)+'</h2>'+
      '<div class="market-intro"><p>'+esc(f.overview||('DEON '+f.name+' are '+f.note.toLowerCase()+'. The family spans a range of thicknesses and constructions to match your substrate, process and performance needs.'))+'</p></div></div>'+
      '<ul class="feature-list">'+benefits.map(function(b){return '<li>'+esc(b)+'</li>';}).join('')+'</ul></div>');
    if(markets.length) out+=sect('is-grey', '<div class="market-eyebrow">Markets</div><h2>Where it\'s used</h2><div class="tag-row">'+markets.map(function(m){return '<a class="tag" href="'+esc(D.url.market(m.id))+'">'+esc(m.name)+'</a>';}).join('')+'</div>');
    if(apps.length) out+=sect('', '<div class="market-eyebrow">Applications</div><h2>Applications</h2><div class="segment-grid">'+apps.map(function(a,i){return segCard(D.url.application(a.id),BG[i%BG.length],a.name,a.summary,'Explore');}).join('')+'</div>');
    out+=sect('is-grey', '<div class="market-eyebrow">Product range</div><h2>Products in this family</h2>'+(products.length?'<div data-family-finder></div>':'<div class="market-intro"><p>Detailed product data for this family is being added.</p></div>'));
    if(techs.length) out+=sect('', '<div class="market-eyebrow">Technologies &amp; materials</div><h2>Related technologies</h2><div class="segment-grid">'+techs.map(function(t,i){return segCard("manufacturing-technology.html#"+esc(t.id),BG[i%BG.length],t.name,t.summary,"Learn more");}).join('')+'</div>');
    if(resources.length) out+=sect('is-grey', '<div class="market-eyebrow">Downloads</div><h2>Downloads &amp; datasheets</h2><div class="download-grid">'+resources.map(dlItem).join('')+'</div>');
    out+='<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/445586/8ea0c8?text=" alt="DEON product support" /></div><div class="cta-body"><h2>Need '+esc(f.name.toLowerCase())+'?</h2><p>Request samples, datasheets or a tailored recommendation from DEON.</p><a href="contact.html?family='+encodeURIComponent(f.id)+'" class="cta-btn">Request a sample</a></div></div>';
    root.innerHTML=out;
    if(products.length) finder(root.querySelector('[data-family-finder]'), products);
  }

  function renderHub(root){
    document.title='Products | DEON';
    var fams=D.raw.productFamilies, products=D.raw.products;
    var out=hero(D.trail.hub('Products'),'DEON product families','Industrial adhesive tape families and the full assortment — every product mapped to the applications and markets it serves.','2f3f5f');
    out+=sect('', '<div class="market-eyebrow">Products</div><h2>Product families</h2><div class="segment-grid">'+fams.map(function(f,i){return segCard(D.url.productFamily(f.id),BG[i%BG.length],f.name,f.note,'View family');}).join('')+'</div>');
    out+=sect('is-grey', '<div class="market-eyebrow">Product assortment</div><h2>Full product assortment</h2><div class="market-intro"><p>Filter the complete DEON assortment by construction attributes to find the right solution.</p></div><div data-hub-finder></div>');
    root.innerHTML=out;
    finder(root.querySelector('[data-hub-finder]'), products, function(p){return D.url.productFamily(p.familyId);});
  }

  function render(){
    var root=document.getElementById('deon-main');
    var fid=qs('family'); var f=fid&&D.productFamily(fid);
    if(f) renderFamily(root,f); else renderHub(root);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
