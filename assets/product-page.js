/* Product page renderer — electronics vocabulary. Reads ?p=<id>.
   Frozen Product template: Hero → Overview → Key Features (feature-list) →
   Technical Specifications (spec table) → Applications (segment-grid) →
   Markets Served (tag-row) → Certifications & Compliance → Downloads
   (download-grid) → Related Products (segment-grid) → CTA (cta-strip).
   Reads relationships through window.DEON only. Requires deon-data.js. */
(function () {
  'use strict';
  var D = window.DEON;
  var BG = ['3a4a6a','394970','445586','4f6090','2f3f5f','47588a','13284a','0e2a44'];
  var ARROW = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DLICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function cap(s){s=String(s==null?'':s);return s.charAt(0).toUpperCase()+s.slice(1);}
  function qs(k){return new URLSearchParams(location.search).get(k);}
  function hero(crumb,h1,intro,bg){return (crumb?'<div class="context-bar">'+crumb+'</div>':'')+'<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/'+bg+'/8ea0c8?text=" alt="'+esc(h1)+'" /></div><div class="hero-card"><h1>'+esc(h1)+'</h1><p>'+esc(intro)+'</p></div></div>';}
  function segCard(href,bg,title,caption,cta){return '<a class="segment-card" href="'+esc(href)+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div><div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div><div class="segment-card-caption">'+esc(caption)+'</div><span class="segment-card-link">'+esc(cta||'Read more')+' '+ARROW+'</span></div></a>';}
  function sect(cls,inner){return '<section class="market-section'+(cls?' '+cls:'')+'">'+inner+'</section>';}
  function dlCard(href,title,sub){return '<a href="'+esc(href)+'" class="download-card"><img class="download-thumb" src="https://placehold.co/264x184/dfe4ec/8ea0c8?text=" alt="" /><div class="download-meta"><div class="download-title">'+esc(title)+'</div><div class="download-sub">'+esc(sub)+'</div><span class="download-action">Download '+DLICON+'</span></div></a>';}
  // Clean two-column spec table reusing the product-database table primitives.
  function specTable(rows){
    var head='<div class="pdb-table" style="margin:0;border-top:1px solid #e4e4e4"><div class="pdb-thead" style="grid-template-columns:1fr 2fr"><div class="pdb-th">Property</div><div class="pdb-th">Value</div></div>';
    var body=rows.map(function(r){return '<div class="pdb-row" style="grid-template-columns:1fr 2fr"><div class="pdb-cell" data-label="Property" style="color:var(--text);font-weight:600">'+esc(r[0])+'</div><div class="pdb-cell" data-label="Value">'+esc(r[1])+'</div></div>';}).join('');
    return head+body+'</div>';
  }

  function renderIndex(root){
    document.title='Products | DEON';
    var fams=D.raw.productFamilies;
    root.innerHTML=hero(D.trail.hub('Products'),'DEON products','Browse the full DEON adhesive tape assortment by family, or use the product finder to filter by construction attributes.','2f3f5f')+
      sect('', '<div class="market-eyebrow">Products</div><h2>Product families</h2>'+
        '<div class="market-intro"><p>Select a family to see its product range, or open the full assortment on the products page.</p></div>'+
        '<div class="segment-grid">'+fams.map(function(f,i){return segCard(D.url.productFamily(f.id),BG[i%BG.length],f.name,f.note,'View family');}).join('')+
        '</div><div class="tag-row" style="margin-top:2rem"><a class="tag" href="'+esc(D.url.products())+'">View full assortment '+ARROW+'</a></div>');
  }

  function render(){
    var root=document.getElementById('deon-main');
    var id=qs('p'); var p=id&&D.product(id);
    if(!p){ renderIndex(root); return; }

    var f=D.familyForProduct(p.id);
    var related=D.relatedProducts(p.id);
    var apps=f?D.applicationsForFamily(f.id):[];
    // Markets served = union of marketsForApplication over those applications.
    var markets=[], seenM={};
    apps.forEach(function(a){ D.marketsForApplication(a.id).forEach(function(m){ if(m&&!seenM[m.id]){seenM[m.id]=1;markets.push(m);} }); });

    document.title=p.name+' | DEON Products';
    var heroBg=BG[(String(p.id).length)%BG.length];

    // 1. HERO
    var out=hero(D.trail.product(p.id), p.name, p.desc, heroBg);

    // 2. OVERVIEW
    out+=sect('', '<div class="market-eyebrow">'+(f?esc(f.name):'Product')+'</div><h2>Overview</h2>'+
      '<div class="market-intro"><p>'+esc(p.name)+' is '+esc(p.desc.toLowerCase())+
      (f?(', part of the DEON '+esc(f.name)+' family — '+esc(f.note.toLowerCase())+'.'):'.')+
      ' Manufactured and converted by DEON, it is supplied on rolls and die-cut to your required geometry for series production. [Placeholder overview — DEON technical copy to follow.]</p></div>');

    // 3. KEY FEATURES — derived from product attributes + family benefits
    var features=[];
    if(p.t!=null) features.push('Total thickness of '+p.t+' µm — engineered for the substrate and bond-line your process requires.');
    if(p.adhesive) features.push(cap(p.adhesive)+' adhesive system for reliable, repeatable performance.');
    if(p.backing&&p.backing!=='none') features.push(esc(p.backing)+' backing for dimensional stability and clean converting.');
    if(f) features.push('Family strength: '+f.note.toLowerCase()+'.');
    features.push('Available die-cut and converted to your exact geometry.');
    features.push('Backed by DEON application engineering and reliable availability.');
    out+=sect('is-grey', '<div class="feature-layout"><div><div class="market-eyebrow">Features</div><h2>Key features</h2>'+
      '<div class="market-intro"><p>Why engineers specify '+esc(p.name)+' — the properties that earn it a place on the line. [Placeholder copy.]</p></div></div>'+
      '<ul class="feature-list">'+features.map(function(c){return '<li>'+esc(c)+'</li>';}).join('')+'</ul></div>');

    // 4. TECHNICAL SPECIFICATIONS — clean spec table
    var specRows=[
      ['Total thickness', (p.t!=null?p.t+' µm':'—')],
      ['Adhesive', (p.adhesive?cap(p.adhesive):'—')],
      ['Backing', (p.backing&&p.backing!=='none'?p.backing:'No backing (transfer)')],
      ['Product family', (f?f.name:'—')]
    ];
    out+=sect('', '<div class="market-eyebrow">Specifications</div><h2>Technical specifications</h2>'+
      '<div class="market-intro"><p>Nominal construction values. Full datasheet figures and tolerances are available on request. [Placeholder data.]</p></div>'+
      specTable(specRows));

    // 5. APPLICATIONS — segment-grid → application pages
    if(apps.length){
      out+=sect('is-grey', '<div class="market-eyebrow">Applications</div><h2>Applications</h2>'+
        '<div class="market-intro"><p>Where '+esc(p.name)+' and its family are put to work.</p></div>'+
        '<div class="segment-grid">'+apps.map(function(a,i){return segCard(D.url.application(a.id),BG[i%BG.length],a.name,a.summary,'Explore');}).join('')+'</div>');
    }

    // 6. MARKETS SERVED — tag-row → market pages
    if(markets.length){
      out+=sect('', '<div class="market-eyebrow">Markets</div><h2>Markets served</h2>'+
        '<div class="market-intro"><p>The industries that rely on this product and its family.</p></div>'+
        '<div class="tag-row">'+markets.map(function(m){return '<a class="tag" href="'+esc(D.url.market(m.id))+'">'+esc(m.name)+'</a>';}).join('')+'</div>');
    }

    // 7. CERTIFICATIONS & COMPLIANCE
    var certs=['ISO 9001 — quality-managed manufacturing','RoHS compliant','REACH compliant'];
    out+=sect('is-grey', '<div class="feature-layout"><div><div class="market-eyebrow">Compliance</div><h2>Certifications &amp; compliance</h2>'+
      '<div class="market-intro"><p>DEON products are manufactured under a quality-managed system and supplied with the documentation your specification requires. [Placeholder — confirm per product.]</p></div></div>'+
      '<ul class="feature-list">'+certs.map(function(c){return '<li>'+esc(c)+'</li>';}).join('')+'</ul></div>');

    // 8. DOWNLOADS — download-grid
    out+=sect('', '<div class="market-eyebrow">Downloads</div><h2>Downloads</h2>'+
      '<div class="download-grid">'+
        dlCard('#','Technical Data Sheet — '+p.name,'PDF · [size] · [placeholder]')+
        dlCard('#','Safety Data Sheet — '+p.name,'PDF · [size] · [placeholder]')+
        (f?dlCard('#',f.name+' — family brochure','PDF · [size] · [placeholder]'):'')+
        dlCard('#','Declaration of compliance (RoHS / REACH)','PDF · [size] · [placeholder]')+
      '</div>');

    // 9. RELATED PRODUCTS — segment-grid → product pages
    if(related.length){
      out+=sect('is-grey', '<div class="market-eyebrow">Related</div><h2>Related products</h2>'+
        '<div class="market-intro"><p>Other constructions in the '+(f?esc(f.name):'same')+' family.</p></div>'+
        '<div class="segment-grid">'+related.map(function(r,i){return segCard(D.url.product(r.id),BG[i%BG.length],r.name,r.desc,'View product');}).join('')+'</div>');
    }

    // 10. CTA — request a sample
    out+='<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/'+heroBg+'/8ea0c8?text=" alt="DEON product samples and support" /></div>'+
      '<div class="cta-body"><h2>Request a sample of '+esc(p.name)+'</h2>'+
      '<p>Get samples, the full datasheet or a tailored recommendation from a DEON application engineer. [Placeholder copy.]</p>'+
      '<a href="contact.html?product='+encodeURIComponent(p.id)+'" class="cta-btn">Request a sample</a></div></div>';

    root.innerHTML=out;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
