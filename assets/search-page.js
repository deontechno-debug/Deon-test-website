/* Search renderer — electronics vocabulary. Hero + market-section with a
   search box and grouped results as segment-grids. Indexes the whole catalog. */
(function () {
  'use strict';
  var D = window.DEON;
  var BG=['3a4a6a','394970','445586','4f6090','2f3f5f','47588a','13284a','0e2a44'];
  var ARROW='<svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="display:inline-block;vertical-align:middle"><path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qp(k){return new URLSearchParams(location.search).get(k);}
  function card(href,bg,title,caption){return '<a class="segment-card" href="'+esc(href)+'"><div class="segment-card-img lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/440x330/'+bg+'/9eb0d8?text=" alt="'+esc(title)+'" /></div><div class="segment-card-body"><div class="segment-card-title">'+esc(title)+'</div><div class="segment-card-caption">'+esc(caption)+'</div><span class="segment-card-link">Open '+ARROW+'</span></div></a>';}

  function buildIndex(){
    var idx=[];
    D.raw.markets.forEach(function(m){idx.push({type:'Market',title:m.name,sub:m.tagline,href:D.url.market(m.id),s:(m.name+' '+m.tagline).toLowerCase()});});
    D.raw.applications.forEach(function(a){idx.push({type:'Application',title:a.name,sub:a.summary,href:D.url.application(a.id),s:(a.name+' '+a.summary).toLowerCase()});});
    D.raw.productFamilies.forEach(function(f){idx.push({type:'Product family',title:f.name,sub:f.note,href:D.url.productFamily(f.id),s:(f.name+' '+f.note).toLowerCase()});});
    D.raw.products.forEach(function(p){idx.push({type:'Product',title:p.name,sub:p.desc,href:D.url.productFamily(p.familyId),s:(p.name+' '+p.desc+' '+p.adhesive+' '+p.backing).toLowerCase()});});
    D.raw.resources.forEach(function(r){idx.push({type:'Resource',title:r.title,sub:r.type+' · '+r.format,href:r.url||'#',s:(r.title+' '+r.type).toLowerCase()});});
    return idx;
  }

  function render(){
    var root=document.getElementById('deon-main');
    document.title='Search | DEON';
    var INDEX=buildIndex(); var q0=qp('q')||'';
    root.innerHTML='<div class="context-bar">'+D.trail.hub('Search')+'</div><div class="hero"><div class="hero-media lazy-loading-placeholder"><img class="fade-in-loaded" src="https://placehold.co/1600x600/2f3f5f/8ea0c8?text=" alt="Search DEON" /></div><div class="hero-card"><h1>Search DEON</h1><p>Search across markets, applications, products and resources.</p></div></div>'+
      '<section class="market-section"><div class="searchbox"><input id="sq" type="search" placeholder="Search markets, applications, products…" value="'+esc(q0)+'" aria-label="Search query"><button class="outline-btn" id="sgo" type="button">Search</button></div><div id="sresults"></div></section>';

    var inp=document.getElementById('sq'), out=document.getElementById('sresults');
    var ORDER=['Market','Application','Product family','Product','Resource'];
    function run(){
      var q=inp.value.trim().toLowerCase();
      if(!q){out.innerHTML='<p class="search-empty">Type to search '+INDEX.length+' items across the DEON ecosystem.</p>';return;}
      var hits=INDEX.filter(function(i){return i.s.indexOf(q)>=0;});
      if(!hits.length){out.innerHTML='<p class="search-empty">No results for “'+esc(inp.value)+'”. Try a market, application or product name.</p>';return;}
      var g={}; hits.forEach(function(h){(g[h.type]=g[h.type]||[]).push(h);});
      out.innerHTML=ORDER.filter(function(t){return g[t];}).map(function(t){
        return '<div class="search-group"><h3>'+esc(t)+' ('+g[t].length+')</h3><div class="segment-grid">'+g[t].map(function(h,i){return card(h.href,BG[i%BG.length],h.title,h.sub);}).join('')+'</div></div>';
      }).join('');
    }
    inp.addEventListener('input',run); document.getElementById('sgo').addEventListener('click',run); run(); inp.focus();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
