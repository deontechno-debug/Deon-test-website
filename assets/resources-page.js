/* Resource Center renderer — Technical/Application Guides, Downloads,
   FAQs and Industry Insights. Guides/downloads come from the catalog;
   FAQs and insights are static (architecture over content depth). */
(function () {
  'use strict';
  var D = window.DEON;
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function section(cls,inner,id){return '<section class="section'+(cls?' '+cls:'')+'"'+(id?' id="'+id+'"':'')+'><div class="container">'+inner+'</div></section>';}
  var DOC='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';

  function resItem(title,sub,href){
    return '<li class="res-item"><span class="res-icon">'+DOC+'</span><span class="res-meta"><a href="'+esc(href||'#')+'"><span class="res-title">'+esc(title)+'</span></a><span class="res-sub">'+esc(sub)+'</span></span><a class="btn-outline" href="'+esc(href||'#')+'" style="padding:.5rem 1rem">Download</a></li>';
  }

  var FAQS=[
    ['Can I request free samples?','Yes. Use the contact form and select “Request a sample”. Our team will send relevant samples and datasheets for your application.'],
    ['Do you provide technical datasheets?','Every product family has supporting datasheets and selection guides. Request them from the Resource Center or via technical consultation.'],
    ['Which industries does DEON serve?','DEON serves eight industrial markets including Electronics, Automotive, Electrical & Insulation, Packaging, Appliance, HVAC & Metal, Construction and Renewable Energy.'],
    ['Can DEON develop custom or converted tapes?','Yes. DEON manufactures and converts adhesive tapes to custom sizes, shapes and constructions for OEM and series production.'],
    ['What certifications do DEON tapes hold?','DEON products are supported by ISO, RoHS and REACH compliance, with documentation available on request.']
  ];
  var INSIGHTS=[
    ['Article','Designing for residue-free rework in consumer devices','How stretch-release and low-residue tapes enable repairable, serviceable products.'],
    ['Trend','Thermal management in EV battery assembly','Balancing insulation, fixation and heat dissipation in higher-density packs.'],
    ['Sustainability','Bio-based and recyclable bonding','Where sustainable tape constructions are ready for industrial production today.']
  ];

  function render(){
    var root=document.getElementById('deon-main');
    document.title='Resource Center | DEON';
    var resources=D.raw.resources;
    var families=D.raw.productFamilies;

    var hero='<section class="page-hero"><div class="container">'+
      '<nav class="breadcrumb"><a href="index.html">Home</a><span class="sep">›</span><span class="current">Resource Center</span></nav>'+
      '<div class="eyebrow">Resource Center</div><h1>Guides, downloads &amp; insights</h1>'+
      '<p class="lead">Technical and application guidance to help you specify the right DEON solution — plus datasheets, FAQs and industry insights.</p></div></section>';

    var guides=section('','<div class="block-head"><div class="eyebrow">Technical &amp; application guides</div><h2>Guides</h2></div><ul class="res-list">'+
      resources.map(function(r){return resItem(r.title, r.type+' · '+r.format+' · '+r.size, r.url);}).join('')+'</ul>','guides');

    var downloads=section('section--grey','<div class="block-head"><div class="eyebrow">Downloads</div><h2>Product family datasheets</h2></div><ul class="res-list">'+
      families.slice(0,8).map(function(f){return resItem(f.name+' datasheet','Datasheet · PDF · '+D.url.productFamily(f.id), D.url.productFamily(f.id));}).join('')+'</ul>','downloads');

    var faqs=section('','<div class="block-head"><div class="eyebrow">FAQs</div><h2>Frequently asked questions</h2></div><div class="faq-list">'+
      FAQS.map(function(q){return '<details class="faq"><summary>'+esc(q[0])+'</summary><p>'+esc(q[1])+'</p></details>';}).join('')+'</div>','faqs');

    var insights=section('section--grey','<div class="block-head"><div class="eyebrow">Industry insights</div><h2>Insights</h2></div><div class="card-grid">'+
      INSIGHTS.map(function(i){return '<a class="ent-card" href="#"><span class="kicker">'+esc(i[0])+'</span><span class="t">'+esc(i[1])+'</span><span class="d">'+esc(i[2])+'</span><span class="more">Read more</span></a>';}).join('')+'</div>','insights');

    var cta='<section class="cta-band"><div class="container"><div><h2>Can\'t find what you need?</h2><p>Our technical team will point you to the right guide, datasheet or sample.</p></div><a class="btn" href="contact.html">Contact DEON</a></div></section>';

    root.innerHTML=hero+guides+downloads+faqs+insights+cta;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
