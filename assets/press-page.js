/* Press & Insights renderer — electronics vocabulary, catalog-driven.
   Context bar (hub crumb) + hero, then one market-section per Press
   category in DEON_ARCH.press, each rendering DEON.insightsByCategory()
   as a segment-grid of insight cards. Ends with a contact cta-strip.
   [Content is placeholder; architecture + relations are production.] */
(function () {
  'use strict';
  var D = window.DEON, ARCH = window.DEON_ARCH;
  var BG = ['3a4a6a', '394970', '445586', '4f6090', '2f3f5f', '47588a', '13284a', '0e2a44'];
  var ARROW = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function fmtDate(d){
    if(!d) return '';
    var t = new Date(d);
    if(isNaN(t)) return String(d);
    return t.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
  }

  function sect(cls,inner,id){return '<section class="market-section'+(cls?' '+cls:'')+'"'+(id?' id="'+esc(id)+'"':'')+'>'+inner+'</section>';}

  // Insight card — image-top segment-card with a category eyebrow + date.
  function insightCard(insight,bg){
    var href = insight.url && insight.url !== '#' ? insight.url : '#';
    var meta = [insight.category, fmtDate(insight.date)].filter(Boolean).join(' · ');
    return '<a class="segment-card" href="'+esc(href)+'">'+
        '<div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(insight.title)+'" /></div>'+
        '<div class="segment-card-body">'+
          '<div class="market-eyebrow" style="margin-bottom:.4rem">'+esc(meta)+'</div>'+
          '<div class="segment-card-title">'+esc(insight.title)+'</div>'+
          (insight.excerpt ? '<div class="segment-card-caption">'+esc(insight.excerpt)+'</div>' : '')+
          '<span class="segment-card-link">Read more '+ARROW+'</span>'+
        '</div></a>';
  }

  function render(){
    var root = document.getElementById('deon-main');
    document.title = 'Press & Insights | DEON';

    var out = '<div class="context-bar">'+D.trail.hub('Press & Insights')+'</div>'+
      '<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/394970/8ea0c8?text=" alt="DEON Press & Insights" /></div>'+
        '<div class="hero-card"><h1>Press &amp; Insights</h1>'+
        '<p>Industry insights, application stories, product updates, company news and events from DEON. [Placeholder content.]</p></div></div>';

    var bi = 0;
    (ARCH.press || []).forEach(function (cat, i) {
      var items = D.insightsByCategory(cat.name) || [];
      if (!items.length) return;
      var grid = '<div class="segment-grid">' + items.map(function (x) {
        return insightCard(x, BG[bi++ % BG.length]);
      }).join('') + '</div>';
      out += sect(i % 2 ? 'is-grey' : '',
        '<div class="market-eyebrow">'+esc(cat.name)+'</div><h2>'+esc(cat.name)+'</h2>'+
        '<div class="market-intro"><p>The latest '+esc(cat.name.toLowerCase())+' from across the DEON ecosystem. [Placeholder copy.]</p></div>'+
        grid,
        ARCH.slug(cat.name));
    });

    out += '<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/394970/8ea0c8?text=" alt="DEON press contact" /></div>'+
      '<div class="cta-body"><h2>Press &amp; media enquiries</h2>'+
      '<p>For interviews, assets or technical commentary, get in touch with the DEON team. [Placeholder copy.]</p>'+
      '<a href="contact.html?topic=press" class="cta-btn">Contact us</a></div></div>';

    root.innerHTML = out;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
