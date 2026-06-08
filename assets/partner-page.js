/* Partner page renderer — single shared renderer for the two PARTNER markets
   (Industrial Converter Partners, OEM & Private Label Partners). Reads a market
   id from #deon-main[data-market] (or window.DEON_MARKET) and renders the
   special, segment-less market in the electronics vocabulary:
   context-bar (DEON.trail.market) → hero (full-bleed image + white card) →
   one alternating .market-section per market.sections[] → final .cta-strip.
   Requires deon-catalog.js + deon-data.js. */
(function () {
  'use strict';
  var D = window.DEON;
  var SEG_BG = ['3a4a6a', '394970', '445586', '4f6090', '2f3f5f', '47588a', '13284a', '0e2a44'];
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  function sect(cls, id, eyebrow, h2, body){
    return '<section class="market-section'+(cls?' '+cls:'')+'"'+(id?' id="'+esc(id)+'"':'')+'>'+
      (eyebrow?'<div class="market-eyebrow">'+esc(eyebrow)+'</div>':'')+
      '<h2>'+esc(h2)+'</h2>'+
      '<div class="market-intro"><p>'+esc(body)+'</p></div></section>';
  }

  function render(){
    var root=document.getElementById('deon-main');
    if(!root) return;
    var id=root.dataset.market || window.DEON_MARKET;
    var m=id && D.market(id);
    if(!m){ root.innerHTML='<section class="market-section"><h2>Partner market not found</h2></section>'; return; }

    document.title=m.name+' | DEON';
    var heroBg=SEG_BG[D.markets().findIndex(function(x){return x.id===m.id;})%SEG_BG.length] || '3a4a6a';
    var lead=m.intro || m.tagline;
    var sections=m.sections || [];

    // 1. CONTEXT BAR + HERO (full-bleed image + white card)
    var out='<div class="context-bar">'+D.trail.market(m.id)+'</div>'+
      '<div class="hero"><div class="hero-media lazy-loading-placeholder">'+
      '<img class="fade-in-loaded" src="https://placehold.co/1600x600/'+heroBg+'/8ea0c8?text=" alt="'+esc(m.name)+'" /></div>'+
      '<div class="hero-card"><h1>'+esc(m.name)+'</h1><p>'+esc(lead)+'</p></div></div>';

    // 2. ONE SECTION PER sections[] ENTRY (alternating grey bands)
    out += sections.map(function(s, i){
      var eyebrow = i===0 ? m.name : 'Capabilities';
      return sect(i%2?'is-grey':'', s.id, eyebrow, s.title, s.body);
    }).join('');

    // 3. FINAL CTA → contact.html
    out += '<div class="cta-strip"><div class="cta-img lazy-loading-placeholder">'+
      '<img class="fade-in-loaded" src="https://placehold.co/800x600/'+heroBg+'/8ea0c8?text=" alt="'+esc(m.name)+' partnership enquiries" /></div>'+
      '<div class="cta-body"><h2>Become a DEON partner</h2>'+
      '<p>Tell us about your program — formats, volumes and the constructions you need — and a DEON specialist will scope a partnership built around your business.</p>'+
      '<a href="contact.html?market='+encodeURIComponent(m.id)+'" class="cta-btn">Get in touch</a></div></div>';

    root.innerHTML=out;
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
