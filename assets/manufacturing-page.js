/* Manufacturing & Technology renderer — the flagship authority page.
   Electronics vocabulary only: context-bar breadcrumb + hero (full-bleed
   image + white .hero-card) + one .market-section per topic in
   DEON_ARCH.manufacturing (id = slug). Adhesive Technologies & Backing
   Materials render DEON.technologies() filtered by category as a
   segment-grid; the remaining topics use feature-layout/feature-list +
   tag-row + download-grid. Closes with a .cta-strip to contact.html.
   Load order: deon-catalog.js, deon-data.js, data/deon-architecture.js,
   deon-chrome.js, manufacturing-page.js. */
(function () {
  'use strict';
  var D = window.DEON, ARCH = window.DEON_ARCH;
  var BG = ['3a4a6a','394970','445586','4f6090','2f3f5f','47588a','13284a','0e2a44'];
  var ARROW = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DLICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function slug(n){return ARCH.slug(n);}

  // ── helpers (same shapes as application-page.js) ──
  function segCard(href,bg,title,caption,cta){return '<a class="segment-card" href="'+esc(href)+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div><div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div><div class="segment-card-caption">'+esc(caption)+'</div><span class="segment-card-link">'+esc(cta||'Read more')+' '+ARROW+'</span></div></a>';}
  function dlCard(href,title,sub){return '<a href="'+esc(href)+'" class="download-card"><img class="download-thumb" src="https://placehold.co/264x184/dfe4ec/8ea0c8?text=" alt="" /><div class="download-meta"><div class="download-title">'+esc(title)+'</div><div class="download-sub">'+esc(sub)+'</div><span class="download-action">Download '+DLICON+'</span></div></a>';}
  function sect(id,cls,inner){return '<section class="market-section'+(cls?' '+cls:'')+'" id="'+esc(id)+'">'+inner+'</section>';}
  function head(eyebrow,h2){return '<div class="market-eyebrow">'+esc(eyebrow)+'</div><h2>'+esc(h2)+'</h2>';}
  function intro(paras){return '<div class="market-intro">'+paras.map(function(p){return '<p>'+p+'</p>';}).join('')+'</div>';}
  function featureLayout(eyebrow,h2,paras,items){
    return '<div class="feature-layout"><div>'+head(eyebrow,h2)+intro(paras)+'</div>'+
      '<ul class="feature-list">'+items.map(function(i){return '<li>'+esc(i)+'</li>';}).join('')+'</ul></div>';
  }
  function tagRow(items){return '<div class="tag-row">'+items.map(function(t){return '<span class="tag">'+esc(t)+'</span>';}).join('')+'</div>';}
  function techGrid(category){
    var techs = D.technologies().filter(function(t){return t.category===category;});
    return '<div class="segment-grid">'+techs.map(function(t,i){
      // Anchor to the same page section; technologies are documented inline.
      return segCard('#'+slug(category), BG[i%BG.length], t.name, t.summary, 'How we use it');
    }).join('')+'</div>';
  }

  function render(){
    var root = document.getElementById('deon-main');
    document.title = 'Manufacturing & Technology | DEON';
    var topics = ARCH.manufacturing; // ordered, frozen
    var out = '<div class="context-bar">'+ D.crumbs([
      { label:'Home', href:'index.html' },
      { label:'About DEON', href:'about.html' },
      { label:'Manufacturing & Technology' }
    ]) +'</div>';

    // ── HERO ──
    out += '<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/13284a/8ea0c8?text=" alt="DEON adhesive coating and converting plant" /></div>'+
      '<div class="hero-card"><h1>Manufacturing &amp; technology</h1>'+
      '<p>DEON is an adhesive-tape <strong>manufacturer, coater and converter</strong> — we formulate the adhesive, coat the backing, cure and slit it, and die-cut it into application-ready parts under one roof. From solvent, hot-melt and water-based coating lines through an in-house test lab and a documented compliance system, this is the engineering depth that lets OEMs and converters specify DEON with confidence.</p></div></div>';

    // ── Topic navigator (uses the frozen topic order) ──
    out += sect('overview','', head('Manufacturing & technology','How DEON builds an adhesive tape') +
      intro([
        'Every DEON tape is the sum of three engineering decisions made together: the <strong>adhesive system</strong>, the <strong>backing</strong> it is coated onto, and the <strong>conversion</strong> that turns master rolls into the exact part your line installs. Controlling all three in-house is what separates a manufacturer from a reseller — and it is what lets us tune peel, shear, tack and temperature performance to a specific joint rather than offer a catalogue average.',
        'The sections below walk the full value chain, from chemistry and substrate selection through coating, curing and converting, into the test lab that qualifies every batch, and out to the development, R&amp;D and compliance programs that keep that output certified and repeatable.'
      ]) +
      '<div class="tag-row">'+ topics.map(function(t){return '<a class="tag" href="#'+esc(slug(t.name))+'">'+esc(t.name)+'</a>';}).join('') +'</div>');

    // ── 1. Adhesive Technologies (segment-grid from DEON.technologies) ──
    out += sect(slug('Adhesive Technologies'),'is-grey',
      head('Adhesive technologies','Adhesive chemistry, engineered to the joint') +
      intro([
        'The adhesive is where a tape earns or loses an application. DEON formulates and coats across the three principal pressure-sensitive chemistries — <strong>acrylic</strong> (solvent and water-based), <strong>rubber and synthetic-rubber hot-melt</strong>, and <strong>silicone</strong> — plus engineered systems such as viscoelastic acrylic-foam structural adhesives and thermally or electrically functional constructions.',
        'Selection is driven by the surface and the duty cycle: rubber hot-melts give aggressive instant tack for high-speed sealing and masking; acrylics trade some initial grab for outstanding UV, ageing and chemical resistance and high-temperature shear; silicones extend continuous service beyond 200 °C and bond where acrylics and rubbers cannot. Coat weight, cross-link density and tackifier loading are then tuned to balance peel, shear and tack for the specific substrate.'
      ]) +
      techGrid('Adhesive Technologies'));

    // ── 2. Backing Materials (segment-grid from DEON.technologies) ──
    out += sect(slug('Backing Materials'),'',
      head('Backing materials','The backing carries the adhesive — and the performance') +
      intro([
        'The backing sets a tape’s mechanical, thermal, dielectric and dimensional behaviour. DEON coats onto a broad substrate library — polyester (PET) and polyimide (PI) films, plasticised PVC, woven and non-woven cloth, PE/PU/acrylic foams, aluminium and metallised foils, saturated crepe and flat papers, and PE/PP protection films.',
        'Backing choice governs conformability, tensile and tear strength, temperature class, breakdown voltage and hand-tearability. A 12 µm PET film and a 130 µm crepe paper are not interchangeable: one is a dielectric carrier that survives reflow, the other a sacrificial mask that releases cleanly after a bake cycle. Matching the right backing to the adhesive is the core of every DEON construction.'
      ]) +
      techGrid('Backing Materials'));

    // ── 3. Manufacturing Capabilities ──
    out += sect(slug('Manufacturing Capabilities'),'is-grey',
      featureLayout('Manufacturing capabilities','From coating line to finished roll',
        [
          'DEON operates dedicated <strong>solvent, hot-melt and water-based (emulsion) coating lines</strong>, so each adhesive chemistry is laid down on its optimal process. Precision coating heads — comma-bar, slot-die and reverse-roll — control coat weight to tight tolerances across the full web width, with in-line drying ovens, UV/EB and thermal curing stages, and corona treatment for adhesion to low-surface-energy films.',
          'Coated master rolls then move into converting: high-speed <strong>slitting and rewinding</strong> to customer widths, lengths, core sizes and put-ups, plus <strong>rotary and flatbed die-cutting, laminating and sheeting</strong> to deliver application-ready parts, gaskets and kiss-cut shapes. Doing this in one facility shortens lead times and keeps a single chain of quality control from formulation to finished SKU.'
        ],
        ['Solvent coating lines','Hot-melt coating lines','Water-based (emulsion) coating','Comma-bar / slot-die / reverse-roll heads','Multi-zone drying ovens','UV / EB & thermal curing','Corona surface treatment','Multi-layer lamination','Precision slitting & rewinding','Rotary & flatbed die-cutting','Sheeting & kiss-cutting','Custom cores, lengths & put-ups']
      ));

    // ── 4. Testing & Validation ──
    out += sect(slug('Testing & Validation'),'',
      featureLayout('Testing & validation','An in-house lab that qualifies every batch',
        [
          'Performance claims are only as good as the test behind them. DEON’s laboratory characterises every construction against recognised methods — <strong>peel adhesion</strong> (180° and 90°, to steel and to application substrates), <strong>static and dynamic shear</strong> (holding power under load and at temperature), <strong>tack</strong> (loop and rolling-ball), and <strong>temperature resistance</strong> across continuous and peak service ranges.',
          'Beyond the core PSA triangle, we run dielectric strength and insulation-resistance testing for electrical grades, thermal-cycling, humidity and salt-spray ageing, solvent and chemical resistance, tensile and elongation, dimensional stability through reflow, and accelerated aged-adhesion studies. Results feed both the technical data sheet and incoming-to-outgoing batch QC, so what ships matches what was specified.'
        ],
        ['Peel adhesion (180° / 90°)','Static & dynamic shear','Loop & rolling-ball tack','Continuous & peak temperature','Dielectric strength / insulation resistance','Tensile strength & elongation','Thermal cycling & shock','Humidity & salt-spray ageing','Solvent & chemical resistance','Dimensional stability (reflow)','Accelerated aged adhesion','Batch-to-batch QC release']
      ));

    // ── 5. Custom Product Development ──
    out += sect(slug('Custom Product Development'),'is-grey',
      head('Custom product development','Engineered to your specification, not from a shelf') +
      intro([
        'When a stock construction does not fit, DEON develops one. Our application engineers start from the joint — the substrates, the surface energy, the temperatures, the dwell and cure window, the geometry and the volume — and work back to an adhesive/backing/coat-weight combination that meets it. Candidate constructions are sampled, tested in the lab against your acceptance criteria, and iterated before any tooling is committed.',
        'Development moves into scale-up with documented process parameters, first-article inspection and qualification support, then into <strong>converting and private-label</strong> output: custom widths and shapes, kiss-cut parts on liner, printed cores and packaging, and OEM supply programs with vendor-managed inventory. The same team owns the part from prototype to production, so the specification that passed qualification is the specification that ships.'
      ]) +
      '<div class="market-intro" style="margin-top:1.75rem"><p>Typical development inputs we work from:</p></div>'+
      tagRow(['Substrate & surface energy','Operating temperature range','Dwell & cure window','Part geometry & tolerance','Dispensing / application method','Regulatory requirements','Annual volume & format','Liner & packaging needs']));

    // ── 6. R&D & Innovation ──
    out += sect(slug('R&D & Innovation'),'',
      featureLayout('R&D & innovation','Where the next DEON construction comes from',
        [
          'DEON’s R&amp;D agenda tracks where industrial assembly is heading: <strong>lightweighting and bonded assembly</strong> replacing rivets and welds, <strong>thermal management</strong> in ever-denser electronics and EV battery packs, reliable bonding to <strong>low-surface-energy plastics</strong> and composites, and thinner dielectric films that survive higher reflow temperatures.',
          'Work spans new adhesive chemistries and tackifier systems, functional fillers for thermal and electrical performance, advanced backing and liner combinations, and coating-process development that brings those formulations onto the line repeatably. Each program is validated through the same test lab that releases production, so innovation reaches customers as a qualified, data-sheeted product — not a promise.'
        ],
        ['Structural & high-bond adhesives','Thermally conductive systems','EMI / electrically functional tapes','LSE & composite bonding','High-temperature dielectric films','Solvent-free & water-based chemistries','Thin & ultra-thin constructions','Functional fillers & additives','Liner & release-coat development','Coating-process scale-up']
      ));

    // ── 7. Sustainability & Compliance ──
    out += sect(slug('Sustainability & Compliance'),'is-grey',
      head('Sustainability & compliance','Certified, documented and accountable') +
      intro([
        'OEM and converter customers cannot specify what they cannot certify. DEON maintains a documented compliance system aligned to the standards industrial buyers audit against — <strong>REACH</strong> and <strong>RoHS</strong> substance compliance, <strong>UL 94</strong> flammability and UL recognition for electrical grades, halogen-free and conflict-minerals declarations, and a quality system run to <strong>ISO 9001</strong> principles. Technical data sheets, declarations of conformity and batch traceability are available to support qualification and incoming inspection.',
        'On sustainability, our development priorities are practical: <strong>solvent-free and water-based adhesive systems</strong> that cut VOC emissions, lower-impact and recyclable backings, optimised coat weights that reduce material use, and converting that minimises matrix waste. The aim is measurable improvement that does not compromise the bond.'
      ]) +
      '<div class="market-intro" style="margin-top:1.75rem"><p>Standards & declarations we work to:</p></div>'+
      tagRow(['REACH','RoHS','UL 94 (flammability)','UL recognition','ISO 9001','Halogen-free declaration','Conflict-minerals declaration','RoHS / REACH SVHC reporting','Declarations of conformity','Batch traceability']) +
      '<div class="download-grid" style="margin-top:2.5rem">'+
        dlCard('#','DEON manufacturing & technology overview','PDF · [size] · [placeholder]')+
        dlCard('#','Adhesive & backing selection guide','PDF · [size] · [placeholder]')+
        dlCard('#','Certifications & compliance pack','PDF · [size] · [placeholder]')+
        dlCard('#','Lab test methods reference','PDF · [size] · [placeholder]')+
      '</div>');

    // ── CTA ──
    out += '<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/13284a/8ea0c8?text=" alt="DEON application engineering and converting support" /></div>'+
      '<div class="cta-body"><h2>Specify with a manufacturer, not a reseller</h2>'+
      '<p>Bring us the joint — the substrates, temperatures, geometry and volume — and our application engineers will scope the adhesive, backing and converting, sample it, and qualify it against your acceptance criteria.</p>'+
      '<a href="contact.html?topic=manufacturing-technology" class="cta-btn">Talk to DEON engineering</a></div></div>';

    root.innerHTML = out;
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
