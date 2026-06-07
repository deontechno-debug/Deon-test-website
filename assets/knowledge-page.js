/* Knowledge Center renderer — electronics vocabulary. Generated from
   DEON_ARCH.knowledge: context bar + hero + a client-side filter, then one
   market-section per Knowledge category (download-grids from the catalog,
   FAQs as a flat accordion) + a contact CTA. Resources are read through the
   DEON data API (DEON.resourcesByCategory) — never raw arrays.
   [Content is placeholder; the taxonomy + relations are production.] */
(function () {
  'use strict';
  var D = window.DEON, ARCH = window.DEON_ARCH;
  var DLICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function sect(cls,id,inner){return '<section class="market-section'+(cls?' '+cls:'')+'"'+(id?' id="'+id+'"':'')+'>'+inner+'</section>';}
  function dlCard(href,title,sub,terms){
    return '<a href="'+esc(href)+'" class="download-card" data-kc-card data-kc-terms="'+esc(terms)+'">'+
      '<img class="download-thumb" src="https://placehold.co/264x184/dfe4ec/8ea0c8?text=" alt="" />'+
      '<div class="download-meta"><div class="download-title">'+esc(title)+'</div>'+
      '<div class="download-sub">'+esc(sub)+'</div>'+
      '<span class="download-action">Download '+DLICON+'</span></div></a>';
  }

  // FAQs render as a flat accordion (no catalog entries — these are evergreen).
  var FAQS = [
    ['Can I request free samples?', 'Yes. Use the contact form and select “Request a sample”. Our team will send relevant samples and datasheets for your application. [Placeholder copy.]'],
    ['Do you provide technical datasheets?', 'Every product family has supporting datasheets and selection guides, available in the Technical Datasheets section above or via a technical consultation.'],
    ['Is DEON a manufacturer or a reseller?', 'DEON is a manufacturer, coater, converter and OEM / private-label partner — not a reseller. We produce and convert adhesive tapes for series production.'],
    ['Can DEON develop custom or converted tapes?', 'Yes. DEON manufactures and converts adhesive tapes to custom sizes, shapes, constructions and printed cores for OEM and private-label programmes.'],
    ['What certifications do DEON tapes hold?', 'DEON products are supported by ISO 9001, ISO 14001, RoHS and REACH documentation, with UL flame ratings on selected constructions. See Certifications & Compliance above.'],
    ['Which industries does DEON serve?', 'DEON serves twelve industrial markets including Electronics, Automotive, Electrical, Packaging & Logistics, Transportation, Appliance, HVACR, Metal, Building Components and Renewable Energy.']
  ];

  function faqHTML(){
    return FAQS.map(function(q){
      var terms = (q[0] + ' ' + q[1]).toLowerCase();
      return '<div class="faq-item" data-kc-card data-kc-terms="'+esc(terms)+'">'+
        '<button class="faq-q" type="button">'+esc(q[0])+'<span class="fq-ico">+</span></button>'+
        '<div class="faq-a">'+esc(q[1])+'</div></div>';
    }).join('');
  }

  function categorySection(cat, grey){
    var id = ARCH.slug(cat.name);
    var head = '<div class="market-eyebrow">Knowledge Center</div><h2>'+esc(cat.name)+'</h2>';
    if (cat.name === 'FAQs') {
      return sect(grey?'is-grey':'', id, head +
        '<div class="market-intro"><p>Quick answers to the questions we hear most from engineering and procurement teams.</p></div>'+
        '<div class="faq-list" data-kc-group="'+esc(id)+'">'+faqHTML()+'</div>');
    }
    var items = D.resourcesByCategory(cat.name);
    var body = items.length
      ? '<div class="download-grid" data-kc-group="'+esc(id)+'">'+items.map(function(r){
          var sub = [r.type, r.format, r.size].filter(Boolean).join(' · ');
          var terms = (r.title + ' ' + (r.type||'') + ' ' + cat.name).toLowerCase();
          return dlCard(r.url || '#', r.title, sub, terms);
        }).join('')+'</div>'
      : '<div class="market-intro" data-kc-group="'+esc(id)+'"><p>Resources for this category are being prepared. [Placeholder.]</p></div>';
    return sect(grey?'is-grey':'', id, head + body);
  }

  function render(){
    var root = document.getElementById('deon-main');
    document.title = 'Knowledge Center | DEON';
    var cats = ARCH.knowledge;

    var out = '<div class="context-bar">'+D.trail.hub('Knowledge Center')+'</div>';
    out += '<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/2f3f5f/8ea0c8?text=" alt="DEON Knowledge Center" /></div>'+
      '<div class="hero-card"><h1>Knowledge Center</h1><p>Product catalogues, technical datasheets, certifications, application and industry guides, videos, case studies, white papers and downloads — everything you need to specify the right DEON solution.</p></div></div>';

    // Search / filter — filters resource and FAQ cards client-side.
    out += sect('', 'knowledge-search',
      '<div class="market-eyebrow">Find a resource</div><h2>Search the Knowledge Center</h2>'+
      '<div class="searchbox"><input type="search" id="kcFilter" placeholder="Search catalogues, datasheets, guides, FAQs…" aria-label="Search the Knowledge Center" autocomplete="off" /></div>'+
      '<p class="search-empty" id="kcNoResults" hidden>No resources match your search. Try a different term or browse the categories below.</p>');

    cats.forEach(function(cat, i){ out += categorySection(cat, i % 2 === 1); });

    out += '<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/3a4a6a/8ea0c8?text=" alt="DEON technical support" /></div><div class="cta-body"><h2>Can\'t find what you need?</h2><p>Our technical team will point you to the right catalogue, datasheet, guide or sample for your application. [Placeholder copy.]</p><a href="contact.html?topic=knowledge-center" class="cta-btn">Contact DEON</a></div></div>';

    root.innerHTML = out;
    wire(root);
  }

  function wire(root){
    // FAQ accordion.
    root.querySelectorAll('.faq-q').forEach(function(b){
      b.addEventListener('click', function(){ b.parentElement.classList.toggle('open'); });
    });

    // Client-side filter across all resource + FAQ cards.
    var input = root.querySelector('#kcFilter');
    var noResults = root.querySelector('#kcNoResults');
    var cards = [].slice.call(root.querySelectorAll('[data-kc-card]'));
    if (!input) return;
    input.addEventListener('input', function(){
      var q = input.value.trim().toLowerCase();
      var any = false;
      cards.forEach(function(c){
        var match = !q || (c.getAttribute('data-kc-terms') || '').indexOf(q) >= 0;
        c.style.display = match ? '' : 'none';
        if (match) any = true;
      });
      // Hide category sections that have no visible cards while filtering.
      root.querySelectorAll('section.market-section').forEach(function(s){
        if (s.id === 'knowledge-search') return;
        var group = s.querySelector('[data-kc-group]');
        if (!group) return;
        var visible = [].slice.call(group.querySelectorAll('[data-kc-card]')).some(function(c){ return c.style.display !== 'none'; });
        s.style.display = (q && !visible) ? 'none' : '';
      });
      if (noResults) noResults.hidden = !(q && !any);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
