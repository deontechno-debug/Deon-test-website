/* About DEON renderer — electronics vocabulary. Context bar + hero, then a
   market-section per item in DEON_ARCH.about (id = slug): Company Overview,
   Our Story, Leadership, Quality & Certifications, Locations. The
   "Manufacturing & Technology" item's body is SKIPPED — instead a prominent
   feature card/CTA links to manufacturing-technology.html. Ends with a CTA.
   [Content is credible industrial placeholder; architecture is production.] */
(function () {
  'use strict';
  var D = window.DEON, ARCH = window.DEON_ARCH;
  var BG = ['3a4a6a', '394970', '445586', '4f6090', '2f3f5f', '47588a', '13284a', '0e2a44'];
  var ARROW = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  function sect(id, cls, inner){return '<section class="market-section'+(cls?' '+cls:'')+'"'+(id?' id="'+esc(id)+'"':'')+'>'+inner+'</section>';}
  function intro(paras){return '<div class="market-intro">'+paras.map(function(p){return '<p>'+p+'</p>';}).join('')+'</div>';}
  function segCard(href, bg, title, caption, cta){
    return '<a class="segment-card" href="'+esc(href)+'">'+
      '<div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div>'+
      '<div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div>'+
      '<div class="segment-card-caption">'+esc(caption)+'</div>'+
      '<span class="segment-card-link">'+esc(cta||'Read more')+' '+ARROW+'</span></div></a>';
  }

  // Body builders keyed by section name. "Manufacturing & Technology" is omitted
  // on purpose (handled as a CTA below). Each returns the inner HTML for a section.
  var BODIES = {
    'Company Overview': function (id) {
      return sect(id, '', '<div class="market-eyebrow">About DEON</div><h2>Company overview</h2>'+
        intro([
          'DEON is a manufacturer, coater and converter of pressure-sensitive adhesive tapes for industry. Founded in 2004, we supply bonding, sealing, insulating, masking and surface-protection tapes to OEMs, tier suppliers and industrial converters worldwide. [Placeholder copy.]',
          'From base-tape formulation through coating, lamination, slitting and die-cutting, we control the full value chain — and supply application-ready parts to the exact geometry each line requires. The result is a single, accountable source for high-performance tapes, backed by in-house application engineering. [Placeholder copy.]'
        ])+
        '<div class="feature-layout" style="margin-top:1rem"><div>'+
          '<div class="market-eyebrow">At a glance</div><h2 style="font-size:28px;line-height:34px">A manufacturer, not a reseller</h2></div>'+
          '<ul class="feature-list">'+
            ['Founded 2004 — two decades of tape manufacturing',
             '3 manufacturing and converting plants',
             '40,000+ tonnes annual coating capacity',
             '12 product families across 10 industrial markets',
             'Supply to 30+ countries',
             'In-house R&D, application engineering and converting',
             '500+ employees across operations and commercial',
             'ISO 9001, ISO 14001, IATF 16949 certified'
            ].map(function(f){return '<li>'+esc(f)+'</li>';}).join('')+
          '</ul></div>');
    },

    'Our Story': function (id) {
      return sect(id, 'is-grey', '<div class="market-eyebrow">Our story</div><h2>Our story</h2>'+
        intro([
          'DEON began in 2004 with a single coating line and a simple conviction: industrial customers deserve a tape supplier who actually makes the product. We started by supplying electrical and packaging tapes to regional manufacturers, and grew by saying yes to the applications others found too demanding. [Placeholder copy.]',
          'Through the 2010s we invested in solvent and hot-melt coating, added high-precision converting, and built an in-house lab so we could formulate to a customer brief rather than resell a catalogue. Today DEON serves automotive, electronics, renewable-energy and appliance OEMs alongside our long-standing converter partners. [Placeholder copy.]',
          'The thread has never changed: control the chemistry, control the conversion, and stand behind every roll. That is what lets us solve problems other suppliers pass on. [Placeholder copy.]'
        ]));
    },

    'Leadership': function (id) {
      var leaders = [
        { name: 'A. Sharma',  role: 'Chief Executive Officer',         bio: 'Two decades in specialty chemicals and industrial manufacturing; founded DEON in 2004 and leads long-term strategy and growth.' },
        { name: 'R. Mehta',   role: 'Chief Operating Officer',          bio: 'Runs coating, converting and supply across all plants, with a focus on capacity, OEE and on-time delivery.' },
        { name: 'S. Iyer',    role: 'Head of R&D and Innovation',       bio: 'Leads adhesive formulation, backing development and the application lab; holds several PSA process patents.' },
        { name: 'P. Nair',    role: 'Head of Quality and Compliance',   bio: 'Owns the quality management system, customer audits and certifications including IATF 16949 and ISO standards.' },
        { name: 'K. Desai',   role: 'Chief Commercial Officer',         bio: 'Directs global sales, key accounts and the OEM/private-label and converter partner programmes.' },
        { name: 'M. Rao',     role: 'Head of People and Safety',        bio: 'Builds the team and the safety-first culture across manufacturing, engineering and commercial functions.' }
      ];
      return sect(id, '', '<div class="market-eyebrow">Leadership</div><h2>Leadership team</h2>'+
        intro(['The people accountable for DEON\'s products, plants and partnerships. [Placeholder bios.]'])+
        '<div class="segment-grid">'+leaders.map(function(l,i){
          return segCard('about.html#leadership', BG[i%BG.length], l.name, l.role+' — '+l.bio, 'About');
        }).join('')+'</div>');
    },

    'Quality & Certifications': function (id) {
      return sect(id, 'is-grey', '<div class="feature-layout"><div>'+
        '<div class="market-eyebrow">Quality &amp; certifications</div><h2>Quality and certifications</h2>'+
        intro([
          'Quality is built into the line, not inspected in at the end. Every batch is traceable from raw material to finished roll, with statistical process control on coating weight, adhesion and dimensions. [Placeholder copy.]',
          'Our products and processes are certified and tested to recognised international standards, and we support customer and third-party audits on request. [Placeholder copy.]'
        ])+'</div>'+
        '<ul class="feature-list">'+
          ['ISO 9001 — Quality management',
           'ISO 14001 — Environmental management',
           'IATF 16949 — Automotive quality',
           'RoHS compliant constructions',
           'REACH compliant materials',
           'UL-recognised tape options',
           'Halogen-free / flame-retardant grades',
           'Full batch traceability and SPC'
          ].map(function(f){return '<li>'+esc(f)+'</li>';}).join('')+
        '</ul></div>');
    },

    'Locations': function (id) {
      var locations = [
        { city: 'Pune, India',     role: 'Headquarters · Coating & Converting (Plant 1)', desc: 'Corporate HQ, primary coating lines, innovation lab and central logistics.' },
        { city: 'Pune, India',     role: 'Converting (Plant 2)',                           desc: 'High-precision slitting, die-cutting and rewinding for application-ready parts.' },
        { city: 'Chennai, India',  role: 'Coating & Distribution (Plant 3)',               desc: 'Southern coating capacity and a regional distribution hub.' },
        { city: 'Mumbai, India',   role: 'Commercial Office',                              desc: 'Sales, key accounts and customer technical support.' },
        { city: 'Frankfurt, Germany', role: 'Europe Sales & Warehouse',                    desc: 'European commercial team and stocking warehouse for EU customers.' },
        { city: 'Singapore',       role: 'APAC Sales Office',                              desc: 'Regional sales and partner support across Asia-Pacific.' }
      ];
      return sect(id, '', '<div class="market-eyebrow">Locations</div><h2>Locations</h2>'+
        intro(['Manufacturing, converting and commercial sites supplying customers in 30+ countries. [Placeholder locations.]'])+
        '<div class="segment-grid">'+locations.map(function(l,i){
          return segCard('contact.html?topic=locations', BG[i%BG.length], l.city, l.role+' — '+l.desc, 'Contact');
        }).join('')+'</div>');
    }
  };

  // Prominent CTA replacing the Manufacturing & Technology body.
  function manufacturingCta(id, href) {
    return sect(id, 'is-grey', '<div class="cta-strip" style="margin:0">'+
      '<div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/13284a/8ea0c8?text=" alt="DEON manufacturing and technology" /></div>'+
      '<div class="cta-body"><h2>Manufacturing &amp; technology</h2>'+
      '<p>Adhesive technologies, backing materials, coating and converting capabilities, testing and validation, custom development and sustainability — explore how DEON makes its tapes. [Placeholder copy.]</p>'+
      '<a href="'+esc(href)+'" class="cta-btn">Explore manufacturing &amp; technology</a></div></div>');
  }

  function render(){
    var root = document.getElementById('deon-main');
    document.title = 'About DEON | DEON';

    var out = '<div class="context-bar">'+D.trail.hub('About DEON')+'</div>';

    // HERO
    out += '<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/2f3f5f/8ea0c8?text=" alt="About DEON" /></div>'+
      '<div class="hero-card"><h1>About DEON</h1>'+
      '<p>A manufacturer, coater and converter of high-performance adhesive tapes for industry — controlling the full value chain from formulation to application-ready parts. [Placeholder copy.]</p></div></div>';

    // One section per architecture item, in frozen order. Skip M&T body -> CTA.
    (ARCH.about || []).forEach(function (item) {
      var id = ARCH.slug(item.name);
      if (item.name === 'Manufacturing & Technology') {
        out += manufacturingCta(id, item.href || 'manufacturing-technology.html');
        return;
      }
      var build = BODIES[item.name];
      if (build) out += build(id);
    });

    // Closing CTA
    out += '<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/3a4a6a/8ea0c8?text=" alt="Talk to DEON" /></div>'+
      '<div class="cta-body"><h2>Work with DEON</h2>'+
      '<p>Whether you need a standard construction at volume or a custom tape developed to your brief, our team can help. Tell us about your application and we will get in touch. [Placeholder copy.]</p>'+
      '<a href="contact.html?topic=about" class="cta-btn">Get in touch</a></div></div>';

    root.innerHTML = out;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
