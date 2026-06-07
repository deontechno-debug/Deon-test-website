/* ============================================================
   DEON PRODUCT FINDER — shared, refined product-assortment component
   (Tesa-style filter sidebar + results table). Renders its own markup
   into a mount element from a products array, then wires the dual-range
   thickness slider, attribute facets, Load More and live count.
   Used on electronics, every market page and the products hub so the
   product experience is identical everywhere.
     ProductFinder.mount(el, products)
   products: [{ name, t (µm), adhesive, backing, desc, href? }]
   ============================================================ */
(function () {
  'use strict';
  var PAGE = 8, MIN = 5, MAX = 2000, SPAN = MAX - MIN;
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function fmt(n){return Number(n).toLocaleString('en-US');}

  // Clean, on-brand product thumbnail (a stylised roll of tape) — replaces the
  // placeholder boxes. Intentional and consistent across every row.
  var THUMB = '<span class="pdb-prod-thumb" aria-hidden="true"><svg viewBox="0 0 60 60" fill="none">' +
    '<rect width="60" height="60" fill="#eef2f7"/>' +
    '<circle cx="30" cy="30" r="17" fill="#fff" stroke="#b6c2d4" stroke-width="2.5"/>' +
    '<circle cx="30" cy="30" r="7" fill="#dfe6ef" stroke="#b6c2d4" stroke-width="2"/>' +
    '<path d="M30 13a17 17 0 0 1 14.7 8.5" stroke="#0072ce" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M16.5 38.5 A17 17 0 0 0 30 47" stroke="#e3000b" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>' +
    '</svg></span>';
  var CHEV = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var NAME_ARROW = '<svg width="7" height="11" viewBox="0 0 7 11" fill="none"><path d="M1 1l4.5 4.5L1 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SHARE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" stroke-linecap="round"/></svg>';

  function markup(){
    return '<div class="pdb">' +
      '<aside class="pdb-filter" data-pdb="filter">' +
        '<div class="pdb-filter-head"><span class="pdb-filter-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2.4" fill="#fff"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="15" cy="17" r="2.4" fill="#fff"/></svg> Filter</span>' +
          '<button class="pdb-collapse" data-pdb="collapse" type="button" aria-label="Collapse filters"><svg width="9" height="14" viewBox="0 0 9 14" fill="none"><path d="M7 1.5L1.5 7L7 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>' +
        '<div class="pdb-filter-body" data-pdb="fbody">' +
          '<a href="#" class="pdb-clear" data-pdb="clear">clear all</a>' +
          '<div class="pdb-group-label">by construction attributes</div>' +
          '<div class="pdb-field"><div class="pdb-field-label">Total thickness</div>' +
            '<div class="pdb-minmax"><label>Min <input type="number" data-pdb="minN" value="'+MIN+'" min="'+MIN+'" max="'+MAX+'" aria-label="Minimum thickness"><span class="pdb-unit">µm</span></label><label>Max <input type="number" data-pdb="maxN" value="'+MAX+'" min="'+MIN+'" max="'+MAX+'" aria-label="Maximum thickness"><span class="pdb-unit">µm</span></label></div>' +
            '<div class="pdb-slider"><div class="pdb-slider-track"><div class="pdb-slider-fill" data-pdb="fill"></div></div><input type="range" data-pdb="minR" min="'+MIN+'" max="'+MAX+'" value="'+MIN+'" step="1" aria-label="Minimum thickness slider"><input type="range" data-pdb="maxR" min="'+MIN+'" max="'+MAX+'" value="'+MAX+'" step="1" aria-label="Maximum thickness slider"></div>' +
            '<div class="pdb-scale"><span>'+MIN+'</span><span>'+MAX+'</span></div></div>' +
          '<div class="pdb-accordion" data-group="adhesive"><button class="pdb-accordion-head" type="button">Adhesive Type '+CHEV+'</button><div class="pdb-accordion-body" data-pdb="adhesiveOpts"></div></div>' +
          '<div class="pdb-accordion" data-group="backing"><button class="pdb-accordion-head" type="button">Backing material '+CHEV+'</button><div class="pdb-accordion-body" data-pdb="backingOpts"></div></div>' +
          '<div class="pdb-divider"></div>' +
          '<div class="pdb-group-label">by additional filters</div>' +
          '<div class="pdb-accordion pdb-accordion--static"><button class="pdb-accordion-head" type="button" aria-disabled="true">Add filters '+CHEV+'</button></div>' +
        '</div></aside>' +
      '<div class="pdb-results"><div class="pdb-count"><strong data-pdb="count">0</strong> Products</div>' +
        '<div class="pdb-table" role="table" aria-label="Product assortment"><div class="pdb-thead" role="row"><div class="pdb-th pdb-th-product" role="columnheader">Product</div><div class="pdb-th" role="columnheader">Total thickness</div><div class="pdb-th" role="columnheader">Adhesive Type</div><div class="pdb-th" role="columnheader">Backing material</div></div>' +
        '<div class="pdb-tbody" data-pdb="body" role="rowgroup"></div></div>' +
        '<div class="pdb-loadmore-wrap"><button class="pdb-loadmore" data-pdb="loadmore" type="button">LOAD MORE</button></div></div>' +
    '</div>';
  }

  function mount(root, data){
    if(!root || !data) return;
    data = data.slice();
    root.innerHTML = markup();
    var q = function(s){return root.querySelector('[data-pdb="'+s+'"]');};
    var body=q('body'), countEl=q('count'), loadBtn=q('loadmore'),
        minN=q('minN'), maxN=q('maxN'), minR=q('minR'), maxR=q('maxR'), fill=q('fill');
    var visible = PAGE;

    function uniq(key){return [...new Set(data.map(function(d){return d[key];}))].sort();}
    function buildOpts(container, values, group){
      container.innerHTML = values.map(function(v){return '<label class="pdb-check"><input type="checkbox" value="'+esc(v)+'" data-group="'+group+'"><span>'+esc(v)+'</span></label>';}).join('');
    }
    buildOpts(q('adhesiveOpts'), uniq('adhesive'), 'adhesive');
    buildOpts(q('backingOpts'), uniq('backing'), 'backing');

    function checked(group){return [...root.querySelectorAll('input[data-group="'+group+'"]:checked')].map(function(i){return i.value;});}
    function filtered(){
      var lo=+minN.value, hi=+maxN.value, a=checked('adhesive'), b=checked('backing');
      return data.filter(function(d){ return d.t>=lo && d.t<=hi && (!a.length||a.indexOf(d.adhesive)>=0) && (!b.length||b.indexOf(d.backing)>=0); });
    }
    function render(){
      var list=filtered(); countEl.textContent=fmt(list.length);
      var slice=list.slice(0,visible);
      if(!slice.length){ body.innerHTML='<div class="pdb-empty">No products match the selected filters.</div>'; }
      else {
        body.innerHTML = slice.map(function(d){
          var href=esc(d.href||'#');
          return '<div class="pdb-row" role="row"><div class="pdb-cell pdb-cell-product" role="cell">'+THUMB+
            '<span class="pdb-prod-info"><a href="'+href+'" class="pdb-prod-name">'+esc(d.name)+' '+NAME_ARROW+'</a>'+
            '<a href="#" class="pdb-prod-share" aria-label="Share product">'+SHARE+'</a>'+
            '<span class="pdb-prod-desc">'+esc(d.desc)+'</span></span></div>'+
            '<div class="pdb-cell" role="cell" data-label="Total thickness">'+fmt(d.t)+' µm</div>'+
            '<div class="pdb-cell" role="cell" data-label="Adhesive Type">'+esc(d.adhesive)+'</div>'+
            '<div class="pdb-cell" role="cell" data-label="Backing material">'+esc(d.backing)+'</div></div>';
        }).join('');
      }
      loadBtn.hidden = visible >= list.length;
    }
    function updateFill(){ fill.style.left=((+minR.value-MIN)/SPAN*100)+'%'; fill.style.right=(100-(+maxR.value-MIN)/SPAN*100)+'%'; }
    function reset(){ visible=PAGE; render(); }

    minR.addEventListener('input',function(){ if(+minR.value>+maxR.value)minR.value=maxR.value; minN.value=minR.value; updateFill(); reset(); });
    maxR.addEventListener('input',function(){ if(+maxR.value<+minR.value)maxR.value=minR.value; maxN.value=maxR.value; updateFill(); reset(); });
    function clampNum(){ var lo=Math.max(MIN,Math.min(+minN.value||MIN,MAX)), hi=Math.max(MIN,Math.min(+maxN.value||MAX,MAX)); if(lo>hi)lo=hi; minN.value=lo;maxN.value=hi;minR.value=lo;maxR.value=hi; updateFill(); reset(); }
    minN.addEventListener('change',clampNum); maxN.addEventListener('change',clampNum);
    q('fbody').addEventListener('change',function(e){ if(e.target.matches('input[type="checkbox"][data-group]')) reset(); });
    root.querySelectorAll('.pdb-accordion:not(.pdb-accordion--static) .pdb-accordion-head').forEach(function(h){ h.addEventListener('click',function(){ h.parentElement.classList.toggle('is-open'); }); });
    q('collapse').addEventListener('click',function(){ q('filter').classList.toggle('is-collapsed'); });
    q('clear').addEventListener('click',function(e){ e.preventDefault(); root.querySelectorAll('input[type="checkbox"][data-group]').forEach(function(c){c.checked=false;}); minN.value=MIN;maxN.value=MAX;minR.value=MIN;maxR.value=MAX; updateFill(); reset(); });
    loadBtn.addEventListener('click',function(){ visible+=PAGE; render(); });

    updateFill(); render();
  }

  window.ProductFinder = { mount: mount };
})();
