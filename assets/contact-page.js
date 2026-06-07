/* Contact renderer — electronics vocabulary. Hero + market-section with a
   two-column form/aside. Prefills context from ?topic/market/family. */
(function () {
  'use strict';
  var D = window.DEON;
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qp(k){return new URLSearchParams(location.search).get(k);}
  function ctx(){var f=qp('family'),t=qp('topic'),m=qp('market');
    if(f){var x=D.productFamily(f);if(x)return 'about '+x.name;}
    if(t){var a=D.application(t);if(a)return 'about '+a.name;}
    if(m){var k=D.market(m);if(k)return 'for '+k.name;}
    return '';}

  function render(){
    var root=document.getElementById('deon-main');
    document.title='Contact | DEON';
    var c=ctx();
    var marketOpts='<option value="">Select a market…</option>'+D.markets().map(function(m){return '<option value="'+esc(m.id)+'"'+(qp('market')===m.id?' selected':'')+'>'+esc(m.name)+'</option>';}).join('');
    var typeSel=(qp('family')||qp('topic'))?'sample':'consultation';
    var out='<div class="context-bar">'+D.trail.hub('Contact')+'</div><div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/3a4a6a/8ea0c8?text=" alt="Contact DEON" /></div><div class="hero-card"><h1>Talk to DEON</h1><p>Request a sample, ask for a quote, or get a technical consultation '+esc(c)+'. Our application engineers respond within one business day. [Placeholder.]</p></div></div>';

    out+='<section class="market-section"><div class="contact-cols">'+
      '<div><div class="market-eyebrow">Inquiry</div><h2>Send an inquiry</h2>'+
        '<div id="formNote" class="form-note" hidden></div>'+
        '<form id="cform" class="cform" novalidate>'+
          (c?'<div class="row"><label>Regarding</label><input type="text" value="Inquiry '+esc(c)+'" readonly></div>':'')+
          '<div class="row"><label for="cf-type">How can we help?</label><select id="cf-type"><option value="sample"'+(typeSel==='sample'?' selected':'')+'>Request a sample</option><option value="quote">Request a quote</option><option value="consultation"'+(typeSel==='consultation'?' selected':'')+'>Technical consultation</option></select></div>'+
          '<div class="row"><label for="cf-name">Name</label><input id="cf-name" type="text" required></div>'+
          '<div class="row"><label for="cf-company">Company</label><input id="cf-company" type="text"></div>'+
          '<div class="row"><label for="cf-email">Work email</label><input id="cf-email" type="email" required></div>'+
          '<div class="row"><label for="cf-market">Market</label><select id="cf-market">'+marketOpts+'</select></div>'+
          '<div class="row"><label for="cf-msg">Message</label><textarea id="cf-msg" placeholder="Tell us about your application, substrates and requirements…"></textarea></div>'+
          '<button class="outline-btn" type="submit">Submit inquiry</button>'+
        '</form></div>'+
      '<aside class="contact-aside"><h3>Ways to engage</h3>'+
        '<div class="opt"><div class="opt-t">Request a sample</div><div class="opt-d">Evaluate the right product on your line.</div></div>'+
        '<div class="opt"><div class="opt-t">Request a quote</div><div class="opt-d">Pricing for prototype to series volumes.</div></div>'+
        '<div class="opt"><div class="opt-t">Technical consultation</div><div class="opt-d">Application engineering &amp; selection support.</div></div>'+
        '<div class="opt"><div class="opt-t">Email</div><div class="opt-d"><a href="mailto:info@deontechnology.co.in" style="color:var(--blue)">info@deontechnology.co.in</a></div></div>'+
      '</aside></div></section>';

    root.innerHTML=out;
    var f=document.getElementById('cform');
    f.addEventListener('submit',function(e){e.preventDefault();
      var name=document.getElementById('cf-name').value.trim(), email=document.getElementById('cf-email').value.trim(), note=document.getElementById('formNote');
      if(!name||!email){note.hidden=false;note.style.background='#fdeaea';note.style.borderColor='#f0b8b8';note.style.color='#9b1c1c';note.textContent='Please add your name and work email.';return;}
      note.hidden=false;note.style.background='#eaf7ee';note.style.borderColor='#b8e2c4';note.style.color='#1b6b34';
      note.textContent='Thanks, '+name+' — your inquiry has been captured. (Demo form: no message was sent.)'; f.reset();
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
