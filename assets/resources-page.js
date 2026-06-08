/* Resource Center renderer — electronics vocabulary. Guides/downloads as
   download-grids, FAQs as flat accordion, insights as segment-grid. */
(function () {
  'use strict';
  var D = window.DEON;
  var BG=['3a4a6a','394970','445586','4f6090','2f3f5f','47588a'];
  var ARROW='<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DLICON='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function sect(cls,id,inner){return '<section class="market-section'+(cls?' '+cls:'')+'"'+(id?' id="'+id+'"':'')+'>'+inner+'</section>';}
  function dlCard(href,title,sub){return '<a href="'+esc(href)+'" class="download-card"><img class="download-thumb" src="https://placehold.co/264x184/dfe4ec/8ea0c8?text=" alt="" /><div class="download-meta"><div class="download-title">'+esc(title)+'</div><div class="download-sub">'+esc(sub)+'</div><span class="download-action">Download '+DLICON+'</span></div></a>';}
  function segCard(href,bg,kick,title,caption){return '<a class="segment-card" href="'+esc(href)+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div><div class="segment-card-body"><div class="market-eyebrow" style="margin-bottom:.4rem">'+esc(kick)+'</div><div class="segment-card-title">'+esc(title)+'</div><div class="segment-card-caption">'+esc(caption)+'</div><span class="segment-card-link">Read more '+ARROW+'</span></div></a>';}

  var FAQS=[
    ['Can I request free samples?','Yes. Use the contact form and select “Request a sample”. Our team will send relevant samples and datasheets for your application.'],
    ['Do you provide technical datasheets?','Every product family has supporting datasheets and selection guides. Request them from the Resource Center or via a technical consultation.'],
    ['Which industries does DEON serve?','DEON serves eight industrial markets: Electronics, Automotive, Electrical & Insulation, Packaging, Appliance, HVAC & Metal, Construction and Renewable Energy.'],
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
    var resources=D.raw.resources, families=D.raw.productFamilies;
    var out='<div class="context-bar">'+D.trail.hub('Resource Center')+'</div><div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/2f3f5f/8ea0c8?text=" alt="DEON Resource Center" /></div><div class="hero-card"><h1>Guides, downloads &amp; insights</h1><p>Technical and application guidance to help you specify the right DEON solution — plus datasheets, FAQs and industry insights.</p></div></div>';

    out+=sect('','guides', '<div class="market-eyebrow">Technical &amp; application guides</div><h2>Guides</h2><div class="download-grid">'+resources.map(function(r){return dlCard(r.url||'#',r.title,r.type+' · '+r.format+' · '+r.size);}).join('')+'</div>');
    out+=sect('is-grey','downloads', '<div class="market-eyebrow">Downloads</div><h2>Product family datasheets</h2><div class="download-grid">'+families.slice(0,8).map(function(f){return dlCard(D.url.productFamily(f.id),f.name+' datasheet','Datasheet · PDF · [size]');}).join('')+'</div>');
    out+=sect('','faqs', '<div class="market-eyebrow">FAQs</div><h2>Frequently asked questions</h2><div class="faq-list">'+FAQS.map(function(q){return '<div class="faq-item"><button class="faq-q" type="button">'+esc(q[0])+'<span class="fq-ico">+</span></button><div class="faq-a">'+esc(q[1])+'</div></div>';}).join('')+'</div>');
    out+=sect('is-grey','insights', '<div class="market-eyebrow">Industry insights</div><h2>Insights</h2><div class="segment-grid">'+INSIGHTS.map(function(it,i){return segCard('#',BG[i%BG.length],it[0],it[1],it[2]);}).join('')+'</div>');
    out+='<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/3a4a6a/8ea0c8?text=" alt="DEON technical support" /></div><div class="cta-body"><h2>Can\'t find what you need?</h2><p>Our technical team will point you to the right guide, datasheet or sample.</p><a href="contact.html" class="cta-btn">Contact DEON</a></div></div>';

    root.innerHTML=out;
    document.querySelectorAll('.faq-q').forEach(function(b){b.addEventListener('click',function(){b.parentElement.classList.toggle('open');});});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
