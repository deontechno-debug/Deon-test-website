/* Contact renderer — the destination every CTA resolves to. Pre-fills
   context from ?topic / ?market / ?family, offers sample / quote /
   consultation paths, and a (client-side) inquiry form. */
(function () {
  'use strict';
  var D = window.DEON;
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qp(k){return new URLSearchParams(location.search).get(k);}

  function contextLine(){
    var topic=qp('topic'), market=qp('market'), family=qp('family');
    if(family){var f=D.productFamily(family); if(f) return 'about ' + f.name;}
    if(topic){var a=D.application(topic); if(a) return 'about ' + a.name;}
    if(market){var m=D.market(market); if(m) return 'for ' + m.name;}
    return '';
  }

  function render(){
    var root=document.getElementById('deon-main');
    document.title='Contact | DEON';
    var ctx=contextLine();
    var marketOpts='<option value="">Select a market…</option>'+D.markets().map(function(m){return '<option value="'+esc(m.id)+'"'+(qp('market')===m.id?' selected':'')+'>'+esc(m.name)+'</option>';}).join('');
    var typeFromParam = qp('family')||qp('topic') ? 'sample' : 'consultation';

    var hero='<section class="page-hero"><div class="container">'+
      '<nav class="breadcrumb"><a href="index.html">Home</a><span class="sep">›</span><span class="current">Contact</span></nav>'+
      '<div class="eyebrow">Contact</div><h1>Talk to DEON</h1>'+
      '<p class="lead">Request a sample, ask for a quote, or get a technical consultation '+esc(ctx)+'. Our application engineers respond within one business day.</p></div></section>';

    var form='<section class="section"><div class="container"><div class="contact-grid">'+
      '<div><div class="block-head"><h2>Send an inquiry</h2></div>'+
        '<div id="formNote" class="form-note" hidden></div>'+
        '<form id="cform" novalidate>'+
          (ctx?'<div class="field"><label>Regarding</label><input type="text" value="Inquiry '+esc(ctx)+'" readonly></div>':'')+
          '<div class="field"><label for="cf-type">How can we help?</label><select id="cf-type">'+
            '<option value="sample"'+(typeFromParam==='sample'?' selected':'')+'>Request a sample</option>'+
            '<option value="quote">Request a quote</option>'+
            '<option value="consultation"'+(typeFromParam==='consultation'?' selected':'')+'>Technical consultation</option></select></div>'+
          '<div class="field"><label for="cf-name">Name</label><input id="cf-name" type="text" required></div>'+
          '<div class="field"><label for="cf-company">Company</label><input id="cf-company" type="text"></div>'+
          '<div class="field"><label for="cf-email">Work email</label><input id="cf-email" type="email" required></div>'+
          '<div class="field"><label for="cf-market">Market</label><select id="cf-market">'+marketOpts+'</select></div>'+
          '<div class="field"><label for="cf-msg">Message</label><textarea id="cf-msg" placeholder="Tell us about your application, substrates and requirements…"></textarea></div>'+
          '<button class="btn" type="submit">Submit inquiry</button>'+
        '</form></div>'+
      '<aside class="contact-aside"><h3>Ways to engage</h3>'+
        '<div class="contact-option"><div><div class="co-t">Request a sample</div><div class="co-d">Evaluate the right product on your line.</div></div></div>'+
        '<div class="contact-option"><div><div class="co-t">Request a quote</div><div class="co-d">Pricing for prototype to series volumes.</div></div></div>'+
        '<div class="contact-option"><div><div class="co-t">Technical consultation</div><div class="co-d">Application engineering & selection support.</div></div></div>'+
        '<div style="margin-top:1.25rem"><div class="co-t">Email</div><div class="co-d"><a href="mailto:info@deontechnology.co.in" style="color:var(--blue)">info@deontechnology.co.in</a></div></div>'+
      '</aside>'+
    '</div></div></section>';

    root.innerHTML=hero+form;

    var f=document.getElementById('cform');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var name=document.getElementById('cf-name').value.trim();
      var email=document.getElementById('cf-email').value.trim();
      var note=document.getElementById('formNote');
      if(!name||!email){ note.hidden=false; note.style.background='#fdeaea'; note.style.borderColor='#f0b8b8'; note.style.color='#9b1c1c'; note.textContent='Please add your name and work email.'; return; }
      note.hidden=false; note.style.background='#eaf7ee'; note.style.borderColor='#b8e2c4'; note.style.color='#1b6b34';
      note.textContent='Thanks, '+name+' — your inquiry has been captured. (Demo form: no message was sent.)';
      f.reset();
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
