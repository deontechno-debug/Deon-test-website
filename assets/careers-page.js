/* Careers renderer — electronics vocabulary. Context bar + hero, "Why DEON"
   (feature-layout + feature-list of benefits), "Open Positions" (segment-grid
   of placeholder roles with location + type), "Life at DEON" (feature-layout),
   CTA -> contact.html. [Content is credible placeholder; architecture is production.] */
(function () {
  'use strict';
  var D = window.DEON;
  var BG = ['3a4a6a', '394970', '445586', '4f6090', '2f3f5f', '47588a', '13284a', '0e2a44'];
  var ARROW = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  function sect(id, cls, inner){return '<section class="market-section'+(cls?' '+cls:'')+'"'+(id?' id="'+esc(id)+'"':'')+'>'+inner+'</section>';}
  function segCard(href, bg, title, caption, cta){
    return '<a class="segment-card" href="'+esc(href)+'">'+
      '<div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div>'+
      '<div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div>'+
      '<div class="segment-card-caption">'+esc(caption)+'</div>'+
      '<span class="segment-card-link">'+esc(cta||'Read more')+' '+ARROW+'</span></div></a>';
  }

  var BENEFITS = [
    'Competitive salary benchmarked to industry',
    'Performance and shift bonuses',
    'Health and accident insurance for you and family',
    'Provident fund and retirement savings',
    'Structured training and skills certification',
    'Clear progression paths into senior and lead roles',
    'Modern, safety-first manufacturing environment',
    'Subsidised canteen and transport',
    'Paid leave and family-friendly policies',
    'Recognition and long-service awards',
    'Cross-functional project exposure',
    'Tuition support for relevant qualifications'
  ];

  // ~6 placeholder open roles.
  var ROLES = [
    { title: 'Process Engineer',        location: 'Pune, India · Plant 1',        type: 'Full-time · On-site', desc: 'Own coating-line process windows, drive yield and OEE, and lead continuous-improvement projects across adhesive coating and lamination.' },
    { title: 'R&D Chemist',             location: 'Pune, India · Innovation Lab', type: 'Full-time · On-site', desc: 'Formulate and characterise pressure-sensitive adhesives, run peel/shear/tack testing, and scale lab recipes to production.' },
    { title: 'Converting Operator',     location: 'Pune, India · Plant 2',        type: 'Full-time · Shift',   desc: 'Operate slitting, die-cutting and rewinding lines to spec, perform first-article checks and maintain throughput and quality.' },
    { title: 'QA Specialist',           location: 'Pune, India · Quality',        type: 'Full-time · On-site', desc: 'Run incoming, in-process and final inspection against ISO procedures, manage CAPA and support customer audits.' },
    { title: 'Key Account Manager',     location: 'Mumbai, India · Field',        type: 'Full-time · Hybrid',  desc: 'Grow strategic OEM and converter accounts, translate application needs into specifications and coordinate technical support.' },
    { title: 'Maintenance Technician',  location: 'Pune, India · Plant 1',        type: 'Full-time · Shift',   desc: 'Carry out preventive and breakdown maintenance on coating, slitting and converting equipment to maximise uptime.' }
  ];

  var LIFE = [
    'Safety-first culture with daily toolbox talks',
    'Hands-on teams that solve real production problems',
    'Engineers, chemists and operators working side by side',
    'Continuous-improvement (kaizen) built into every line',
    'Mentoring from experienced shift and process leads',
    'Celebrations for milestones, launches and long service'
  ];

  function render(){
    var root = document.getElementById('deon-main');
    document.title = 'Careers | DEON';

    var out = '<div class="context-bar">'+D.trail.hub('Careers')+'</div>';

    // HERO
    out += '<div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/3a4a6a/8ea0c8?text=" alt="Careers at DEON" /></div>'+
      '<div class="hero-card"><h1>Build a career in industrial adhesives</h1>'+
      '<p>DEON manufactures and converts adhesive tapes for industry — and we are always looking for engineers, chemists, operators and commercial talent who want to make precision products at scale.</p></div></div>';

    // WHY DEON — feature-layout + feature-list of benefits
    out += sect('why-deon', '', '<div class="feature-layout"><div>'+
      '<div class="market-eyebrow">Why DEON</div><h2>Why build your career here</h2>'+
      '<div class="market-intro"><p>We pair the stability of an established manufacturer with the pace of a growing one. You will work on real production lines and real customer problems, with the training and progression to grow with us.</p></div></div>'+
      '<ul class="feature-list">'+BENEFITS.map(function(b){return '<li>'+esc(b)+'</li>';}).join('')+'</ul></div>');

    // OPEN POSITIONS — segment-grid of roles
    out += sect('open-positions', 'is-grey', '<div class="market-eyebrow">Open positions</div><h2>Open positions</h2>'+
      '<div class="market-intro"><p>Current openings across manufacturing, R&amp;D, quality and commercial teams. Apply through our contact form and a member of the people team will be in touch.</p></div>'+
      '<div class="segment-grid">'+ROLES.map(function(r,i){
        return segCard('contact.html?topic=careers&role='+encodeURIComponent(r.title), BG[i%BG.length], r.title, r.location+' · '+r.type+' — '+r.desc, 'Apply');
      }).join('')+'</div>');

    // LIFE AT DEON — feature-layout + feature-list
    out += sect('life-at-deon', '', '<div class="feature-layout"><div>'+
      '<div class="market-eyebrow">Life at DEON</div><h2>Life at DEON</h2>'+
      '<div class="market-intro"><p>Our plants run on teamwork, safety and craft. People stay because the work is tangible, the teams are tight, and there is always a next problem worth solving.</p></div></div>'+
      '<ul class="feature-list">'+LIFE.map(function(l){return '<li>'+esc(l)+'</li>';}).join('')+'</ul></div>');

    // CTA — apply -> contact.html
    out += '<div class="cta-strip"><div class="cta-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/800x600/3a4a6a/8ea0c8?text=" alt="Apply to DEON" /></div>'+
      '<div class="cta-body"><h2>Ready to apply?</h2>'+
      '<p>Send us your details and the role you are interested in. We review every application and reach out to candidates whose experience fits our open positions.</p>'+
      '<a href="contact.html?topic=careers" class="cta-btn">Apply now</a></div></div>';

    root.innerHTML = out;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
