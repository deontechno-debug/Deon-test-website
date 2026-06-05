/* Products renderer — two modes from one template:
   ?family=<id> → product family page (overview, benefits, markets,
                  applications, related products, CTA)
   (no param)   → Products hub (all families + filterable SKU table)
   Requires deon-data.js. */
(function () {
  'use strict';
  var D = window.DEON;
  var ARROW = '<svg width="16" height="10" viewBox="0 0 24 16" fill="none" aria-hidden="true"><path d="M0 8H21M12 1L21 8L12 15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qs(k){return new URLSearchParams(location.search).get(k);}
  function uniqBy(a){var s=[],seen={};a.forEach(function(e){if(e&&!seen[e.id]){seen[e.id]=1;s.push(e);}});return s;}
  function card(href,kicker,title,desc,cta){return '<a class="ent-card" href="'+esc(href)+'">'+(kicker?'<span class="kicker">'+esc(kicker)+'</span>':'')+'<span class="t">'+esc(title)+'</span>'+(desc?'<span class="d">'+esc(desc)+'</span>':'')+'<span class="more">'+esc(cta||'View')+' '+ARROW+'</span></a>';}
  function section(cls,inner,id){return '<section class="section'+(cls?' '+cls:'')+'"'+(id?' id="'+id+'"':'')+'><div class="container">'+inner+'</div></section>';}

  // ----- Product family page -----
  function renderFamily(root, f){
    document.title = f.name + ' | DEON Products';
    var apps = D.applicationsForFamily(f.id);
    var markets = uniqBy([].concat.apply([], apps.map(function(a){return D.marketsForApplication(a.id);})));
    var products = D.productsForFamily(f.id);
    var benefits = [
      'Engineered for ' + f.note.toLowerCase() + '.',
      'Consistent, repeatable performance in series production.',
      'Backed by DEON application engineering and technical support.'
    ];

    var hero = '<section class="page-hero"><div class="container">'+
      '<nav class="breadcrumb"><a href="index.html">Home</a><span class="sep">›</span><a href="products.html">Products</a><span class="sep">›</span><span class="current">'+esc(f.name)+'</span></nav>'+
      '<div class="eyebrow">Product family</div><h1>'+esc(f.name)+'</h1><p class="lead">'+esc(f.note)+'.</p>'+
      '<div class="hero-cta"><a class="btn" href="contact.html?family='+encodeURIComponent(f.id)+'">Request a sample</a>'+
      '<a class="btn-outline" href="contact.html?family='+encodeURIComponent(f.id)+'">Get technical advice</a></div></div></section>';

    var overview = section('',
      '<div class="block-head"><div class="eyebrow">Overview</div><h2>About '+esc(f.name)+'</h2></div>'+
      '<p class="lead" style="max-width:860px">DEON '+esc(f.name)+' are '+esc(f.note.toLowerCase())+'. The family spans a range of thicknesses and constructions to match your substrate, process and performance needs. [Placeholder overview.]</p>'+
      '<div style="margin-top:1.5rem"><p class="block-sub">Key benefits</p><ul class="tick-list">'+benefits.map(function(b){return '<li>'+esc(b)+'</li>';}).join('')+'</ul></div>');

    var mk = markets.length? section('section--grey',
      '<div class="block-head"><div class="eyebrow">Markets</div><h2>Where it\'s used</h2></div><div class="chip-row">'+
      markets.map(function(m){return '<a class="chip" href="'+esc(D.url.market(m.id))+'">'+esc(m.name)+'</a>';}).join('')+'</div>') : '';

    var ap = apps.length? section('',
      '<div class="block-head"><div class="eyebrow">Applications</div><h2>Applications</h2></div><div class="card-grid">'+
      apps.map(function(a){return card(D.url.application(a.id),'Application',a.name,a.summary,'Explore');}).join('')+'</div>') : '';

    var prod = products.length? section('section--grey',
      '<div class="block-head"><div class="eyebrow">Related products</div><h2>Products in this family</h2></div>'+
      '<div class="ptable"><div class="ptable-head"><span>Product</span><span>Thickness</span><span>Adhesive</span><span>Backing</span></div>'+
      products.map(function(p){return '<div class="ptable-row"><span class="pt-name">'+esc(p.name)+'<small>'+esc(p.desc)+'</small></span><span>'+p.t+' µm</span><span>'+esc(p.adhesive)+'</span><span>'+esc(p.backing)+'</span></div>';}).join('')+
      '</div>') : section('section--grey','<p class="lead">Detailed product data for this family is being added.</p>');

    var cta = '<section class="cta-band"><div class="container"><div><h2>Need '+esc(f.name.toLowerCase())+'?</h2><p>Request samples, datasheets or a tailored recommendation from DEON.</p></div><a class="btn" href="contact.html?family='+encodeURIComponent(f.id)+'">Contact DEON</a></div></section>';

    root.innerHTML = hero+overview+mk+ap+prod+cta;
  }

  // ----- Products hub -----
  function renderHub(root){
    document.title = 'Products | DEON';
    var fams = D.raw.productFamilies, products = D.raw.products;

    var hero = '<section class="page-hero"><div class="container">'+
      '<nav class="breadcrumb"><a href="index.html">Home</a><span class="sep">›</span><span class="current">Products</span></nav>'+
      '<div class="eyebrow">Products</div><h1>DEON product families</h1>'+
      '<p class="lead">Browse DEON\'s industrial adhesive tape families, or search the full assortment below. Every product maps to the applications and markets it serves.</p></div></section>';

    var famGrid = section('',
      '<div class="block-head"><h2>Product families</h2></div><div class="card-grid">'+
      fams.map(function(f){return card(D.url.productFamily(f.id),'Product family',f.name,f.note,'View family');}).join('')+'</div>');

    var table = section('section--grey',
      '<div class="block-head"><h2>Full product assortment</h2></div>'+
      '<input id="pfilter" class="pfilter" type="search" placeholder="Filter '+products.length+' products by name, adhesive or backing…" aria-label="Filter products">'+
      '<div class="ptable" id="ptable"><div class="ptable-head"><span>Product</span><span>Family</span><span>Thickness</span><span>Adhesive</span></div>'+
      products.map(function(p){var fam=D.productFamily(p.familyId);return '<div class="ptable-row" data-s="'+esc((p.name+' '+p.adhesive+' '+p.backing+' '+(fam?fam.name:'')).toLowerCase())+'">'+
        '<span class="pt-name">'+esc(p.name)+'<small>'+esc(p.desc)+'</small></span>'+
        '<span>'+(fam?'<a href="'+esc(D.url.productFamily(fam.id))+'">'+esc(fam.name)+'</a>':'')+'</span>'+
        '<span>'+p.t+' µm</span><span>'+esc(p.adhesive)+'</span></div>';}).join('')+
      '</div>');

    var cta='<section class="cta-band"><div class="container"><div><h2>Not sure which product fits?</h2><p>Send your application details and DEON will recommend the right family and SKU.</p></div><a class="btn" href="contact.html">Request a recommendation</a></div></section>';
    root.innerHTML = hero+famGrid+table+cta;

    var inp=document.getElementById('pfilter'), rows=[].slice.call(document.querySelectorAll('#ptable .ptable-row'));
    if(inp) inp.addEventListener('input',function(){var q=inp.value.trim().toLowerCase();rows.forEach(function(r){r.style.display=(!q||r.dataset.s.indexOf(q)>=0)?'':'none';});});
  }

  function render(){
    var root=document.getElementById('deon-main');
    var fid=qs('family');
    var f=fid&&D.productFamily(fid);
    if(f) renderFamily(root,f); else renderHub(root);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
