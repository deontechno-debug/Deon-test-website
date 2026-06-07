/* Capabilities renderer — electronics vocabulary. First-class section
   (DEON differentiator). Generated from DEON_ARCH. Context bar + hero +
   capability overview grid + per-capability detail sections + CTA. */
(function () {
  'use strict';
  var D = window.DEON, ARCH = window.DEON_ARCH;
  var BG = ['3a4a6a','394970','445586','4f6090','2f3f5f','47588a','13284a'];
  var ARROW='<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  var DESC = {
    'Slitting': 'Precision slitting of master rolls into narrow widths to tight tolerances, in-house. Consistent edge quality and dimensional control across high volumes. [Placeholder copy.]',
    'Rewinding': 'Custom rewinding to specified roll lengths, core sizes and put-ups — matched to your application and dispensing equipment. [Placeholder copy.]',
    'Die Cutting': 'Rotary and flatbed die-cutting of tapes into application-ready parts, gaskets and shapes, supplied to the exact geometry each line requires. [Placeholder copy.]',
    'Lamination': 'Multi-layer lamination of films, foams, foils and adhesives into custom constructions engineered for the application. [Placeholder copy.]',
    'Sheet Conversion': 'Conversion of tapes into sheets, pads and kiss-cut parts for fast, accurate manual assembly. [Placeholder copy.]',
    'Custom Packaging': 'Private-label and custom packaging, kitting and labelling for OEM supply and distribution. [Placeholder copy.]',
    'OEM Programs': 'Dedicated OEM programs with qualification support, vendor-managed inventory and long-term supply agreements. [Placeholder copy.]'
  };

  function segCard(href,bg,title,caption){return '<a class="segment-card" href="'+esc(href)+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div><div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div><div class="segment-card-caption">'+esc(caption)+'</div><span class="segment-card-link">Learn more '+ARROW+'</span></div></a>';}

  function render(){
    var root=document.getElementById('deon-main');
    document.title='Capabilities | DEON';
    var caps=ARCH.capabilities;
    var out='<div class="context-bar">'+D.trail.hub('Capabilities')+'</div>';
    out+='<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/2f3f5f/8ea0c8?text=" alt="DEON manufacturing capabilities" /></div>'+
      '<div class="hero-card"><h1>Manufacturing &amp; converting capabilities</h1><p>DEON is a manufacturer and converter — not only a tape supplier. Our in-house slitting, die-cutting, lamination and conversion turn base tapes into application-ready parts, backed by dedicated OEM programs. [Placeholder copy.]</p></div></div>';
    out+='<section class="market-section"><div class="market-eyebrow">Capabilities</div><h2>What we do in-house</h2><div class="segment-grid">'+
      caps.map(function(c,i){return segCard(c.href,BG[i%BG.length],c.name,(DESC[c.name]||'').split('.')[0]+'.');}).join('')+'</div></section>';
    caps.forEach(function(c,i){
      out+='<section class="market-section'+(i%2? ' is-grey':'')+'" id="'+esc(ARCH.slug(c.name))+'"><div class="market-eyebrow">Capability</div><h2>'+esc(c.name)+'</h2>'+
        '<div class="market-intro"><p>'+esc(DESC[c.name]||'')+'</p></div></section>';
    });
    out+='<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/2f3f5f/8ea0c8?text=" alt="DEON converting support" /></div><div class="cta-body"><h2>Need a custom converted solution?</h2><p>Tell us about your part geometry, volumes and tolerances — our converting team will scope it with you. [Placeholder copy.]</p><a href="contact.html?topic=capabilities" class="cta-btn">Talk to DEON</a></div></div>';
    root.innerHTML=out;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
