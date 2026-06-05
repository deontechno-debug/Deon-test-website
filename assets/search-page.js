/* Search renderer — searches the whole catalog (markets, applications,
   product families, products, resources) and links results into the graph.
   ?q= seeds the query; results update live as you type. */
(function () {
  'use strict';
  var D = window.DEON;
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function qp(k){return new URLSearchParams(location.search).get(k);}

  // Flatten the catalog into a searchable index.
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
    var INDEX=buildIndex();
    var q0=qp('q')||'';

    root.innerHTML='<section class="page-hero"><div class="container">'+
      '<nav class="breadcrumb"><a href="index.html">Home</a><span class="sep">›</span><span class="current">Search</span></nav>'+
      '<div class="eyebrow">Search</div><h1>Search DEON</h1>'+
      '<p class="lead">Search across markets, applications, products and resources.</p></div></section>'+
      '<section class="section"><div class="container">'+
        '<div class="search-box"><input id="sq" type="search" placeholder="Search markets, applications, products…" value="'+esc(q0)+'" aria-label="Search query">'+
        '<button class="btn" id="sgo" type="button">Search</button></div>'+
        '<div id="sresults"></div>'+
      '</div></section>';

    var inp=document.getElementById('sq'), out=document.getElementById('sresults');
    var ORDER=['Market','Application','Product family','Product','Resource'];

    function run(){
      var q=inp.value.trim().toLowerCase();
      if(!q){ out.innerHTML='<p class="search-empty">Type to search '+INDEX.length+' items across the DEON ecosystem.</p>'; return; }
      var hits=INDEX.filter(function(i){return i.s.indexOf(q)>=0;});
      if(!hits.length){ out.innerHTML='<p class="search-empty">No results for “'+esc(inp.value)+'”. Try a market, application or product name.</p>'; return; }
      var groups={};
      hits.forEach(function(h){(groups[h.type]=groups[h.type]||[]).push(h);});
      out.innerHTML=ORDER.filter(function(t){return groups[t];}).map(function(t){
        return '<div class="search-group"><h3>'+esc(t)+' ('+groups[t].length+')</h3><div class="card-grid">'+
          groups[t].map(function(h){return '<a class="ent-card" href="'+esc(h.href)+'"><span class="kicker">'+esc(h.type)+'</span><span class="t">'+esc(h.title)+'</span><span class="d">'+esc(h.sub)+'</span><span class="more">Open</span></a>';}).join('')+
          '</div></div>';
      }).join('');
    }
    inp.addEventListener('input',run);
    document.getElementById('sgo').addEventListener('click',run);
    run(); inp.focus();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
